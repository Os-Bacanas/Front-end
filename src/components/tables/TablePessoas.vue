<template>
    <v-container>
        <v-card class="mx-10">
            <div class="pa-4">
                <v-card-title class="d-flex align-center pa-4">
                    <DialogDeleteSelect :selectedItems="selectedItems" @deleted="handleDelete" />
                    <v-spacer />
                    <DialogSave />
                </v-card-title>

                <v-table height="500px" fixed-header>
                    <thead class="text-button">
                        <tr>
                            <th>
                                <v-checkbox class="d-flex align-center" v-model="selectAll"
                                    @change="toggleSelectAll"></v-checkbox>
                            </th>
                            <th class="text-left">Nomes</th>
                            <th class="text-left">Emails</th>
                            <th class="text-left">CPFs</th>
                            <th class="text-left">Telefones</th>
                            <th class="text-left">Descrições</th>
                            <th class="no-width text-center">Ações</th>
                        </tr>
                    </thead>

                    <tbody class="text-body-2">
                        <tr v-if="displayedPessoas.length === 0">
                            <td colspan="6" class="text-center">Nenhuma pessoa cadastrada</td>
                        </tr>

                        <tr v-for="pessoa in displayedPessoas" :key="pessoa.email" class="table-row ">
                            <td>
                                <v-checkbox class="d-flex align-center" v-model="selectedItems"
                                    :value="pessoa"></v-checkbox>
                            </td>
                            <td>{{ pessoa.name ?? tableMessage }}</td>
                            <td>{{ pessoa.email ?? tableMessage }}</td>
                            <td>{{ pessoa.cpf ?? tableMessage }}</td>
                            <td>
                                <div v-if="pessoa.phones && pessoa.phones.length" class="d-flex align-center">
                                    {{ pessoa.phones[0].number ?? tableMessage }}

                                    <v-menu :model-value="menuAberto === pessoa.id"
                                        @update:model-value="toggleMenu(pessoa.id)" transition="slide-y-transition"
                                        max-height="200" width="270" close-on-content-click="false">
                                        <template v-slot:activator="{ props }">
                                            <v-icon class="transition-icon" v-bind="props" size="x-large"
                                                @click="toggleMenu(pessoa.id)" @mouseover="menuAberto = pessoa.id">
                                                mdi-chevron-down
                                            </v-icon>
                                        </template>

                                        <v-list class="menuColor" @mouseleave="menuAberto = null">
                                            <v-container class="d-flex ma-n3">
                                                <v-list-subheader class="text-button font-weight-bold"
                                                    :color="isDarkTheme ? 'white' : 'black'">
                                                    Telefones
                                                </v-list-subheader>

                                                <v-spacer></v-spacer>

                                                <v-list-subheader class="text-button font-weight-bold mr-n5"
                                                    :color="isDarkTheme ? 'white' : 'black'">
                                                    Descrições
                                                </v-list-subheader>
                                            </v-container>
                                            <v-divider></v-divider>
                                            <v-list-item v-for="(phone, index) in pessoa.phones" :key="index">
                                                <v-list-item-title class="text-caption d-flex align-center">
                                                    <v-chip class="mr-2"
                                                        :color="isDarkTheme ? 'deep-purple-lighten-4' : 'blue'">
                                                        {{ phone.number }}
                                                    </v-chip>
                                                    <v-spacer></v-spacer>
                                                    <span class="text-caption"
                                                        style="font-size: 0.75rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                                        {{ phone.typePhoneDTO?.description ?? 'Não informado' }}
                                                    </span>
                                                </v-list-item-title>
                                            </v-list-item>
                                        </v-list>
                                    </v-menu>

                                </div>
                                <div v-else>
                                    {{ tableMessage }}
                                </div>
                            </td>
                            <td>
                                <div v-if="pessoa.phones && pessoa.phones.length">
                                    {{ pessoa.phones[0].typePhoneDTO?.description ?? tableMessage }}
                                </div>
                                <div v-else>
                                    {{ tableMessage }}
                                </div>
                            </td>
                            <td class="no-width">
                                <v-btn-group>
                                    <DialogEdit :pessoa="{
                                        id: pessoa.id || '',
                                        nome: pessoa.name || '',
                                        email: pessoa.email || '',
                                        cpf: pessoa.cpf || '',
                                        phones: pessoa.phones || []
                                    }" />
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
import { ref, watchEffect, onMounted, onUnmounted, nextTick, computed } from 'vue';
import DialogEdit from '../dialogs/DialogEdit.vue';
import DialogSave from '../dialogs/DialogSave.vue';
import DialogDeleteSelect from '../dialogs/DialogDeleteSelect.vue';
import api from '@/services/api';
import { useTheme } from 'vuetify';

