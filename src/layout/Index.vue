<template>
    <v-layout class="rounded rounded-md">

        <v-app-bar flat class="border-b">
            <v-app-bar-nav-icon @click.stop="isDrawerOpen = !isDrawerOpen"></v-app-bar-nav-icon>
            <v-toolbar-title>Sistema de Contatos</v-toolbar-title>

            <template #append>
                <v-card-text class="mr-n5 mb-n4">
                    <v-card-subtitle>{{ nameUser() }}</v-card-subtitle>
                </v-card-text>
                <v-avatar class="mr-5">
                    <v-icon icon="mdi-account-circle-outline" color="blue" size="40"></v-icon>
                </v-avatar>
            </template>

        </v-app-bar>

        <v-navigation-drawer v-model="isDrawerOpen">
            <v-list>
                <v-list-item to="usuarios" title="Usuarios" prepend-icon="mdi-account"></v-list-item>
                <v-list-item to="pessoas" title="Pessoas" prepend-icon="mdi-account-group"></v-list-item>
                <Sair></Sair>
            </v-list>
        </v-navigation-drawer>

        <v-main class="d-flex align-center justify-center" style="min-height: 300px;">
            <RouterView></RouterView>
        </v-main>

    </v-layout>
</template>

<script setup lang="ts">
import Sair from '@/components/Sair.vue';
import { ref } from 'vue';

const isDrawerOpen = ref(true);

function nameUser() {
    const name = localStorage.getItem('name');
    return name;
}

</script>