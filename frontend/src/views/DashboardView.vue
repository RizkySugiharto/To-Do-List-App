<template>
    <div class="container-sm mt-5">
        <div class="mb-5 d-flex flex-row justify-content-sm-end">
            <button class="btn-account ms-sm-2 me-2" @click="logout">Logout</button>
        </div>
        <h4 class="mb-3">
            Hi {{ userStore.username }},
            <br>
            here are your tasks:
        </h4>
        <div class="mb-4 d-flex flex-wrap">
            <button class="btn-create d-flex align-items-center me-3 mb-2" data-bs-toggle="modal" data-bs-target="#modalCreate">
                <img src="@/assets/icon-create.png" width="20">
                <p class="m-0 ms-3">Create</p>
            </button>
            <button class="btn-checked-all d-flex align-items-center me-3 mb-2" @click="updateAllWithUserId(true)">
                <img src="@/assets/icon-check.png" width="20">
                <p class="m-0 ms-3">Check All</p>
            </button>
            <button class="btn-unchecked-all d-flex align-items-center me-3 mb-2" @click="updateAllWithUserId(false)">
                <img src="@/assets/icon-uncheck.png" width="20">
                <p class="m-0 ms-3">Uncheck All</p>
            </button>
            <button class="btn-delete-all d-flex align-items-center me-3 mb-2" @click="deleteAllWithUserId">
                <img src="@/assets/icon-delete.png" width="20">
                <p class="m-0 ms-3">Delete All</p>
            </button>
            <button class="btn-filter d-flex align-items-center me-3 mb-2" data-bs-toggle="modal" data-bs-target="#modalFilter">
                <img src="@/assets/icon-filter.png" width="20">
                <p class="m-0 ms-3">Filter</p>
            </button>
        </div>
        <div class="d-flex flex-column mb-3">
            <div v-if="tasks.length > 0">
                <details v-for="task, i in tasks" :key="task">
                    <summary class="text-decoration-line-through" v-if="task.isChecked">{{ task.name }}</summary>
                    <summary v-else>{{ task.name }}</summary>
                    <div class="d-flex flex-row justify-content-end">
                        <button class="btn-unchecked ms-2" v-if="task.isChecked" @click="updateOneById(i, task._id, false)">
                            <img src="@/assets/icon-uncheck.png" alt="Check" width="20">
                        </button>
                        <button class="btn-checked ms-2" v-else @click="updateOneById(i, task._id, true)">
                            <img src="@/assets/icon-check.png" alt="Check" width="20">
                        </button>
                        <button class="btn-delete ms-2" @click="deleteOneById(i, task._id)">
                            <img src="@/assets/icon-delete.png" alt="Delete" width="20">
                        </button>
                    </div>
                </details>
            </div>
            <div class="mt-2" v-else>
                <h5>Hmm, you haven't created any tasks yet.</h5>
            </div>
        </div>
        <div class="modal fade" id="modalCreate" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Create a Task</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <form @submit="createTask" onsubmit="return false">
                        <div class="modal-body">
                            <div class="mb-3">
                                <label class="form-label text-secondary">Task Name: </label>
                                <input type="text" class="form-control" ref="taskNameInput">
                            </div>
                            <div class="text-success" v-for="task, i in lastCreatedTasks" :key="task">
                                ({{ i + 1 }}) Task [ {{ task.name }} ] successfully created.
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="submit" class="btn-create">Create</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <div class="modal fade" id="modalFilter" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Filter Tasks</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <form @submit="filterTasks" onsubmit="return false">
                        <div class="modal-body">
                            <div class="mb-3">
                                <label class="form-label text-secondary">Filter By Status: </label>
                                <div class="form-check">
                                    <input type="radio" class="form-check-input" name="filterByStatus" id="filterByStatusChecked" ref="filterByStatusCheckedRadio">
                                    <label class="form-check-label text-secondary">Checked</label>
                                </div>
                                <div class="form-check">
                                    <input type="radio" class="form-check-input" name="filterByStatus" id="filterByStatusUnchecked" ref="filterByStatusUncheckedRadio">
                                    <label class="form-check-label text-secondary">Unchecked</label>
                                </div>
                            </div>
                            <div class="text-success" v-for="times in filteringTimes" :key="times">
                                ({{ times }}) Successfully filtering tasks by status
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button class="btn-clear-filter" @click="clearFilters">Clear Filter</button>
                            <button type="submit" class="btn-filter">Filter</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getApi } from '@/utils';
import { useUserStore } from '@/stores/user';
import { mapStores } from 'pinia';

