<template>
    <v-btn class="text-none font-weight-regular" prepend-icon="mdi-close" text="Deletar Todos"
        :variant="isDarkTheme ? 'flat' : 'tonal'" color="red-darken-4" @click="openDialog" :disabled="loading">
    </v-btn>

    <v-dialog v-model="isConfirmed" max-width="340">
        <v-card>
            <v-card-title class="text-h5">
                Deseja Deletar Todos?
                <v-card-subtitle>Não será possível recuperar os dados</v-card-subtitle>
            </v-card-title>

            <v-alert v-if="errorMessage" type="error" color="red-lighten-4">
                {{ errorMessage }}
            </v-alert>

            <v-progress-linear v-if="loading" indeterminate color="primary"></v-progress-linear>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green" @click="confirmAction" :disabled="loading">Sim</v-btn>
                <v-btn color="red" @click="isConfirmed = false" :disabled="loading" variant="flat">Não</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import axios, { AxiosError } from 'axios';
import { errorMessage } from '@/services/Clean';
import { useTheme } from 'vuetify';

const isConfirmed = ref(false);
const loading = ref(false);
const theme = useTheme();
const isDarkTheme = computed(() => theme.global.current.value.dark);

function openDialog() {
    errorMessage.value = "";
    isConfirmed.value = true;
}

async function confirmAction() {
    await deleteAll();
    if (!errorMessage.value) {
        isConfirmed.value = false;
    }
}

async function deleteAll() {
    loading.value = true;
    try {
        await axios.delete("/users/deleteAll");

    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            errorMessage.value = error.response?.data?.message || "Erro ao deletar. Tente novamente.";
        } else {
            errorMessage.value = "Erro inesperado. Tente novamente.";
        }
    } finally {
        loading.value = false;
    }
}
</script>