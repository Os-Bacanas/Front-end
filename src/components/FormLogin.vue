<template>

    <v-container class="fill-height d-flex justify-center ">
        <div class="h-50 w-100">
            <v-card class="mx-auto pa-12 pb-8" elevation="6" max-width="448" rounded="lg">

                <div class="text-h5  text-center text-grey-darken-1">LOGIN</div>

                <v-alert v-if="errorMessage" type="error" color="red-lighten-4">
                    {{ errorMessage }}
                </v-alert>


                <div class="text-subtitle-1 text-medium-emphasis">Email</div>
                <v-text-field v-model="formComSenha.email" density="compact" placeholder="Digite seu email"
                    prepend-inner-icon="mdi-email-outline" variant="outlined"
                    :rules="[required, emailIsValid]"></v-text-field>


                <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">Senha</div>
                <v-text-field v-model="formComSenha.password" @click:append-inner="toggleVisibility"
                    :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :type="visible ? 'text' : 'password'"
                    density="compact" placeholder="Digite sua senha" prepend-inner-icon="mdi-lock-outline"
                    variant="outlined" :rules="[required]"></v-text-field>


                <v-btn class="mt-3" color="blue" size="large" variant="tonal" block
                    :disabled="!formComSenha.email || !formComSenha.password" @click="postLogin">Entrar</v-btn>


                <v-card-text class="text-end pt-10 mb-n5">
                    <router-link to="/cadastro" class="text-blue-lighten-1 text-decoration-none"
                        rel="noopener noreferrer">Cadastra-se<v-icon icon="mdi-chevron-right"></v-icon></router-link>

                </v-card-text>
            </v-card>
        </div>
    </v-container>

</template>


<script lang="ts" setup>
import { required, emailIsValid } from "../services/Validacao"
import { formComSenha, valid } from '../services/Campos'
import { visible, toggleVisibility } from "@/services/visiblePassword";
import { onMounted } from 'vue';
import axios from "../services/api";
import { useRouter } from "vue-router";
import { jwtDecode } from "jwt-decode";
import { getToken, type CustomJwtPayload } from '@/services/LocalStorageVerification';
import { clean, errorMessage } from "@/services/Clean";

const router = useRouter();

async function postLogin() {
    errorMessage.value = "";

    try {
        if (!valid.value) return errorMessage.value = "Erro ao fazer login. Verifique suas credenciais.";

        const response = await axios.post("/users", {
            email: formComSenha.value.email,
            password: formComSenha.value.password,
        });

        localStorage.setItem("token", response.data.token);
        router.push("/");

    } catch (error) {
        errorMessage.value = "Erro ao fazer login. Verifique suas credenciais.";

    } finally {
        setTimeout(() => {
            errorMessage.value = "";
        }, 5000);

    }
};

onMounted(() => {
    clean(formComSenha);
    if (getToken) {
        try {
            const decodedToken = jwtDecode<CustomJwtPayload>(getToken);
            if (decodedToken.name) {
                router.push("/usuarios");
            }
        } catch (error) {
            console.error("Erro ao decodificar o token:", error);
            localStorage.removeItem("token");
        }
    }
});
</script>