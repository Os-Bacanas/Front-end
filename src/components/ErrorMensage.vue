<template>
    <v-alert v-if="errorMessage" type="error" color="red-lighten-4">
        {{ errorMessage }}
    </v-alert>
</template>

<script lang="ts">
import { ref } from 'vue';
const errorMessage = ref("");
</script>