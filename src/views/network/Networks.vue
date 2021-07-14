<template>
    <div class="p-m-5" style="min-width: 1000px;">
        <h1>Networks Overview</h1>
        <div class="p-d-flex p-jc-between p-m-5">
            <div>
                <Button :label="(allNetworks ? 'All Networks' : 'My Networks')" class="p-mr-2" @click="allNetworks = !allNetworks"/>
                <Button label="Change Display" class="p-mr-2" @click="tableDisplay = !tableDisplay" />
                <Button label="Create Network" icon="pi pi-plus" class="p-button-success" @click="createNetworkDialog=true" />
            </div>
            <span class="p-input-icon-left">
                <i class="pi pi-search" /><InputText v-model="search" placeholder="Search Networks..." />
            </span>
        </div>
        <Divider />
        <network-list :networks="networks" :table="tableDisplay" :search="search" :loading="loading"  @clicked-network="goToNetwork" />
    </div>
    <Dialog v-model:visible="createNetworkDialog" style="width: 500px" header="Network Details" :modal="true" :dismissableMask="true">
        <network-form @closedialog="createNetworkDialog=false" />
    </Dialog>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import NetworkList from '../../components/lists/NetworkList'
import NetworkForm from '../../components/forms/NetworkForm'

export default {
    components: {
        NetworkList,
        NetworkForm
    },
    data () {
        return {
            allNetworks: false,
            tableDisplay: false,
            search: '',
            loading: true,
            createNetworkDialog: false
        }
    },
    computed: {
        ...mapState('network', ['networks', 'network'])
    },
    watch: {
        allNetworks () {
            this.getNetworks()
        }
    },
    async created () {
        this.getNetworks()
    },
    methods: {
        ...mapActions('network', ['fetchNetworks', 'setNetwork', 'createNetwork']),
        async getNetworks () {
            if (this.allNetworks) {
                await this.fetchNetworks({ query: '?allnetworks=1' })
            } else {
            await this.fetchNetworks({})
            }
            this.loading = false
        },
        async goToNetwork (network) {
            if (network.id) {
                await this.setNetwork(network)
                this.$router.push({ name: 'networkoverview', params: { NetworkId: this.network.id } })
            }
        }
    }
}
 </script>

// NetworkColumns: [
//     { field: 'ispublic', header: 'Public' },
//     { field: 'name', header: 'Name' },
//     { field: 'description', header: 'Description' },
//     { field: 'organisations.length', header: 'Organisations' },
//     { field: 'created_by', header: 'Created by' }
// ],
