<template>
    <v-container class="fill-height d-flex justify-center">
        <div class="h-15 w-100">
            <v-card class="mx-auto pa-12 pb-8" elevation="6" max-width="448" rounded="lg">

                <div class="text-h5  text-center text-grey-darken-1">CADASTRO</div>

                <v-alert v-if="errorMessage" type="error" variant="tonal">
                    {{ errorMessage }}
                </v-alert>

                <div class="text-subtitle-1 text-medium-emphasis">Nome</div>
                <v-text-field v-model="formComSenha.nome" density="compact" placeholder="Nome do usuário"
                    variant="outlined" :rules="[required]" prepend-inner-icon="mdi-account-outline"></v-text-field>


                <div class="text-subtitle-1 text-medium-emphasis">CPF</div>
                <v-text-field v-model="formComSenha.cpf" density="compact" placeholder="CPF" variant="outlined"
                    :rules="[required, cpfIsValid]"
                    prepend-inner-icon="mdi-card-account-details-outline"></v-text-field>


                <div class="text-subtitle-1 text-medium-emphasis">Email</div>
                <v-text-field v-model="formComSenha.email" density="compact" placeholder="Email address"
                    prepend-inner-icon="mdi-email-outline" variant="outlined"
                    :rules="[required, emailIsValid]"></v-text-field>


                <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">Senha</div>
                <v-text-field v-model="formComSenha.password" @click:append-inner="toggleVisibility"
                    :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :type="visible ? 'text' : 'password'"
                    density="compact" placeholder="Digite uma senha" prepend-inner-icon="mdi-lock-outline"
                    variant="outlined" :rules="[required, passwordIsValid]"></v-text-field>


                <div class="text-subtitle-1 text-medium-emphasis">Confirmar senha</div>
                <v-text-field v-model="formComSenha.confirmPassword" @click:append-inner="toggleVisibility"
                    :type="visible ? 'text' : 'password'" density="compact" placeholder="Confirme sua senha"
                    prepend-inner-icon="mdi-lock-outline" variant="outlined"
                    :rules="[required, value => confirmPasswordIsValid(value, formComSenha.password)]"></v-text-field>


                <v-btn class="mt-3" color="blue" size="large" variant="tonal" block @click="postCadastro"
                    :disabled="!formComSenha.nome || !formComSenha.cpf || !formComSenha.email || !formComSenha.password || !formComSenha.confirmPassword">Cadastra-se</v-btn>


                <v-card-text class="text-end pt-10 mb-n5">
                    <router-link to="/login" class="text-blue-lighten-1 text-decoration-none"
                        rel="noopener noreferrer"><v-icon icon="mdi-chevron-left"></v-icon>Entrar</router-link>
                </v-card-text>

            </v-card>
        </div>
    </v-container>
</template>

<script lang="ts" setup>
import { required, emailIsValid, cpfIsValid, passwordIsValid, confirmPasswordIsValid } from "../../services/Validacao"
import { formComSenha, valid } from '../../services/Campos'
import { visible, toggleVisibility } from "@/services/visiblePassword";
import { useRouter } from "vue-router";
import { onMounted, watch } from "vue";
import { clean, errorMessage } from "@/services/Clean";
import api from "../../services/api";

const router = useRouter();

async function postCadastro() {
    errorMessage.value = "";

    try {
        if (!valid.value.email || !valid.value.cpf || !valid.value.password || !valid.value.confirmPassword) return errorMessage.value = "Erro ao fazer o cadastro. Verifique suas credenciais.";

        await api.post("/users/cadastro", {
            name: formComSenha.value.nome,
            cpf: formComSenha.value.cpf,
            email: formComSenha.value.email,
            senha: formComSenha.value.password,
        });
        router.push("/login");
    } catch (error) {
        console.error("Erro ao cadastrar:", error);
        errorMessage.value = error.response?.data?.message || 'Ocorreu um erro inesperado. Tente novamente';
    }
};

onMounted(() => {
    errorMessage.value = '';
    clean(formComSenha);
});

watch(formComSenha, () => {
    errorMessage.value = "";
}, { deep: true });
</script>