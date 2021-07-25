<template>
<form ref="form" class="p-grid p-m-5 p-px-5 p-pb-3 p-fluid p-input-filled" :style="[(active) ? 'border: 2px solid #9ecaed;': 'border: 1px solid lightgrey;', (!v$.lazyIndicator.$invalid && lazyIndicator.id > 0) ? '': 'border: 2px solid rgba(255, 0, 0, 0.3);']" style="background-color: #F2F2F2;">
    <!-- {{lazyIndicator}} {{v$.lazyIndicator.$invalid}} --> {{lazyIndicator === directIndicator}}
        <div class="p-d-flex p-col-12">
            <h3 class="p-col-11 p-text-center">Direct Indicator</h3>
            <div class="p-col p-d-flex p-ai-center p-jc-end">
                <i class="pi pi-trash p-mx-5" style="font-size: 30px; color: red; cursor: pointer;" @click="removeIndicator()" />
                <i class="pi pi-ellipsis-v" style="font-size: 30px; cursor: not-allowed;" />
            </div>
        </div>
        <div class="p-col-6 p-field p-my-2">
            <span class="p-float-label">
                <InputText id="indicator-key" type="text" v-model="lazyIndicator.key" :class="{'borderless': v$.lazyIndicator.key.$error}" :disabled="!active" /> <!--  @blur="questionKeyFilter(lazyIndicator.key)" -->
                <label for="indicator-key">Indicator Key</label>
            </span>
            <div class="p-error p-text-italic" v-for="error in keyErrors" :key="error"><small>{{ error }}</small></div>
        </div>

        <div class="p-col-6 p-field p-my-2">
            <Dropdown v-model="lazyIndicator.datatype" :options="dataTypesList" optionLabel="text" optionValue="value" placeholder="Select Datatype..." :class="{'p-invalid': v$.lazyIndicator.datatype.$error }" :disabled="!active" @change="changeDataTypeComponent" />
        </div>

        <div class="p-col-12 p-field p-my-2">
            <span class="p-float-label">
                <InputText ref="indicatorname" id="indicatorname" type="text" v-model="lazyIndicator.name" :class="{borderless: nameErrors.length }" @blur="v$.lazyIndicator.name.$touch()" :disabled="!active" />
                <label for="indicatorname">Name</label>
            </span>
        </div>
        <div v-if="active" class="p-col-12 p-m-0 p-p-0">
            <div class="p-col-12 p-field p-my-2">
                <span class="p-float-label">
                    <InputText id="indicatordescription" type="text" v-model="lazyIndicator.description" />
                    <label for="indicatordescription">Description</label>
                </span>
            </div>

            <div v-if="lazyIndicator.datatype && !datatypeWithOptions" class="p-col-12 p-grid p-m-0 p-p-0">
                <div class="p-col-6 p-field p-my-2">
                    <span class="p-float-label">
                        <InputText id="pre_unit" type="text" v-model="lazyIndicator.pre_unit" />
                        <label for="pre_unit">pre unit</label>
                    </span>
                </div>
                <div class="p-col-6 p-field p-my-2">
                    <span class="p-float-label">
                        <InputText id="post_unit" type="text" v-model="lazyIndicator.post_unit" />
                        <label for="post_unit">post unit</label>
                    </span>
                </div>
            </div>
            <div v-if="lazyIndicator.datatype && datatypeWithOptions" class="p-grid p-col-12 p-mx-0 p-px-0">
                <option-form v-for="(option, index) in lazyIndicator.options" :key="`option-${index}`" :option="option" @delete="deleteOption(option)" />
                <Button label="Add Option" class="p-button-text" @click="addOption" />
            </div>
        </div>
   </form>
</template>

<script>
import { isEqual, cloneDeep } from 'lodash'
import HandleValidationErrors from '../../utils/HandleValidationErrors'
import useVuelidate from '@vuelidate/core'
import { required, maxLength } from '@/utils/validators'
import Dropdown from 'primevue/dropdown'
import OptionForm from '@/components/forms/OptionForm'
import { DATA_TYPES } from '@/utils/constants'
// import InputSwitch from 'primevue/inputswitch'

export default {
    components: {
        OptionForm,
        Dropdown
    },
    props: {
        directIndicator: {
            type: Object,
            required: true
        },
        active: {
            type: Boolean
        },
        errors: {
            type: Object,
            default: () => ({})
        },
        checker: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            lazyIndicator: cloneDeep(this.directIndicator || {}),
            dataTypes: DATA_TYPES
            // active: true
        }
    },
    computed: {
        // ...mapGetters(directIndicator, ['getValidIndicatorKeyNumber'])
        dataTypesList () {
            return this.dataTypes
        },
        datatypeWithOptions () {
            if (this.lazyIndicator.datatype) {
                const datatypesWithOptions = ['boolean', 'singlechoice', 'multiplechoice']
                return datatypesWithOptions.includes(this.lazyIndicator.datatype)
            }
            return false
        },
        keyErrors () {
            return HandleValidationErrors(this.v$.lazyIndicator.key, this.errors.key)
        },
        nameErrors () {
            return HandleValidationErrors(this.v$.lazyIndicator.name, this.errors.name)
        }
    },
    watch: {
        directIndicator: {
            handler (val) {
                setTimeout(() => {
                    console.log('change it up')
                     // if (isEqual(this.lazyIndicator, val)) { return }
                    this.lazyIndicator = cloneDeep(val)
                }, 200)
            },
            deep: true
        },
        lazyIndicator: {
            handler (val) {
                setTimeout(() => {
                    this.v$.lazyIndicator.$touch()
                    if (this.v$.$invalid) { return }
                    if (isEqual(this.directIndicator, val)) { return }
                    console.log('saving Indicator...')
                    this.$emit('input', val)
                }, 200)
            },
            deep: true
        }
    },
    mounted () {
        if (this.lazyIndicator) {
            // console.log('-->', this.$refs)
            //  this.$refs.indicatorname.$el.focus()
        }
    },
    created () {
    },
    setup: () => ({ v$: useVuelidate() }),
    validations: {
        lazyIndicator: {
            key: { required },
            datatype: { required },
            name: { required, maxLength: maxLength(120) }
        }
    },
    methods: {
        changeDataTypeComponent (e) {
            console.log(e)
            const datatypesWithOptions = ['boolean', 'singlechoice', 'multiplechoice']
            if (!datatypesWithOptions.includes(e.value)) {
                this.lazyIndicator.options = []
            } else if (!this.lazyIndicator.options.length) {
                this.lazyIndicator.options = [
                    { text: 'Option 1', order: 1 },
                    { text: 'Option 2', order: 2 }
                ]
            }
        },
        addOption () {
            this.lazyIndicator.options.push({ text: `option ${this.lazyIndicator.options.length + 1}`, order: this.lazyIndicator.options.length + 1 })
        },
        deleteOption (option) {
            if (this.lazyIndicator.options && this.lazyIndicator.options.length > 2) {
                console.log('check', option)
                this.lazyIndicator.options = this.lazyIndicator.options.filter(choice => choice.text !== option.text)
            }
        },
        removeIndicator () {
            this.$emit('delete', this.directIndicator)
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
