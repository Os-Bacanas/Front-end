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
                        <tr v-if="displayedUsuarios.length === 0">
                            <td colspan="6" class="text-center">Nenhuma pessoa cadastrada</td>
                        </tr>
                        <tr v-for="(usuario, index) in displayedUsuarios" :key="index">
                            <td>{{ usuario.id }}</td>
                            <td>{{ usuario.name }}</td>
                            <td>{{ usuario.email }}</td>
                            <td>{{ usuario.cpf }}</td>

                        </tr>
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
import { sentinela, itemsPerPage, isLoading, displayedCount, type UsuarioPessoa } from '@/services/ScriptTables';



const usuarios = ref<UsuarioPessoa[]>([]);
const displayedUsuarios = computed(() => usuarios.value.slice(0, displayedCount.value));


async function fetchUsuarios() {
    try {
        isLoading.value = true;
        const response = await axios.get<UsuarioPessoa[]>('/users');
        usuarios.value = response.data;
    } catch (error) {
        console.log('Erro ao buscar usuários: ', error);
    } finally {
        isLoading.value = false;
    }
};

function loadMoreUsuarios() {
    if (displayedCount.value < usuarios.value.length) {
        displayedCount.value += itemsPerPage;
    }
};

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