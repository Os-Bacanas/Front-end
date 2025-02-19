<template>
    <v-layout class="rounded rounded-md">

        <v-app-bar flat class="border-b">
            <v-app-bar-nav-icon @click.stop="isDrawerOpen = !isDrawerOpen"></v-app-bar-nav-icon>
            <v-toolbar-title>Sistema de Contatos</v-toolbar-title>

            <template #append>
                <v-card-text class="mr-n5 mb-n4">
                    <v-card-subtitle>{{ nameUser || 'Nome do usuário' }}</v-card-subtitle>
                </v-card-text>
                <Profile></Profile>
            </template>

        </v-app-bar>

        <v-navigation-drawer v-model="isDrawerOpen">
            <v-list>
                <v-list-item to="/usuarios" title="Usuários" prepend-icon="mdi-account"></v-list-item>
                <v-list-item to="/pessoas" title="Pessoas" prepend-icon="mdi-account-group"></v-list-item>

                <v-divider class="my-2"></v-divider>

                <Sair></Sair>
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
import Sair from '@/components/Sair.vue';
import router from '@/router';
import { ref, onMounted } from 'vue';
import { token, type CustomJwtPayload } from '@/services/LocalStorageVerification';
import { jwtDecode } from 'jwt-decode';
import { useTheme } from 'vuetify';
import Profile from "../components/Profile.vue"; //erro na importacao

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

    if (!token) {
        return;// router.push('/login') // Redirecionar para login se não houver token
    }

    try {
        const decodedToken = jwtDecode<CustomJwtPayload>(token);
        nameUser = decodedToken.name;
    } catch (error) {
        console.error("Erro ao decodificar o token:", error);
        localStorage.removeItem("token");
        // router.push("/login"); // Redirecionar para login em caso de erro
    }
});
</script>