export default {
    name: 'DashboardView',
    data() {
        return {
            tasks: [],
            api: null,
            lastCreatedTasks: [],
            filteringTimes: 0
        }
    },
    computed: {
        ...mapStores(useUserStore)
    },
    async mounted() {
        if (!this.userStore.userId) {
            this.$router.replace('/')
        }
        this.api = getApi()

        await this.getAndFillTasks()
    },
    methods: {
        logout() {
            this.userStore.logout()
            this.$router.replace('/')
        },
        isFilterByStatus() {
            return this.$refs.filterByStatusCheckedRadio.checked || this.$refs.filterByStatusUncheckedRadio.checked
        },
        async getAndFillTasks() {
            try {
                const response = await this.api.get(`/tasks/all/${this.userStore.userId}`)
                this.tasks = response.data
            } catch (error) {
                this.$log.error(error)
            }
        },
        clearLastCreatedTasks() {
            this.lastCreatedTasks = []
        },
        async clearFilters() {
            this.filteringTimes = 0
            this.$refs.filterByStatusCheckedRadio.checked = false
            this.$refs.filterByStatusUncheckedRadio.checked = false
        },
        async createTask(e) {
            e.preventDefault()

            try {
                const response = await this.api.post(`/tasks/${this.userStore.userId}`, {
                    name: this.$refs.taskNameInput.value
                })
                this.$log.debug(response.data)
                
                if (response.data._id) this.createOne(response.data)
                else throw new Error("Failed to create the task")
            } catch (error) {
                this.$log.error(error)
            }
        },
        createOne(task) {
            if (!task.name) return
            this.tasks.push(task)
            this.lastCreatedTasks.push(task)
        },
        async updateOneById(index, taskId, status) {
            await this.api.patch(`/tasks/${taskId}`, { isChecked: status })
                .then(() => this.updateOne(index, status))
                .catch((error) => this.$log.error(error))
        },
        updateOne(index, status) {
            this.tasks[index].isChecked = status
        },
        async deleteOneById(index, taskId) {
            await this.api.delete(`/tasks/${taskId}`)
                .then(() => this.deleteOne(index))
                .catch((error) => this.$log.error(error))
        },
        deleteOne(index) {
            this.tasks.splice(index, 1)
        },
        async updateAllWithUserId(status) {
            await this.api.patch(`/tasks/all/${this.userStore.userId}`, { isChecked: status })
                .then(() => this.updateAll(status))
                .catch((error) => this.$log.error(error))
        },    
        updateAll(status) {
            for (const index in this.tasks) {
                this.updateOne(index, status)
            }
        },
        async deleteAllWithUserId() {
            await this.api.delete(`/tasks/all/${this.userStore.userId}`)
                .then(() => this.deleteAll())
                .catch((error) => this.$log.error(error))
        },    
        deleteAll() {
            this.tasks = []
        },
        async filterTasks(e) {
            e.preventDefault()

            try {
                const filterByStatus = this.isFilterByStatus()
                const filterValue = filterByStatus && this.$refs.filterByStatusCheckedRadio.checked ? true : false

                const response = await this.api.get(`/tasks/all/${this.userStore.userId}?filterByStatus=${filterByStatus}&filterValue=${filterValue}`)
                this.tasks = response.data

                if (filterByStatus) this.filteringTimes++
                else await this.getAndFillTasks()
            } catch (error) {
                this.$log.error(error)
            }
        }
    }
}
</script>

<style scoped>

.text-success {
    color: limegreen !important;
}

.btn-account {
    background-color: rgb(58, 91, 255);
    border: 3px solid rgb(var(--text-rgb));
    border-radius: 7px;
    color: rgb(var(--text-rgb));
    font-weight: bold;
    padding: 0.3rem 1rem;
}

.btn-create {
    background-color: limegreen;
    border: 3px solid rgb(var(--text-rgb));
    border-radius: 7px;
    color: rgb(var(--text-rgb));
    font-weight: bold;
    padding: 0.3rem 1rem;
}

.btn-checked-all {
    background-color: green;
    border: 3px solid rgb(var(--text-rgb));
    border-radius: 7px;
    color: rgb(var(--text-rgb));
    font-weight: bold;
    padding: 0.3rem 1rem;
}

.btn-unchecked-all {
    background-color: rgb(209, 0, 0);
    border: 3px solid rgb(var(--text-rgb));
    border-radius: 7px;
    color: rgb(var(--text-rgb));
    font-weight: bold;
    padding: 0.3rem 1rem;
}

.btn-delete-all {
    background-color: red;
    border: 3px solid rgb(var(--text-rgb));
    border-radius: 7px;
    color: rgb(var(--text-rgb));
    font-weight: bold;
    padding: 0.3rem 1rem;
}

.btn-filter {
    background-color: rgb(0, 0, 183);
    border: 3px solid rgb(var(--text-rgb));
    border-radius: 7px;
    color: rgb(var(--text-rgb));
    font-weight: bold;
    padding: 0.3rem 1rem;
}

.btn-clear-filter {
    background-color: rgb(176, 0, 0);
    border: 3px solid rgb(var(--text-rgb));
    border-radius: 7px;
    color: rgb(var(--text-rgb));
    font-weight: bold;
    padding: 0.3rem 1rem;
}

.btn-account:hover,
.btn-create:hover,
.btn-checked-all:hover,
.btn-unchecked-all:hover,
.btn-delete-all:hover,
.btn-filter:hover,
.btn-clear-filter:hover {
    box-shadow: 0px 0px 7px rgb(var(--text-rgb));
}

.btn-checked {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: green;
    padding: 5px;
    border: 3px solid rgb(var(--secondary-rgb));
    border-radius: 5px;
}

.btn-unchecked {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgb(209, 0, 0);
    padding: 5px;
    border: 3px solid rgb(var(--secondary-rgb));
    border-radius: 5px;
}

.btn-delete {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: red;
    padding: 5px;
    border: 3px solid rgb(var(--secondary-rgb));
    border-radius: 5px;
}

.btn-checked:hover,
.btn-unchecked:hover,
.btn-delete:hover {
    box-shadow: 0px 0px 5px rgb(var(--secondary-rgb));
}

details {
    background-color: rgb(var(--primary-rgb));
    border: 3px solid rgb(var(--secondary-rgb));
    color: rgb(var(--text-rgb));
    padding: 0.4rem 1.3rem;
    margin-block: 0.5rem;
}

details:hover {
    box-shadow: 0px 0px 10px rgb(var(--secondary-rgb));
}

details summary {
    display: flex;
    justify-content: space-between;
}

details p {
    margin: 0px;
    margin-block: 0.5rem;
}

</style>