interface Pessoa {
    id?: string;
    name?: string;
    email: string;
    cpf?: string;
    phones: Phone[];
}

interface Phone {
    number: string;
    typePhoneDTO: {
        description: string;
    };
}

const theme = useTheme();
const isDarkTheme = computed(() => theme.global.current.value.dark);
const pessoas = ref<Pessoa[]>([]);
const displayedPessoas = ref<Pessoa[]>([]);
const selectedItems = ref<Pessoa[]>([]);
const selectAll = ref(false);
const itemsPerPage = 5;
const displayedCount = ref(itemsPerPage);
const isLoading = ref(false);
const sentinela = ref(null);
const tableMessage = 'Não informado';
const menuAberto = ref<string | null>(null);

const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !isLoading.value) {
        loadMorePessoas();
    }
}, {
    rootMargin: '50px',
    threshold: 1.0
});

function toggleMenu(id: string) {
    menuAberto.value = menuAberto.value === id ? null : id;
};

async function fetchPessoas() {
    try {
        isLoading.value = true;
        const response = await api.get('/pessoas');
        pessoas.value = response.data.map((person: any) => ({
            id: person.id,
            name: person.name,
            email: person.email,
            cpf: person.cpf,
            phones: person.phones ? person.phones.map((phone: any) => ({
                number: phone.number,
                typePhoneDTO: phone.typePhoneDTO ? { description: phone.typePhoneDTO.description } : undefined
            })) : []
        }));
    } catch (error) {
        console.error('Erro ao buscar pessoas: ', error);
    } finally {
        isLoading.value = false;
    }
};

function toggleSelectAll() {
    if (selectAll.value) {
        selectedItems.value = [...displayedPessoas.value];
    } else {
        selectedItems.value = [];
    }
};

function handleDelete(deletedEmails: any) {
    pessoas.value = pessoas.value.filter(pessoa => !deletedEmails.includes(pessoa.email));
    selectedItems.value = [];
    selectAll.value = false;
};

function loadMorePessoas() {
    if (displayedCount.value < pessoas.value.length) {
        displayedCount.value = Math.min(displayedCount.value + itemsPerPage, pessoas.value.length);
    }
};

watchEffect(() => {
    displayedPessoas.value = pessoas.value.slice(0, displayedCount.value);
    selectAll.value = selectedItems.value.length === displayedPessoas.value.length && displayedPessoas.value.length > 0;
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

.table-row {
    transition: background 0.2s ease-in-out;
}

.table-row:hover {
    background-color: v-bind('theme.global.current.value.dark ? "#333" : "#F0F0F0"');
}

tbody tr:nth-child(odd) {
    background-color: v-bind('theme.global.current.value.dark ? "#282828" : "#FAFAFA"');
}

.sentinela {
    height: 50px;
}

.transition-icon {
    transition: transform 0.3s ease, color 0.3s ease;
}

.transition-icon:hover {
    transform: rotate(180deg);
    color: #FF4081;
}

.v-list-item-title {
    display: flex;
    align-items: center;
}

.v-chip {
    margin-right: 8px;
    font-weight: bold;
    font-size: 14px;
}

.v-divider {
    margin: 4px 0;
    background-color: #1976D2;
}
</style>