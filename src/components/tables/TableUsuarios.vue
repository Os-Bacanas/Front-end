<template>
    <v-container>
        <v-card class="mx-10 rounded-lg">
            <div class="pa-4">
                <v-table height="500px" fixed-header>
                    <thead class="text-button">
                        <tr>
                            <th class="text-left pl-7">Nomes</th>
                            <th class="text-left pl-7">Emails</th>
                            <th class="text-center">CPFs</th>
                        </tr>
                    </thead>
                    <tbody class="text-body-2">
                        <tr v-if="displayedUsuarios.length === 0 && !isLoading">
                            <td colspan="3" class="text-center">Nenhuma pessoa cadastrada</td>
                        </tr>
                        <tr v-for="usuario in displayedUsuarios" :key="usuario.email" class="table-row">
                            <td class="d-flex align-center">
                                <v-icon class="mr-2 icon-color">mdi-account</v-icon>
                                {{ usuario.name ?? tableMessage }}
                            </td>
                            <td class="emailRow">{{ usuario.email ?? tableMessage }}</td>
                            <td class="text-center">{{ usuario.cpf ?? tableMessage }}</td>
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
import { useTheme } from 'vuetify';

interface Usuario {
    name?: string;
    email?: string;
    cpf?: string;
}

const theme = useTheme();
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
.emailRow {
    margin-left: auto;
    margin-right: auto;
    width: 6em
}

.table-row {
    transition: background 0.2s ease-in-out;
}

.table-row:hover {
    background-color: v-bind('theme.global.current.value.dark ? "#333" : "#F0F0F0"');
}

tbody tr:nth-child(odd) {
    background-color: v-bind('theme.global.current.value.dark ? "#282828" : "#FAFAFA"');
}

.icon-color {
    color: v-bind('theme.global.current.value.dark ? "#BB86FC" : "#1976D2"');
}

.sentinela {
    height: 50px;
}
</style>