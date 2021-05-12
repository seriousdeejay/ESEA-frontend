<template>
    <form ref="form" class="p-grid p-fluid p-input-filled p-text-left p-py-5">
        <div class="p-col-12 p-field">
            <span class="p-float-label">
            <InputText id="surveyname" type="text" v-model.lazy="lazySurvey.name" @blur="updateName" :class="{'borderless': nameErrors.length}" lazy />
            <label for="surveyname">Survey Name</label>
            </span>
            <div class="p-error p-text-italic p-pt-1" v-for="error in nameErrors" :key="error">{{error}}</div>
        </div>
        <div class="p-grid p-col-12 p-m-0 p-p-0">
            <div class="p-col-8">
                <span class="p-float-label">
                <InputText id="surveystakeholders" type="text" v-model.lazy="lazySurvey.stakeholdergroup" @blur="updateStakeholder" :class="{'borderless': stakeholderErrors.length}" lazy />
                <label for="surveystakeholders">Stakeholder Group</label>
                </span>
                <div class="p-error p-text-italic p-pt-1" v-for="error in stakeholderErrors" :key="error">{{error}}</div>
            </div>
            <div class="p-col-4">
                <span class="p-float-label">
                    <InputNumber id="surveyminthreshold" suffix="%" :min="0" :max="100" v-model.lazy="lazySurvey.min_threshold" lazy />
                    <label for="surveyresponserate">Minimal Response Threshold</label>
                </span>
            </div>
        </div>
        <Divider />
        <!-- <tree-select v-model="items"></tree-select> -->
        <div class="p-grid p-col-12 p-m-0">
            <tree-select v-model="selectedQuestions" :options="goodItems" selectionMode="checkbox"  placeholder="Select Items" @blur="updateQuestions" class="p-col-12" :class="{'borderless': questionsErrors.length}" />
            <div class="p-col-12 p-error p-text-italic p-pt-1" v-for="error in questionsErrors" :key="error">{{error}}</div>
        </div>
        <Button label="Save Survey" class="p-m-2" @click="saveSurvey" :loading="loading" />
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
import { required, maxLength, minLength, between } from '../../utils/validators'
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
            loading: false,
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
                this.v$.lazySurvey.name,
                this.errors.name
            )
        },
        stakeholderErrors () {
            return HandleValidationErrors(
                this.v$.lazySurvey.stakeholdergroup,
                this.errors.stakeholdergroup
            )
        },
        questionsErrors () {
            return HandleValidationErrors(
                this.v$.lazySurvey.questions,
                this.errors.questions
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
                    console.log('test')
                    // this.lazySurvey.stakeholders = []
                    // if (this.surveystakeholder !== undefined) {
                    // this.lazySurvey.stakeholders.push(this.surveystakeholder)
                    // }
                    // console.log('==', this.lazySurvey.questions, this.lazySurvey.stakeholdergroup)
                    // console.log(this.v$.lazySurvey.questions)
                    if (this.v$.$invalid) { return }
                    this.lazySurvey.questions.sort()
                    if (isEqual(this.survey, val)) { return }
                    console.log('it works?', this.lazySurvey.questions)
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
            stakeholdergroup: { required, minLength: minLength(4) },
            min_threshold: { required, between: between(0, 100) },
            questions: { required, minLength: minLength(1) }
        }
    },
    methods: {
        updateName () {
            this.v$.lazySurvey.name.$touch()
        },
        updateStakeholder () {
            this.v$.lazySurvey.stakeholdergroup.$touch()
        },
        updateQuestions () {
            this.v$.lazySurvey.questions.$touch()
        },
        saveSurvey () {
            this.loading = true
            this.v$.lazySurvey.$touch()
            setTimeout(() => { this.loading = false }, 500)
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
