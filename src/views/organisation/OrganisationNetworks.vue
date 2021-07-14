<template>
    <div class="p-d-flex p-jc-between p-ai-center p-m-5">
        <div>
            <Button label="Change Display" class="p-mr-2" @click="tableDisplay = !tableDisplay" />
            <Button :label="joinButton? 'Show own Networks' : 'Join Network'" :icon="joinButton? '' : 'pi pi-plus'" :class="joinButton? 'p-button-warning' : 'p-button-success'" @click="joinableNetworks" />
        </div>
        <h3 v-if="joinButton" class="p-m-0"> Click Network you would like to join. </h3>
        <span class="p-input-icon-left">
            <i class="pi pi-search" /><InputText v-model="search" placeholder="Search Networks..." />
        </span>
    </div>
    <Divider />
    <network-list :networks="networks" :table="tableDisplay" :search="search" :loading="loading" @clicked-network="goToNetwork"/>
    <div v-if="memberships.length" class="p-p-3 p-shadow-3" style="background-color: rgba(0, 105, 92, 0.4); margin: 100px; border-radius: 5px;">
        <div class="p-d-flex p-jc-between p-ai-center">
             <h3 class="p-text-left p-text-bold">Network Invitations</h3>
             <div>
            <Button icon="pi pi-check" label="Accept all" class="p-button-success p-button-sm p-mr-2" @click="reactOnAllRequests('accepted')" />
            <Button icon="pi pi-check" label="Decline all" class="p-button-danger p-button-sm" @click="reactOnAllRequests('denied')" />
            </div>
        </div>
        <DataTable :value="memberships" datakey="id" selectionMode="single" @row-select="goToOrganisation" showGridlines autoLayout
        :paginator="true" :rows="5" :filters="filters" paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5,10,25]" currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" class="p-datatable-striped">

            <!-- <Column field="ispublic" header="Public" headerStyle="width: 5rem">
                <template #body="slotProps">
                    <i class="pi p-text-center p-text-bold" style="width:100%; font-size: 20px;" :class="{'true-icon pi-check': slotProps.data.ispublic, 'false-icon pi-times': !slotProps.data.ispublic}" :style="(slotProps.data.ispublic ? 'color: green;':'color: red;')"></i>
                </template>
            </Column> -->
            <Column v-for="col of columns" :field="col.field" :header="col.header" :key="col.field" bodyStyle="" /> <!-- text-align: center; overflow: visible  contentStyle="width: 500px;" -->
            <!-- <Column field="created_by" header="Creator">
                <template #body="slotProps">
                    <div v-if="slotProps.data.created_by !== currentuser">{{slotProps.data.created_by}}</div> <div v-else class="p-text-bold">You</div>
                </template>
            </Column> -->
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
        <h3 class="p-m-5 p-text-left p-text-bold">No current invites</h3>
    </div>

    <Dialog v-model:visible="requestParticipationDialog" class="p-fluid" style="width: 500px" :header="`Network: ${selectedNetwork?.name}`" :modal="true" :dismissableMask="true">
        <div class="p-field">
        <label for="message">Message</label>
        <Textarea id="message" v-model="something" rows="5" :autoResize="true" placeholder="Write a message to the network you want to participate in." />
        </div>
        <template #footer>
            <Button label="Cancel" icon="pi pi-times" @click="requestParticipationDialog=false" class="p-button-text"/>
            <Button label="Request Participation" icon="pi pi-check" @click="requestNetworkParticipation" />
        </template>
    </Dialog>
    <!-- <my-networks v-if="tableDisplay" :query="`?organisation=${this.$route.params.OrganisationId}`" organisation-networks selection-enabled></my-networks> -->
</template>

<script>
import { mapState, mapActions } from 'vuex'
import NetworkList from '../../components/lists/NetworkList'

export default {
    components: {
        NetworkList
    },
    data () {
        return {
            joinButton: false,
            tableDisplay: false,
            search: '',
            loading: true,
            requestParticipationDialog: false,
            selectedNetwork: null,
            columns: [
                    { field: 'network_name', header: 'Name' },
                    { field: 'network_description', header: 'Description' }
                ]
        }
    },
    computed: {
        ...mapState('network', ['networks']),
        ...mapState('membership', ['memberships'])
    },
    async created () {
       this.initialize()
    },
    methods: {
        ...mapActions('network', ['fetchNetworks']),
        ...mapActions('membership', ['fetchMemberships', 'createMembership', 'updateMembership']),
        async initialize () {
             await this.fetchNetworks({ query: `?organisation=${this.$route.params.OrganisationId}` })
             await this.fetchMemberships({ query: `?organisation=${this.$route.params.OrganisationId}` })
             this.loading = false
        },
        async joinableNetworks () {
            this.joinButton = !this.joinButton
            if (this.joinButton) {
                await this.fetchNetworks({ query: `?excludeorganisation=${this.$route.params.OrganisationId}` })
            } else {
                await this.fetchNetworks({ query: `?organisation=${this.$route.params.OrganisationId}` })
            }
        },
        async requestNetworkParticipation () {
            await this.createMembership({ network: this.selectedNetwork.id, organisation: this.$route.params.OrganisationId, requester: 'organisation' })
            this.requestParticipationDialog = false
            console.log('Requesting Network Participation...')
        },
        async reactOnAllRequests (action) {
            for (const request of this.memberships) {
                await this.updateMembership({ id: request.id, data: { network: request.network, organisation: this.$route.params.OrganisationId, requester: 'network', status: action } })
            }
            this.initialize()
        },
        async reactOnRequest (request, action) {
            console.log(action, request)
            await this.updateMembership({ id: request.id, data: { network: request.network, organisation: this.$route.params.OrganisationId, requester: 'network', status: action } })
            this.initialize()
        },
        goToNetwork (network) {
            if (this.joinButton) {
                this.selectedNetwork = network
                if (this.selectedNetwork.name) {
                    this.requestParticipationDialog = true
                }
                console.log('going to Network')
                return
            }
            this.$router.push({ name: 'networkoverview', params: { NetworkId: network.id } })
        }
    }
}
</script>
