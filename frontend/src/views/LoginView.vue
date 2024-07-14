<template>
    <div class="container-fluid mt-5 d-flex justify-content-center">
        <div class="card" style="width: 30rem;">
            <div class="card-body d-flex justify-content-center flex-column px-4 px-sm-5 py-4">
                <h2 class="text-center mb-3">Login</h2>
                <form @submit="login" onsubmit="return false">
                    <div class="mb-3">
                        <label class="form-label">Email: </label>
                        <input type="email" class="form-control" name="email" ref="email" autocomplete="current-password">
                    </div>
                    <div class="mb-2">
                        <label class="form-label">Password: </label>
                        <input type="password" class="form-control" name="password" ref="password" autocomplete="current-password">
                    </div>
                    <div class="form-check mb-3">
                        <input type="checkbox" class="form-check-input" ref="passwordVisible" @click="togglePasswordVisibility">
                        <label class="form-check-label">Show Password</label>
                    </div>
                    <div class="mt-4">
                        <button type="submit">Login</button>
                        <div class="text-danger mt-1" v-if="isError">
                            Email or password is invalid.
                        </div>
                    </div>
                </form>
                <p class="mt-4">
                    Don't you have an account yet?
                    If it's true,
                    <router-link to="/register">
                        create an account now.
                    </router-link>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
import { getApi } from '@/utils';
import { useUserStore } from '@/stores/user';
import { mapStores } from 'pinia';

export default {
    name: 'LoginView',
    data() {
        return {
            isError: false
        }
    },
    computed: {
        ...mapStores(useUserStore)
    },
    mounted() {
        if (this.userStore.userId) this.$router.replace('/dashboard')
    },
    methods: {
        togglePasswordVisibility() {
            this.$refs.password.type = this.$refs.passwordVisible.checked ? 'text' : 'password'
        },
        async login(e) {
            e.preventDefault()
            
            try {
                const response = await getApi().post('/accounts/login', {
                    email: this.$refs.email.value,
                    password: this.$refs.password.value
                })
    
                if (!response.data._id) throw new Error('Login is failed')
    
                this.userStore.userId = response.data._id
                this.userStore.username = response.data.username

                this.$log.debug(response)
                this.$router.replace('/dashboard')
            } catch (error) {
                this.$log.error(error)
                this.isError = true
            }
        }
    }
}
</script>

<style scoped>
form button[type="submit"] {
    background-color: rgb(var(--text-rgb));
    color: rgb(var(--primary-rgb));
    font-weight: bold;
    border: 3px solid rgb(var(--primary-rgb));
    border-radius: 10px;
    padding: 0.5rem 1.4rem;
}

form button[type="submit"]:hover {
    box-shadow: 0px 0px 10px rgb(var(--text-rgb));
}
</style>