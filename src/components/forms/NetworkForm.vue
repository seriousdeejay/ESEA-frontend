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

export default {
    setup: () => ({ v$: useVuelidate() }),
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
            ispublic: { required }
        }
    },
    computed: {
        ...mapState('network', ['network', 'error']),
        nameErrors () {
            return HandleValidationErrors(this.v$.networkForm.name, this.error.name)
        }
    },
    created () {
        this.initialize()
    },
    methods: {
        ...mapActions('network', ['setNetwork', 'createNetwork']),
        async initialize () {
            this.setNetwork({})
        },
        async createNewNetwork () {
            this.v$.networkForm.$touch()
            if (this.v$.$invalid) { return }

            await this.createNetwork({ data: this.networkForm })
            if (this.network?.id) {
                this.$router.push({ name: 'networkoverview', params: { NetworkId: this.network.id } })
            }
        },
        closeDialog () {
            this.$emit('closedialog')
        }
    }
}
</script>
