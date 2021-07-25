<template>
    <form ref="form" class="p-shadow-1 p-grid p-m-0 p-p-5 p-fluid p-input-filled" style="border-radius: 5px;" :style="[(!v$.lazyQuestion.$invalid && lazyQuestion.id > 0) ? 'border: 1px solid #00695C;': 'border: 1px solid rgba(255, 0, 0, 0.3);']" >
        <template v-if="active" class="p-grid p-col-12 p-m-0">
            <div class="p-col-8 p-m-0 p-my-1 p-field">
                <span class="p-float-label">
                    <InputText ref="questionname" id="questionname" type="text" v-model="lazyQuestion.name"  :class="{'borderless': nameErrors.length }"  @blur="v$.lazyQuestion.name.$touch()" :disabled="!active" /> <!-- nameErrors.length -->
                    <label for="questionname">Question</label>
                </span>
                <div class="p-error p-text-italic" v-for="error in nameErrors" :key="error"><small>{{error}}</small></div>
            </div>
            <div class="p-col-4">
                <span class="p-float-label">
                    <Dropdown id="questionuicomponent" v-model="lazyQuestion.uiComponent" :options="uiComponentsList" optionLabel="text" optionValue="value" :class="{'p-invalid': uiComponentErrors.length}" @change="changeUIComponent" :disabled="!active" />
                    <label v-if="active" for="questionuicomponent">Select ui Component...</label>
                </span>
            </div>

                <div class="p-col-12 p-m-1 p-field">
                    <span class="p-float-label">
                        <InputText id="questiondescription" type="text" v-model="lazyQuestion.description" :disabled="!active" />
                        <label for="questiondescription">Description</label>
                    </span>
                </div>

                <div class="p-col-12 p-m-1 p-field">
                    <span class="p-float-label">
                        <InputText id="questioninstruction" type="text" v-model="lazyQuestion.instruction" :disabled="!active" />
                        <label for="questioninstruction">Instruction</label>
                    </span>
                </div>

            <Divider />
            <div class="p-col-12 p-d-flex p-ai-center p-jc-end">
                <!-- <Button v-if="lazyQuestion.direct_indicator.length" label="Drag Indicator" class="p-button-outlined p-col" @click="addIndicator" /> -->
                <h3 v-if="!lazyQuestion.direct_indicator.length" class="p-col p-text-center p-text-italic p-text-light" style="border: 3px dashed rgba(192,192,192,0.7); background-color:rgba(192,192,192,0.25); height: 50px; color: grey; padding: auto;"  @drop='onDrop($event)'  @dragover.prevent @dragenter.prevent >{{ this.lazyQuestion.direct_indicator?.[0]?.key || 'Add Indicator by dragging it into the box' }}</h3>
                <div v-else class="p-col p-d-flex p-ai-center"><h3 class="p-col p-text-center p-text-italic p-text-light" style="border: 3px dashed rgba(192,192,192,0.4); background-color:rgba(192,192,192,0.1); height: 50px; color: black; padding: auto;"  @drop='onDrop($event)'  @dragover.prevent @dragenter.prevent>{{ this.lazyQuestion.direct_indicator?.[0]?.key || 'Add Indicator by dragging it into the box' }}</h3><i class="pi pi-trash p-p-2" style="font-size: 25px; color: red;" @click="deleteIndicator" /></div>
                <div class="p-d-flex p-ai-center p-ml-5"><p class="p-mr-2">Required</p> <InputSwitch v-model="lazyQuestion.isMandatory" style="" /></div>
                <i class="pi pi-trash p-mx-5" style="font-size: 25px; color: red; cursor: not-allowed;" />
                <i class="pi pi-ellipsis-v" style="font-size: 25px; cursor: not-allowed;" />
            </div>
        </template>
        <div v-else>
            <h3 class="p-col-12 p-m-0" v-if="!active"><span class="p-text-light p-mr-5">Question:</span> {{lazyQuestion.name}}</h3>
            <h3 class="p-col-12 p-m-0"><span class="p-text-light p-mr-5">Indicator:</span>   {{lazyQuestion.direct_indicator?.[0]?.key || 'None'}}</h3>
        </div>
    </form>
