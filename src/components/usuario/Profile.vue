<template>
  <v-menu v-model="openMenu" :close-on-content-click="false" location="end">
    <template v-slot:activator="{ props }">
      <v-avatar class="mr-5">
        <v-icon icon="mdi-account-circle-outline" color="blue" size="50" v-bind="props"></v-icon>
      </v-avatar>
    </template>

    <v-card min-width="300">
      <v-list class="d-flex">
        <v-list-item>
          <v-list-item-title class="text-body-1 font-weight-medium">{{ nameUser }}</v-list-item-title>
          <v-list-item-subtitle>{{ emailUser }}</v-list-item-subtitle>
          <v-list-item-subtitle>{{ formatCpf(cpfUser) }}</v-list-item-subtitle>
        </v-list-item>
        <v-list-item class="align-center" size="x-large" #append>
          <v-icon size="50" color="#0A84FF" class="pl-9">mdi-account</v-icon>
        </v-list-item>
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
import { ref, computed, onMounted } from 'vue';
import DeletarConta from './DeletarConta.vue';
import Editar from './Editar.vue';
import { jwtDecode } from 'jwt-decode';
import type { CustomJwtPayload } from '@/services/LocalStorageVerification';
import { formatCpf } from '../../services/FormatData';

const openMenu = ref(false);

// Estado do usuário com valores padrão
const usuario = ref({
  name: 'Nome do usuário',
  email: 'Email do usuário',
  cpf: 'CPF do usuário'
});

// Computeds que acessam o usuário
const nameUser = computed(() => usuario.value.name);
const emailUser = computed(() => usuario.value.email);
const cpfUser = computed(() => usuario.value.cpf);

const token = localStorage.getItem('accessToken');

onMounted(() => {
  if (token) {
    try {
      // decodifica token uma vez
      const decodedToken = jwtDecode<CustomJwtPayload>(token);
      // atualiza estado do usuário com os dados do token
      usuario.value = {
        name: decodedToken?.name || 'Nome do usuário',
        email: decodedToken?.email || 'Email do usuário',
        cpf: decodedToken?.cpf || 'CPF do usuário'
      };
    } catch (error) {
      console.error('Erro ao decodificar o token:', error);
    }
  }
});
</script>
