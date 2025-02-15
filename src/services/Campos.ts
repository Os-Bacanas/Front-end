import { ref } from 'vue';

export const form = ref({
    nome: "",
    cpf: "",
    email: "",
    password: "",
    confirmPassword: "",
    telefone: "",
});

export const valid = ref({
    cpf: false,
    email: false,
    password: false,
    confirmPassword: false,
    telefone: false,
});