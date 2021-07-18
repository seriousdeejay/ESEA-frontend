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
                    <i class="pi p-text-center p-text-bold" style="width:100%; font-size: 20px;" :class="{'true-icon pi-check': slotProps.data.ispublic, 'false-icon pi-times': !slotProps.data.ispublic}" :style="(slotProps.data.ispublic ? 'color: green;':'color: red;')"></i>
                </template>
            </Column>
            <Column v-for="col of columns" :field="col.field" :header="col.header" :key="col.field" bodyStyle="" /> <!-- text-align: center; overflow: visible  contentStyle="width: 500px;" -->
            <Column field="created_by" header="Creator">
                <template #body="slotProps">
                    <div v-if="slotProps.data.created_by !== currentuser">{{slotProps.data.created_by}}</div> <div v-else class="p-text-bold">You</div>
                </template>
            </Column>
            <Column headerStyle="width: 5rem; text-align: center" bodyStyle="text-align: center; overflow: visible">
                <template #body="{data}">
                    <Button v-if="data.created_by === this.currentuser" icon="pi pi-trash" class="p-button-danger p-button-sm" @click="(selectedOrganisation = data) && (destroyOrganisationDialog = true)" style="width: 50px" />
                </template>
            </Column>
        </Datatable>
    </div>
    <div v-else class="p-text-italic">No Organisations to display!</div>

    <Dialog v-model:visible="destroyOrganisationDialog" :style="{width: '450px'}" header="Confirm Organisation Deletion" :modal="true">
        <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle p-mr-3" style="font-size:1.5rem" />
            <span>Are you sure you want to completely delete the following Organisation: <b>{{selectedOrganisation.name}}</b>?</span>
        </div>
        <template #footer>
            <Button label="No" icon="pi pi-times" class="p-button-text" @click="destroyOrganisationDialog = false"/>
            <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="destroyOrganisation()" />
        </template>
    </Dialog>
</template>

<script>
    import { mapState, mapActions } from 'vuex'
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
                styleObject: { backgroundColor: '#EFEEEE', cursor: 'pointer' },
                columns: [
                    { field: 'name', header: 'Name' },
                    { field: 'description', header: 'Description' },
                    { field: 'networks.length', header: 'Networks' }
                ],
                failedLoad: false,
                destroyOrganisationDialog: false,
                selectedOrganisation: null
            }
        },
        computed: {
            ...mapState('authentication', ['currentuser']),
            filteredOrganisations () {
                return this.organisations.filter(organisation => {
                    return (
                        organisation.name.toLowerCase().includes(this.search.toLowerCase()) ||
                        organisation.description.toLowerCase().includes(this.search.toLowerCase())
                    )
                })
            }
        },
        created () {
            setTimeout(() => { this.failedLoad = true }, 10000)
        },
        methods: {
            ...mapActions('organisation', ['deleteOrganisation']),
            goToOrganisation (organisation) {
                if (organisation?.data) {
                    organisation = organisation.data
                }
                this.$emit('clicked-organisation', organisation)
            },
            async destroyOrganisation () {
                if (this.selectedOrganisation) {
                    this.deleteOrganisation({ id: this.selectedOrganisation?.id })
                }
                this.selectedOrganisation = null
                this.destroyOrganisationDialog = false
            }
        }
    }
</script>
