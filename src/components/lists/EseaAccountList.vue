<template>
    <ProgressSpinner v-if="loading && !failedLoad" />
    <div v-else-if="loading && failedLoad" class="p-text-italic">Esea Accounts could not be retrieved!</div>
    <div v-else-if="eseaAccounts.length">
        <div v-if="table" class="p-grid p-m-5">
            <div v-for="eseaAccount in filteredEseaAccounts" :key="eseaAccount.id" class="p-col-12 p-md-6 p-lg-4" style="width: 300px; height: auto;">
                <div class="p-p-3" :class="eseaAccount.hover ? 'p-shadow-2 p-m-1' : 'p-shadow-1 p-m-2'" :style="(eseaAccount.hover ? styleObject: '')" @mouseover="eseaAccount.hover = true" @mouseleave="eseaAccount.hover = false" @click="goToEseaAccount(eseaAccount)">
                    <p class="p-text-bold">{{eseaAccount.method_name}}</p>
                    <p class="p-text-italic">{{eseaAccount.year}}</p>
                </div>
            </div>
        </div>
        <DataTable v-else :value="filteredEseaAccounts" datakey="id" selectionMode="single" @row-select="goToEseaAccount" showGridlines autoLayout
            :paginator="true" :rows="10" :filters="filters" paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rowsPerPageOptions="[5,10,25]" currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" class="p-datatable-striped">

            <Column v-for="col of columns" :field="col.field" :header="col.header" :key="col.field" bodyStyle="" />
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
        eseaAccounts: {
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
                { field: 'method_name', header: 'Method' },
                { field: 'year', header: 'Year' },
                { field: 'campaign', header: 'Campaign' },
                { field: 'network', header: 'Network' }
            ],
            failedLoad: false
        }
    },
    computed: {
        filteredEseaAccounts () {
            return this.eseaAccounts.filter((eseaAccount) => {
                return (
                    eseaAccount.method_name.toLowerCase().includes(this.search.toLowerCase()) ||
                    eseaAccount.year.toString().includes(this.search) ||
                    eseaAccount.campaign?.toLowerCase().includes(this.search.toLowerCase()) ||
                    eseaAccount.network?.toLowerCase().includes(this.search.toLowerCase())
                    )
                })
        }
    },
    created () {
        setTimeout(() => { this.failedLoad = true }, 10000)
    },
    methods: {
        goToEseaAccount (eseaAccount) {
            if (eseaAccount?.data) {
                eseaAccount = eseaAccount.data
            }
            this.$emit('clicked-esea-account', eseaAccount)
        }
    }
}
</script>
