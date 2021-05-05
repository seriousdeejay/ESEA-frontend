<template>
    <form ref="form" class="p-grid p-fluid p-input-filled p-text-left p-py-5">
        {{this.survey}}
        {{this.lazySurvey}}
        <div class="p-col-12 p-field">
            <span class="p-float-label">
            <InputText id="surveyname" type="text" v-model.lazy="lazySurvey.name" @blur="updateName" lazy />
            <label for="surveyname">Survey Name</label>
            </span>
            <div class="p-error p-text-italic p-pt-1" v-for="error in nameErrors" :key="error">{{error}}</div>
        </div>
        <div class="p-grid p-col-12 p-m-0 p-p-0">
            <div class="p-col-8">
                <span class="p-float-label">
                <InputText id="surveystakeholders" type="text" v-model.lazy="surveystakeholder" @blur="updateStakeholder" lazy />
                <label for="surveystakeholders">Stakeholder Group</label>
                </span>
                <div class="p-error p-text-italic p-pt-1" v-for="error in stakeholderErrors" :key="error">{{error}}</div>
            </div>
            <div class="p-col-4">
                <span class="p-float-label">
                    <InputNumber id="surveyresponserate" suffix="%" :min="0" :max="100" v-model.lazy="lazySurvey.rate" lazy />
                    <label for="surveyresponserate">Response Rate</label>
                </span>
            </div>
        </div>
        <Divider />
        <!-- <tree-select v-model="items"></tree-select> -->
        <tree-select v-model="selectedQuestions" :options="goodItems" selectionMode="checkbox"  placeholder="Select Items" />
         <div class="p-error p-text-italic p-pt-1" v-for="error in questionsErrors" :key="error">{{error}}</div>
        =:{{v$.$invalid}} >>{{questionsErrors}} ;; {{stakeholderErrors}}
        {{Object.keys(selectedQuestions)}}
        {{v$.lazySurvey.questions.$invalid}}
        {{lazySurvey.questions}}
        >: {{lazySurvey.stakeholders}}
        <div class="p-grid p-col-12 p-mx-0 p-px-0 p-field">
                 <div class="p-col-4">
                    <!-- <span class="p-float-label">
                        <InputText id="questionkey" type="text" v-model="dd"  :class="{'borderless': keyErrors.length}"  @blur="questionKeyFilter" :disabled="!active" />
                        <label for="questionkey">Question Key</label>
                    </span>
                    <div class="p-error p-text-italic" v-for="error in keyErrors" :key="error"><small>{{error}}</small></div> -->
                </div>
        </div>
    </form>
</template>
<script>
import { mapGetters } from 'vuex'
import useVuelidate from '@vuelidate/core'
import { required, maxLength, minLength } from '../../utils/validators'
import HandleValidationErrors from '../../utils/HandleValidationErrors'
import getMethodItems from '../../utils/getMethodItems'
import { isEqual } from 'lodash'
import TreeSelect from 'primevue/treeselect'

export default {
    components: {
        TreeSelect
    },
    props: {
        survey: {
            type: Object,
            required: true
        },
        items: {
            type: Array,
            required: true
        },
        stakeholders: {
            type: Array,
            required: true
        },
        errors: {
            type: Object,
            required: true
        }
    },
    data () {
        return {
            lazySurvey: { ...this.survey },
            selectedQuestions: [],
            topicIndirectIndicators: [],
            surveystakeholder: undefined
        }
    },
    computed: {
        ...mapGetters('topic', ['methodTopics', 'subTopics']),
		...mapGetters('question', { topicQuestions: 'topicQuestions' }),
		// ...mapGetters('indirectIndicator', ['topicIndirectIndicators']),
        // items () {
        //     const data = getMethodItems(this.methodTopics,
		// 		this.subTopics,
		// 		this.topicQuestions,
		// 		this.topicIndirectIndicators)

        //     for (const topic of data) {
        //         topic.label = topic.name
        //         for (const subtopic of topic.children) {
        //             subtopic.label = subtopic.name
        //             for (const indicator of subtopic.children) {
        //                 indicator.label = indicator.key
        //                 if (indicator.objType === 'calculation') {
        //                     indicator.icon = 'pi pi-percentage'
        //                 } else {
        //                     indicator.icon = 'pi pi-pencil'
        //                 }
        //             }
        //         }
        //     }
        //     return data
        nameErrors () {
            return HandleValidationErrors(
                this.v$.lazySurvey.name
            )
        },
        stakeholderErrors () {
            return HandleValidationErrors(
                this.v$.lazySurvey.stakeholders
            )
        },
        questionsErrors () {
            return HandleValidationErrors(
                this.v$.lazySurvey.questions
            )
        },
        goodItems () {
            const data = getMethodItems(this.methodTopics,
				this.subTopics,
				this.topicQuestions,
				this.topicIndirectIndicators)

            for (const topic of data) {
                topic.label = topic.name
                for (const subtopic of topic.children) {
                    subtopic.label = subtopic.name
                    for (const indicator of subtopic.children) {
                        indicator.label = indicator.key
                    }
                }
            }
            return data
        }
    },
    watch: {
        survey (val) {
            if (!isEqual(this.lazySurvey, val)) {
                console.log('not the same')
                this.lazySurvey = { ...val }
            }
        },
        lazySurvey: {
            handler (val) {
                setTimeout(() => {
                    this.lazySurvey.questions = Object.keys(this.selectedQuestions).filter(key => (key !== 'undefined'))
                    this.lazySurvey.stakeholders = []
                    if (this.surveystakeholder !== undefined) {
                    this.lazySurvey.stakeholders.push(this.surveystakeholder)
                    }
                    console.log('==', this.lazySurvey.questions, this.lazySurvey.stakeholders)
                    if (this.v$.$invalid) { return }
                    if (isEqual(this.survey, val)) { return }
                    console.log('it works?')
                    this.$emit('goodinput', this.lazySurvey)
                    console.log('check', this.survey)
                    console.log('++', val)
                }, 5000)
            },
            deep: true
        }
    },
    setup: () => ({ v$: useVuelidate() }),
    validations: {
        lazySurvey: {
            name: { required, maxLength: maxLength(120) },
            stakeholders: { required, minLength: minLength(1) },
            questions: { required, minLength: minLength(1) }
        }
    },
    methods: {
        updateName () {
            this.v$.lazySurvey.name.$touch()
        },
        updateStakeholder () {
            this.v$.lazySurvey.stakeholders.$touch()
        }
    }
}
</script>
