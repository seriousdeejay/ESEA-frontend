<template>
        <ProgressSpinner v-if="loading" />
        <div v-else-if="campaigns.length" class="p-grid p-m-5">
            <div v-for="campaign in filteredCampaigns" :key="campaign.name" class="p-col-12 p-md-6 p-lg-4" style="width: 400px">
                <div class="p-p-3" :class="campaign.hover ? 'p-shadow-1 p-m-1' : 'p-shadow-1 p-m-0'" style="border-radius: 3px" :style="(campaign.hover ? styleObject : '')"  @mouseover="campaign.hover=true" @mouseleave="campaign.hover = false" @click="goToCampaign(campaign)">
                        <p class="p-text-light">{{ dateFixer(campaign.open_survey_date, 'MMMM Do YYYY') }} - {{ dateFixer(campaign.close_survey_date, 'MMMM Do YYYY') }}</p> <!-- MM/Do/YYYY' -->
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
        <div v-else class="p-text-italic">No Campaigns to display!</div>
</template>

<script>
    import ProgressSpinner from 'primevue/progressspinner'
    import dateFixer from '../../utils/datefixer'

    export default {
        components: {
            ProgressSpinner
        },
        props: {
            campaigns: {
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
            }
        },
        data () {
            return {
                styleObject: { backgroundColor: '#EFEEEE' }
            }
        },
        computed: {
            filteredCampaigns () {
                return this.campaigns.filter(campaign => { return campaign.name.toLowerCase().includes(this.search.toLowerCase()) })
            }
        },
        methods: {
            dateFixer,
            goToCampaign (campaign) {
                this.$emit('clicked-campaign', campaign)
            }
        }
    }
</script>
