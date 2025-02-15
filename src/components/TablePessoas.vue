<template>
    <v-container>
        <v-card class="mx-10">
            <div class="pa-4">
                <v-card-title class="d-flex">
                    <DialogSave></DialogSave>
                    <DialogDeleteAll></DialogDeleteAll>
                </v-card-title>
                <v-table height="300px" fixed-header>
                    <thead>
                        <tr>
                            <th class="text-left">Nomes</th>
                            <th class="text-left">Emails</th>
                            <th class="text-left">CPFs</th>
                            <th class="text-left">Telefones</th>
                            <th class="text-left">Descrição</th>
                            <th class="no-width">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="displayedPessoas.length === 0">
                            <td colspan="6" class="text-center">Nenhuma pessoa cadastrada</td>
                        </tr>
                        <tr v-for="pessoa in displayedPessoas" :key="pessoa.email">
                            <td>{{ pessoa.nome ?? tableMessage }}</td>
                            <td>{{ pessoa.email ?? tableMessage }}</td>
                            <td>{{ pessoa.cpf ?? tableMessage }}</td>
                            <td>{{ pessoa.telefone ?? tableMessage }}</td>
                            <td>{{ pessoa.descricao ?? tableMessage }}</td>
                            <td class="no-width">
                                <v-btn-group>
                                    <DialogEdit :user="{
                                        nome: pessoa.nome || '',
                                        email: pessoa.email || '',
                                        cpf: pessoa.cpf || '',
                                        telefone: pessoa.telefone || '',
                                        descricao: pessoa.descricao || ''
                                    }" />
                                    <DialogDelete :pessoaId="pessoa.email" @deleted="handleDelete" />
                                </v-btn-group>
                            </td>
                        </tr>
                        <tr v-if="isLoading" ref="sentinela">
                            <td colspan="6" class="text-center">Carregando...</td>
                        </tr>
                    </tbody>
                </v-table>
            </div>
        </v-card>
    </v-container>
</template>

<script lang="ts" setup>
import { ref, watchEffect, onMounted, onUnmounted, nextTick } from 'vue';
import axios from 'axios';
import DialogSave from './dialog/DialogSave.vue';
import DialogEdit from './dialog/DialogEdit.vue';
import DialogDelete from './dialog/DialogDelete.vue';
import DialogDeleteAll from './dialog/DialogDeleteAll.vue';

interface Pessoa {
    nome?: string;
    email?: string;
    cpf?: string;
    telefone?: string;
    descricao?: string;
}

const pessoas = ref<Pessoa[]>([]);
const displayedPessoas = ref<Pessoa[]>([]);
const itemsPerPage = 2;
const displayedCount = ref(itemsPerPage);
const isLoading = ref(false);
const sentinela = ref<HTMLElement | null>(null);
const tableMessage = 'Não informado'

async function fetchPessoas() {
    try {
        isLoading.value = true;
        const response = await axios.get<Pessoa[]>('/people');
        pessoas.value = response.data;
    } catch (error) {
        console.error('Erro ao buscar pessoas: ', error);
    } finally {
        isLoading.value = false;
    }
};

function loadMorePessoas() {
    if (displayedCount.value < pessoas.value.length) {
        displayedCount.value += itemsPerPage;
    }
};

function handleDelete(deletedEmail: string) {
    pessoas.value = pessoas.value.filter((pessoa) => pessoa.email !== deletedEmail);
};

const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !isLoading.value) {
        loadMorePessoas();
    }
}, {
    rootMargin: '0px',
    threshold: 1.0
});

watchEffect(() => {
    displayedPessoas.value = pessoas.value.slice(0, displayedCount.value);
});

onMounted(async () => {
    await fetchPessoas();
    await nextTick();
    if (sentinela.value) {
        observer.observe(sentinela.value);
    }
});

onUnmounted(() => {
    observer.disconnect();
});
</script>

<style scoped>
.no-width {
    width: 0px !important;
}
</style>
