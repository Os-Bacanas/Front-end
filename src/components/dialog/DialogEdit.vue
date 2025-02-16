<template>
    <v-dialog v-model="dialog" max-width="600">
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn icon color="primary" variant="text" size="small" v-bind="activatorProps" @click="resetForm">
                <v-icon>mdi-pencil</v-icon>
            </v-btn>
        </template>

        <v-card prepend-icon="mdi-pencil" title="Editar Contato">

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
                        <v-text-field label="CPF*" v-model="formBase.cpf"
                            :rules="[required, cpfIsValid]"></v-text-field>
                    </v-col>

                    <v-col cols="12" md="4" sm="6">
                        <v-text-field label="Telefone*" v-model="formBase.telefone"
                            :rules="[required, telefoneIsValid]"></v-text-field>
                    </v-col>

                </v-row>

                <small class="text-caption text-medium-emphasis">*Preencha os dados corretamente</small>
            </v-card-text>

            <v-divider></v-divider>
            <v-progress-linear v-if="loading" indeterminate color="primary"></v-progress-linear>

            <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn text="Fechar" variant="plain" @click="dialog = false"></v-btn>

                <v-btn color="primary" text="Editar" variant="tonal" @click="putEdit"
                    :disabled="!formBase.nome || !formBase.cpf || !formBase.email || !formBase.telefone || loading"></v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { required, emailIsValid, cpfIsValid, telefoneIsValid } from "../../services/Validacao";
import api from "../../services/api";
import { valid, formBase } from '@/services/Campos';
import { clean, errorMessage } from '@/services/Clean';

const dialog = ref(false);
const loading = ref(false);
const props = defineProps<{
    user?: {
        nome: string;
        email: string;
        cpf: string;
        telefone: string;
        descricao: string;
    };
}>();

watch(dialog, (newVal) => {
    if (newVal && props.user) {
        formBase.value = Object.assign({}, props.user);
    }
});

function resetForm() {
    errorMessage.value = ''
    if (props.user) {
        formBase.value = Object.assign({}, props.user);
    } else {
        clean(formBase);
    }
}

async function putEdit() {
    if (!props.user) {
        return dialog.value = false;
    }

    loading.value = true;

    try {
        if (!valid.value) return errorMessage.value = "Erro ao salvar. Verifique suas credenciais.";

        await api.put(`/people/${props.user.email}`, {
            nome: formBase.value.nome,
            email: formBase.value.email,
            cpf: formBase.value.cpf,
            telefone: formBase.value.telefone,
        });

        dialog.value = false;

    } catch (error: any) {
        console.error("Erro ao editar:", error.response?.data || error.message);
        errorMessage.value = "Erro ao editar. Tente novamente.";
    } finally {
        loading.value = false;
    }
};
</script>