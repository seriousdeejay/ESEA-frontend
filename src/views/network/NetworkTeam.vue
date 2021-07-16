<template>
     <div class="p-d-flex p-m-5" :class="network?.accesLevel ? 'p-jc-between' : 'p-jc-end' " style="min-width: 600px;">
        <div>
            <Button label="Invite User" icon="pi pi-plus" class="p-button-success p-button-sm p-mr-2" @click="inviteDialog = !inviteDialog" />
        </div>
        <span class="p-input-icon-left">
            <i class="pi pi-search" /><InputText v-model="search" placeholder="Search Organisations..." />
        </span>
    </div>
    <Divider />
    <DataTable :value="networkmembers"  dataKey="id" :loading="loading" selectionMode="single" @row-select="goToNetwork" showGridlines autoLayout
    :paginator="true" :rows="10" :filters="filters" paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
    :rowsPerPageOptions="[5,10,25]" currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" class="p-datatable-striped p-datatable-sm">

        <template #loading>
            Loading records, please wait...
        </template>
        <Column v-for="col of columns" :field="col.field" :header="col.header" :key="col.field" />
        <Column header="Actions" headerStyle="width: 10rem; text-align: center" bodyStyle="text-align: center; overflow: visible">
            <template #body="{data}">
                <div v-if="network?.accesLevel === 'admin'" class="p-d-flex">
                    <Button label="change" class="p-button-info p-button-sm p-mr-2" @click="changeRole(data)" />
                    <Button label="delete" icon="pi pi-trash" class="p-button-danger p-button-sm" @click="deleteRole(data)" />
                </div>
            </template>
        </Column>
    </Datatable>

    <Dialog v-model:visible="inviteDialog" style="width: 500px" header="Invite Users" modal="true"  dismissableMask="true">
            Select the users you would like to invite to the team of '{{this.network?.name}}'.
            <div v-for="organisation in selectedOrganisations" :key="organisation.id" class="p-shadow-1 p-p-3 p-m-5">{{organisation.name}}</div>
        <template #footer>
        <Button label="No" icon="pi pi-times" class="p-button-text" @click="inviteDialog=false" />
        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="a" />
      </template>
    </Dialog>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
    data () {
        return {
            inviteDialog: false,
            columns: [
                { field: 'user_name', header: 'User' },
                { field: 'role_name', header: 'role' }
            ]
        }
    },
    computed: {
        ...mapState('networkTeam', ['networkmembers']),
        ...mapState('network', ['network'])
    },
    created () {
        this.getData()
    },
    methods: {
        ...mapActions('networkTeam', ['fetchNetworkMembers']),
        async getData () {
            await this.fetchNetworkMembers({ nId: this.$route.params.NetworkId })
        },
        changeRole (data) {
            console.log(data)
        },
        deleteRole (data) {
            console.log(data)
        }
    }
}
</script>
