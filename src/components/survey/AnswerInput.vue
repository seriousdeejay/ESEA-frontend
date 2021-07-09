<template>
    <!--
        uiComponent: field, line, textBox, checkBox, dropDown, radioButton
        datatype: Text, Integer, Double, Date, Boolean, SingleChoice, MultipleChoice

    -->
    <div class="p-p-0 p-my-3 p-text-left p-d-flex p-ai-center p-fluid p-input-filled">
        <span class="p-mr-2"> {{indicator?.pre_unit}} </span>
        <div v-if="uiComponent === 'field'">
            <div v-if="indicator.datatype === 'Text'">
            </div>
            <div v-if="indicator.datatype === 'Integer'" >
                <InputNumber class="inputnumber" v-model="lazyValue" :disabled="readonly" required style="border: none;" @focus="focusedField()" />
                <!-- <input type="number" step="1" v-model="lazyValue" :disabled="readonly" required /> -->
            </div>
            <div v-if="indicator.datatype === 'Double'">
                <InputNumber class="inputnumber" v-model="lazyValue" mode="decimal" :minFractionDigits="2" :maxFractionDigits="5" :disabled="readonly" required style="border: none;" @focus="focusedField()" />
            </div>
            <div v-if="indicator.datatype === 'Date'">
                <input type="date" v-model="lazyValue" :disabled="readonly" required />
            </div>
        </div>

        <div v-if="uiComponent === 'line'" style="width: 100%;">
            <input type="text" v-model="lazyValue" :disabled="readonly" required style="width: 100%;" />
        </div>

        <Textarea v-if="uiComponent === 'textbox'" id="description" v-model="lazyValue" :disabled="readonly" autoResize="true" rows="3" />

        <div v-if="uiComponent === 'radiobutton'">
            <div v-for="(option, index) in indicator.options" :key="`${index}-option`" class="p-field-radiobutton">
                <RadioButton :id="`${index}-option`" name="option" :value="option[optionValueKey]" v-model="lazyValue" :disabled="readonly" required @focus="focusedField()" />
                <label :for="`${index}-option`" class="p-text-left">{{option[optionTextKey]}}</label>
            </div>
        </div>

        <div v-if="uiComponent === 'checkbox'">
            <div v-for="(option, index) in indicator.options" :key="`${index}-option`" class="p-field-checkbox">
                <Checkbox :id="`${index}-option`" name="option" :value="option[optionValueKey]" v-model="lazyValue" :disabled="readonly" required/>
                <label :for="`${index}-option`" class="p-text-left">{{option[optionTextKey]}}</label>
            </div>
        </div>

        <div v-if="uiComponent === 'dropdown'" style="width: 100%;">
            <Dropdown v-model="lazyValue" :options="indicator.options"  optionLabel="text" optionValue="text" placeholder="Select option"  style="width: 100%" />
        </div>

        <span class="p-ml-2">{{indicator?.post_unit}}</span>
    </div>
</template>

<script>
    // import { QUESTION_TYPES } from '../../utils/constants'
    import Dropdown from 'primevue/dropdown'

export default {
    model: {
        prop: 'value',
        event: 'input'
    },
    components: {
        Dropdown
    },
    props: {
        value: {
            type: [String, Number, Array, Boolean],
            default: null
        },
        // required: {
        //     type: Boolean,
        //     default: false
        // },
        indicator: {
            type: Object,
            default: () => { return { } }
        },
        uiComponent: {
            type: String
        },
        optionTextKey: {
            type: String,
            default: 'text'
        },
        optionValueKey: {
            type: String,
            default: 'value'
        },
        readonly: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            lazyValue: null
        }
    },
    watch: {
        value () {
            this.getValues()
        },
        lazyValue (val) {
            console.log('cheeeck', val)
            if ((val === 'undefined') || (val === this.value)) {
                console.log('value is undefined or same as this.value')
                return
            }
            if (!Array.isArray(val)) {
               this.$emit('input', [val])
               return
            }

            if (typeof (val || val[0]) === 'undefined') {
                return
            }

			this.$emit('input', val)
        }
    },
    created () {
        console.log('this vlaue', this.value)
        this.getValues()
    },
    methods: {
        focusedField () {
            this.$emit('focuscheck', true)
        },
        getValues () {
            if (
                !this.value ||
                this.value[1] === null ||
                (!this.value[0].length && this.value[1] === '') ||
                this.value[0] === this.lazyValue ||
                this.value[1] === this.lazyValue
                ) {
                    return
                }

            if (this.value) {
                if (this.indicator.datatype === 'integer') {
                    this.lazyValue = parseInt(this.value[1]) || null
                }
                if (this.indicator.datatype === 'double') {
                    this.lazyValue = parseFloat(this.value[1]) || null
                }
                const questionWithSingleChoices = ['singleChoice', 'boolean']
                if (questionWithSingleChoices.includes(this.indicator.datatype)) {
                    this.lazyValue = this.value[1] || null
                }
                if (this.indicator.datatype === 'multipleChoice') {
                    this.lazyValue = this.value[0] || null
                }
            }
        }
    }
    // type: {
    //     type: String,
    //     default: 'text'
    //     // validator: v => Object.values(QUESTION_TYPES).includes(v)
    // },
    // if (this.lazyValue !== this.value) {
    //     this.lazyValue = this.value[1]
    // }
    // console.log(this.value)
    // if (this.value) {
    //     try {
    //         this.lazyValue = parseInt(this.value[1])
    //     } catch {
    //         this.lazyValue = this.value[1]
    //     }
        // this.lazyValue = this.type === this.questionTypes.CHECKBOX ? this.splitValue(val) : val
    // }

    // if (this.type === this.questionTypes.RADIO) {
    //     console.log('----', this.value)
    //     try {
    //         this.lazyValue = this.value[1]
    //     } catch {
    //         this.lazyValue = null
    // }
    // console.log(this.lazyValue)
    // } else {
    // this.lazyValue = this.value
    // }
    // console.log(this.options)
    // console.log(this.value)
    // console.log(this.lazyValue)
    // if (this.type === this.questionTypes.CHECKBOX) {
        // this.lazyValue = this.splitValue(this.lazyValue)
    // }
    // methods: {
    //     splitValue (value) {
    //         console.value('sss', value)
    //         return value ? value.split(',') : value
    //     }
    // }
    // lazyvalue watch
    // console.log(this.lazyValue)

    // if (this.type === this.questionTypes.RADIO)

    // if (this.type === this.questionTypes.CHECKBOX) {
    // console.log('==========', val)
    // const checked = this.splitValue(this.value)
    // console.log('>>>>>>', checked)
    // if (!val.length) {
    // this.lazyValue = checked
    // console.log(this.lazyValue)
    //    return
    // }
    // if (val === checked) return
    // }
    // <!-- <InputText v-if="uiComponent === 'field'" type="text" v-model="lazyValue" :disabled="readonly" required /> -->
    // <!-- Field
    //     - Text
    //     - Integer
    //     - Double
    //     - Date
    // -->
    // <!-- Line -->
    // <!-- Textbox -->
}
</script>

// <style lang="scss" scoped>
//     .p-inputtext {
//         border: 0px solid black;
//         border-bottom: 1px solid lightgrey;
//     }
// </style>
