<template>
    <form ref="form"  class="p-text-left p-fluid p-m-5 p-p-5 p-inputtext-lg"> <!-- @submit.prevent="!v$.$invalid" -->
        <div class="p-field p-m-5">
            <h3>Method Name</h3>
                <InputText id="methodname" type="text" v-model="lazierMethod.name"  :class="{'borderless': nameErrors.length}" @blur="updateName"  />
            <div class="p-error p-text-left p-text-italic p-pt-1" v-for="error in nameErrors" :key="error" style="font-size: 20px;">{{error}}</div>
        </div>
        <div class="p-field p-m-5">
            <h3>Method Description</h3>
                <Textarea id="methoddescription" v-model="lazierMethod.description" :autoResize="true" rows="3" :class="{'borderless': descriptionErrors.length}" @blur="updateDescription" />
            <div class="p-error p-text-italic p-pt-1" v-for="error in descriptionErrors" :key="error">{{error}}</div>
        </div>
        <div class="p-field p-m-5">
            <h3>Should this network be public? </h3>
            <SelectButton id="ispublic" v-model="lazierMethod.ispublic"  optionLabel="display" optionValue="value" :options="ispublicbool" />
        </div>
    </form>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { cloneDeep, isEqual } from 'lodash' // cloneDeep isEqual
import useVuelidate from '@vuelidate/core'
import { required, minLength, maxLength } from '../../utils/validators'
import HandleValidationErrors from '../../utils/HandleValidationErrors'

export default {

    data () {
        return {
            lazierMethod: null,
            ispublicbool: [
                { display: 'Public', value: true },
                { display: 'Private', value: false }
            ]
        }
    },
    computed: {
        ...mapState('method', ['method', 'error']),
        nameErrors () {
            return HandleValidationErrors(
                this.v$.lazierMethod.name,
                this.error.name
                )
        },
        descriptionErrors () {
            return HandleValidationErrors(
                this.v$.lazierMethod.description,
                this.error.description
            )
        }
    },
    watch: {
        method (val) {
            if (isEqual(this.lazierMethod, val)) { return }
            this.lazyMethod = cloneDeep(val)
        },
        lazierMethod: {
            handler (val) {
                setTimeout(() => {
                    if (this.v$.$invalid) { return }
                    if (isEqual(this.method, val)) { return }
                    this.updateMethod(val)
                }, 200)
            },
            deep: true
        }
    },
    setup: () => ({ v$: useVuelidate() }),
    validations: {
        lazierMethod: {
            id: { required },
            name: { required, minLength: minLength(2), maxLength: maxLength(255) },
            description: { required }
        }
    },
    created () {
        this.lazierMethod = cloneDeep(this.method)
    },
    methods: {
        ...mapActions('method', ['updateMethod']),
        updateName () {
            this.v$.lazierMethod.name.$touch()
        },
        updateDescription () {
            this.v$.lazierMethod.description.$touch()
        }
    }
}
</script>

<style lang="scss" scoped>
    .p-inputtext {
        border: none;
        border-bottom: 1px solid lightgrey;
    }
    .borderless {
        border-bottom: 1px solid red;

    }
</style>
