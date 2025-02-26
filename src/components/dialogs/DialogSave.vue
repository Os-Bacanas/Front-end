<template>
    <v-dialog v-model="dialog" max-width="700">
        <template v-slot:activator="{ props: activatorProps }">
            <v-card-actions>
                <v-btn prepend-icon="mdi-account" text="Salvar" :variant="isDarkTheme ? 'flat' : 'tonal'"
                    v-bind="activatorProps" color="green-darken-2" @click="openDialog">
                </v-btn>
            </v-card-actions>
        </template>

        <v-card>
            <v-container class="text-h6">
                <v-icon class="mx-2 " :color="isDarkTheme ? 'green-lighten-1' : 'green-darken-2'">mdi-account</v-icon>
                <v-title>Salvar Pessoa</v-title>
            </v-container>

            <v-alert v-if="errorMessage" type="error" color="red-lighten-4">
                {{ errorMessage }}
            </v-alert>

            <v-card-text>
                <v-row dense>
                    <v-col cols="12" md="4" sm="6">
                        <v-text-field label="Nome*" v-model="formBase.nome" :rules="[required]"></v-text-field>
                    </v-col>

                    <v-col cols="12" md="4" sm="6">
                        <v-text-field label="Email*" v-model="formBase.email"
                            :rules="[required, emailIsValid]"></v-text-field>
                    </v-col>

                    <v-col cols="12" md="4" sm="6">
                        <v-text-field label="CPF" v-model="formBase.cpf" :rules="[cpfIsValid]"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4" sm="6">
                        <v-text-field label="Telefone*" v-model="formBase.telefone"
                            :rules="[required, telefoneIsValid]"></v-text-field>
                    </v-col>
                    <v-col>
                        <v-combobox label="Descrição do Telefone"
                            :items="['Pessoal', 'Corporativo', 'Emergencial', 'Residencial']"
                            v-model="formBase.descricao"></v-combobox>
                    </v-col>
                </v-row>

                <small class="text-caption text-medium-emphasis">*Preencha os dados corretamente</small>
            </v-card-text>

            <v-divider></v-divider>

            <v-progress-linear v-if="loading" indeterminate color="primary"></v-progress-linear>

            <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn text="Cancelar" variant="plain" @click="dialog = false" color="red"></v-btn>

                <v-btn text="Salvar" :variant="isDarkTheme ? 'flat' : 'tonal'" @click="postSave"
                    :disabled="!formBase.nome || !formBase.email || loading"
                    :color="isDarkTheme ? 'green-lighten-1' : 'green-darken-2'">
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { required, emailIsValid, cpfIsValid, telefoneIsValid } from "../../services/Validacao";
import { formBase, valid } from '../../services/Campos';
import api from "../../services/api";
import { clean, errorMessage } from '@/services/Clean';
import { useTheme } from 'vuetify';

const dialog = ref(false);
const loading = ref(false);
const theme = useTheme();
const isDarkTheme = computed(() => theme.global.current.value.dark);

function openDialog() {
    errorMessage.value = ''
    clean(formBase);
    dialog.value = true;
}

async function postSave() {
    loading.value = true;
    try {
        if (!valid.value.email || !valid.value.cpf || !valid.value.telefone) {
            return errorMessage.value = "Erro ao salvar. Verifique suas credenciais.";
        }
        await api.post("/pessoas", {
            name: formBase.value.nome,
            email: formBase.value.email,
            cpf: formBase.value.cpf,
            phones: [
                {
                    number: formBase.value.telefone,
                    typePhoneDTO: {
                        description: formBase.value.descricao
                    }
                }
            ]
        });
        dialog.value = false;
        clean(formBase);
        window.location.reload();
    } catch (error) {
        console.error("Erro ao salvar:", error);
        errorMessage.value = "Erro ao salvar. Tente novamente.";
    } finally {
        loading.value = false;
    }
};

</script>