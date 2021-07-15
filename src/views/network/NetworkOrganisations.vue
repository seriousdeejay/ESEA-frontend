<template>
    <div class="p-d-flex p-m-5" :class="permission ? 'p-jc-between' : 'p-jc-end' " style="min-width: 600px;">
        <div v-if="permission">
            <Button :label="'Invite Organisation'" icon="pi pi-plus" class="p-button-success p-button-sm p-mr-2" @click="addableOrganisations()" />
            <Button :label="removeMode ? 'Select the organisation to remove': 'Enable Remove Mode'" icon="pi pi-trash" class="p-button-sm" :class="removeMode ? 'p-button-danger' : 'p-button-warning'" :disabled="!organisations.length" @click="removeMode = !removeMode" />
        </div>
        <span class="p-input-icon-left">
            <i class="pi pi-search" /><InputText v-model="search" placeholder="Search Organisations..." />
        </span>
    </div>
    <Divider />
    <organisation-list v-if="!inviteDialog" :organisations="organisations" :search="search" :loading="loading" @clicked-organisation="goToOrganisation" />

    <invitation-window parenttype="network" @refresh="refreshData()"/>
    <!-- <h3 class="p-text-left p-ml-2">Invites</h3>
    <TabView>
        <TabPanel header="Received">
            {{ requestsByNetwork }}
            {{ requestsByOrganisation }}
        </TabPanel>
        <TabPanel header="Sent">
        </TabPanel>
    </TabView>

    <div v-if="memberships.length" class="p-p-3 p-shadow-3" style="background-color: rgba(0, 105, 92, 0.4); margin: 100px; border-radius: 5px;">
        <div class="p-d-flex p-jc-between p-ai-center">
             <h3 class="p-text-left p-text-bold">Participation Requests</h3>
             <div>
            <Button icon="pi pi-check" label="Accept all" class="p-button-success p-button-sm p-mr-2" @click="reactOnAllRequests('accepted')" />
            <Button icon="pi pi-check" label="Decline all" class="p-button-danger p-button-sm" @click="reactOnAllRequests('denied')" />
            </div>
        </div>
        <DataTable :value="memberships" datakey="id" selectionMode="single" @row-select="goToOrganisation" showGridlines autoLayout
        :paginator="true" :rows="5" :filters="filters" paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5,10,25]" currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" class="p-datatable-striped">

           <Column field="ispublic" header="Public" headerStyle="width: 5rem">
                <template #body="slotProps">
                    <i class="pi p-text-center p-text-bold" style="width:100%; font-size: 20px;" :class="{'true-icon pi-check': slotProps.data.ispublic, 'false-icon pi-times': !slotProps.data.ispublic}" :style="(slotProps.data.ispublic ? 'color: green;':'color: red;')"></i>
                </template>
            </Column>
            <Column v-for="col of columns" :field="col.field" :header="col.header" :key="col.field" bodyStyle="" /> text-align: center; overflow: visible  contentStyle="width: 500px;"
            <Column field="created_by" header="Creator">
                <template #body="slotProps">
                    <div v-if="slotProps.data.created_by !== currentuser">{{slotProps.data.created_by}}</div> <div v-else class="p-text-bold">You</div>
                </template>
            </Column>
            <Column headerStyle="width: 5rem; text-align: center" bodyStyle="text-align: center; overflow: visible">
                <template #body="{data}">
                    <div class="p-d-flex">
                        <Button icon="pi pi-check" class="p-button-success p-button-sm p-mr-2" @click="reactOnRequest(data, 'accepted')" style="width: 50px" />
                        <Button icon="pi pi-times" class="p-button-danger p-button-sm" @click="reactOnRequest(data, 'denied')" style="width: 50px" />
                    </div>
                </template>
            </Column>
        </Datatable>
    </div>
    <div v-else>
        <h3 class="p-m-5 p-text-left p-text-bold">No current requests</h3>
    </div>
{{organisationsToInvite}} -->
    <Dialog v-model:visible="removeDialog" style="width: 500px" header="Confirm Deletion" modal="true"  dismissableMask="true">
            Are you sure you want to <b>delete</b> the following organisation(s)?
            <div v-for="organisation in selectedOrganisations" :key="organisation.id" class="p-shadow-1 p-p-3 p-m-5">{{organisation.name}}</div>
        <template #footer>
        <Button label="No" icon="pi pi-times" class="p-button-text" @click="removeDialog=false" />
        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="removeOrganisation()" />
      </template>
    </Dialog>

     <Dialog v-model:visible="inviteDialog" style="width: 500px" modal="true" dismissableMask="true" class="p-fluid">
         <div class="p-field">
            <MultiSelect id="organisations" v-model="organisationsToInvite" :options="organisations" optionLabel="name" placeholder="Select Organisations" :filter="true" class="multiselect-custom">
                <template #value="slotProps">
                    <div v-for="option of slotProps.value" :key="option.id">
                        <div>{{option}}</div>
                    </div>
                    <template v-if="!slotProps.value || slotProps.value.length === 0">
                        Select Organisations
                    </template>
                </template>
                <template #option="slotProps">
                    <div>{{slotProps.option.name}}</div>
                </template>
            </MultiSelect>
         </div>
            <div class="p-field">
            <label for="message">Message to Organisations</label>
            <Textarea id="message" v-model="something" required="true" :autoResize="true" rows="3" />
            </div>
        <template #footer>
                <Button label="Invite Organisations" icon="pi pi-plus" @click="addOrganisations"/>
                <Button label="Cancel" icon="pi pi-check" class="p-button-text" @click="inviteDialog=false" />
        </template>
    </Dialog>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import MultiSelect from 'primevue/multiselect'
