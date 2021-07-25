<template>
    <form ref="form" class="p-text-left p-fluid p-m-5 p-p-5 p-inputtext-lg" style="width: 1000px; height: 70vh">
        <div class="p-field p-m-3">
            <label for="description">Survey Name</label>
            <InputText ref="surveyname" id="surveyname" type="text" v-model.lazy="lazySurvey.name" @blur="updateName" :class="{'borderless': nameErrors.length}" lazy />
            <div class="p-error p-text-italic p-pt-1" v-for="error in nameErrors" :key="error">{{error}}</div>
        </div>
        <div class="p-field p-m-3">
            <label for="description">Response Type</label>
            <Dropdown v-model="lazySurvey.response_type" :options="responseTypeList"  optionLabel="value" optionValue="value" placeholder="Select response type" :class="{'p-invalid': v$.lazySurvey.response_type.$invalid}"/>
        </div>
        <div class="p-field p-m-3">
            <label for="description">Minimal Response Threshold</label>
            <InputNumber id="surveyminthreshold" suffix="%" :min="0" :max="100" v-model.lazy="lazySurvey.min_threshold" lazy :class="{'borderless': v$.lazySurvey.min_threshold.$error}" />
        </div>
        <div class="p-field p-m-3">
            <label for="description">Welcoming Text</label>
            <Textarea id="description" v-model="lazySurvey.welcome_text" :autoResize="true" />
            <!-- <div class="p-error p-text-italic" v-for="error in descriptionErrors" :key="error">{{ error }}</div> -->
        </div>
        <div class="p-field p-m-3">
            <label for="description">Closing Text</label>
            <Textarea id="description" v-model="lazySurvey.closing_text" :autoResize="true" />
            <!-- <div class="p-error p-text-italic" v-for="error in descriptionErrors" :key="error">{{ error }}</div> -->
        </div>
    </form>

</template>

<script>
import { mapState, mapActions } from 'vuex'
import Dropdown from 'primevue/dropdown'
import { RESPONSE_TYPE } from '../../utils/constants'
import { isEqual, cloneDeep } from 'lodash'
import { required, maxLength, between } from '../../utils/validators'
import HandleValidationErrors from '../../utils/HandleValidationErrors'
import useVuelidate from '@vuelidate/core'

    export default {
        components: {
            Dropdown
        },
        data () {
            return {
                lazySurvey: cloneDeep(this.survey) || {},
                response_type: RESPONSE_TYPE
            }
        },
        computed: {
            ...mapState('survey', ['survey', 'errors']),
            responseTypeList () {
                return Object.entries(this.response_type).map(([text, value]) => ({ text, value }))
            },
            nameErrors () {
                return HandleValidationErrors(
                    this.v$.lazySurvey.name,
                    this.errors.name
                )
            }
        },
        watch: {
            survey (val) {
                if (isEqual(this.lazySurvey, val)) { return }
                this.lazySurvey = cloneDeep(val)
            },
            lazySurvey: {
                handler (val) {
                    setTimeout(() => {
                        if (this.v$.$invalid) { return }
                        if (isEqual(this.survey, val)) { return }
                        this.updateSurvey({ mId: this.$route.params.id, survey: val })
                    }, 200)
                },
                deep: true
            }
        },
        setup: () => ({ v$: useVuelidate() }),
        validations: {
            lazySurvey: {
                name: { required, maxLength: maxLength(120) },
                min_threshold: { required, between: between(0, 100) },
                response_type: { required }
            }
        },
        mounted () {
            this.lazySurvey = cloneDeep(this.survey)
            if (!this.lazySurvey.name.length) {
                this.$refs.surveyname.$el.focus()
            }
        },
        methods: {
            ...mapActions('survey', ['updateSurvey']),
            updateName () {
                this.v$.lazySurvey.name.$touch()
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
