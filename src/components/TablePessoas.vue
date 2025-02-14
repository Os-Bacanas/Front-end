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
                        <tr v-if="displayedPessoas.length === 0">
                            <td colspan="6" class="text-center">Nenhuma pessoa cadastrada</td>
                        </tr>
                        <tr v-for="(pessoa, index) in displayedPessoas" :key="index">
                            <td>{{ pessoa.id }}</td>
                            <td>{{ pessoa.name }}</td>
                            <td>{{ pessoa.email }}</td>
                            <td>{{ pessoa.cpf }}</td>
                            <td class="no-widht">
                                <DialogEdit :pessoa="pessoa" />
                            </td>
                            <td class="no-widht">
                                <DialogDelete :pessoaId="pessoa.id" @deleted="handleDelete" />
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
import { ref, computed, onMounted, onUnmounted } from 'vue';
import axios from 'axios';
import DialogSave from './dialog/DialogSave.vue';
import DialogEdit from './dialog/DialogEdit.vue';
import DialogDelete from './dialog/DialogDelete.vue';
import DialogDeleteAll from './dialog/DialogDeleteAll.vue';
import { sentinela, itemsPerPage, isLoading, displayedCount, type UsuarioPessoa } from '@/services/ScriptTables';

const pessoas = ref<UsuarioPessoa[]>([]);
const displayedPessoas = computed(() => pessoas.value.slice(0, displayedCount.value));

async function fetchPessoas() {
    try {
        isLoading.value = true;
        const response = await axios.get<UsuarioPessoa[]>('/people');
        pessoas.value = response.data;
    } catch (error) {
        console.log('Erro ao buscar pessoas: ', error);
    } finally {
        isLoading.value = false;
    }
};


function loadMorePessoas() {
    if (displayedCount.value < pessoas.value.length) {
        displayedCount.value += itemsPerPage;
    }
};


function handleDelete(deletedId: number) {
    pessoas.value = pessoas.value.filter((pessoa) => pessoa.id !== deletedId);
};


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

</script>

<style scoped>
.no-widht {
    width: 0px !important;
}
</style>
