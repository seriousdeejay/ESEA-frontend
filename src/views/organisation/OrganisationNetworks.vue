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
            selectedNetwork: null
        }
    },
    computed: {
        ...mapState('network', ['networks'])
    },
    async created () {
        await this.fetchNetworks({ query: `?organisation=${this.$route.params.OrganisationId}` })
        this.loading = false
    },
    methods: {
        ...mapActions('network', ['fetchNetworks']),
        async joinableNetworks () {
            this.joinButton = !this.joinButton
            if (this.joinButton) {
                await this.fetchNetworks({ query: `?excludeorganisation=${this.$route.params.OrganisationId}` })
            } else {
                await this.fetchNetworks({ query: `?organisation=${this.$route.params.OrganisationId}` })
            }
        },
        requestNetworkParticipation () {
            this.requestParticipationDialog = false
            console.log('Requesting Network Participation...')
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
