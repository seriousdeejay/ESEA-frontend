<template>
    <h1>Networks Overview</h1>
    <div class="p-d-flex p-jc-between p-m-5">
        <Button label="Create Network" icon="pi pi-plus" class="p-button-success" @click="createNetworkDialog=true" />
        <span class="p-input-icon-left">
            <i class="pi pi-search" /><InputText v-model="search" placeholder="Search Networks..." />
        </span>
    </div>
    <Divider />
    <network-list :networks="networks" :search="search" :loading="loading"  @clicked-network="goToNetwork" />

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
            search: '',
            loading: true,
            // NetworkColumns: [
            //     { field: 'ispublic', header: 'Public' },
            //     { field: 'name', header: 'Name' },
            //     { field: 'description', header: 'Description' },
            //     { field: 'organisations.length', header: 'Organisations' },
            //     { field: 'created_by', header: 'Created by' }
            // ],
            createNetworkDialog: false
        }
    },
    computed: {
        ...mapState('network', ['networks'])
    },
    async created () {
        // setTimeout(() => { this.loading = false }, 4000)
        await this.fetchNetworks({})
        this.loading = false
    },
    methods: {
        ...mapActions('network', ['fetchNetworks', 'setNetwork', 'createNetwork']),
        async goToNetwork (network) {
            if (network.id) {
                await this.setNetwork(network)
                this.$router.push({ name: 'networkoverview', params: { NetworkId: network.id } })
            }
        }
    }
}
 </script>
