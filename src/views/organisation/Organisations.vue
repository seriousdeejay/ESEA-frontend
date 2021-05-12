<template>
    <h1>Organisations Overview</h1>
    <div class="p-d-flex p-jc-between p-m-5">
        <Button label="Create Organisation" icon="pi pi-plus" class="p-button-success" @click="createOrganisationDialog=true" />
        <span class="p-input-icon-left">
            <i class="pi pi-search" /><InputText v-model="search" placeholder="Search Organisations..." />
        </span>
    </div>
    <Divider />
    <organisation-list :organisations="organisations" @clicked-organisation="goToOrganisation" :search="search" :loading="loading" />

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
            search: '',
            loading: true,
            createOrganisationDialog: false
        }
    },
    computed: {
        ...mapState('organisation', ['organisations'])
    },

    created () {
        this.fetchOrganisations({})
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
