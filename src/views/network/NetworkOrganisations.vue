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

    <Dialog v-model:visible="removeDialog" style="width: 500px" header="Confirm Deletion" modal="true"  dismissableMask="true">
            Are you sure you want to <b>delete</b> the following organisation(s)?
            <div v-for="organisation in selectedOrganisations" :key="organisation.id" class="p-shadow-1 p-p-3 p-m-5">{{organisation}}</div>
        <template #footer>
        <Button label="No" icon="pi pi-times" class="p-button-text" @click="removeDialog=false" />
        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="removeOrganisation()" />
      </template>
    </Dialog>

     <Dialog v-model:visible="inviteDialog" style="width: 500px" modal="true" dismissableMask="true" class="p-fluid">
         <div class="p-field">
            <MultiSelect id="organisations" v-model="organisationsToInvite" :options="organisations" optionLabel="name" optionValue="name" placeholder="Select Organisations" :filter="true" class="multiselect-custom">
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
import { mapActions, mapState } from 'vuex'
import MultiSelect from 'primevue/multiselect'
import OrganisationList from '../../components/lists/OrganisationList'

export default {
    components: {
        OrganisationList,
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
            removeDialog: false
        }
    },
    computed: {
        ...mapState('organisation', ['organisations', 'organisation']),
        ...mapState('network', ['network']),
        ...mapState('authentication', ['currentuser']),
        filteredList () {
            return this.organisations.filter(organisation => { return organisation.name.toLowerCase().includes(this.search.toLowerCase()) })
        }
    },
    watch: {
        inviteDialog () {
            if (!this.inviteDialog) { this.getOrganisations() }
        }
    },
    async created () {
        this.permission = this.network.created_by === this.currentuser
        await this.fetchOrganisations({ query: `?network=${this.$route.params.NetworkId}` })
        this.loading = false
    },
    methods: {
        ...mapActions('organisation', ['fetchOrganisations', 'setOrganisation']),
        ...mapActions('network', ['patchNetwork']),
        async getOrganisations () {
            this.loading = true
            await this.fetchOrganisations({ query: `?network=${this.$route.params.NetworkId}` })
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
                var newListOfOrganisations = this.network.organisations.concat(this.organisationsToInvite)
                await this.patchNetwork({ organisations: newListOfOrganisations })
            }
            this.getOrganisations()
        },
        async removeOrganisation () {
            console.log(this.selectedOrganisations)
            this.removeDialog = false
            if (this.selectedOrganisations.length) {
                var newListOfOrganisations = this.network.organisations.filter((item) => !this.selectedOrganisations.includes(item))
                console.log('>>>', newListOfOrganisations)
                await this.patchNetwork({ organisations: newListOfOrganisations })
            }
            this.getOrganisations()
        },
        async goToOrganisation (organisation) {
            if (this.removeMode) {
                this.selectedOrganisations = []
                this.selectedOrganisations.push(organisation.name)
                this.removeDialog = true
            } else {
            await this.setOrganisation({ ...organisation })
            this.$router.push({ name: 'organisationoverview', params: { OrganisationId: organisation.id } })
            }
        }
    }
}
</script>
