
import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/pages/Login.vue'
import Index from '../layout/Index.vue'
import Pessoa from '@/pages/Pessoa.vue'
import Usuario from '@/pages/Usuario.vue'
import Cadastro from '@/pages/Cadastro.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      component: Login
    },
    {
      path: '/cadastro',
      component: Cadastro
    },
    {
      path: "/",
      component: Index,
      children: [
        {
          path: "pessoas",
          component: Pessoa,
        },
        {
          path: "usuarios",
          component: Usuario
        }
      ]
    }
  ]
})

export default router
