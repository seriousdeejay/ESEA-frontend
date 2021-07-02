<template>
    <!--
        uiComponent: field, line, textBox, checkBox, dropDown, radioButton
        datatype: Text, Integer, Double, Date, Boolean, SingleChoice, MultipleChoice

    -->
    <div class="p-p-0 p-my-0 p-text-left p-d-flex p-ai-center">
        {{indicator.datatype}}
        <span class="p-mr-2"> {{indicator.pre_unit}} </span>
        <!-- <InputText v-if="uiComponent === 'field'" type="text" v-model="lazyValue" :disabled="readonly" required /> -->
        <!-- Field
                - Text
                - Integer
                - Double
                - Date
        -->
        <!-- Line -->
        <!-- Textbox -->
        <div v-if="uiComponent === 'field'">
            <div v-if="indicator.datatype === 'text'">

            </div>
            <div v-if="indicator.datatype === 'integer'" >
                <InputNumber v-model="lazyValue" :disabled="readonly" required  />
                <!-- <input type="number" step="1" v-model="lazyValue" :disabled="readonly" required /> -->
            </div>
            <div v-if="indicator.datatype === 'double'">
            </div>
            <div v-if="indicator.datatype === 'date'">
                <input type="date" v-model="lazyValue" :disabled="readonly" required />
            </div>
        </div>

        <div v-if="uiComponent === 'line'" style="width: 100%;">
            <input type="text" v-model="lazyValue" :disabled="readonly" required style="width: 100%;" />
        </div>

        <Textarea v-if="uiComponent === 'textBox'" id="description" v-model="lazyValue" :disabled="readonly" autoResize="true" rows="3" />

        <div v-if="uiComponent === 'radioButton'">
            <div v-for="(option, index) in options" :key="`${index}-option`" class="p-field-radiobutton">
                <RadioButton :id="`${index}-option`" name="option" :value="option[optionValueKey]" v-model="lazyValue" :disabled="readonly" required/>
                <label :for="`${index}-option`" class="p-text-left">{{option[optionTextKey]}}</label>
            </div>
        </div>

        <div v-if="uiComponent === 'checkBox'">
            <div v-for="(option, index) in options" :key="`${index}-option`" class="p-field-checkbox">
                <Checkbox :id="`${index}-option`" name="option" :value="option[optionValueKey]" v-model="lazyValue" :disabled="readonly" required/>
                <label :for="`${index}-option`" class="p-text-left">{{option[optionTextKey]}}</label>
            </div>
        </div>

        <div v-if="uiComponent === 'dropDown'">
            <div></div>
        </div>

        <span class="p-ml-2">{{indicator.post_unit}}</span>
    </div>
</template>

<script>
    import { QUESTION_TYPES } from '../../utils/constants'

export default {
    model: {
        prop: 'value',
        event: 'input'
    },
    props: {
        value: {
            type: [String, Number, Array],
            default: undefined
        },
        required: {
            type: Boolean,
            default: false
        },
        indicator: {
            type: Object
        },
        type: {
            type: String,
            default: 'text'
            // validator: v => Object.values(QUESTION_TYPES).includes(v)
        },
        uiComponent: {
            type: String
        },
        options: {
            type: Array,
            default: () => ([])
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
        },
        checkanswerrequired: {
            type: Boolean,
            default: undefined
        }
    },
    data () {
        return {
            lazyValue: [],
            completedBool: this.checkanswerrequired,
            questionTypes: QUESTION_TYPES
        }
    },
    computed: {
        // parsedType() {
		// 	return this.type.toLowerCase();
		// },
    },
    watch: {
        // value (val) {
            // if (val !== this.lazyValue) {
                // console.log('ddd', val)
                // console.log(this.value)
                // console.log(this.lazyValue)
                // this.lazyValue = this.type === this.questionTypes.CHECKBOX ? this.splitValue(val) : val
            // }
        // },
        lazyValue (val) {
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
            console.log('mmm', val)
            //
            if ((val === 'undefined') || (val === this.value)) {
                console.log('dd')
                return
            }
            if (!Array.isArray(val)) {
               this.$emit('input', [val])
               return
            }

            if (typeof (val || val[0]) === 'undefined') {
                console.log('zz')
                return
            }
            console.log('sss', val)
			this.$emit('input', val)
        }
    },
    created () {
        if (this.type === this.questionTypes.RADIO) {
            console.log('----', this.value)
            try {
                this.lazyValue = this.value[0]
            } catch {
                this.lazyValue = null
        }
        console.log(this.lazyValue)
        } else {
        this.lazyValue = this.value
        }
        // console.log(this.options)
        // console.log(this.value)
        // console.log(this.lazyValue)
        // if (this.type === this.questionTypes.CHECKBOX) {
            // this.lazyValue = this.splitValue(this.lazyValue)
        // }
    }
    // methods: {
    //     splitValue (value) {
    //         console.value('sss', value)
    //         return value ? value.split(',') : value
    //     }
    // }
}
</script>
