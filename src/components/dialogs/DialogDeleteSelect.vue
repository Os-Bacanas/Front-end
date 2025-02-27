<template>
    <v-dialog v-model="deleteDialog" max-width="500">
        <template v-slot:activator="{ props: activatorProps }">
            <transition name="fade">
                <v-btn color="red" prepend-icon="mdi-close" v-show="selectedItems.length !== 0" v-bind="activatorProps"
                    @click="openDialog" variant="flat">
                    Deletar
                </v-btn>
            </transition>
        </template>
        <v-card>
            <v-container class="text-h6">
                <v-icon class="mx-2 " :color="isDarkTheme ? '#F44336' : '#D32F2F'">mdi-delete-forever</v-icon>
                <v-title>Confirmar Exclusão</v-title>
            </v-container>
            <v-card-text class="mb-n5">Tem certeza que deseja excluir os {{ selectedItems.length }} itens
                selecionados?</v-card-text>

            <v-alert v-if="errorMessage" type="error" class="mb-3 mx-3" :variant="isDarkTheme ? 'tonal' : 'elevated'">
                {{ errorMessage }}
            </v-alert>

            <v-progress-linear v-if="loading" indeterminate color="primary"></v-progress-linear>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="grey" @click="deleteDialog = false">Cancelar</v-btn>
                <v-btn color="red" :disabled="loading" @click="deleteSelected"
                    :variant="isDarkTheme ? 'tonal' : 'text'">Excluir</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import api from '../../services/api';
import { errorMessage } from '@/services/Clean';
import { useTheme } from 'vuetify';

interface Pessoa {
    email: string;
}

const deleteDialog = ref(false);
const loading = ref(false);
const theme = useTheme();
const isDarkTheme = computed(() => theme.global.current.value.dark);

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
        await api.delete('/pessoas/deletar-emails', { data: emailsToDelete });
        emit("deleted", emailsToDelete);
        deleteDialog.value = false;
        window.location.reload();
    } catch (error) {
        console.error("Erro ao deletar pessoas:", error);
        errorMessage.value = "Erro ao tentar deletar as pessoas . Tente novamente.";
    } finally {
        loading.value = false;
    }
}
</script>

<style scoped>
.fade-enter-active {
    transition: opacity 0.5s ease-in-out;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}

.fade-enter-to {
    opacity: 1;
}
</style>