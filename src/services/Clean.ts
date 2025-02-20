import { ref } from "vue";

export const errorMessage = ref("");

export function clean(form: any) {
  if (!form || !form.value) return;
  errorMessage.value = "";

  form.value = {
    nome: "",
    email: "",
    cpf: "",
  };
}
