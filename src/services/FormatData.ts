export function formatCpf(cpf: string): string {
    const cleaned = cpf.replace(/[^\d]/g, '');
    if (cleaned.length === 11) {
        // Formato: xxx.xxx.xxx-xx
        return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9)}`;
    }
    return cpf;
}

export function formatPhoneNumber(phone: string): string {
    const cleaned = phone.replace(/[^\d]/g, '');
    if (cleaned.length === 11) {
        // Formato: (xx) xxxxx-xxxx
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    }
    return phone;
}

export function formatName(name: string): string {
    return name
        .split(' ') 
        .map(part => {
            return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
        })
        .join(' '); 
}
