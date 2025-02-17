<template>
    <v-btn class="text-none font-weight-regular" prepend-icon="mdi-close" text="Deletar Todos"
        :variant="isDarkTheme ? 'flat' : 'tonal'" color="red-darken-4" @click="openDialog" :disabled="loading">
    </v-btn>

    <v-dialog v-model="isConfirmed" max-width="340">
        <v-card>
            <v-card-title class="text-h5">Deseja Deletar Todos?</v-card-title>
            <v-card-subtitle>Não será possível recuperar os dados</v-card-subtitle>

            <v-alert v-if="errorMessage" type="error" color="red-lighten-4" class="ma-4">
                {{ errorMessage }}
            </v-alert>

            <v-progress-linear v-if="loading" indeterminate color="primary"></v-progress-linear>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green" text="Sim" variant="tonal" @click="confirmAction" :disabled="loading"></v-btn>
                <v-btn color="red" text="Não" variant="flat" @click="isConfirmed = false" :disabled="loading"></v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { errorMessage } from '@/services/Clean';
import { useTheme } from 'vuetify';
import api from '@/services/api';

const isConfirmed = ref(false);
const loading = ref(false);
const theme = useTheme();
const isDarkTheme = computed(() => theme.global.current.value.dark);

function openDialog() {
    errorMessage.value = "";
    isConfirmed.value = true;
}

async function confirmAction() {
    errorMessage.value = "";
    await deleteAll();
}

async function deleteAll() {
    loading.value = true;

    try {
        await api.delete("/people/deleteAll");
        isConfirmed.value = false;
    } catch (error) {
        console.error("Erro ao deletar:", error);
        errorMessage.value = "Erro ao deletar. Tente novamente.";
    } finally {
        loading.value = false;
    }
}
</script>