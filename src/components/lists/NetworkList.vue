<template>
    <ProgressSpinner v-if="loading" />
    <div v-else-if="networks.length">
         <div v-if="table" class="p-grid p-m-5">
            <div v-for="network in filteredNetworks" :key="network.id" class="p-col-12 p-md-6 p-lg-4" style="width: 300px; height: auto;">
                <div class="p-p-3" :class="network.hover ? 'p-shadow-2 p-m-1' : 'p-shadow-1 p-m-2'" :style="(network.hover ? styleObject : '')" @mouseover="network.hover=true" @mouseleave="network.hover=false" @click.left="goToNetwork(network)">
                    <img :src="network.image" alt="Network Image" style="max-width: 150px; max-height: 150px; border-radius: 50%;" format="PNG" />
                    <p class="p-text-bold p-text-italic">{{network.name}}</p>
                </div>
            </div>
         </div>
        <DataTable v-else :value="filteredNetworks"  dataKey="id" :loading="loading" selectionMode="single" @row-select="goToNetwork" showGridlines autoLayout
        :paginator="true" :rows="10" :filters="filters" paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5,10,25]" currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" class="p-datatable-striped"> <!-- p-datatable-sm -->

            <template #loading>
                Loading records, please wait...
            </template>
            <Column field="ispublic" header="Public" headerStyle="width: 5rem">
                <template #body="slotProps">
                    <i class="pi p-text-center" style="width:100%;" :class="{'true-icon pi-check-circle': slotProps.data.ispublic, 'false-icon pi-times-circle': !slotProps.data.ispublic}"></i>
                </template>
            </Column>
            <Column v-for="col of columns" :field="col.field" :header="col.header" :key="col.field" bodyStyle="" /> <!-- text-align: center; overflow: visible  contentStyle="width: 500px;" -->
            <Column field="created_by" header="Creator">
                <template #body="slotProps">
                    <div v-if="slotProps.data.created_by !== currentuser">{{slotProps.data.created_by}}</div> <div v-else class="p-text-bold">You</div>
                </template>
            </Column>
        </Datatable>
    </div>
    <div v-else class="p-text-italic">No Networks to display!</div>
</template>

<script>
    import { mapState } from 'vuex'
    import ProgressSpinner from 'primevue/progressspinner'

    export default {
        components: {
            ProgressSpinner
        },
        props: {
            networks: {
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
                    { field: 'name', header: 'Name' },
                    { field: 'description', header: 'Description' },
                    { field: 'organisations.length', header: 'Organisations' }
                ]
            }
        },
        computed: {
            ...mapState('authentication', ['currentuser']),
            filteredNetworks () {
                return this.networks.filter(network => { return network.name.toLowerCase().includes(this.search.toLowerCase()) })
            }
        },
        methods: {
            goToNetwork (network) {
                if (network?.data) {
                    network = network.data
                }
                console.log('check1', network)
                this.$emit('clicked-network', network)
            }
        }
    }
</script>
