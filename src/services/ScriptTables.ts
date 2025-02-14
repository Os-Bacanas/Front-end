import { ref, computed, onMounted, onUnmounted } from 'vue';


export const itemsPerPage = 5; 
export const displayedCount = ref(itemsPerPage);
export const isLoading = ref(false);
export const sentinela = ref<HTMLElement | null>(null);

export interface UsuarioPessoa {
    id: number;
    name: string;
    email: string;
    cpf: string;
}