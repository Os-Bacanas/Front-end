<template>
    <v-list-item title="Deletar Conta" prepend-icon="mdi-delete" @click="openDialog()"
        class="text-red-accent-3"></v-list-item>

    <v-dialog v-model="isConfirmed" max-width="340">
        <v-card title="Deseja deletar a conta?" prepend-icon="mdi-close">
            <v-card-subtitle>Impossível recuperar os dados depois.</v-card-subtitle>

            <v-alert v-if="errorMessage" type="error" color="red-lighten-4">
                {{ errorMessage }}
            </v-alert>

            <v-progress-linear v-if="loading" indeterminate color="primary"></v-progress-linear>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green" @click="confirmAction">Sim</v-btn>
                <v-btn color="red" @click="isConfirmed = false" variant="flat">Não</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';
import { errorMessage } from '@/services/Clean';
import { type CustomJwtPayload } from '@/services/LocalStorageVerification';
import { jwtDecode } from 'jwt-decode';

const router = useRouter();
const isConfirmed = ref(false);
const loading = ref(false);
const token = localStorage.getItem('accessToken');

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
    } catch (error) {
        console.error('Erro ao deletar usuario: ', error)
        errorMessage.value = "Não foi possível remover sua conta, tente mais tarde.";
    } finally {
        loading.value = false;
    }
}
</script>