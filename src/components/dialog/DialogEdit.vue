<template>
    <v-dialog v-model="dialog" max-width="600">
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn class="text-none font-weight-regular " icon="mdi-pencil" variant="tonal" v-bind="activatorProps"
                color="primary" @click="clean" size="small"></v-btn>
        </template>

        <v-card prepend-icon="mdi-pencil" title="Editar Usuário">

            <v-alert v-if="errorMessage" type="error" color="red-lighten-4">
                {{ errorMessage }}
            </v-alert>

            <v-card-text>
                <v-row dense>
                    <v-col cols="12" md="4" sm="6">
                        <v-text-field label="Nome*" v-model="form.nome" :rules="[required]"></v-text-field>
                    </v-col>

                    <v-col cols="12" md="4" sm="6">
                        <v-text-field label="Email*" v-model="form.email"
                            :rules="[required, emailIsValid]"></v-text-field>
                    </v-col>

                    <v-col cols="12" md="4" sm="6">
                        <v-text-field label="CPF*" v-model="form.cpf" :rules="[required, cpfIsValid]"></v-text-field>
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
                    :disabled="!form.nome || !form.cpf || !form.email || loading"></v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { required, emailIsValid, cpfIsValid } from "../../services/Validacao";
import axios from "../../services/api";
import { valid } from '@/services/Campos';
import { clean, errorMessage } from '@/services/Clean';

const dialog = ref(false);
const loading = ref(false);

// Definir props corretamente
const props = defineProps<{
    user?: { id: number; nome: string; email: string; cpf: string };
}>();


const form = ref({
    nome: '',
    email: '',
    cpf: ''
});

// Atualizar o formulário quando `dialog` abrir e `props.user` estiver definido
watch(dialog, (newVal) => {
    if (newVal && props.user) {
        form.value = { ...props.user }; // Garante que estamos editando os valores corretos
    }
});


async function putEdit() {
    if (!props.user) { return dialog.value = false; } // Evita erros caso `user` seja undefined

    errorMessage.value = "";
    loading.value = true;

    try {
        if (!valid.value) return errorMessage.value = "Erro ao fazer ao salvar. Verifique suas credenciais.";

        const response = await axios.put(`/users/${props.user.id}`, {
            nome: form.value.nome,
            email: form.value.email,
            cpf: form.value.cpf,
        });

        dialog.value = false;

    } catch (error) {
        errorMessage.value = "Erro ao editar. Tente novamente.";
    } finally {
        loading.value = false;
        setTimeout(() => {
            errorMessage.value = "";
        }, 5000);
    }
};
</script>
