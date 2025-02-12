<template>
    <v-container class="fill-height d-flex justify-center">
        <div class="h-15 w-100">
            <v-card class="mx-auto pa-12 pb-8" elevation="6" max-width="448" rounded="lg">

                <div class="text-h5  text-center text-grey-darken-1">CADASTRO</div>

                <div class="text-subtitle-1 text-medium-emphasis">Nome</div>
                <v-text-field v-model="form.nome" density="compact" placeholder="Nome do usuário" variant="outlined"
                    :rules="[required]" prepend-inner-icon="mdi-account-outline"></v-text-field>


                <div class="text-subtitle-1 text-medium-emphasis">CPF</div>
                <v-text-field v-model="form.cpf" density="compact" placeholder="CPF" variant="outlined"
                    :rules="[required, cpfIsValid]"
                    prepend-inner-icon="mdi-card-account-details-outline"></v-text-field>


                <div class="text-subtitle-1 text-medium-emphasis">Email</div>
                <v-text-field v-model="form.email" density="compact" placeholder="Email address"
                    prepend-inner-icon="mdi-email-outline" variant="outlined"
                    :rules="[required, emailIsValid]"></v-text-field>


                <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">Senha</div>
                <v-text-field v-model="form.password" @click:append-inner="toggleVisibility"
                    :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :type="visible ? 'text' : 'password'"
                    density="compact" placeholder="Digite uma senha" prepend-inner-icon="mdi-lock-outline"
                    variant="outlined" :rules="[required, passwordIsValid]"></v-text-field>


                <div class="text-subtitle-1 text-medium-emphasis">Confirmar senha</div>
                <v-text-field v-model="form.confirmPassword" @click:append-inner="toggleVisibility" :type="visible ? 'text' : 'password'"
                    density="compact" placeholder="Confirme sua senha" prepend-inner-icon="mdi-lock-outline"
                    variant="outlined" :rules="[required, value => confirmPasswordIsValid(value, form.password)]"></v-text-field>


                <v-btn class="mt-3" color="blue" size="large" variant="tonal" block to="/login">Cadastra-se</v-btn>
                
                <v-card-text class="text-end pt-10 mb-n5">
                    <router-link to="/login" class="text-blue-lighten-1 text-decoration-none"
                        rel="noopener noreferrer">Entrar<v-icon icon="mdi-chevron-right"></v-icon></router-link>

                </v-card-text>
            </v-card>
        </div>
    </v-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const visible = ref(false);

const form = ref({
    nome: "",
    cpf: "",
    email: "",
    password: "",
    confirmPassword: ""
})


function required(value: string) {
    return value ? true : 'O campo é obrigatório'
}

function emailIsValid(value: string) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (regex.test(value)) return true
    return "Email inválido"
}

function cpfIsValid(value: string) {
    const cleanCPF = value.replace(/\D/g, ""); // remove pontos e tracos 

    if (cleanCPF.length !== 11) return 'CPF inválido'
    return true;
}


function passwordIsValid(value: string) {
    if (value.length <= 8) return 'A senha deve ter mais de 8 caracteres';
    if (!/[A-Z]/.test(value)) return 'A senha deve conter pelo menos uma letra maiúscula';
    if (!/[0-9]/.test(value)) return 'A senha deve conter pelo menos um número';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) return 'A senha deve conter pelo menos um caractere especial';
    return true;
}

function confirmPasswordIsValid(value: string, password: string) {

    if (value !== password) return 'A senha deve ser igual'
    return true;
}

const toggleVisibility = () => {
    visible.value = !visible.value;
};

</script>