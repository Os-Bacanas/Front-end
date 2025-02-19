export interface CustomJwtPayload {
    id: Number;
    name: string;
    email: string;
    cpf: string;
    password: string;
}

export const token = localStorage.getItem("token");