<template>
        <form ref="form" class="p-grid p-px-5 p-py-5 p-fluid p-input-filled" :style="cssProps" style="background-color: #F1F1F1;" >
            <!-- {{question}}<hr>
            {{lazyQuestion}} -->
            <div class="p-col-12 p-m-0 p-field">
                <span class="p-float-label">
                    <InputText id="questionname" type="text" v-model="lazyQuestion.name"  :class="{'borderless': nameErrors.length}"  @blur="v$.lazyQuestion.name.$touch()" :disabled="!active" />
                    <label for="questionname">Question</label>
                </span>
                <div class="p-error p-text-italic" v-for="error in nameErrors" :key="error"><small>{{error}}</small></div>
            </div>

            <div class="p-grid p-col-12 p-mx-0 p-px-0" >
                 <!-- <div class="p-col-4">
                    <span class="p-float-label">
                        <InputText id="questionkey" type="text" v-model="lazyQuestion.key"  :class="{'borderless': keyErrors.length}"  @blur="questionKeyFilter(lazyQuestion.key)" :disabled="!active" />
                        <label for="questionkey">Question Key</label>
                    </span>
                    <div class="p-error p-text-italic" v-for="error in keyErrors" :key="error"><small>{{error}}</small></div>
                </div> -->
                <div class="p-col-6">
                    <ToggleButton v-model="lazyQuestion.isMandatory" onLabel="Required answer" offLabel="Optional Answer" :disabled="!active" /> <!--  onIcon="pi pi-check" offIcon="pi pi-times" -->
                </div>
                <div class="p-col-6">
                    <Dropdown v-model="lazyQuestion.uiComponent" :options="uiComponentsList" optionLabel="text" optionValue="value" placeholder="Select ui Component..." @change="changeUIComponent" :disabled="!active" />
                </div>
            </div>

            <template v-if="active">
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
                <Button v-if="!lazyQuestion.direct_indicator.length" label="Add Indicator" class="p-button-outlined" @click="addIndicator" />
                <div v-else class="p-col-12 p-pt-5" style="border: 1px solid lightgrey;">
                    <!-- <p class="p-col-12 p-text-bold p-text-center">Direct Indicator</p> style="border: 1px solid lightgrey; background-color: #F7F7F7;"-->
                    <div class="p-grid p-col-12 p-pb-3" >
                        <div class="p-col-5">
                            <span class="p-float-label">
                                <InputText id="questionkey" type="text" v-model="lazyQuestion.direct_indicator[0].key"  :class="{'borderless': keyErrors.length}"  @blur="questionKeyFilter(lazyQuestion.direct_indicator[0].key)" :disabled="!active" />
                                <label for="questionkey">Question Key</label>
                            </span>
                            <div class="p-error p-text-italic" v-for="error in keyErrors" :key="error"><small>{{error}}</small></div>
                        </div>
                        <div class="p-col-5">
                            <Dropdown v-model="lazyQuestion.direct_indicator[0].datatype" :options="dataTypesList" optionLabel="text" optionValue="value" placeholder="Select datatype..." @change="changeDataTypeComponent" :disabled="!active" />
                        </div>
                        <Button label="Delete Indicator" class="p-col p-button-danger p-button-text" @click="deleteIndicator" />
                        <div class="p-col-12 p-m-1 p-field">
                            <span class="p-float-label">
                                <InputText id="indicatorname" type="text" v-model="lazyQuestion.direct_indicator[0].name" />
                                <label for="indicatorname">Name</label>
                            </span>
                        </div>
                            <div class="p-col-12 p-m-1 p-field">
                            <span class="p-float-label">
                                <InputText id="indicatordescription" type="text" v-model="lazyQuestion.direct_indicator[0].description" />
                                <label for="indicatordescription">Description</label>
                            </span>
                        </div>
                        <div v-if="lazyQuestion.direct_indicator[0].datatype && datatypeWithoutOptions" class="p-col-12 p-grid p-m-0 p-p-0">
                            {{datatypesWithoutOptions}}
                            <div class="p-col-6">
                                <span class="p-float-label">
                                    <InputText id="pre_unt" type="text" v-model="lazyQuestion.direct_indicator[0].pre_unit" />
                                    <label for="pre_unit">pre unit</label>
                                </span>
                            </div>
                            <div class="p-col-6">
                                <span class="p-float-label">
                                    <InputText id="post_unit" type="text" v-model="lazyQuestion.direct_indicator[0].post_unit" />
                                    <label for="post_unit">post unit</label>
                                </span>
                            </div>
                        </div>
                        <div v-if="lazyQuestion.direct_indicator[0].datatype && !datatypeWithoutOptions" class="p-grid p-col-12 p-mx-0 p-px-0"> <!-- v-if="active && lazyQuestion.direct_indicator[0].options && lazyQuestion.direct_indicator[0].options.length" -->
                            <option-form v-for="(option, index) in lazyQuestion.direct_indicator[0].options" :key="`option-${index}`" :option="option" @delete="deleteOption(option)" />
                            <Button label="Add Option" class="p-button-text" @click="newOption" />
                        </div>
                    </div>
                    <!-- <div v-if="active && lazyQuestion.answertype === 'NUMBER'" class="p-grid p-col-12 p-mx-0 p-px-0">
                        <div class="p-col-4">
                            <span class="p-float-label">
                                <InputText id="minvalue" type="number" v-model="lazyQuestion.min_number" />
                                <label for="minvalue">Minimum</label>
                            </span>
                        </div>
                        <div class="p-col-6">
                            <span class="p-float-label">
                                <InputText id="defaultvalue" type="number" v-model="lazyQuestion.default" />
                                <label for="defaultvalue">Default</label>
                            </span>
                        </div>
                        <div class="p-col-6">
                            <span class="p-float-label">
                                <InputText id="maxvalue" type="number" v-model="lazyQuestion.max_number" />
                                <label for="maxvalue"><small>Maximum</small></label>
                            </span>
                        </div>
                    </div> -->
                </div>
            </template>
        </form>
        <!-- <div v-else class="p-grid p-jc-center p-ai-center p-px-5" :style="cssProps">
            <i class="pi pi-question p-col-1" style="fontSize: 2rem"></i>
            <div class="p-col-11">
            <p><span class="p-text-bold">Question:</span> {{ question.name }}</p>
            <div class="p-d-flex p-jc-between p-mr-5 p-pr-5">
            <p><span class="p-text-bold">Key:</span> {{ question.key }}</p>
            <p><span class="p-text-bold">Type:</span> {{ questionType }}</p>
            </div>
            </div>
            <Divider />
            <div v-if="!question.options.length" class="p-d-flex p-jc-between p-col-10">
                <p v-if="question.min_number"><span class="p-text-bold">Minimum:</span> {{ question.min_number }}</p>
                <p><span class="p-text-bold">Default:</span> {{ question.default }}</p>
                <p v-if="question.max_number"><span class="p-text-bold">Maximum:</span> {{ question.max_number }}</p>
            </div>
            <template v-else>
                <div v-for="(option, index) in question.options" :key="index" class="p-field-checkbox p-col-12">
                    <Checkbox :id="index" name="option" :value="text" v-model="ss" />
                    <label :for="index"><span class="p-text-bold">Text:</span> '{{option.text}}'<span class="p-text-bold"> - Value:</span> '{{option.value}}'</label>
                </div>
            </template>
        </div> -->
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import useVuelidate from '@vuelidate/core'
import { QUESTION_TYPES, DATA_TYPES, UI_COMPONENTS } from '../../utils/constants'
// import HandleValidationErrors from '../../utils/HandleValidationErrors'
import { isEqual, cloneDeep } from 'lodash'
import { required, maxLength } from '../../utils/validators'
import Dropdown from 'primevue/dropdown'
import OptionForm from '../../components/forms/OptionForm'

