import { ref } from "vue";

export const formBase = ref({
  id: "",
  nome: "",
  cpf: "",
  email: "",
  telefone: "",
  descricao: "",
});

export const formComSenha = ref({
  ...formBase.value,
  password: "",
  confirmPassword: "",
});

export const valid = ref({
  cpf: false,
  email: false,
  password: false,
  confirmPassword: false,
  telefone: false,
});
