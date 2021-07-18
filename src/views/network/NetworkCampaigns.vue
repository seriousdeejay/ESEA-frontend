<template>
    <div style="min-width: 1000px;">
        <div class="p-d-flex p-m-5 p-jc-between">
            <div>
            <Button label="Change Display" class="p-button-sm p-mr-2" @click="tableDisplay = !tableDisplay" />
            <Button v-if="permission" label="New Campaign" icon="pi pi-plus" class="p-button-success p-button-sm" @click="createCampaignDialog=true" />
            </div>
            <span class="p-input-icon-left">
                <i class="pi pi-search" /><InputText v-model="search" placeholder="Search Campaigns..." />
            </span>
        </div>
        <Divider />
        <campaign-list :campaigns="campaigns" :table="tableDisplay" :search="search" :loading="loading" @clicked-campaign="goToCampaign" />
    </div>
    <Dialog v-model:visible="createCampaignDialog" style="width: 700px" header="Campaign Details" :modal="true" :dismissableMask="true">
        <campaign-form @closedialog="createCampaignDialog=false" />
    </Dialog>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import CampaignList from '../../components/lists/CampaignList'
import CampaignForm from '../../components/forms/CampaignForm'

export default {
    components: {
        CampaignList,
        CampaignForm
    },
    data () {
        return {
            tableDisplay: false,
            search: '',
            loading: true,
            permission: false,
            hover: false,
            styleObject: { backgroundColor: '#EFEEEE' },
            createCampaignDialog: false
        }
    },
    computed: {
        ...mapState('network', ['network']),
        ...mapState('authentication', ['currentuser']),
        ...mapState('campaign', ['campaigns']),
        filteredCampaigns () {
                return this.campaigns.filter(campaign => { return campaign.name.toLowerCase().includes(this.search.toLowerCase()) })
            }
    },
    async created () {
        this.permission = this.network.created_by === this.currentuser
        await this.fetchCampaigns({ nId: this.$route.params.NetworkId })
        this.loading = false
    },
    methods: {
        ...mapActions('campaign', ['fetchCampaigns', 'setCampaign']),
        async goToCampaign (campaign) {
            if (campaign.id) {
                await this.setCampaign(campaign)
                this.$router.push({ name: 'networkcampaign', params: { CampaignId: campaign.id } })
            }
        }
    }
}
</script>
