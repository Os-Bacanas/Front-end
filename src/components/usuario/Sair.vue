<template>

    <v-list-item @click="isConfirmed = true">
        <v-container class="ml-n5 my-n3">
            <v-icon class="mx-2 " color="red">mdi-logout</v-icon>
            <v-title>Sair</v-title>
        </v-container>
    </v-list-item>

    <v-dialog v-model="isConfirmed" max-width="400">
        <v-card>
            <v-card-title class="text-h5">
                Deseja sair?
                <v-card-subtitle class="ml-n4">Voce voltará para a tela de login</v-card-subtitle>
            </v-card-title>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red" @click="isConfirmed = false" variant="outlined">Não</v-btn>
                <v-btn color="green" @click="confirmAction">Sim</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

</template>

<script lang="ts" setup>
import router from '@/router';
import { ref } from 'vue';

const isConfirmed = ref(false);

function confirmAction() {
    isConfirmed.value = false;
    localStorage.removeItem("accessToken");
    localStorage.removeItem('theme');
    router.push("/login");
}
</script>