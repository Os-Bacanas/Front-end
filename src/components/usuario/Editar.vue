<template>
    <v-list-item title="Editar conta" prepend-icon="mdi-pencil" @click="openDialog()"></v-list-item>

    <v-dialog v-model="isConfirmed" max-width="700">
        <v-card class="pa-4" :elevation="isDarkTheme ? 12 : 6" rounded="xl">
            <v-container class="text-h6">
                <v-icon class="mx-2 " :color="isDarkTheme ? '#BB86FC' : '#1976D2'">mdi-pencil</v-icon>
                <v-card-title>Editar conta</v-card-title>
            </v-container>
            <v-alert v-if="errorMessage" type="error" class="mb-3" :variant="isDarkTheme ? 'elevated' : 'tonal'">
                {{ errorMessage }}
            </v-alert>

            <v-card-text>
                <v-row dense>
                    <v-col cols="12" md="4" sm="6">
                        <v-text-field label="Nome*" v-model="name" :rules="[required]"></v-text-field>
                    </v-col>

                    <v-col cols="12" md="4" sm="6">
                        <v-text-field label="Email*" v-model="email" :rules="[required, emailIsValid]"></v-text-field>
                    </v-col>

                    <v-col cols="12" md="4" sm="6">
                        <v-text-field label="CPF" v-model="cpf" :rules="[required, cpfIsValid]"></v-text-field>
                    </v-col>
                </v-row>
                <small class="text-caption text-medium-emphasis">*Preencha os dados corretamente</small>
            </v-card-text>
            <v-divider></v-divider>

            <v-progress-linear v-if="loading" indeterminate
                :color="isDarkTheme ? '#BB86FC' : 'primary'"></v-progress-linear>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red" @click="isConfirmed = false">Cancelar</v-btn>
                <v-btn :color="isDarkTheme ? '#BB86FC' : '#1976D2'" @click="confirmAction"
                    :variant="isDarkTheme ? 'tonal' : 'outlined'">Editar</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import api from '@/services/api';
import { errorMessage } from '@/services/Clean';
import { type CustomJwtPayload } from '@/services/LocalStorageVerification';
import { jwtDecode } from 'jwt-decode';
import { required, emailIsValid, cpfIsValid } from '@/services/Validacao';
import { formComSenha, valid } from '../../services/Campos'
import { useTheme } from 'vuetify';

const theme = useTheme();
const isDarkTheme = computed(() => theme.global.current.value.dark);
const isConfirmed = ref(false);
const loading = ref(false);
const id = ref();
const name = ref('');
const email = ref('');
const cpf = ref('');
const token = localStorage.getItem('accessToken');

function openDialog() {
    errorMessage.value = "";
    loadUserData();
    isConfirmed.value = true;
}

function loadUserData() {
    if (!token) {
        console.error('o usuario nao tem token')
        errorMessage.value = "Não é possível editar a conta. Faça login novamente.";
        loading.value = false;
        return;
    }
    try {
        const decodedToken = jwtDecode<CustomJwtPayload>(token);
        if (!decodedToken.sub) {
            throw new Error("Token inválido");
        }
        id.value = decodedToken.sub;
        name.value = decodedToken.name;
        email.value = decodedToken.email;
        cpf.value = decodedToken.cpf;
    } catch (error) {
        console.error('Erro ao decodificar o token: ', error);
        setTimeout(() => {
            router.replace('/login')
        }, 2000);
    }
}

async function confirmAction() {
    loading.value = true;
    errorMessage.value = '';

    if (!valid.value.cpf || !valid.value.email) {
        loading.value = false;
        return errorMessage.value = "Erro ao editar. Verifique suas credenciais.";
    }
    try {
        const response = await api.put('/users', {
            id: id.value,
            name: name.value,
            email: email.value,
            cpf: cpf.value
        });
        const newToken = response.data.accessToken;
        if (newToken) {
            localStorage.setItem('accessToken', newToken);
        }
        isConfirmed.value = false;
        window.location.reload();
    } catch (error) {
        console.error("Erro ao fazer o PUT:", error);
        errorMessage.value = error.response?.data?.message || 'Ocorreu um erro inesperado. Tente novamente';
    } finally {
        loading.value = false;
    }
}
</script>