
import { valid } from '../services/Campos'


 export function required(value: string) {
    return value ? true : 'O campo é obrigatório';
}

export function emailIsValid(value: string) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (regex.test(value)) {
        valid.value.email = true;
        return true;
    }
    return "Email inválido";
}

export function cpfIsValid(value: string) {
    const cleanCPF = value.replace(/\D/g, ""); // remove pontos e traços 
    if (cleanCPF.length !== 11) return 'CPF inválido';
    valid.value.cpf = true;
    return true;
}

export function passwordIsValid(value: string) {
    if (value.length <= 8) return 'A senha deve ter mais de 8 caracteres';
    if (!/[A-Z]/.test(value)) return 'A senha deve conter pelo menos uma letra maiúscula';
    if (!/[0-9]/.test(value)) return 'A senha deve conter pelo menos um número';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) return 'A senha deve conter pelo menos um caractere especial';
    valid.value.password = true;
    return true;
}

export function confirmPasswordIsValid(value: string, password: string) {
    if (value !== password) return 'A senha deve ser igual';
    valid.value.confirmPassword = true;
    return true;
}
