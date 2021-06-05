<template>
    <ProgressSpinner v-if="loading && !failedLoad" />
    <div v-else-if="loading && failedLoad" class="p-text-italic">Users could not be retrieved!</div>
    <div v-else-if="users.length">
        <div v-if="table" class="p-grid p-m-5">
            <div v-for="user in filteredUsers" :key="user.id" class="p-col-12 p-md-6 p-lg-4" style="width: 220px; height: auto;">
                <div class="p-p-3" :class="user.hover ? 'p-shadow-1 p-m-0' : 'p-m-0'" :style="(user.hover ? styleObject: '')" @mouseover="user.hover = true" @mouseleave="user.hover = false" @click="goToUser(user)">
                    <img :src="user.image" alt="Profile Avatar" style="max-width: 100px; max-height: 100px; border-radius: 50%;" format="PNG">
                    <p class="p-text-italic">{{user.username}}</p>
                </div>
            </div>
        </div>
         <DataTable v-else :value="filteredUsers" v-model:selection="selectedRows" :selectionMode="selectionToggle? 'multiple' : 'single'" dataKey="id" :metaKeySelection="false" @row-select="goToUser" showGridlines autoLayout
        :paginator="true" :rows="10" :filters="filters" paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5,10,25]" currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" class="p-datatable-striped">

            <Column v-for="col of columns" :field="col.field" :header="col.header" :key="col.field" />
        </Datatable>
    </div>
</template>

<script>
    import ProgressSpinner from 'primevue/progressspinner'

    export default {
        components: {
            ProgressSpinner
        },
        props: {
            users: {
                type: Array,
                default: () => []
            },
            search: {
                type: String,
                default: ''
            },
            loading: {
                type: Boolean,
                default: false
            },
            table: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                styleObject: { backgroundColor: '#EFEEEE' },
                columns: [
                    { field: 'username', header: 'Username' },
                    { field: 'email', header: 'E-mail' },
                    { field: 'first_name', header: 'First Name' }
                ],
                failedLoad: false
            }
        },
        computed: {
            filteredUsers () {
                return this.users.filter(user => { return user.username.toLowerCase().includes(this.search.toLowerCase()) })
            }
        },
        created () {
            setTimeout(() => { this.failedLoad = true }, 10000)
        },
        methods: {
            goToUser (user) {
                if (user?.data) {
                    user = user.data
                }
                this.$emit('clicked-user', user)
            }
        }
    }
</script>
