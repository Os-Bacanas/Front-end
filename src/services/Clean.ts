export const errorMessage = ref("");

export function clean() {
    errorMessage.value = '';
    form.value.nome = ''
    form.value.email = ''
    form.value.cpf = ''
}

import { form } from "./Campos";
import { ref } from "vue";