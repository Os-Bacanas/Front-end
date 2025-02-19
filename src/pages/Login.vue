<template>
    <FormLogin></FormLogin>
</template>

<script lang="ts" setup>
import FormLogin from '../components/forms/FormLogin.vue';
import { onMounted, ref } from 'vue';
import { useTheme } from 'vuetify';

const theme = useTheme();

onMounted(() => {
    if (!localStorage.getItem('theme')) {
        theme.global.name.value = "light";
    }
})
</script>