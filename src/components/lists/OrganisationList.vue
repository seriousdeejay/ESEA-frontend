<template>
    <ProgressSpinner v-if="loading && !failedLoad" />
    <div v-else-if="loading && failedLoad" class="p-text-italic">Organisations could not be retrieved!</div>
    <div v-else-if="organisations.length">
        <div v-if="table" class="p-grid p-m-5">
            <div v-for="organisation in filteredOrganisations" :key="organisation.id" class="p-col-12 p-md-6 p-lg-4" style="width: 300px; height: auto;">
                <div class="p-p-3" :class="organisation.hover ? 'p-shadow-2 p-m-1' : 'p-shadow-1 p-m-2'" :style="(organisation.hover ? styleObject : '')" @mouseover="organisation.hover=true" @mouseleave="organisation.hover=false" @click.left="goToOrganisation(organisation)">
                    <img :src="organisation.image" alt="Organisation Image" style="max-width: 150px; max-height: 150px; border-radius: 50%;" format="PNG" />
                    <p class="p-text-italic">{{organisation.name}}</p>
                </div>
            </div>
        </div>
        <DataTable v-else :value="filteredOrganisations" datakey="id" selectionMode="single" @row-select="goToOrganisation" showGridlines autoLayout
        :paginator="true" :rows="10" :filters="filters" paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5,10,25]" currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" class="p-datatable-striped">

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
    <div v-else class="p-text-italic">No Organisations to display!</div>
</template>

<script>
    import { mapState } from 'vuex'
    import ProgressSpinner from 'primevue/progressspinner'

    export default {
        components: {
            ProgressSpinner
        },
        props: {
            organisations: {
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
                    { field: 'networks.length', header: 'Networks' }
                ],
                failedLoad: false
            }
        },
        computed: {
            ...mapState('authentication', ['currentuser']),
            filteredOrganisations () {
                return this.organisations.filter(organisation => { return organisation.name.toLowerCase().includes(this.search.toLowerCase()) })
            }
        },
        created () {
            setTimeout(() => { this.failedLoad = true }, 10000)
        },
        methods: {
            goToOrganisation (organisation) {
                if (organisation?.data) {
                    organisation = organisation.data
                }
                this.$emit('clicked-organisation', organisation)
            }
        }
    }
</script>
