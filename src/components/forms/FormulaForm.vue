<template>
    <div class="p-my-5">
        <div v-if="(type === 'Average' || type === 'Sum')" class="p-d-flex p-ai-center p-ml-5">
            <span v-if="type === 'Average'">Average of</span><span v-if="type === 'Sum'">Sum of</span>
            <Dropdown id="questionuicomponent" class="p-ml-2" v-model="indicator" :options="indicatorList" placeholder="Select Indicator"  />
        </div>
        <div v-if="type === 'Conditionals'" class="p-text-bold" style="font-size: 20px;">
            <div class="p-d-flex p-ai-center p-m-2">
                <span style="width: 60px;">If</span>
                <div class="" style="display: flex; flex-wrap: wrap;">
                    <div v-for="(item, key) in formula.if" :key="item" class="p-d-flex p-ai-center p-my-2">
                        <Dropdown v-if="key.slice(-1) !== '0'" class="p-p-0" v-model="formulaFields.first_if.chained" :options="conditionalChainingList" style="width: 70px;" />
                        <conditional-form />
                    </div>
                </div>
                <i class="p-col pi pi-plus Icon" style="color: grey;" @click="addConditional()"/>
            </div>
            <div class="p-d-flex p-ai-center p-m-2">
                <span  style="width: 60px;">Then</span>
                <conditional-form assignment="assignment" :indicator="indicatorkey" />
                <Dropdown v-if="false" v-model="formulaFields.first_if.chained" :options="conditionalChainingList" style="width:70px;" />
                <i class="pi pi-plus Icon" style="color: grey;"/>
                <!-- <div v-if="(formulaEditableFields.first_then || !formulaFields.first_then.indicator_value.assigned_value)" class="p-d-flex p-ai-center conditional"  @mouseleave="formulaEditableFields.first_then=false">
                    <span class="p-mr-2">{{indicatorkey}} = </span>
                    <InputText type="text" v-model="formulaFields.first_then.indicator_value.assigned_value" style="width: 150px;" />
                    <i class="pi pi-times Icon" @click="addConditional()"/>
                </div>
                <div v-else class="conditional" @click="formulaEditableFields.first_then=true">{{indicatorkey}} = {{formulaFields.first_then.indicator_value.assigned_value}}</div> -->
            </div>
            <div class="p-d-flex p-ai-center p-m-2">
                <span  style="width: 60px;">Else</span>
                <conditional-form assignment="assignment" :indicator="indicatorkey" />
            </div>
            <!-- <input id="first_if" v-if="formulaEditableFields.first_if" v-model="formulaFields.first_if" @blur="formulaEditableFields.first_if=false" @keyup.enter="formulaEditableFields.first_if=false" class="p-inputtext" /> -->
            <!-- <div @click="delayedfocus('first_if')">{{formulaFields.first_if}}</div> -->
        </div>
    </div>
</template>
//:class="{'p-invalid': uiComponentErrors.length}" @change="changeUIComponent" :disabled="!active"

<script>
import ConditionalForm from '@/components/forms/ConditionalForm'
import Dropdown from 'primevue/dropdown'

export default {
    components: {
        ConditionalForm,
        Dropdown
    },
    props: {
        type: {
            type: String
        },
        indicatorkey: {
            type: String
        }
    },
    data () {
        return {
            OperatorsList: ['<', '<=', '=', '!=', '>', '>='],
            conditionalChainingList: ['AND', 'OR'],
            indicator: null,
            indicatorList: ['Indicator 1', 'Indicator 2', 'Indicator 3', 'Indicator 4'],
            formulaEditableFields: { first_if: true, first_then: false },
            formula: { if: { constraint_0: true }, then: null, else: null },
            formulaFields: { first_if: { first_statement: { left_side: 'indicator 1', operator: '<', right_side: 10 } }, first_then: { indicator_value: { assigned_value: null } } }
        }
    },
    methods: {
        delayedfocus (id) {
            this.editablefields[`${id}`] = true
            setTimeout(() => { document.getElementById(`${id}`).focus() }, 50)
        },
        addConditional () {
            const obj = this.formula.if
            const val = Object.keys(obj).length
            console.log('len', val)
            this.formula.if[`constraint_${val}`] = true
        }
    }
}
</script>

<style lang="scss" scoped>
    .conditional {
        background-color: #ededed;
        border-radius: 10px;
        margin: 0px 10px;
        padding: 5px 5px;
    }
    .Icon {
        cursor: pointer;
        color: red;
        font-size: 20px;
        margin: 0px 10px;
        width: 30px;
    }
    .Icon:hover {
        font-size: 25px;
    }
</style>
// <div v-if="(formulaEditableFields.first_if || !formulaFields.first_if.first_statement.left_side || !formulaFields.first_if.first_statement.operator || !formulaFields.first_if.first_statement.right_side)" class="p-d-flex p-ai-center conditional"  @mouseleave="formulaEditableFields.first_if=false">
// <Dropdown id="first_if" class="p-ml-2" v-model="formulaFields.first_if.first_statement.left_side" :options="indicatorList" placeholder="Select Indicator"  />
// <Dropdown class="p-m-2" v-model="formulaFields.first_if.first_statement.operator" :options="OperatorsList" style="width: 100px;" />
// <InputText type="text" v-model="formulaFields.first_if.first_statement.right_side" style="width: 150px;" />
// <i class="pi pi-times Icon" />
// </div>
// <div v-else class="conditional p-px-3" @click="formulaEditableFields.first_if=true">{{formulaFields.first_if.first_statement.left_side}} {{formulaFields.first_if.first_statement.operator}} {{formulaFields.first_if.first_statement.right_side}}</div>
