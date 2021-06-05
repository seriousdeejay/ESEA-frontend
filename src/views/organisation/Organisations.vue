<template>
    <div style="min-width: 1000px;">
        <h1>Organisations Overview</h1>
        <div class="p-d-flex p-jc-between p-m-5">
            <div>
                <Button label="Change Display" class="p-mr-2" @click="tableDisplay = !tableDisplay" />
                <Button label="Create Organisation" icon="pi pi-plus" class="p-button-success" @click="createOrganisationDialog=true" />
            </div>
            <span class="p-input-icon-left">
                <i class="pi pi-search" /><InputText v-model="search" placeholder="Search Organisations..." />
            </span>
        </div>
        <Divider />
        <organisation-list :organisations="organisations" :table="tableDisplay" :search="search" :loading="loading" @clicked-organisation="goToOrganisation" />
    </div>
    <Dialog v-model:visible="createOrganisationDialog" style="width: 500px" header="Organisation Details" :modal="true" :dismissableMask="true">
        <organisation-form @closedialog="createOrganisationDialog=false" />
    </Dialog>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import OrganisationList from '../../components/lists/OrganisationList'
import OrganisationForm from '../../components/forms/OrganisationForm'

export default {
    components: {
        OrganisationList,
        OrganisationForm

    },
    data () {
        return {
            tableDisplay: false,
            search: '',
            loading: true,
            createOrganisationDialog: false
        }
    },
    computed: {
        ...mapState('organisation', ['organisations'])
    },

    async created () {
        await this.fetchOrganisations({})
        this.loading = false
    },
    methods: {
        ...mapActions('organisation', ['fetchOrganisations', 'setOrganisation']),
        async goToOrganisation (organisation) {
            if (organisation.id) {
                await this.setOrganisation(organisation)
                this.$router.push({ name: 'organisationoverview', params: { OrganisationId: organisation.id } })
            }
        }
    }
}
</script>
