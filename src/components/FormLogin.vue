<template>
    <v-container class="fill-height d-flex justify-center ">
        <div class="h-50 w-100">
            <v-card class="mx-auto pa-12 pb-8" elevation="6" max-width="448" rounded="lg">

                <div class="text-h5  text-center text-grey-darken-1">LOGIN</div>


                <div class="text-subtitle-1 text-medium-emphasis">Email</div>
                <v-text-field v-model="form.email" density="compact" placeholder="Digite seu email"
                    prepend-inner-icon="mdi-email-outline" variant="outlined"
                    :rules="[required, emailIsValid]"></v-text-field>


                <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">Senha</div>
                <v-text-field v-model="form.password" @click:append-inner="toggleVisibility"
                    :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :type="visible ? 'text' : 'password'"
                    density="compact" placeholder="Digite sua senha" prepend-inner-icon="mdi-lock-outline"
                    variant="outlined" :rules="[required]"></v-text-field>


                <v-btn class="mt-3" color="blue" size="large" variant="tonal" block to="/">Entrar</v-btn>


                <v-card-text class="text-end pt-10 mb-n5">
                    <router-link to="/cadastro" class="text-blue-lighten-1 text-decoration-none"
                        rel="noopener noreferrer">Cadastra-se<v-icon icon="mdi-chevron-right"></v-icon></router-link>

                </v-card-text>
            </v-card>
        </div>
    </v-container>
</template>



<script lang="ts" setup>
import { ref } from 'vue';
const visible = ref(false);

const form = ref({
    email: undefined,
    password: undefined
})


function required(value: string) {
    return value ? true : 'O campo é obrigatório'
}

function emailIsValid(value: string) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (regex.test(value)) {
        return true
    }
    return "Email inválido"
}

const toggleVisibility = () => {
    visible.value = !visible.value;
};

</script>