<template>
    <v-dialog v-model="dialog" max-width="700">
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn icon class="icon-color" variant="text" v-bind="activatorProps" @click="openDialog">
                <v-icon>mdi-pencil</v-icon>
            </v-btn>
        </template>

        <v-card class="pa-4" :elevation="isDarkTheme ? 12 : 6" rounded="xl">
            <v-container class="d-flex align-center text-h6">
                <v-icon class="mr-2" :color="isDarkTheme ? '#BB86FC' : '#1976D2'">mdi-pencil</v-icon>
                <span>Editar Pessoa</span>
            </v-container>

            <v-alert v-if="errorMessage" type="error" class="mb-3" :variant="isDarkTheme ? 'elevated' : 'tonal'">
                {{ errorMessage }}
            </v-alert>

            <v-card-text>
                <v-row dense>
                    <v-col cols="12" md="4">
                        <v-text-field label="Nome*" v-model="formBase.nome" :rules="[required]"></v-text-field>
                    </v-col>

                    <v-col cols="12" md="4">
                        <v-text-field label="Email*" v-model="formBase.email"
                            :rules="[required, emailIsValid]"></v-text-field>
                    </v-col>

                    <v-col cols="12" md="4">
                        <v-text-field label="CPF" v-model="formBase.cpf" :rules="[cpfIsValid]"></v-text-field>
                    </v-col>

                    <v-container class="py-0 mt-3">
                        <v-row v-for="(phone, index) in formBase.phones" :key="index" class="align-center pa-0">
                            <v-col cols="12" md="6" class="py-1">
                                <v-text-field :label="`Telefone ${index + 1}*`" v-model="phone.number"
                                    :rules="[required, telefoneIsValid]" placeholder="Digite o telefone" />
                            </v-col>

                            <v-col cols="12" md="6" class="py-1">
                                <v-combobox :label="`Descrição ${index + 1}`" v-model="phone.typePhoneDTO.description"
                                    :items="['Pessoal', 'Corporativo', 'Emergencial', 'Residencial']"
                                    placeholder="Selecione a descrição" />
                            </v-col>

                            <v-col cols="12" class="py-1">
                                <v-divider class="divider"></v-divider>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-row>
                <v-container class="mb-n10">
                    <small class="text-caption text-medium-emphasis">*Preencha os dados corretamente</small>
                </v-container>
            </v-card-text>

            <v-progress-linear v-if="loading" indeterminate
                :color="isDarkTheme ? '#BB86FC' : 'primary'"></v-progress-linear>

            <v-card-actions class="mt-2">
                <v-btn @click="addPhone" color="blue" variant="tonal" size="small">Adicionar Telefone</v-btn>

                <v-spacer></v-spacer>

                <v-btn text="Cancelar" variant="plain" @click="cancelEdit" color="red"></v-btn>

                <v-btn :color="isDarkTheme ? '#BB86FC' : '#1976D2'" text="Editar"
                    :variant="isDarkTheme ? 'flat' : 'tonal'" @click="putEdit"
                    :disabled="!formBase.nome || !formBase.email || formBase.phones.some(phone => !phone.number) || loading" />
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { required, emailIsValid, cpfIsValid, telefoneIsValid } from "../../services/Validacao";
import api from "../../services/api";
import { valid, formBase } from '../../services/Campos';
import { clean, errorMessage } from '@/services/Clean';
import { useTheme } from 'vuetify';

const theme = useTheme();
const isDarkTheme = computed(() => theme.global.current.value.dark);
const dialog = ref(false);
const loading = ref(false);
const props = defineProps<{
    pessoa?: {
        id: string;
        nome: string;
        email: string;
        cpf: string;
        phones: Array<{ number: string, typePhoneDTO: { description: string } }>;
    };
}>();

function openDialog() {
    resetForm();
    dialog.value = true;
};

function resetForm() {
    errorMessage.value = '';
    if (props.pessoa) {
        formBase.value = JSON.parse(JSON.stringify(props.pessoa));
    } else {
        clean(formBase);
    }
};

function cancelEdit() {
    dialog.value = false;
    resetForm();
};

async function putEdit() {
    errorMessage.value = '';
    if (!props.pessoa) {
        return dialog.value = false;
    }
    loading.value = true;
    try {
        if (!valid.value.email || !valid.value.telefone || !valid.value.cpf) {
            return errorMessage.value = "Erro ao salvar. Verifique suas credenciais.";
        }
        const phonesData = formBase.value.phones.map(phone => ({
            number: phone.number,
            typePhoneDTO: { description: phone.typePhoneDTO?.description }
        }));
        await api.put('/pessoas', {
            id: formBase.value.id,
            name: formBase.value.nome,
            email: formBase.value.email,
            cpf: formBase.value.cpf,
            phones: phonesData
        });
        dialog.value = false;
        window.location.reload();
    } catch (error) {
        console.error("Erro ao editar:", error);
        errorMessage.value = "Erro ao editar. Tente novamente.";
    } finally {
        loading.value = false;
    }
};

function addPhone() {
    const newPhone = { number: '', typePhoneDTO: { description: '' } };
    formBase.value.phones.push(newPhone);
}

watch(dialog, (newVal) => {
    if (!newVal) {
        resetForm();
    }
});
</script>

<style scoped>
.icon-color {
    color: v-bind('theme.global.current.value.dark ? "#BB86FC" : "#1976D2"');
}

.divider {
    opacity: 0.2;
    background-color: v-bind('theme.global.current.value.dark ? "#FFFFFF" : "#000000"');
}
</style>
