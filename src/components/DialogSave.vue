<template>
    <div class="pa-4">
        <v-dialog v-model="dialog" max-width="600">
            <template v-slot:activator="{ props: activatorProps }">
                <v-btn class="text-none font-weight-regular" prepend-icon="mdi-account" text="Salvar" variant="tonal"
                    v-bind="activatorProps"></v-btn>
            </template>

            <v-card prepend-icon="mdi-account" title="Save User">
                <!-- Exibir mensagem de erro caso ocorra -->
                <v-alert v-if="errorMessage" type="error" color="red-lighten-4">
                    {{ errorMessage }}
                </v-alert>
                <v-card-text>
                    <v-row dense>
                        <v-col cols="12" md="4" sm="6">
                            <v-text-field label="Nome*" v-model="form.nome" :rules="[required]"></v-text-field>
                        </v-col>

                        <v-col cols="12" md="4" sm="6">
                            <v-text-field label="Email*" v-model="form.email"
                                :rules="[required, emailIsValid]"></v-text-field>
                        </v-col>

                        <v-col cols="12" md="4" sm="6">
                            <v-text-field label="CPF*" v-model="form.cpf"
                                :rules="[required, cpfIsValid]"></v-text-field>
                        </v-col>
                    </v-row>

                    <small class="text-caption text-medium-emphasis">*indicates required field</small>
                </v-card-text>

                <v-divider></v-divider>

                <v-progress-linear v-if="loading" indeterminate color="primary"></v-progress-linear>

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn text="Fechar" variant="plain" @click="dialog = false"></v-btn>

                    <v-btn color="primary" text="Salvar" variant="tonal" @click="postLogin"
                        :disabled="!form.nome || !form.cpf || !form.email"></v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { required, emailIsValid, cpfIsValid } from "../services/Validacao";
import { form, valid } from '../services/Campos';
import axios from "../services/api";

const dialog = ref(false);
const loading = ref(false); // Variável para controlar o estado de carregamento
const errorMessage = ref("");

async function postLogin() {
    errorMessage.value = "";
    loading.value = true; // Inicia o loader

    try {
        if (!valid.value) return errorMessage.value = "Erro ao fazer login. Verifique suas credenciais.";

        const response = await axios.post("/users", {
            email: form.value.email,
            password: form.value.password,
        });

        // Aqui você pode adicionar lógica para lidar com a resposta, como redirecionar o usuário ou exibir uma mensagem de sucesso.

    } catch (error) {
        // Exibe um alert de erro
        errorMessage.value = "Erro ao fazer login. Verifique suas credenciais.";
    } finally {
        loading.value = false; // Para o loader
        // Timeout da duração do alert 
        setTimeout(() => {
            errorMessage.value = "";
        }, 5000);
    }
};
</script>