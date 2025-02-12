<template>
    <v-layout class="rounded rounded-md">
        <v-navigation-drawer>
            <v-list>
                <v-list-item to="pessoas" title="Pessoas"></v-list-item>
                <v-list-item to="usuarios" title="Usuarios"></v-list-item>
            </v-list>
        </v-navigation-drawer>

        <v-app-bar title="Sistema de Contatos"></v-app-bar>

        <v-main class="d-flex align-center justify-center" style="min-height: 300px;">
            <RouterView></RouterView>
        </v-main>
    </v-layout>
</template>