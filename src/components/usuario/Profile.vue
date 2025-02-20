<template>
    <v-menu v-model="openMenu" :close-on-content-click="false" location="end">
        <template v-slot:activator="{ props }">
            <v-avatar class="mr-5">
                <v-icon icon="mdi-account-circle-outline" color="blue" size="40" v-bind="props"></v-icon>
            </v-avatar>
        </template>

        <v-card min-width="300">
            <v-list class="d-flex">
                <v-list-item :title="nameUser">
                    <v-list-item-subtitle>{{ emailUser }}</v-list-item-subtitle>
                    <v-list-item-subtitle>{{ cpfUser }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item class="align-center" size="x-large"
                    append-icon="mdi-file-document-multiple-outline"><v-icon></v-icon></v-list-item>
            </v-list>

            <v-divider></v-divider>

            <v-list>
                <Editar></Editar>
                <DeletarConta></DeletarConta>
            </v-list>
        </v-card>
    </v-menu>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import DeletarConta from './DeletarConta.vue';
import Editar from './Editar.vue';
import { jwtDecode } from 'jwt-decode';
import { token, type CustomJwtPayload } from '@/services/LocalStorageVerification';

const openMenu = ref(false);

let decodedToken: CustomJwtPayload | null = null;
try {
    if (token) {
        decodedToken = jwtDecode<CustomJwtPayload>(token);
    }
} catch (error) {
    console.error("Erro ao decodificar o token:", error);
}

const usuario = ref({
    name: decodedToken?.name || "Nome do usuário",
    email: decodedToken?.email || "Email do usuário",
    cpf: decodedToken?.cpf || "CPF do usuário",
});

const nameUser = computed(() => usuario.value.name);
const emailUser = computed(() => usuario.value.email);
const cpfUser = computed(() => usuario.value.cpf);
</script>