</template>

<script>
import { mapGetters } from 'vuex'
import useVuelidate from '@vuelidate/core'
import { DATA_TYPES, UI_COMPONENTS } from '../../utils/constants'
import HandleValidationErrors from '../../utils/HandleValidationErrors'
import { isEqual, cloneDeep } from 'lodash'
import { required, maxLength } from '../../utils/validators'
import Dropdown from 'primevue/dropdown'
import InputSwitch from 'primevue/inputswitch'

export default {
    components: {
        Dropdown,
        InputSwitch
    },
    props: {
        question: {
            type: Object,
            required: true
        },
        active: {
            type: Boolean,
            default: false
        },
        errors: {
            type: Object,
            default: () => ({})
        }
    },
    data () {
        return {
            lazyQuestion: cloneDeep(this.question) || {},
            uiComponents: UI_COMPONENTS,
            dataTypes: DATA_TYPES,
            requiredList: [{ name: 'Required', value: true }, { name: 'Optional', value: 'false' }]
        }
    },
    computed: {
        ...mapGetters('question', ['getValidQuestionKeyNumber']),
        uiComponentsList () {
            // if (this.lazyQuestion.direct_indicator?.[0]?.datatype) {
            //     const acceptedUIComponents = this.uiComponents.reduce((result, option) => option.possibleDataTypes.includes(this.lazyQuestion.direct_indicator[0].datatype) ? result.concat({ text: option.text, value: option.value }) : result, []) // Object.entries(this.dataTypes).reduce((result, datatype, {includes(datatype.value)}))
            //     console.log(acceptedUIComponents)
            //     return acceptedUIComponents
            // }
            return this.uiComponents
        },
                nameErrors () {
            return HandleValidationErrors(this.v$.lazyQuestion.name, this.errors.name)
        },
        uiComponentErrors () {
            return HandleValidationErrors(this.v$.lazyQuestion.uiComponent, this.errors.uiComponent)
        },
        cssProps () {
            const props = { border: '1px solid lightgrey' }
            if (this.active) {
                props.border = '2px solid #9ecaed'
                props['background-color'] = '#f7f7f7'
            }
            return props
        }
    },
    watch: {
        question (val) {
            if (isEqual(this.lazyQuestion, val)) { return }
            this.lazyQuestion = cloneDeep(val)
        },
        lazyQuestion: {
            handler (val) {
                setTimeout(() => {
                    this.v$.lazyQuestion.$touch()
                    if (this.v$.$invalid) { return }
                    if (isEqual(this.question, val)) { return }
                    this.$emit('input', val)
                }, 50)
            },
            deep: true
        },
        active (val) {
            if (!val) {
                this.v$.$touch()
            } else {
                this.$nextTick(() => this.$refs.questionname.$el.focus())
            }
        }
    },
    mounted () {
        if (!this.lazyQuestion.name.length) {
            this.$refs.questionname.$el.focus()
        }
    },
    setup: () => ({ v$: useVuelidate() }),
    validations: {
        lazyQuestion: {
            name: { required, maxLength: maxLength(120) },
            uiComponent: { required },
            isMandatory: { required }
        }
    },
    methods: {
        onDrop (evt) {
            const myitem = evt.dataTransfer.getData('draggedItem')
            const parseditem = JSON.parse(myitem)
            delete parseditem.method
            delete parseditem.question
            this.lazyQuestion.direct_indicator = [parseditem]
            console.log('-->', this.lazyQuestion)
        },
        deleteIndicator () {
            this.lazyQuestion.direct_indicator = []
            this.lazyQuestion.direct_indicator = []
            this.lazyQuestion.direct_indicator = []
        }
    }
}
</script>
