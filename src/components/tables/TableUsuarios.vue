<template>
    <v-container>
        <v-card class="mx-10">
            <div class="pa-4">
                <v-table height="500px" fixed-header>
                    <thead>
                        <tr>
                            <th class="text-left">Nomes</th>
                            <th class="text-left">Emails</th>
                            <th class="text-left">CPFs</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="displayedUsuarios.length === 0 && !isLoading">
                            <td colspan="3" class="text-center">Nenhuma pessoa cadastrada</td>
                        </tr>
                        <tr v-for="usuario in displayedUsuarios" :key="usuario.email">
                            <td>{{ usuario.name ?? tableMessage }}</td>
                            <td>{{ usuario.email ?? tableMessage }}</td>
                            <td>{{ usuario.cpf ?? tableMessage }}</td>
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
import api from '@/services/api';

interface Usuario {
    name?: string;
    email?: string;
    cpf?: string;
}

const usuarios = ref<Usuario[]>([]);
const displayedUsuarios = ref<Usuario[]>([]);
const itemsPerPage = 5;
const displayedCount = ref(itemsPerPage);
const isLoading = ref(false);
const sentinela = ref<HTMLElement | null>(null);
const tableMessage = 'Não informado';

async function fetchUsuarios() {
    try {
        isLoading.value = true;
        const response = await api.get('/users');
        usuarios.value = response.data.map((user: any) => ({
            name: user.name,
            email: user.email,
            cpf: user.cpf,
        }));
    } catch (error) {
        console.error('Erro ao buscar usuários: ', error);
    } finally {
        isLoading.value = false;
    }
}

function loadMoreUsuarios() {
    if (displayedCount.value < usuarios.value.length) {
        displayedCount.value = Math.min(displayedCount.value + itemsPerPage, usuarios.value.length);
    }
}

const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !isLoading.value) {
        loadMoreUsuarios();
    }
}, {
    rootMargin: '50px',
    threshold: 0.1,
});

watchEffect(() => {
    displayedUsuarios.value = usuarios.value.slice(0, displayedCount.value);
});

onMounted(async () => {
    await fetchUsuarios();
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
.sentinela {
    height: 50px;
}
</style>