import OrganisationList from '../../components/lists/OrganisationList'
import InvitationWindow from '../../components/InvitationWindow'

export default {
    components: {
        OrganisationList,
        InvitationWindow,
        MultiSelect
    },
    data () {
        return {
            permission: false,
            search: '',
            loading: true,
            selectedOrganisations: [],
            organisationsToInvite: [],
            inviteDialog: false,
            removeMode: false,
            removeDialog: false,
            columns: [
                    { field: 'organisation_name', header: 'Name' },
                    { field: 'organisation_description', header: 'Description' }
                ]
        }
    },
    computed: {
        ...mapState('organisation', ['organisations', 'organisation']),
        ...mapState('network', ['network']),
        ...mapState('authentication', ['currentuser']),
        ...mapState('membership', ['memberships']),
        ...mapGetters('membership', ['requestsByNetwork', 'requestsByOrganisation']),
        filteredList () {
            return this.organisations.filter(organisation => { return organisation.name.toLowerCase().includes(this.search.toLowerCase()) })
        }
    },
    watch: {
        inviteDialog () {
            if (!this.inviteDialog) { this.refreshData() }
        }
    },
    async created () {
        this.permission = this.network.created_by === this.currentuser
        this.refreshData()
    },
    methods: {
        ...mapActions('organisation', ['fetchOrganisations', 'setOrganisation']),
        ...mapActions('network', ['patchNetwork']),
        ...mapActions('membership', ['fetchMemberships', 'createMembership', 'updateMembership']),
        async refreshData () {
            this.loading = true
            await this.fetchOrganisations({ query: `?network=${this.$route.params.NetworkId}` })
            await this.fetchMemberships({ query: `?network=${this.$route.params.NetworkId}` })
            this.loading = false
        },
        async addableOrganisations () {
            await this.fetchOrganisations({ query: `?excludenetwork=${this.$route.params.NetworkId}` })
            this.organisationsToInvite = []
            this.inviteDialog = true
        },
        async addOrganisations () {
            this.inviteDialog = false
            if (this.organisationsToInvite.length) {
                for (const organisation of this.organisationsToInvite) {
                    console.log('>>', organisation)
                    await this.createMembership({ network: this.$route.params.NetworkId, organisation: organisation.id, requester: 'network' })
                }
                this.refreshData()
                console.log(this.organisationsToInvite)
                // const result = this.organisationsToInvite.map(a => a.id)
                // var newListOfOrganisations = this.network.organisations.concat(result)
                // await this.patchNetwork({ organisations: newListOfOrganisations })
            }
            this.refreshData()
        },
        async removeOrganisation () {
            console.log(this.selectedOrganisations)
            this.removeDialog = false
            if (this.selectedOrganisations.length) {
                const result = this.selectedOrganisations.map(a => a.id)
                var newListOfOrganisations = this.network.organisations.filter((item) => !result.includes(item))
                console.log('>>>', newListOfOrganisations)
                await this.patchNetwork({ organisations: newListOfOrganisations })
            }
            this.refreshData()
        },
        // async reactOnAllRequests (action) {
        //     for (const request of this.memberships) {
        //         await this.updateMembership({ id: request.id, data: { network: this.$route.params.NetworkId, organisation: request.organisation, requester: 'organisation', status: action } })
        //     }
        //     this.initialize()
        // },
        // async reactOnRequest (request, action) {
        //     console.log(action, request)
        //     await this.updateMembership({ id: request.id, data: { network: this.$route.params.NetworkId, organisation: request.organisation, requester: 'organisation', status: action } })
        //     this.initialize()
        // },
        async goToOrganisation (organisation) {
            if (this.removeMode) {
                this.selectedOrganisations = []
                this.selectedOrganisations.push(organisation)
                this.removeDialog = true
            } else {
            await this.setOrganisation({ ...organisation })
            this.$router.push({ name: 'organisationoverview', params: { OrganisationId: organisation.id } })
            }
        }
    }
}
</script>
