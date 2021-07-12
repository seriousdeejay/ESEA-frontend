<template>
<div class="p-grid p-pt-5" style="background-color: #F1F1F1; border: 1px solid #D8D8D8;">
    <div class="p-col-12 p-field">
                <span class="p-float-label">
                <InputText id="sectiontitle" type="text" v-model.lazy="lazySection.title" :class="{'p-invalid': v$.lazySection.title.$invalid}" @blur="v$.lazySection.title.$touch()" />
                <label for="sectiontitle">Title</label>
                </span>
                <!-- <tree-select v-model="selectedQuestions" :options="goodItems" selectionMode="checkbox"  placeholder="Select Items" @blur="updateQuestions" class="p-col-12" :class="{'borderless': questionsErrors.length}" /> -->
                <MultiSelect v-model="selectedQuestions" :options="questions" optionLabel="name" placeholder="Select Questions" class="p-col-12 p-my-2" :class="{'p-invalid': v$.lazySection.questions.$invalid}" @blur="v$.lazySection.questions.$touch()" /> <!--@blur="updateQuestions" :class="{'borderless': questionsErrors.length} -->
                <Button label="Delete Section" class="p-col p-button-danger p-button-text" @click="deleteSection" /><!-- <div class="p-col-12 p-error p-text-italic p-pt-1" v-for="error in questionsErrors" :key="error">{{error}}</div> -->
            <!-- <div class="p-error p-text-italic p-pt-1" v-for="error in nameErrors" :key="error">{{error}}</div> -->
        </div>
        </div>
</template>

<script>
import { isEqual, cloneDeep } from 'lodash'
import useVuelidate from '@vuelidate/core'
import { required, minLength } from '../../utils/validators'
import MultiSelect from 'primevue/multiselect'
export default {
    components: {
        MultiSelect
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
                    console.log(this.lazySection, this.section)
                    if (this.v$.$invalid) { return }
                    if (isEqual(this.section, val)) { return }
                // this.updateSection({ })
                console.log('saving...')
                this.$emit('input', val)
                }, 1000)
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
            title: { required },
            questions: {
                required,
                minLength: minLength(1)
            }
        }
    },
    methods: {
        deleteSection () {
            console.log('eeee')
            this.$emit('delete', this.section)
        }
    }
}
</script>
