<template>
    <v-dialog v-model="dialog" max-width="600">
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn class="text-none font-weight-regular me-auto" prepend-icon="mdi-account" text="Salvar"
                :variant="isDarkTheme ? 'flat' : 'tonal'" v-bind="activatorProps" color="green-darken-2"
                @click="openDialog">
            </v-btn>
        </template>

        <v-card prepend-icon="mdi-account" title="Salvar Usuário">

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
                        <v-text-field label="CPF*" v-model="form.cpf" :rules="[required, cpfIsValid]"></v-text-field>
                    </v-col>
                </v-row>

                <small class="text-caption text-medium-emphasis">*Preencha os dados corretamente</small>
            </v-card-text>

            <v-divider></v-divider>

            <v-progress-linear v-if="loading" indeterminate color="primary"></v-progress-linear>

            <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn text="Fechar" variant="plain" @click="dialog = false"></v-btn>

                <v-btn color="primary" text="Salvar" variant="tonal" @click="postLogin"
                    :disabled="!form.nome || !form.cpf || !form.email || loading">
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { required, emailIsValid, cpfIsValid } from "../../services/Validacao";
import { form, valid } from '../../services/Campos';
import axios from "../../services/api";
import { clean, errorMessage } from '@/services/Clean';
import { useTheme } from 'vuetify';

const dialog = ref(false);
const loading = ref(false);
const theme = useTheme();
const isDarkTheme = computed(() => theme.global.current.value.dark);

function openDialog() {
    errorMessage.value = ''
    clean(form);
    dialog.value = true;
}


async function postLogin() {
    loading.value = true;

    try {
        if (!valid.value) {
            errorMessage.value = "Erro ao salvar. Verifique suas credenciais.";
            return;
        }

        await axios.post("/users", {
            nome: form.value.nome,
            email: form.value.email,
            cpf: form.value.cpf,
        });

        dialog.value = false;
        clean(form);

    } catch (error) {
        console.error("Erro ao salvar:", error);
        errorMessage.value = "Erro ao salvar. Tente novamente.";
    } finally {
        loading.value = false;
    }
};
</script>