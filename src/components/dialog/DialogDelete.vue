<template>
    <v-dialog v-model="dialog" max-width="400">
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn icon color="red-darken-4" variant="text" size="small" v-bind="activatorProps" @click="openDialog">
                <v-icon>mdi-delete-forever</v-icon>
            </v-btn>
        </template>

        <v-card prepend-icon="mdi-delete" title="Deletar Contato">
            <v-card-subtitle>
                Essa ação não pode ser desfeita.
            </v-card-subtitle>

            <v-alert v-if="errorMessage" type="error" color="red-lighten-4" class="ma-4">
                {{ errorMessage }}
            </v-alert>

            <v-progress-linear v-if="loading" indeterminate color="primary"></v-progress-linear>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text="Cancelar" variant="plain" @click="dialog = false" :disabled="loading"></v-btn>
                <v-btn color="red" text="Excluir" variant="tonal" @click="deleteUser" :disabled="loading"></v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import api from '@/services/api';
import { errorMessage } from '@/services/Clean';

const dialog = ref(false);
const loading = ref(false);

const props = defineProps<{
    user: {
        email: string;
    };
}>();

function openDialog() {
    errorMessage.value = ''
}

async function deleteUser() {
    loading.value = true;
    errorMessage.value = "";

    try {
        await api.delete(`/people/${props.user.email}`);
        dialog.value = false;
    } catch (error: any) {
        console.error("Erro ao excluir:", error.response?.data || error.message);
        errorMessage.value = "Erro ao excluir. Tente novamente.";
    } finally {
        loading.value = false;
    }
}
</script>