<template>
    <div class="pa-4">
        <v-dialog v-model="dialog" max-width="600">

            <template v-slot:activator="{ props: activatorProps }">
                <v-btn class="text-none font-weight-regular" prepend-icon="mdi-account" text="Salvar" variant="tonal"
                    v-bind="activatorProps"></v-btn>
            </template>

            <v-card prepend-icon="mdi-account" title="Save User">
                <v-card-text>
                    <v-row dense>
                        <v-col cols="12" md="4" sm="6">
                            <v-text-field label="Nome*" :rules="[required]"></v-text-field>
                        </v-col>

                        <v-col cols="12" md="4" sm="6">
                            <v-text-field label="Email*" :rules="[required, emailIsValid]"></v-text-field>
                        </v-col>

                        <v-col cols="12" md="4" sm="6">
                            <v-text-field label="CPF*" :rules="[required, cpfIsValid]"></v-text-field>
                        </v-col>
                    </v-row>

                    <small class="text-caption text-medium-emphasis">*indicates required field</small>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn text="Fechar" variant="plain" @click="dialog = false"></v-btn>

                    <v-btn color="primary" text="Salvar" variant="tonal" @click="dialog = false"
                        :disabled="!form.nome || !form.cpf || !form.email"></v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const dialog = ref(false);

const form = ref({
    nome: "",
    email: "",
    cpf: "",
});

const valid = ref({
    cpf: false,
    email: false,
})

function required(value: string) {
    return value ? true : 'O campo é obrigatório'
};


function emailIsValid(value: string) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regex.test(value)) {
        return "Email inválido"
    }
    valid.value.email = true;
    return true;
};

function cpfIsValid(value: string) {
    const cleanCPF = value.replace(/\D/g, ""); 
    if (cleanCPF.length !== 11) return 'CPF inválido'
    valid.value.cpf = true
    return true;
}
</script>
