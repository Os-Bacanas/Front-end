<template>
    <v-container>
        <v-card class="mx-10">
            <div class="pa-4">
                <v-card-title class="d-flex ">
                    <DialogSave></DialogSave>
                    <DialogDeleteAll></DialogDeleteAll>
                </v-card-title>

                <v-table height="300px" fixed-header>
                    <thead>
                        <tr>
                            <th class="text-left">ID</th>
                            <th class="text-left">Nomes</th>
                            <th class="text-left">Emails</th>
                            <th class="text-left">CPFs</th>
                            <th class="no-widht">Editar</th>
                            <th class="no-widht">Deletar</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(pessoa, index) in displayedPessoas" :key="index">
                            <td>{{ pessoa.id }}</td>
                            <td>{{ pessoa.name }}</td>
                            <td>{{ pessoa.email }}</td>
                            <td>{{ pessoa.cpf }}</td>
                            <td class="no-widht">
                                <DialogEdit></DialogEdit>
                            </td>
                            <td class="no-widht">
                                <DialogDelete></DialogDelete>
                            </td>

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
import DialogSave from './dialog/DialogSave.vue';
import DialogEdit from './dialog/DialogEdit.vue';
import DialogDelete from './dialog/DialogDelete.vue';
import DialogDeleteAll from './dialog/DialogDeleteAll.vue';


// Definindo tipos e variáveis reativas
interface Pessoa {
    id: number;
    name: string;
    email: string;
    cpf: string;
}

const pessoas = ref<Pessoa[]>([]);
const itemsPerPage = 10;
const displayedCount = ref(itemsPerPage);
const isLoading = ref(false); // Controle do estado de carregamento
const sentinela = ref<HTMLElement | null>(null);

// Computed para exibir apenas as pessoas necessárias
const displayedPessoas = computed(() => pessoas.value.slice(0, displayedCount.value));

// Função para buscar pessoas da API
async function fetchPessoas() {
    try {
        isLoading.value = true;
        const response = await axios.get<Pessoa[]>('/people');
        pessoas.value = response.data;
    } catch (error) {
        console.log('Erro ao buscar usuários: ', error);
    } finally {
        isLoading.value = false;
    }
};

// Função para carregar mais pessoas quando o sentinela é atingido
function loadMorePessoas() {
    if (displayedCount.value < pessoas.value.length) {
        displayedCount.value += itemsPerPage;
    }
};

// Configuração do Intersection Observer para detectar o sentinela
const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !isLoading.value) {
        loadMorePessoas();
    }
}, {
    rootMargin: '0px',
    threshold: 1.0
});

onMounted(() => {
    fetchPessoas();
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