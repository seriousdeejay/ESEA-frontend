<template>
    <div class="" >
        <!-- <i class="pi pi-percentage p-col-1 p-text-center" style="fontSize: 3rem; color: grey;"></i> p-grid p-m-5 p-px-2 p-d-flex p-ai-center -->
        <form v-if="active" ref="form" class="p-grid p-fluid p-input-filled p-m-3 p-px-5 p-pb-3 p-text-center" :style="[(active) ? 'border: 2px solid #9ecaed;':'border: 1px solid lightgrey;', (valid) ? '':'border: 2px solid rgba(255, 0, 0, 0.3)', (hover) ? 'background-color: white;':'background-color: #F2F2F2;']" @mouseover="hover=true" @mouseleave="hover=false">
            {{v$.lazyIndirectIndicator.$invalid}} {{lazyIndirectIndicator}} {{errors}}
            <div class="p-d-flex p-col-12">
                <h3 class="p-col p-text-cente">Indirect Indicator</h3>
                <div class="p-d-flex p-ai-center p-jc-end">
                    <i class="pi pi-trash p-mx-5" style="font-size: 30px; color: red; cursor: pointer;" @click="removeIndicator()" />
                    <i class="pi pi-ellipsis-v" style="font-size: 30px; cursor: not-allowed;" />
                </div>
            </div>
            <div class="p-grid p-col-12 p-mx-0 p-px-0 p-text-left">
                <div class="p-col-6 p-field p-my-2">
                    <span class="p-float-label">
                        <InputText id="calculationkey" ref="keyinput" type="text" v-model="lazyIndirectIndicator.key"  :class="{'borderless': keyErrors.length}"  @blur="updateName" :disabled="!active" />
                        <label for="calculationkey">indicator Key</label>
                    </span>
                    <div class="p-error p-text-italic" v-for="error in keyErrors" :key="error">{{error}}</div>
                </div>
                <div class="p-col-6 p-field p-my-2">
                    <Dropdown v-model="formulaType" :options="formulaTypeOptions" optionLabel="type" optionValue="type" placeholder="Select Formula Type" class="p-text-center" />
                </div>
                <div class="p-col-12 p-field p-my-2">
                    <span class="p-float-label">
                        <InputText id="calculationame" type="text" v-model="lazyIndirectIndicator.name" :class="{'borderless': nameErrors.length}" :disabled="!active" />
                        <label for="calculationname">Name</label>
                    </span>
                    <div class="p-error p-text-italic p-pt-1" v-for="error in nameErrors" :key="error">{{error}}</div>
                </div>
            </div>
            <div v-if="active" class="p-col-12 p-field">
                <span class="p-float-label">
                    <InputText id="calculationdescription" type="text" v-model="lazyIndirectIndicator.description" :disabled="!active" />
                    <label for="calculationdescription">Description</label>
                </span>
            </div>

            <div  v-if="active" class="p-col-12">
                <p class="p-mr-3">Formula</p>
                <Divider />
                <expression-form v-if="formulaType === 'Calculation'" :formula="lazyIndirectIndicator.formula" :assignment="true" @expression="updateFormula" />
                <formula-form-3 v-if="formulaType === 'Conditionals'" />
                <div v-if="(formulaType === 'Average' || formulaType === 'Sum')" class="p-d-flex p-ai-center p-ml-5">
                    <span v-if="formulaType === 'Average'">Average of</span><span v-if="formulaType === 'Sum'">Sum of</span>
                    <Dropdown id="questionuicomponent" class="p-ml-2" v-model="indicator" :options="indicators" optionLabel="key" optionValue="key" placeholder="Select Indicator"  />
                </div>
                <div class="p-error p-text-italic p-pt-1" v-for="error in formulaErrors" :key="error">{{error}}</div>
            </div>
    <!-- <formula-form-2 v-if="formulaType === 'Conditionals2'" class="p-col-12 p-m-2" /> -->
    <!-- <div id="formulaform" class="p-col-12"><formula-form :type="formulaType" :indicatorkey="lazyIndirectIndicator.key" /></div> -->
            <!-- <div class="p-col-12 p-field">
                <span class="p-float-label">
                    <InputText id="calculationformula" ref="calculationinput" type="text" v-model="lazyIndirectIndicator.formula" :class="{'borderless': formulaErrors.length}" @blur="updateFormula" :disabled="!active" />
                    <label for ="calculationformula">Formula</label>
                </span>
                <div class="p-error p-text-italic p-pt-1" v-for="error in formulaErrors" :key="error">{{error}}</div>
            </div> -->
        </form>
        <calculation-card v-if="!active" :keyy="indirectIndicator.key" :name="indirectIndicator.name" :formula="indirectIndicator.formula" :valid="valid" :hover="hover" @mouseover="hover=true" @mouseleave="hover=false" />
    </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import useVuelidate from '@vuelidate/core'
