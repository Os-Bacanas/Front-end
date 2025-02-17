<template>
    <v-container>
        <v-card class="mx-10">
            <div class="pa-4">
                <v-card-title class="d-flex align-center pa-4">
                    <DialogDeleteSelect :selectedItems="selectedItems" @deleted="handleDelete" />
                    <v-spacer />
                    <DialogSave />
                </v-card-title>
                <v-table height="300px" fixed-header>
                    <thead>
                        <tr>
                            <th>
                                <v-checkbox class="d-flex align-center" v-model="selectAll" @update:model-value="toggleSelectAll"></v-checkbox>
                            </th>
                            <th class="text-left">Nomes</th>
                            <th class="text-left">Emails</th>
                            <th class="text-left">CPFs</th>
                            <th class="text-left">Telefones</th>
                            <th class="text-left">Descrições</th>
                            <th class="no-width text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="displayedPessoas.length === 0">
                            <td colspan="6" class="text-center">Nenhuma pessoa cadastrada</td>
                        </tr>
                        <tr v-for="pessoa in displayedPessoas" :key="pessoa.email">
                            <td>
                                <v-checkbox class="d-flex align-center" v-model="selectedItems" :value="pessoa"></v-checkbox>
                            </td>
                            <td>{{ pessoa.name ?? tableMessage }}</td>
                            <td>{{ pessoa.email ?? tableMessage }}</td>
                            <td>{{ pessoa.cpf ?? tableMessage }}</td>
                            <td>{{ pessoa.phone ?? tableMessage }}</td>
                            <td>{{ pessoa.description ?? tableMessage }}</td>
                            <td class="no-width">
                                <v-btn-group>
                                    <DialogEdit
                                        :pessoa="{ nome: pessoa.name || '', email: pessoa.email || '', cpf: pessoa.cpf || '', telefone: pessoa.phone || '', descricao: pessoa.description || '' }" />
                                </v-btn-group>
                            </td>
                        </tr>
                    </tbody>
                </v-table>
                <div ref="sentinela" class="sentinela text-center"></div>
            </div>
        </v-card>
    </v-container>
</template>

<script lang="ts" setup>
import { ref, watchEffect, onMounted, onUnmounted, nextTick } from 'vue';
import DialogSave from './dialog/DialogSave.vue';
import DialogEdit from './dialog/DialogEdit.vue';
import DialogDeleteSelect from './dialog/DialogDeleteSelect.vue';
import api from '@/services/api';

interface Pessoa {
    name?: string;
    email: string;
    cpf?: string;
    phone?: string;
    description?: string;
}


const pessoas = ref<Pessoa[]>([]);
const displayedPessoas = ref<Pessoa[]>([]);
const selectedItems = ref<Pessoa[]>([]);
const selectAll = ref(false);
const itemsPerPage = 5;
const displayedCount = ref(itemsPerPage);
const isLoading = ref(false);
const sentinela = ref(null);
const tableMessage = 'Não informado';

async function fetchPessoas() {
    try {
        isLoading.value = true;
        const response = await api.get('/users');
        pessoas.value = response.data.map((person: any) => ({
            name: person.name,
            email: person.email,
            cpf: person.cpf,
            phone: person.phone,
            description: person.description,
        }));
    } catch (error) {
        console.error('Erro ao buscar pessoas: ', error);
    } finally {
        isLoading.value = false;
    }
}

function toggleSelectAll(value: any) {
    if (value) {
        selectedItems.value = [...displayedPessoas.value];
    } else {
        selectedItems.value = [];
    }
}

function handleDelete(deletedEmails: any) {
    pessoas.value = pessoas.value.filter(pessoa => !deletedEmails.includes(pessoa.email));
    selectedItems.value = [];
    selectAll.value = false;
}

function loadMorePessoas() {
    if (displayedCount.value < pessoas.value.length) {
        displayedCount.value = Math.min(displayedCount.value + itemsPerPage, pessoas.value.length)
    }
};

const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !isLoading.value) {
        loadMorePessoas();
    }
}, {
    rootMargin: '50px',
    threshold: 1.0
});

watchEffect(() => {
    displayedPessoas.value = pessoas.value.slice(0, displayedCount.value);
    if (selectedItems.value.length === displayedPessoas.value.length && displayedPessoas.value.length > 0) {
        selectAll.value = true;
    } else {
        selectAll.value = false
    }
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
