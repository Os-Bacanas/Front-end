<template>
    <v-container class="fill-height d-flex justify-center">
        <div class="h-50 w-100">
            <v-card class="mx-auto pa-12 pb-8" elevation="6" max-width="448" rounded="lg">
                <div class="text-h5 text-center text-grey-darken-1">LOGIN</div>

                <v-alert v-if="errorMessage" type="error" variant="tonal">
                    {{ errorMessage }}
                </v-alert>
                <div class="text-subtitle-1 text-medium-emphasis">Email</div>
                <v-text-field v-model="formComSenha.email" density="compact" placeholder="Digite seu email"
                    prepend-inner-icon="mdi-email-outline" variant="outlined" :rules="[required, emailIsValid]" />

                <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">Senha</div>
                <v-text-field v-model="formComSenha.password" @click:append-inner="toggleVisibility"
                    :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :type="visible ? 'text' : 'password'"
                    density="compact" placeholder="Digite sua senha" prepend-inner-icon="mdi-lock-outline"
                    variant="outlined" :rules="[required]" />

                <v-btn class="mt-3" color="blue" size="large" variant="tonal" block
                    :disabled="!formComSenha.email || !formComSenha.password || isSubmitting" @click="postLogin">
                    {{ isSubmitting ? 'Entrando...' : 'Entrar' }}
                </v-btn>

                <v-card-text class="text-end pt-10 mb-n5">
                    <router-link to="/cadastro" class="text-blue-lighten-1 text-decoration-none"
                        rel="noopener noreferrer">
                        Cadastrar-se <v-icon icon="mdi-chevron-right"></v-icon>
                    </router-link>
                </v-card-text>
            </v-card>
        </div>
    </v-container>
</template>

<script lang="ts" setup>
import { required, emailIsValid } from "../../services/Validacao";
import { formComSenha, valid } from '../../services/Campos';
import { visible, toggleVisibility } from "@/services/visiblePassword";
import { onMounted, ref, watch } from 'vue';
import { useRouter } from "vue-router";
import { jwtDecode } from "jwt-decode";
import { type CustomJwtPayload } from '@/services/LocalStorageVerification';
import { clean, errorMessage } from "@/services/Clean";
import api from "@/services/api";

const router = useRouter();
const isSubmitting = ref(false);

async function postLogin() {
    errorMessage.value = "";
    if (!valid.value.email) return errorMessage.value = "Erro ao fazer login. Verifique suas credenciais.";

    isSubmitting.value = true;
    try {
        const response = await api.post("/login", {
            email: formComSenha.value.email,
            password: formComSenha.value.password,
        });
        localStorage.setItem("accessToken", response.data.accessToken);
        router.push("/usuarios");
    } catch (error) {
        console.error("Erro ao fazer o login:", error);
        errorMessage.value = error.response?.data?.message || 'Ocorreu um erro inesperado. Tente novamente';
    } finally {
        isSubmitting.value = false;
    }
}

onMounted(() => {
    errorMessage.value = '';
    clean(formComSenha);
    const token = localStorage.getItem('accessToken');
    if (token) {
        try {
            const decodedToken = jwtDecode<CustomJwtPayload>(token);
            if (decodedToken.name) {
                router.replace("/usuarios");
            }
        } catch (error) {
            console.error("Erro ao decodificar o token:", error);
            localStorage.removeItem("accessToken");
        }
    }
});

watch(formComSenha, () => {
    errorMessage.value = "";
}, { deep: true });
</script>