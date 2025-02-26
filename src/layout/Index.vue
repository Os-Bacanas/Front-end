<template>
    <v-layout class="rounded rounded-md">

        <v-app-bar flat class="border-b px-1">
            <v-app-bar-nav-icon @click.stop="isDrawerOpen = !isDrawerOpen"></v-app-bar-nav-icon>
            <v-toolbar-title class="text-h6">Sistema de Gerenciamento de Pessoas</v-toolbar-title>

            <template #append>
                <v-card-text class="mr-n7 mb-n4">
                    <v-card-subtitle class="text-overline font-weight-medium">{{ nameUser || 'Usuário'
                        }}</v-card-subtitle>
                </v-card-text>
                <Profile></Profile>
            </template>

        </v-app-bar>

        <v-navigation-drawer v-model="isDrawerOpen">
            <v-list>
                <v-list-item to="/usuarios">
                    <v-container class="ma-n4">
                        <v-icon class="mr-3" :color="isDarkTheme ? '#BB86FC' : 'blue-darken-1'">mdi-account</v-icon>
                        <v-title>Usuários</v-title>
                    </v-container>
                </v-list-item>
                <v-list-item to="/pessoas">
                    <v-container class="ma-n4">
                        <v-icon class="mr-3"
                            :color="isDarkTheme ? '#BB86FC' : 'blue-darken-1'">mdi-account-group</v-icon>
                        <v-title>Pessoas</v-title>
                    </v-container>
                </v-list-item>

                <v-divider class="my-2"></v-divider>

                <Sair/>
            </v-list>

            <template #append>
                <v-divider></v-divider>
                <div class="pa-4 d-flex justify-center">
                    <v-btn @click="mudarTema" variant="text" size="small">
                        <v-icon>{{ isDarkTheme ? 'mdi-weather-night' : 'mdi-white-balance-sunny' }}</v-icon>
                        <span class="ml-2">{{ isDarkTheme ? 'Modo Escuro' : 'Modo Claro' }}</span>
                    </v-btn>
                </div>
            </template>
        </v-navigation-drawer>

        <v-main>
            <RouterView></RouterView>
        </v-main>

    </v-layout>
</template>

<script setup lang="ts">
import Sair from '@/components/usuario/Sair.vue';
import router from '@/router';
import { ref, onMounted } from 'vue';
import { type CustomJwtPayload } from '@/services/LocalStorageVerification';
import { jwtDecode } from 'jwt-decode';
import { useTheme } from 'vuetify';
import Profile from "../components/usuario/Profile.vue";

const isDrawerOpen = ref(true);
const theme = useTheme();
const isDarkTheme = ref(false);

let nameUser = "";

function mudarTema() {
    isDarkTheme.value = !isDarkTheme.value;
    theme.global.name.value = isDarkTheme.value ? 'dark' : 'light';
    localStorage.setItem("theme", isDarkTheme.value ? "dark" : "light");
}

onMounted(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
        isDarkTheme.value = savedTheme === "dark";
        theme.global.name.value = isDarkTheme.value ? "dark" : "light";
    }

    const savedToken = localStorage.getItem("accessToken");
    if (!savedToken) {
        setTimeout(() => {
            return router.replace('/login');
        }, 500);
        return;
    }

    try {
        const decodedToken = jwtDecode<CustomJwtPayload>(savedToken);
        nameUser = decodedToken.name;
    } catch (error) {
        console.error("Erro ao decodificar o token:", error);
        localStorage.removeItem("accessToken");
        router.replace("/login");
    }
});
</script>