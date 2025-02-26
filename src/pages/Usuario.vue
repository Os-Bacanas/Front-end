<template>
    <v-container class="text-center title">Usuários</v-container>
    <TableUsuarios></TableUsuarios>
</template>

<script lang="ts" setup>
import TableUsuarios from '../components/tables/TableUsuarios.vue';
</script>

<style scoped>
.title {
    font-size: 1.400rem;
    font-weight: 500;
    line-height: 2.6;
    letter-spacing: 0.0892857143em;
    text-transform: uppercase;
}
</style>