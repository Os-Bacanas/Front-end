<template>
    
    <v-list-item title="Sair" prepend-icon="mdi-logout" @click="isConfirmed = true"></v-list-item>

    <v-dialog v-model="isConfirmed" max-width="340">
        <v-card>
            <v-card-title class="text-h5">
                Deseja sair?
            </v-card-title>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green" @click="confirmAction">Sim</v-btn>
                <v-btn color="red" @click="isConfirmed = false">Não</v-btn>
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
    localStorage.removeItem("token");
    router.push("/login");
}
</script>