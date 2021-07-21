<template>
     <div class="p-d-flex p-mb-5 p-mx-5" :class="(network?.accesLevel === 'network admin' || network?.accesLevel ==='admin') ? 'p-jc-between' : 'p-jc-end' " style="min-width: 600px;">
        <Button v-if="(network?.accesLevel === 'network admin' || network?.accesLevel ==='admin')" label="Invite User" icon="pi pi-plus" class="p-button-success p-button-sm p-mr-2" @click="openInviteDialog" />
        <span class="p-input-icon-left">
            <i class="pi pi-search" /><InputText v-model="search" placeholder="Search Team members..." />
        </span>
    </div>
    <Divider />
    <DataTable :value="networkmembers"  dataKey="id" :loading="loading" selectionMode="single" @row-select="goToNetwork" showGridlines autoLayout
    :paginator="true" :rows="10" :filters="filters" paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
    :rowsPerPageOptions="[5,10,25]" currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" class="p-datatable-striped">

        <template #loading>
            Loading records, please wait...
        </template>
        <Column v-for="col of columns" :field="col.field" :header="col.header" :key="col.field" />
        <Column header="Actions" headerStyle="width: 10rem; text-align: center" bodyStyle="text-align: center; overflow: visible">
            <template #body="{data}">
                <div v-if="(network?.accesLevel === 'network admin' || network?.accesLevel ==='admin')" class="p-d-flex">
                    <Button label="change" class="p-button-info p-button-sm p-mr-2" @click="changeRole(data)" />
                    <Button label="delete" icon="pi pi-trash" class="p-button-danger p-button-sm" @click="deleteRole(data)" />
                </div>
            </template>
        </Column>
    </Datatable>
    <Dialog v-model:visible="changeDialog" style="width: 500px" :header="`Change ${member?.user_name}'s role`" modal="true"  dismissableMask="true">
        <div class="p-d-flex p-jc-between">
            <Dropdown v-model="member.role" :options="roles" optionLabel="role_name" optionValue="role" placeholder="Select a Role" style="width: 100%;" />
        </div>
        <template #footer>
            <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="changeDialog=false" />
             <Button label="Save Member" icon="pi pi-check" class="p-button-text" @click="updateRole()" />
        </template>
    </Dialog>
    <Dialog v-model:visible="inviteDialog" style="width: 1000px" header="Invite Users" modal="true"  dismissableMask="true">
        <invite-users :users="users" @inviteduser="inviteUser" />
        <template #footer>
            <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="inviteDialog=false" />
        </template>
    </Dialog>
    <Dialog  v-model:visible="messageDialog" modal="true"  dismissableMask="true">
        Can't perform this action because this network requires atleast one network admin. Promote someone else before you continue with this action.
    </Dialog>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import InviteUsers from '@/components/dialogs/InviteUsers'
import Dropdown from 'primevue/dropdown'

export default {
    components: {
        InviteUsers,
        Dropdown
    },
    data () {
        return {
            inviteDialog: false,
            changeDialog: false,
            messageDialog: false,
            member: null,
            columns: [
                { field: 'user_name', header: 'User' },
                { field: 'role_name', header: 'Role' },
                { field: 'invitation', header: 'Invitation' }
            ],
            roles: [
                { role_name: 'network admin', role: 2 },
                { role_name: 'guest', role: 1 }
            ]
        }
    },
    computed: {
        ...mapState('networkTeam', ['networkmembers']),
        ...mapState('network', ['network']),
        ...mapState('user', ['users'])
    },
    created () {
        this.getData()
    },
    methods: {
        ...mapActions('networkTeam', ['fetchNetworkMembers', 'createNetworkMember', 'updateNetworkMember', 'deleteNetworkMember']),
        ...mapActions('user', ['fetchUsers']),
        ...mapActions('network', ['fetchNetwork']),
        async getData () {
            await this.fetchNetworkMembers({ nId: this.$route.params.NetworkId })
        },
        async openInviteDialog () {
            await this.fetchUsers({ query: `?excludenetwork=${this.$route.params.NetworkId}` })
            this.inviteDialog = true
        },
        async inviteUser (data) {
            await this.createNetworkMember({ nId: this.$route.params.NetworkId, data: { user: data.id } })
            this.getData()
            this.inviteDialog = false
        },
        changeRole (data) {
            console.log(data)
            this.member = data
            if (this.checkNetworkAdminCount(data)) {
                this.changeDialog = true
            } else {
                this.messageDialog = true
            }
        },
        checkNetworkAdminCount (data) {
             if (this.networkmembers.filter(element => element.user_name !== data.user_name).find(element => element.role_name === 'network admin')) {
                console.log('===', this.networkmembers.filter(element => element.user_name !== data.user_name).find(element => element.role_name === 'network admin'))
                return true
            }
            return false
        },
        async updateRole () {
            await this.updateNetworkMember({ nId: this.$route.params.NetworkId, id: this.member.id, data: { user: this.member.user, role: this.member.role } })
            this.getData()
            this.changeDialog = false
        },
        async deleteRole (data) {
            if (this.checkNetworkAdminCount(data)) {
                await this.deleteNetworkMember({ nId: this.$route.params.NetworkId, id: data.id })
                this.fetchNetwork({ id: this.$route.params.NetworkId })
            } else {
                this.messageDialog = true
            }
        },
        closeInvitationDialog () {
            this.inviteDialog = false
            this.getData()
        }
    }
}
</script>
