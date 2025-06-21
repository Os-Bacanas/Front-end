<template>
    <v-list-item title="Deletar Conta" prepend-icon="mdi-delete" @click="openDialog()"
        class="text-red-accent-3"></v-list-item>

    <v-dialog v-model="isConfirmed" max-width="400">
        <v-card>
            <v-container class="text-h6 d-flex align-center">
                <v-icon class="mx-2 " color="red">mdi-close</v-icon>
                <v-card-title class="pa-0">Deseja deletar a conta?</v-card-title>
            </v-container>
            <v-card-subtitle>Impossível recuperar os dados depois.</v-card-subtitle>

            <v-alert v-if="errorMessage" type="error" class="mb-3" :variant="isDarkTheme ? 'elevated' : 'tonal'">
                {{ errorMessage }}
            </v-alert>

            <v-progress-linear v-if="loading" indeterminate
                :color="isDarkTheme ? '#BB86FC' : 'primary'"></v-progress-linear>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red" @click="isConfirmed = false" variant="outlined">Não</v-btn>
                <v-btn color="green" @click="confirmAction">Sim</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';
import { errorMessage } from '@/services/Clean';
import { type CustomJwtPayload } from '@/services/LocalStorageVerification';
import { jwtDecode } from 'jwt-decode';
import { useTheme } from 'vuetify';

const router = useRouter();
const isConfirmed = ref(false);
const loading = ref(false);
const token = localStorage.getItem('accessToken');

const theme = useTheme();
const isDarkTheme = computed(() => theme.global.current.value.dark);

function openDialog() {
    errorMessage.value = "";
    isConfirmed.value = true;
}

async function confirmAction() {
    loading.value = true;
    if (!token) {
        console.error('usuario nao tem token')
        errorMessage.value = "Não é possível remover a conta, faça login novamente.";
        loading.value = false;
        return;
    }
    let decodedToken: CustomJwtPayload;
    try {
        decodedToken = jwtDecode<CustomJwtPayload>(token);
        await api.delete(`/users/${decodedToken.sub}`);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("theme");
        router.push("/login");
        isConfirmed.value = false;
    } catch (error: any) {
        console.error('Erro ao deletar usuario: ', error)
        errorMessage.value = error.response?.data?.message || 'Ocorreu um erro inesperado. Tente novamente';
    } finally {
        loading.value = false;
    }
}
</script>