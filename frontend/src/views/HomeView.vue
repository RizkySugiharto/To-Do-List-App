<template>
    <div class="container-sm mt-5 mx-0 mx-sm-4 text-center">
        <h1>Creating To-Do List Is Simple!</h1>
        <h4 class="mt-2">Let's create a to-do list together with more simple. You can create more to-do list more than you want. Now, let's get started</h4>
        <router-link to="/register">
            <button class="mt-4 mx-2 mx-sm-3 btn-get-started">Get Started</button>
        </router-link>
        <router-link to="/dashboard" v-if="userStore.userId">
            <button class="mt-4 mx-2 mx-sm-3 btn-dashboard">Dashboard</button>
        </router-link>
        <router-link to="/login" v-else>
            <button class="mt-4 mx-2 mx-sm-3 btn-login">Login</button>
        </router-link>
    </div>
</template>

<script>
import { useUserStore } from '@/stores/user';
import { mapStores } from 'pinia';

export default {
    name: 'HomeView',
    computed: {
        ...mapStores(useUserStore)
    }
}
</script>

<style scoped>

h1 {
    text-shadow: 0px 0px 5px rgb(var(--text-rgb));
    text-decoration: underline;
}

.btn-get-started {
    background-color: rgb(var(--text-rgb));
    color: rgb(var(--primary-rgb));
    font-weight: bold;
    border: 3px solid rgb(var(--primary-rgb));
    border-radius: 10px;
    box-shadow: 0px 0px 5px rgb(var(--secondary-rgb));
    padding: 0.4rem 1.5rem;
}

.btn-get-started:hover {
    background-color: rgb(var(--primary-rgb));
    color: rgb(var(--text-rgb));
    text-shadow: 0px 0px 5px rgb(var(--text-rgb));
}

.btn-dashboard,
.btn-login {
    background-color: rgb(var(--primary-rgb));
    color: rgb(var(--text-rgb));
    font-weight: bold;
    border: 3px solid rgb(var(--secondary-rgb));
    border-radius: 10px;
    box-shadow: 0px 0px 5px rgb(var(--secondary-rgb));
    padding: 0.4rem 1.5rem;
}

.btn-dashboard:hover,
.btn-login:hover {
    background-color: rgb(var(--secondary-rgb));
    color: rgb(var(--primary-rgb));
    border-color: rgb(var(--primary-rgb));
}

</style>