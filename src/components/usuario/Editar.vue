<template>
    <v-list-item title="Editar conta" prepend-icon="mdi-pencil" @click="openDialog()"></v-list-item>

    <v-dialog v-model="isConfirmed" max-width="700">
        <v-card title="Editar conta" prepend-icon="mdi-pencil">

            <v-alert v-if="errorMessage" type="error" color="red-lighten-4">
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

            <v-progress-linear v-if="loading" indeterminate color="primary"></v-progress-linear>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red" @click="isConfirmed = false">Cancelar</v-btn>
                <v-btn color="green" @click="confirmAction" :variant="isDarkTheme ? 'flat' : 'tonal'">Editar</v-btn>
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
        errorMessage.value = "Erro inesperado, tente mais tarde.";
    }
}

async function confirmAction() {
    loading.value = true;
    errorMessage.value = '';
    try {
        await api.put('/users', {
            id: id.value,
            name: name.value,
            email: email.value,
            cpf: cpf.value
        });
        isConfirmed.value = false;
    } catch (error) {
        console.error('Erro ao editar usuário: ', error);
        errorMessage.value = "Não foi possível editar sua conta.";
    } finally {
        loading.value = false;
    }
}
</script>