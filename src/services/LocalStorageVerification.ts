export interface CustomJwtPayload {
    name: string;
    email: string;
    cpf: string;
    password: string;
}

export const getToken = localStorage.getItem("token");