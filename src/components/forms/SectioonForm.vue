<template>
    <form ref="form"  class="p-d-flex p-ai-center p-fluid p-input-filled p-p-4 p-text-center" @submit.prevent="!v$.$invalid" :style="[(!v$.lazySection.$invalid && lazySection.id > 0) ? 'border: 1px solid #00695C;': 'border: 1px solid rgba(255, 0, 0, 0.3);']" style="width: 100%;">
        <div class="p-col p-mr-5">
            <div v-if="active" class="p-col-12 p-field p-m-0 p-p-0">
                <span class="p-float-label">
                    <InputText id="sectiontitle" type="text" v-model.lazy="lazySection.title" :class="{'p-invalid': v$.lazySection.title.$invalid}" @blur="v$.lazySection.title.$touch()" />
                    <label for="sectiontitle">Title</label>
                </span>
            </div>
            <h1 v-else>{{lazySection.title}}</h1>
        </div>
        <i class="pi pi-trash p-p-2" style="font-size: 40px; color: red;" @click="deleteSection()" />
        <!-- <div v-if="v$.lazySection.questions.$invalid" class="p-error p-text-left">Be sure to add atleast one question to keep this section!</div> -->
    </form>
</template>

<script>
import { isEqual, cloneDeep } from 'lodash'
import useVuelidate from '@vuelidate/core'
import { required } from '../../utils/validators'
// import MultiSelect from 'primevue/multiselect'
export default {
    components: {
        // MultiSelect
    },
    props: {
        survey: {
            type: Number,
            required: true
        },
        section: {
            type: Object,
            required: true
        },
        questions: {
            type: Object,
            required: true
        },
        active: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            lazySection: cloneDeep(this.section) || { },
            selectedQuestions: this.section?.questions || []
        }
    },
    computed: {
    },
    watch: {
        section (val) {
            if (isEqual(this.lazySection, val)) { return }
            this.lazySection = cloneDeep(val)
        },
        lazySection: {
            handler (val) {
                setTimeout(() => {
                    this.v$.lazySection.$touch()
                    console.log(this.lazySection, this.section)
                    if (this.v$.lazySection.$invalid) { return }
                    if (isEqual(this.section, this.lazySection)) { return }
                this.$emit('input', val)
                }, 200)
            },
            deep: true
        },
        selectedQuestions (val) {
            const templist = []
            val.forEach((question) => templist.push(question.id))
            console.log(templist)
            this.lazySection.questions = templist
        }
    },
    setup: () => ({ v$: useVuelidate() }),
    validations: {
        lazySection: {
            title: { required }
            // questions: {
            //     required,
            //     minLength: minLength(1)
            // }
        }
    },
    created () {
        this.lazySection = cloneDeep(this.section)
    },
    methods: {
        deleteSection () {
            console.log('eeee')
            this.$emit('delete', this.section)
        }
    }
}
// <!-- <div class="p-grid p-m-0 p-pt-5" style="background-color: #F1F1F1; border: 1px solid #D8D8D8;"> -->
// <!-- <tree-select v-model="selectedQuestions" :options="goodItems" selectionMode="checkbox"  placeholder="Select Items" @blur="updateQuestions" class="p-col-12" :class="{'borderless': questionsErrors.length}" /> -->
// <!-- <MultiSelect v-model="selectedQuestions" :options="questions" optionLabel="name" placeholder="Select Questions" class="p-col-12 p-my-2" :class="{'p-invalid': v$.lazySection.questions.$invalid}" @blur="v$.lazySection.questions.$touch()" /> @blur="updateQuestions" :class="{'borderless': questionsErrors.length} -->
// <!--<Button label="Delete Section" class="p-col p-button-danger p-button-text" @click="deleteSection" /><div class="p-col-12 p-error p-text-italic p-pt-1" v-for="error in questionsErrors" :key="error">{{error}}</div> -->
// <!-- <div class="p-error p-text-italic p-pt-1" v-for="error in nameErrors" :key="error">{{error}}</div> -->
</script>
