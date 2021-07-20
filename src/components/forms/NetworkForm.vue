<template>
    <form id="networkform" @submit.prevent="createNewNetwork" class="p-input-filled p-fluid p-text-left">
        <div class="p-field">
            <label for="name">Name<span style="color:red">*</span></label>
            <InputText id="name" v-model.trim="networkForm.name" :class="{'p-invalid': v$.networkForm.name.$error}" />
            <div class="p-error p-text-italic" v-for="error in nameErrors" :key="error">{{ error }}</div>
        </div>
        <div class="p-field">
            <label for="description">Description</label>
            <Textarea id="description" v-model="networkForm.description" :autoResize="true" rows="3" />
            <div class="p-error p-text-italic" v-for="error in descriptionErrors" :key="error">{{ error }}</div>
        </div>
        <div class="p-field">
            <label for="networkadmin">Network Admin<span style="color:red">*</span></label>
            <Dropdown id="name" v-model="networkForm.networkadmin" :options="users" optionLabel="username" optionValue="id" :class="{'p-invalid': v$.networkForm.networkadmin.$error}" />
            <div class="p-error p-text-italic" v-if="v$.networkForm.networkadmin.$error">Network requires a network admin.</div>
        </div>
        <div class="p-field">
            <label for="ispublic">Should this network be public? </label>
            <SelectButton id="ispublic" v-model="networkForm.ispublic" :options="ispublicbool" />
        </div>
        <div class="p-d-flex p-jc-between">
            <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="closeDialog" style="width: 100px" />
            <Button type="submit" form="networkform" label="Save" icon="pi pi-check" class="p-button-text" :disabled="v$.networkForm.$error" style="width: 100px" />
        </div>
    </form>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import useVuelidate from '@vuelidate/core'
import { required, maxLength } from 'vuelidate/lib/validators'
import HandleValidationErrors from '../../utils/HandleValidationErrors'
import Dropdown from 'primevue/dropdown'

export default {
    setup: () => ({ v$: useVuelidate() }),
    components: {
        Dropdown
    },
    data () {
        return {
            ispublicbool: [true, false],
            networkForm: {
                name: null,
                description: '',
                ispublic: true
            }
        }
    },
    validations: {
        networkForm: {
            name: { required, maxLength: maxLength(255) },
            description: { maxLength: maxLength(1000) },
            ispublic: { required },
            networkadmin: { required }
        }
    },
    computed: {
        ...mapState('network', ['network', 'error']),
        ...mapState('user', ['users']),
        ...mapState('authentication', ['authenticatedUser']),
        nameErrors () {
            return HandleValidationErrors(this.v$.networkForm.name, this.error.name)
        }
    },
    created () {
        this.initialize()
    },
    methods: {
        ...mapActions('network', ['setNetwork', 'createNetwork']),
        ...mapActions('user', ['fetchUsers']),
        ...mapActions('networkTeam', ['createNetworkMember']),
        async initialize () {
            await this.setNetwork({})
            await this.fetchUsers({})
            this.networkForm.networkadmin = this.authenticatedUser.id
        },
        async createNewNetwork () {
            this.v$.networkForm.$touch()
            if (this.v$.$invalid) { return }

            await this.createNetwork({ data: this.networkForm })
            if (this.network?.id) {
                // await this.createNetworkMember({ nId: this.network.id, data: { user: this.networkForm.networkadmin, role: 2 } })
                this.$router.push({ name: 'networkoverview', params: { NetworkId: this.network.id } })
            }
        },
        closeDialog () {
            this.$emit('closedialog')
        }
    }
}
</script>
