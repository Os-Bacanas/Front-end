<template>
    <v-container class="fill-height d-flex justify-center ">
        <div class="h-50 w-100">
            <v-card class="mx-auto pa-12 pb-8" elevation="6" max-width="448" rounded="lg">

                <div class="text-h5  text-center text-grey-darken-1">LOGIN</div>

                <!-- Exibir mensagem de erro caso ocorra -->
                <v-alert v-if="errorMessage" type="error" color="red-lighten-4">
                    {{ errorMessage }}
                </v-alert>


                <div class="text-subtitle-1 text-medium-emphasis">Email</div>
                <v-text-field v-model="form.email" density="compact" placeholder="Digite seu email"
                    prepend-inner-icon="mdi-email-outline" variant="outlined"
                    :rules="[required, emailIsValid]"></v-text-field>


                <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">Senha</div>
                <v-text-field v-model="form.password" @click:append-inner="toggleVisibility"
                    :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :type="visible ? 'text' : 'password'"
                    density="compact" placeholder="Digite sua senha" prepend-inner-icon="mdi-lock-outline"
                    variant="outlined" :rules="[required]"></v-text-field>


                <v-btn class="mt-3" color="blue" size="large" variant="tonal" block 
                    :disabled="!form.email || !form.password" to="/">Entrar</v-btn>



                <v-card-text class="text-end pt-10 mb-n5">
                    <router-link to="/cadastro" class="text-blue-lighten-1 text-decoration-none"
                        rel="noopener noreferrer">Cadastra-se<v-icon icon="mdi-chevron-right"></v-icon></router-link>

                </v-card-text>
            </v-card>
        </div>
    </v-container>
</template>



<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import axios from "../services/api";
import { useRouter } from "vue-router";


const errorMessage = ref(""); // Estado para mensagens de erro
const router = useRouter();
const visible = ref(false);

//campos do formulario de login
const form = ref({
    email: "",
    password: "",
})

const valid = ref({
    email: false, //constante para verificar o sucesso do email
})


//requisicao API ao clicar no botao ENTRAR - devemos adiconar o @click para chamar a funcao e devemos remover o to:"/" no btn (fiz essas alteraceos pq a api nao esta pronta)
async function postLogin() {
    errorMessage.value = ""; // Resetar mensagem de erro

    try {
        if (!valid.value) return errorMessage.value = "Erro ao fazer login. Verifique suas credenciais."; //exibe um alert, caso o email esteja na formatacao incorreta

        //faz a requisicao post para a api
        const response = await axios.post("/login", {
            email: form.value.email,
            password: form.value.password,
        });

        // Salvar token no localStorage
        localStorage.setItem("token", response.data.token);

        //redimenciona para a tela principal
        router.push("/");
    } catch (error) {
        //exibe um alert de erro
        errorMessage.value = "Erro ao fazer login. Verifique suas credenciais.";

    } finally {
        //time out da duracao do alert 
        setTimeout(() => {
            errorMessage.value = "";
        }, 5000);

    }
};

//verifica se os campos de email e senha foram preencidos
function required(value: string) {
    return value ? true : 'O campo é obrigatório'
};

//verifica se o email é valido
function emailIsValid(value: string) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regex.test(value)) {
        return "Email inválido"
    }
    valid.value.email = true;
    return true;
};

//muda a visibilidade do icone da senha
const toggleVisibility = () => {
    visible.value = !visible.value;
};

// Verificar login automático ao carregar a página
onMounted(() => {
    const token = localStorage.getItem("token");

    if (token) {
        // Se o token estiver no localStorage, redireciona o usuário para o dashboard
        router.push("/");
    }
});

</script>