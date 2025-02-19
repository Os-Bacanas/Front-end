<template>
    <v-dialog v-model="deleteDialog" max-width="400">
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn color="red" prepend-icon="mdi-close" :disabled="selectedItems.length === 0" v-bind="activatorProps"
                @click="openDialog" variant="flat">
                Deletar
            </v-btn>
        </template>
        <v-card title="Confirmar Exclusão" prepend-icon="mdi-delete-forever">
            <v-card-text class="mb-n5">Tem certeza que deseja excluir os {{ selectedItems.length }} itens
                selecionados?</v-card-text>

            <v-alert v-if="errorMessage" type="error" color="red-lighten-4" class="ma-4">
                {{ errorMessage }}
            </v-alert>

            <v-progress-linear v-if="loading" indeterminate color="primary"></v-progress-linear>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="grey" @click="deleteDialog = false">Cancelar</v-btn>
                <v-btn color="red" :disabled="loading" @click="deleteSelected">Excluir</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import api from '@/services/api';
import { errorMessage } from '@/services/Clean';
import { useTheme } from 'vuetify';

interface Pessoa {
    email: string;
}

const deleteDialog = ref(false);
const loading = ref(false);
const theme = useTheme();

const props = defineProps<{
    selectedItems: Pessoa[];
}>();

const emit = defineEmits<{
    (event: "deleted", deletedEmails: string[]): void;
}>();

function openDialog() {
    errorMessage.value = '';
}

async function deleteSelected() {
    if (!props.selectedItems || props.selectedItems.length === 0) return;

    loading.value = true;

    try {
        const emailsToDelete = props.selectedItems.map((item: Pessoa) => item.email);
        await api.delete('/users', { data: emailsToDelete });
        emit("deleted", emailsToDelete);
        deleteDialog.value = false;
    } catch (error) {
        console.error("Erro ao deletar pessoas:", error);
        errorMessage.value = "Erro ao tentar deletar as pessoas . Tente novamente.";
    } finally {
        loading.value = false;
    }
}
</script>