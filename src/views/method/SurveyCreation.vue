<template>
    <div class="p-d-flex" style="height: 100%; border-top: 1px solid lightgrey;">
        <div class="p-d-flex p-flex-column p-jc-between" style="height: calc(100vh - 190px;); width: 300px; border: 1px solid lightgrey;">
            <survey-tree-side-bar style="height: 100%;" />
        </div>
        <div class="p-col p-d-flex p-jc-center" style="height: calc(100vh - 195px); width: 100%; text-align: center; overflow-y: scroll;">
            <div class="p-m-5 p-text-left p-fluid" style="width: 1200px;">
                <div v-for="(section, sectionIndex) in items" :key="sectionIndex" class="p-my-5" style="background-color: #fcfcfc; border: 1px solid lightgrey;">
                    <sectioon-form :section="section" :active="activeItem.objType === section.objType && activeItem.id === section.id" @input="saveActive('section', $event)" @click="toggleActive(section)" @delete="removeSection" />
                    <div v-for="(sectionChild, index) in section.children" :key="index" class="p-m-5">
                        <question-form ref="items" :question="sectionChild" :active="activeItem.objType === sectionChild.objType && activeItem.id === sectionChild.id" @input="saveActive(sectionChild.objType, $event)" @click="toggleActive(sectionChild)" @delete="removeQuestion(section, question)" />
                    </div>
                    <div class="addQuestion" @click="addQuestion(section)"><i class="pi pi-plus" /> Add Question</div>
                </div>
                <div class="addQuestion p-mb-5" @click="addSection"><i class="pi pi-plus" /> Add Section</div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import SurveyTreeSideBar from '@/components/SurveyTreeSideBar'
import getSurveyItems from '@/utils/getSurveyItems'
import SectioonForm from '../../components/forms/SectioonForm'
import QuestionForm from '@/components/forms/QuestionForm'

export default {
    components: {
        SurveyTreeSideBar,
        QuestionForm,
        SectioonForm
    },
    data () {
        return {
        }
    },
    computed: {
        ...mapState('method', ['method']),
        ...mapState('survey', ['survey']),
        ...mapState('section', ['sections', 'section']),
        ...mapState('question', ['questions', 'question']),
        ...mapGetters('question', ['sectionQuestions']),
        items () {
            return getSurveyItems(
                this.sections,
                this.sectionQuestions
            )
        },
        activeItem () {
            let objType = 'section'
            let { id } = this.section

            if (this.question.id) {
                objType = 'question'
                id = this.question.id
            }
            return { objType, id }
        },
        errors () {
            return {
                section: this.sectionErrors,
                question: this.questionErrors
            }
        }
    },
    created () {
        this.initialize()
    },
    methods: {
        ...mapActions('survey', ['fetchSurvey', 'updateSurvey', 'saveSurvey']),
        ...mapActions('section', ['fetchSections', 'createSection', 'setSection', 'updateSection', 'addNewSection', 'deleteSection']),
        ...mapActions('question', ['fetchQuestions', 'setQuestion', 'addNewQuestion', 'updateQuestion', 'deleteQuestion']),
        ...mapActions('directIndicator', ['fetchDirectIndicators']),
        async initialize () {
            if (this.survey.id !== parseInt(this.$route.params.SurveyId)) {
                this.$router.push({ name: 'method-wizard-surveys' })
            }

            await this.fetchSections({ mId: this.method.id, sId: this.survey.id })
            await this.fetchQuestions({ mId: this.method.id, SuId: this.survey.id, SeId: 0 })
        },
        addSection () {
            this.createSection({ mId: this.method.id, sId: this.survey.id }) //  this.addNewSection({ survey: this.survey.id })
            this.setQuestion()
        },
        addQuestion (section) {
            console.log('hmm')
            this.addNewQuestion({ section: section?.id })
        },
        toggleActive (item) {
            console.log('check', item.objType, item.id, this.question.id)
            const { objType } = item
            const section = { id: item.section || item.id }
            console.log('eee')
            if (objType === 'section') {
                this.setSection(section)
                this.setQuestion()
            } else if (objType === 'question' && (item.id !== this.question.id)) {
                console.log('aaa')
                this.setQuestion(item)
            }
        },
        async saveActive (type, object) {
            console.log(type, 'object', object)
            if (object.target) { return }
            if (type === 'section') {
                await this.updateSection({
                    mId: this.method.id,
                    sId: this.survey.id,
                    section: object
                })
            }
            if (type === 'question') {
                await this.updateQuestion({
                    mId: this.method.id,
                    SuId: this.survey.id,
                    SeId: this.section.id,
                    question: object
                })
            }
            // await this.fetchDirectIndicators({ mId: this.method.id })
        },
        deleteActive () {
            const objType = this.activeItem.objType
            const id = this.activeItem.id

            if (objType === 'section') {
                this.deleteSection({ mId: this.method.id, sId: this.survey.id, id: id })
            }
            if (objType === 'question') {
                this.deleteQuestion({ mId: this.method.id, SuId: this.survey.id, SeId: 0, id: id })
            }
        },
        removeSection (section) {
            this.deleteSection({ mId: this.method.id, sId: this.survey.id, id: section.id })
            this.initialize()
        },
        async removeQuestion (...args) {
            const [section, question] = [...args]
            console.log('event:', section, 'question:', question)
            if (section?.id && question?.id) {
                await this.deleteQuestion({ mId: this.method.id, SuId: this.survey.id, SeId: section.id, id: question.id })
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .addQuestion {
        height: 50px;
        line-height: 50px;
        margin: 50px;
        text-align: center;
        background-color: #E2E2E2;
        border-radius: 5px;
        font-size: 22px;
        font-weight: bold;
        color: black;
    }
    .addQuestion:hover {
        background-color: #E9E9E9;
        border: 1px solid lightgrey;
        cursor: pointer;
    }
</style>
