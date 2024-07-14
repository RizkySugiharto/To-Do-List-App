import { createRouter, createWebHistory } from "vue-router";
import HomeView from '@/views/HomeView.vue'
import RegiserView from '@/views/RegisterView.vue'
import LoginView from '@/views/LoginView.vue'
import DashboardView from '@/views/DashboardView.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: HomeView
        },
        {
            path: '/register',
            component: RegiserView
        },
        {
            path: "/login",
            component: LoginView
        },
        {
            path: '/dashboard',
            component: DashboardView
        }
    ]
})

export default router