import HandleValidationErrors from '../../utils/HandleValidationErrors'
import { required, maxLength } from '../../utils/validators'
import { isEqual, cloneDeep } from 'lodash'
// import FormulaForm from '@/components/forms/FormulaForm'
// import FormulaForm2 from '@/components/forms/FormulaForm2'
import CalculationCard from '@/components/cards/CalculationCard'
import FormulaForm3 from '@/components/forms/FormulaForm3'
import ExpressionForm from '@/components/forms/ExpressionForm'
import Dropdown from 'primevue/dropdown'

export default {
    components: {
        // FormulaForm,
        // FormulaForm2,
        CalculationCard,
        FormulaForm3,
        ExpressionForm,
        Dropdown
    },
    props: {
        indirectIndicator: {
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
    setup: () => ({ v$: useVuelidate() }),
    validations: {
        lazyIndirectIndicator: {
            key: { required },
            name: { required, maxLength: maxLength(255) },
            formula: { required }
        }
    },
    data () {
        return {
            tab: null,
            lazyIndirectIndicator: { ...this.indirectIndicator }, // cloneDeep(this.indirectIndicator) || {} //,
            formulaType: 'Calculation',
            formulaTypeOptions: [
                { type: 'Calculation' },
                { type: 'Conditionals' },
                { type: 'Average' },
                { type: 'Sum' }
                ],
            indicator: null,
            hover: false
        }
    },
    computed: {
        ...mapGetters('indirectIndicator', ['getValidIndirectIndicatorNumber']),
        ...mapState('directIndicator', ['directIndicators']),
        ...mapState('indirectIndicator', ['indirectIndicators', 'indirectIndicator', 'errors']),
        indicators () {
            const selectableIndirectIndicators = this.indirectIndicators.filter(item => item.id !== this.indirectIndicator.id)
            return this.directIndicators.concat(selectableIndirectIndicators)
        },
        keyErrors () {
            return HandleValidationErrors(
                this.v$.lazyIndirectIndicator.key,
                this.errors.key
            )
        },
        nameErrors () {
            return HandleValidationErrors(
                this.v$.lazyIndirectIndicator.name,
                this.errors.name
            )
        },
        formulaErrors () {
            return HandleValidationErrors(
                this.v$.lazyIndirectIndicator.formula,
                this.errors.formula
            )
        },
        valid () {
            return (!this.v$.lazyIndirectIndicator.$invalid && (this.lazyIndirectIndicator.id > 0))
        }
        // cssProps () {
        //     const props = { border: '1px solid lightgrey' }
        //     if (this.active) {
        //         props.border = '2px solid #9ecaed'
        //         props['background-color'] = '#f7f7f7' // '#d0dfff' // '#E1E8ED' // '#DFE3EE' // '#CCD6DD' // '#E1E8ED' // '#cfe0e8' // '#fbfbfb'
        //     }
        //     return props
        // }
    },
    watch: {
        indirectIndicator (val) {
            if (!isEqual(this.lazyIndirectIndicator, val)) {
                // if (this.lazyIndirectIndicator.formula !== val.formula) {
                //     this.$refs.calculationinput.focus()
                // }
                console.log('updating lazy object')
                this.lazyIndirectIndicator = cloneDeep(val) // { ...val }
            }
        },
        lazyIndirectIndicator: {
            handler (val) {
                setTimeout(() => {
                console.log('>', this.indirectIndicator)
                console.log('check', this.indirectIndicator, val)

                if (this.v$.$invalid) { return }
                console.log('check2')
                if (isEqual(this.indirectIndicator, val)) { return }
                console.log('check3')
                console.log('-------', val)
                this.$emit('input', cloneDeep(val))
                }, 500)
            },
            deep: true
        },
        active () {
            this.v$.lazyIndirectIndicator.$touch()
            // if (!val) {
            //     this.v$.$touch()
            // } else {
            //     this.$nextTick(() => this.$refs.input && this.$refs.input.focus())
            // }
        }
    },
    mounted () {
        if (!this.lazyIndirectIndicator.name) {
        }
    },
    created () {
        this.initialize()
    },
    methods: {
        initialize () {
            if (!this.lazyIndirectIndicator.key) {
                this.lazyIndirectIndicator.key = `indirect_indicator_${this.getValidIndirectIndicatorNumber}`
            }
            if (!this.lazyIndirectIndicator.name) {
                this.lazyIndirectIndicator.name = `indirect_indicator_${this.getValidIndirectIndicatorNumber}`
            }
            if (!this.lazyIndirectIndicator.formula) {
                this.lazyIndirectIndicator.formula = ''
            }
        },
        updateName () {
            this.v$.lazyIndirectIndicator.name.$touch()
        },
        // updateFormula () {
        //     this.v$.lazyIndirectIndicator.formula.$touch()
        // },
        updateFormula (formula) {
            console.log('=====')
            this.lazyIndirectIndicator.formula = formula
        },
        removeIndicator () {
            console.log('removed another one...')
            this.$emit('delete', this.indirectIndicator)
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
