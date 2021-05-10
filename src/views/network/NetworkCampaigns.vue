<template>
    <div class="p-d-flex p-jc-between p-m-5">
        <Button label="New Campaign" icon="pi pi-plus" class="p-button-success p-d-flex p-mx-5" @click="createCampaignDialog = true" />
        <span class="p-input-icon-left">
            <i class="pi pi-search" /><InputText v-model="search" placeholder="Search..." />
        </span>
    </div>
    <Divider />
<ProgressSpinner v-if="loading" />
    <div v-if="campaigns.length && !loading" class="p-grid p-m-5">
        <div v-for="campaign in campaigns" :key="campaign.name" class="p-col-12 p-md-6 p-lg-4" style="width: 400px">
            <div class="p-p-3" :class="campaign.hover ? 'p-shadow-1 p-m-1' : 'p-shadow-1 p-m-0'" style="border-radius: 3px" :style="(campaign.hover ? styleObject : '')"  @mouseover="campaign.hover=true" @mouseleave="campaign.hover = false" @click="goToCampaign(campaign)">
                    <p class="p-text-light">{{ dateFixer(campaign.open_survey_date, 'MMMM Do YYYY') }} - {{ dateFixer(campaign.close_survey_date, 'MMMM Do YYYY') }}</p> <!-- MM/Do/YYYY' -->
                    <!-- <span class="p-text-italic">{{ dateFixer(campaign.close_survey_date, 'MMMM Do YYYY') }}</span> -->
                <img :src="campaign.image" alt="Campaign Image" style="max-width: 150px; max-height: 150px; border-radius: 50%;" format="PNG">
                 <p class="p-text-italic">{{campaign.name}}</p>

                <Divider />
                <div class="p-text-left p-ml-3">
                    <p>Method: <span class="p-text-bold">{{campaign.method}}</span></p> <!-- Should be method name instead of pk! -->
                    <p>Participating Organisations: <span class="p-text-bold">{{campaign.organisation_accounts.length}}</span></p>
                </div>
            </div>
        </div>
    </div>
    <div v-else class="p-text-italic">There are no campaigns to display, create one!</div>

    <Dialog v-model:visible="createCampaignDialog" style="width: 700px" header="Campaign Details" :modal="true" :dismissableMask="true">
        <campaign-form @closedialog="closeDialog" />
    </Dialog>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import dateFixer from '../../utils/datefixer'
import CampaignForm from '../../components/forms/CampaignForm'
import ProgressSpinner from 'primevue/progressspinner'
export default {
    components: {
        CampaignForm,
        ProgressSpinner
    },
    data () {
        return {
            loading: true,
            hover: false,
            styleObject: { backgroundColor: '#EFEEEE' },
            createCampaignDialog: false
        }
    },
    computed: {
        ...mapState('network', ['network']),
        ...mapState('method', ['methods']),
        ...mapState('campaign', ['campaigns', 'campaign'])
    },
    created () {
        this.initialize()
    },
    methods: {
        ...mapActions('campaign', ['fetchCampaigns', 'setCampaign']),
        dateFixer,
        async initialize () {
            setTimeout(() => { this.loading = false }, 4000)
            await this.fetchCampaigns({ nId: this.$route.params.NetworkId })
            this.loading = false
        },

        async goToCampaign (campaign) {
            await this.setCampaign(campaign)
            this.$router.push({ name: 'networkcampaign', params: { CampaignId: campaign.id } })
        },
        closeDialog () {
            this.createCampaignDialog = false
        }
    }

}
</script>

        // async createNewCampaign () {
        //     this.submitted = false
        //     if (this.campaignForm.name && this.campaignForm.method) {
        //         for (var index in this.selectedOrganisations) {
        //             this.campaignForm.organisations.push(this.selectedOrganisations[index].name)
        //         }
        //         await this.createCampaign({ nId: this.$route.params.NetworkId, data: this.campaignForm })
        //         this.$router.push({ name: 'networkcampaign', params: { NetworkId: this.$route.params.NetworkId, CampaignId: this.campaign.id } })
        //         this.createCampaignDialog = false
        //     }
        //     this.submitted = true
        // },