export default {
    components: {
        OptionForm,
        Dropdown
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
            lazyQuestion: cloneDeep(this.question) || { },
            questionTypes: QUESTION_TYPES,
            dataTypes: DATA_TYPES,
            uiComponents: UI_COMPONENTS,
            indicator: false,
            datatypeWithoutOptions: false
        }
    },
    computed: {
        ...mapGetters('question', ['getValidQuestionKeyNumber']),
        dataTypesList () {
            return Object.entries(this.dataTypes).map(([text, value]) => ({ text, value }))
        },
        uiComponentsList () {
            return Object.entries(this.uiComponents).map(([text, value]) => ({ text, value }))
        },
        questionType () {
            return this.questionTypesList.find(type => type.value === this.lazyQuestion.answertype).text
        },
        keyErrors () {
            return false
        //     return HandleValidationErrors(this.v$.lazyQuestion.key, this.errors.key)
        },
        nameErrors () {
            return false
        //     return HandleValidationErrors(this.v$.lazyQuestion.name, this.errors.name)
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
            console.log('reee')
            this.lazyQuestion = cloneDeep(val)
        },
        lazyQuestion: {
            handler (val) {
                setTimeout(() => {
                    console.log('saving...', val)
                // if (this.v$.$invalid) { return }
                if (this.lazyQuestion.direct_indicator.length) {
                    if (this.lazyQuestion.direct_indicator?.[0].options.length) {
                        this.lazyQuestion.direct_indicator[0].options.forEach((option, index) => { option.order = index + 1 })
                    }
                }
                // if (val) { return }
                if (isEqual(this.question, val)) { return }
                console.log('+++', val)
                this.$emit('input', val) // cloneDeep(val)
                }, 200)
            },
            deep: true
        },
        active (val) {
            if (!val) {
                this.v$.$touch()
            } else {
                this.$nextTick(() => this.$refs.input && this.$refs.input.focus())
            }
        }
    },
    mounted () {
        if (!this.lazyQuestion.name) {
            this.$refs.input.focus()
        }
    },
    created () {
        this.initialize()
    },
    setup: () => ({ v$: useVuelidate() }),
    validations: {
        lazyQuestion: {
            name: { required, maxLength: maxLength(120) }
        }
    },
    methods: {
        ...mapActions('directIndicator', ['deleteDirectIndicator']),
        initialize () {
            if (!this.lazyQuestion.key && !this.lazyQuestion.name) {
                this.lazyQuestion.key = `direct_indicator_${this.getValidQuestionKeyNumber}`
                this.lazyQuestion.name = `question_${this.getValidQuestionKeyNumber}`
            }
            // if (!this.lazyQuestion.options) {
            //     this.lazyQuestion.options = []
            // }
        },
        updateName () {
            this.v$.lazyQuestion.name.$touch()
        },
        changeQuestionType (e) {
            this.lazyQuestion.answertype = e.value
            const typesWithOptions = ['RADIO', 'CHECKBOX']
            if (typesWithOptions.includes(e.value) && !this.lazyQuestion.options.length) {
                this.lazyQuestion.options = [
                    { text: 'option 1', value: 1 },
                    { text: 'option 2', value: 2 }
                ]
            } else if (!typesWithOptions.includes(e)) {
                this.lazyQuestion.options = []
            }
        },
        changeUIComponent (e) {
            // this.lazyQuestion.uiComponent = e.value
            // const typesWithOptions.includes
        },
        changeDataTypeComponent (e) {
            const datatypesWithOptions = ['Boolean', 'SingleChoice', 'MultipleChoice']
            if (!datatypesWithOptions.includes(e.value)) {
                this.datatypeWithoutOptions = true
                this.lazyQuestion.direct_indicator[0].options = []
            } else if (datatypesWithOptions.includes(e.value)) {
                this.datatypeWithoutOptions = false
                if (!this.lazyQuestion.direct_indicator[0].options.length) {
                this.lazyQuestion.direct_indicator[0].options = [
                    { text: 'Option 1', order: 1 },
                    { text: 'Option 2', order: 2 }
                ]
                }
            }
        },
        addIndicator () {
            this.lazyQuestion.direct_indicator = []
            const baseDirectIndicator = { key: '', name: 'new direct indicator', description: '', isMandatory: true, pre_unit: '', post_unit: '', options: [] }
            this.lazyQuestion.direct_indicator.push(baseDirectIndicator)
        },
        async deleteIndicator () {
            const indicator = this.lazyQuestion.direct_indicator?.[0]
            this.lazyQuestion.direct_indicator = []
            await this.deleteDirectIndicator({ mId: indicator?.method, id: indicator?.id })
        },
        // addDirectIndicator () {
        //     this.addNewDirectIndicator({ topic: this.activeTopic.id, question: this.activeQuestion.id })
        // },
        newOption () {
            this.lazyQuestion.direct_indicator[0].options.push({ text: `option ${this.lazyQuestion.direct_indicator[0].options.length + 1}`, order: this.lazyQuestion.direct_indicator[0].options.length + 1 })
        },
        deleteOption (event) {
            if (this.lazyQuestion.direct_indicator[0].options && this.lazyQuestion.direct_indicator[0].options.length > 2) {
                this.lazyQuestion.direct_indicator[0].options = this.lazyQuestion.direct_indicator[0].options.filter(option => option !== event)
            }
        },
        questionKeyFilter (val) {
            console.log(val)
            if (val.includes(' ')) {
                this.lazyQuestion.key = val.replace(' ', '_')
            }
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
