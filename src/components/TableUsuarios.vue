<template>
    <v-container>
        <v-card class="mx-10">
            <div class="pa-4">

                <v-table height="300px" fixed-header>
                    <thead>
                        <tr>
                            <th class="text-left">ID</th>
                            <th class="text-left">Nomes</th>
                            <th class="text-left">Emails</th>
                            <th class="text-left">CPFs</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(usuario, index) in displayedUsuarios" :key="index">
                            <td>{{ usuario.id }}</td>
                            <td>{{ usuario.name }}</td>
                            <td>{{ usuario.email }}</td>
                            <td>{{ usuario.cpf }}</td>

                        </tr>
                        <!-- Elemento sentinela para ativar o carregamento -->
                        <tr v-if="isLoading" ref="sentinela">
                            <td colspan="4" class="text-center">Carregando...</td>
                        </tr>
                    </tbody>
                </v-table>
            </div>
        </v-card>
    </v-container>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import axios from 'axios';


// Definindo tipos e variáveis reativas
interface Usuario {
    id: number;
    name: string;
    email: string;
    cpf: string;
}

const usuarios = ref<Usuario[]>([]);
const itemsPerPage = 10;
const displayedCount = ref(itemsPerPage);
const isLoading = ref(false); // Controle do estado de carregamento
const sentinela = ref<HTMLElement | null>(null);

// Computed para exibir apenas as usuarios necessárias
const displayedUsuarios = computed(() => usuarios.value.slice(0, displayedCount.value));

// Função para buscar usuarios da API
async function fetchUsuarios() {
    try {
        isLoading.value = true;
        const response = await axios.get<Usuario[]>('/users');
        usuarios.value = response.data;
    } catch (error) {
        console.log('Erro ao buscar usuários: ', error);
    } finally {
        isLoading.value = false;
    }
};

// Função para carregar mais usuarios quando o sentinela é atingido
function loadMoreUsuarios() {
    if (displayedCount.value < usuarios.value.length) {
        displayedCount.value += itemsPerPage;
    }
};

// Configuração do Intersection Observer para detectar o sentinela
const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !isLoading.value) {
        loadMoreUsuarios();
    }
}, {
    rootMargin: '0px',
    threshold: 1.0
});

onMounted(() => {
    fetchUsuarios();
    if (sentinela.value) {
        observer.observe(sentinela.value);
    }
});

onUnmounted(() => {
    observer.disconnect();
});

</script>

<style scoped>
.no-widht {
    width: 0px !important;
}
</style>