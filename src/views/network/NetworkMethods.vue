<template>
    <div class="p-d-flex p-m-5" :class="permission ? 'p-jc-between' : 'p-jc-end' " style="min-width: 600px;">
        <div v-if="permission">
            <Button label="Create Method" icon="pi pi-plus" class="p-button-success p-button-sm p-mr-2" @click="createMethod" />
            <Button :label="addMode ? 'Cancel Adding Mode' : 'Enable Adding Mode'" class="p-button-sm p-mr-2" @click="((addMode = !addMode) && (removeMode = false))" :class="addMode ? 'p-button-info' : 'p-button-success'"/>
            <Button :label="removeMode ? 'Cancel Removal Mode': 'Enable Remove Mode'" icon="pi pi-trash" class="p-button-sm" :class="removeMode ? 'p-button-danger' : 'p-button-warning'" @click="((removeMode = !removeMode) && (addMode = false))" />
        </div>
        <span class="p-input-icon-left">
            <i class="pi pi-search" /><InputText v-model="search" placeholder="Search Organisations..." />
        </span>
    </div>
    <Divider />
    <method-list v-if="!inviteDialog" :methods="methods" :search="search" :loading="loading" @clicked-method="goToMethod" />

    <Dialog v-model:visible="actionDialog" style="width: 500px" header="Confirm Action" modal="true"  dismissableMask="true">
            Are you sure you want to <span v-if="removeMode"><b>delete</b></span><span v-if="addMode"><b>Add</b></span> the following methods(s)?
            <div v-for="method in selectedMethods" :key="method.id" class="p-p-3 p-m-3" style="border: 1px solid lightgrey;">{{method}}</div>
        <template #footer>
        <Button label="No" icon="pi pi-times" class="p-button-text" @click="actionDialog=false" />
        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="addMode ? addMethods() : removeMethods()" />
      </template>
    </Dialog>

    <Dialog v-model:visible="removeDialog" style="width: 500px" header="Confirm Action" modal="true"  dismissableMask="true">
            Are you sure you want to <span v-if="removeMode"><b>delete</b></span><span v-if="addMode"><b>Add</b></span> the following methods(s)?
            <div v-for="method in selectedMethods" :key="method.id" class="p-shadow-1 p-p-3 p-m-5">{{method}}</div>
        <template #footer>
        <Button label="No" icon="pi pi-times" class="p-button-text" @click="actionDialog=false" />
        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="addMode ? addMethods() : removeMethods()" />
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
            <Textarea id="message" v-model="something" required="true" rows="3" cols="20" />
            </div>
        <template #footer>
                <Button label="Invite Organisations" icon="pi pi-plus" @click="addOrganisations"/>
                <Button label="Cancel" icon="pi pi-check" class="p-button-text" @click="inviteDialog=false" />
        </template>
    </Dialog>

</template>

<script>
import { mapActions, mapState } from 'vuex'
import MethodList from '../../components/lists/MethodList'

export default {
    components: {
        MethodList
    },
    data () {
        return {
            permission: false,
            search: '',
            loading: true,
            selectedMethods: [],
            organisationsToInvite: [],
            inviteDialog: false,
            addMode: false,
            removeMode: false,
            actionDialog: false
        }
    },
    computed: {
        ...mapState('method', ['methods', 'method']),
        ...mapState('network', ['network']),
        ...mapState('authentication', ['currentuser'])
    },
    watch: {
        addMode () {
            this.getMethods()
        }
    },
    async created () {
        this.permission = this.network.created_by === this.currentuser
        this.getMethods()
    },
    methods: {
        ...mapActions('method', ['fetchMethods', 'setMethod']),
        ...mapActions('network', ['patchNetwork']),
        async getMethods () {
            if (this.addMode) {
                await this.fetchMethods({ query: `?excludenetwork=${this.$route.params.NetworkId}` })
            } else {
                await this.fetchMethods({ query: `?network=${this.$route.params.NetworkId}` })
            }
            this.loading = false
        },
        async goToMethod (method) {
            this.selectedMethods = []
            if (this.addMode) {
                this.selectedMethods.push(method.name)
                this.actionDialog = true
                return
            }
            if (this.removeMode) {
                this.selectedMethods.push(method.name)
                this.actionDialog = true
                return
            }
            if (method.id) {
                await this.setMethod(method)
                this.$router.push({ name: 'newmethoddetails', params: { id: this.method.id } })
            }
        },
        async addMethods () {
            this.actionDialog = false
            console.log('eeee', this.addMode, this.removeMode, this.selectedMethods.length)
            if (this.addMode && this.removeMode) { return }
            if (this.selectedMethods.length && this.addMode) {
                console.log('check')
                const newMethods = this.network.methods.concat(this.selectedMethods)
                await this.patchNetwork({ methods: newMethods })
            }
        },
        async removeMethods () {
            this.actionDialog = false
            if (this.addMode && this.removeMode) { return }
            if (this.selectedMethods.length && this.removeMode) {
                const newListOfMethods = this.network.methods.filter((item) => !this.selectedMethods.includes(item))
                await this.patchNetwork({ methods: newListOfMethods })
            }
        }
    }
}
    // columns:
    // [
    //     { field: 'name', header: 'Name' },
    //     { field: 'description', header: 'Description' },
    //     { field: 'surveys.length', header: 'Surveys' }
    // ]
    //     <!-- my-methods :columns=columns network-methods selection-enabled></my-methods> -->
</script>
