import { valid } from "../services/Campos";

export function required(value: string) {
  return value ? true : "O campo é obrigatório";
}

export function emailIsValid(value: string) {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!regex.test(value)) {
    valid.value.email = false;
    return "Email inválido";
  }
  valid.value.email = true;
  return true;
}

export function cpfIsValid(value: string) {
  if (value.length === 0) {
    valid.value.cpf = true;
    return true;
  }
  if (/[a-zA-Z]/.test(value)) {
    valid.value.cpf = false;
    return "Não pode conter letras";
  }
  const cleanCPF = value.replace(/\D/g, "");

  if (cleanCPF.length !== 11) {
    valid.value.cpf = false;
    return "CPF inválido";
  }
  valid.value.cpf = true;
  return true;
}

export function passwordIsValid(value: string) {
  if (value.length <= 8) {
    valid.value.password = false;
    return "A senha deve ter mais de 8 caracteres";
  }
  if (!/[A-Z]/.test(value)) {
    valid.value.password = false;
    return "A senha deve conter pelo menos uma letra maiúscula";
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
    valid.value.password = false;
    return "A senha deve conter pelo menos um caractere especial";
  }
  if (!/[0-9]/.test(value)) {
    valid.value.password = false;
    return "A senha deve conter pelo menos um número";
  }
  valid.value.password = true;
  return true;
}

export function confirmPasswordIsValid(value: string, password: string) {
  if (value !== password) {
    valid.value.confirmPassword = false;
    return "A senha deve ser igual";
  }
  valid.value.confirmPassword = true;
  return true;
}

export function telefoneIsValid(value: string) {
  if (/[a-zA-Z]/.test(value)) {
    valid.value.telefone = false;
    return "Não pode conter letras";
  }
  const cleanPhone = value.replace(/\D/g, "");
  if (cleanPhone.length !== 11) {
    valid.value.telefone = false;
    return "Telefone inválido";
  }
  valid.value.telefone = true;
  return true;
}