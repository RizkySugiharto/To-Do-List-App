<template>
    <div class="container-fluid mt-5 d-flex justify-content-center">
        <div class="card" style="width: 30rem;">
            <div class="card-body d-flex justify-content-center flex-column px-4 px-sm-5 py-4">
                <h2 class="text-center mb-3">Register</h2>
                <form @submit="register" onsubmit="return false">
                    <div class="mb-3">
                        <label class="form-label">Username: </label>
                        <input type="text" class="form-control" name="username" ref="username">
                    </div>
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
                        <button type="submit">Register</button>
                        <div class="text-loading mt-1" v-if="loading">
                            Please wait....
                        </div>
                        <div class="text-danger mt-1" v-else-if="isError">
                            User's email is already used.
                        </div>
                    </div>
                </form>
                <p class="mt-4">
                    Do you already have an account?
                    If it's true,
                    <router-link to="/login">
                        you can log in now.
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
    name: 'RegisterView',
    data() {
        return {
            isError: false,
            loading: false
        }
    },
    computed: {
        ...mapStores(useUserStore)
    },
    methods: {
        togglePasswordVisibility() {
            this.$refs.password.type = this.$refs.passwordVisible.checked ? 'text' : 'password'
        },
        async register(e) {
            this.loading = true
            e.preventDefault()

            try {
                const response = await getApi().post('/accounts/register', {
                    username: this.$refs.username.value,
                    email: this.$refs.email.value,
                    password: this.$refs.password.value
                })
    
                if (!response.data._id) throw new Error('Register is failed')

                this.$log.debug(response)
                this.$router.replace('/login')
            } catch (error) {
                this.$log.error(error)
                this.isError = true
            }
            this.loading = false
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