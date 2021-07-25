<template>
    <div>
        <div class="p-d-flex">
            <div v-for="item in libraryComponents" :key="item" class="p-col-6" :style="(item === activeComponentType) ? 'border-bottom: 3px solid  #00695C; font-weight: bold;':''" @click="activeComponentType = item">
            {{item}}
            </div>
        </div>
        <div v-if="activeComponentType === 'Indicators'" class="p-text-left">
            <div class="p-ml-1 p-mt-5 p-mb-1" style="height: 50px;">
                <div v-if="!searchbarIndicators" class="p-px-3 p-d-flex p-jc-between p-ai-center" @click="searchbarIndicators = !searchbarIndicators" @blur="searchbarIndicators = false">
                    <h3>Direct Indicators</h3><i class="pi pi-search" />
                </div>
                <span v-else class="p-input-icon-left" style="width: 100%">
                    <i class="pi pi-search" /><InputText ref="searchbarQuestions" v-model="searchIndicator" @blur="checksSearchbarContentIndicator" placeholder="Search Direct Indicators..." style="width: 100%;" />
                </span>
            </div>
            <div style="height: calc(100vh - 400px); overflow-y: scroll;">
            <div v-for="indicator in filteredDirectIndicators" :key="indicator.id" class="directIndicators" style="font-size: 16px; padding: 10px; overflow: hidden; border: 1px solid lightgrey; cursor: grab;"  @dragstart="startDrag($event, indicator)" @dragover.prevent @dragenter.prevent :draggable="true">
                {{indicator.key}}
            </div>
            </div>
        </div>
        <div v-else class="p-text-left">
            <div class="p-ml-1 p-mt-5" style="height: 50px;">
                <div v-if="!searchbarQuestions" class="p-px-3 p-d-flex p-jc-between p-ai-center" @click="searchbarQuestions = !searchbarQuestions">
                    <h3>Questions</h3><i class="pi pi-search" />
                </div>
                <span v-else class="p-input-icon-left" style="width: 100%">
                    <i class="pi pi-search" /><InputText ref="searchbarQuestions" v-model="searchQuestion" @blur="checkSearchbarContentQuestion" placeholder="Search Questions..." style="width: 100%;" />
                </span>
            </div>
            <hr>
            <div v-for="question in filteredQuestions" :key="question.id" class="questions p-px-3" style="font-size: 16px; padding: 10px; overflow: hidden; border: 1px solid lightgrey; cursor: grab;" :style="(question.id === activeQuestion?.id) ? 'background-color: #EEEEEE;':''" :draggable="true">
                {{question.name}}
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    data () {
        return {
            libraryComponents: ['Indicators', 'Questions'],
            activeComponentType: 'Indicators',
            searchbarQuestions: false,
            searchQuestion: '',
            searchbarIndicators: false,
            searchIndicator: ''
        }
    },
    computed: {
        ...mapState('question', ['questions']),
        ...mapState('directIndicator', ['directIndicators']),
        filteredQuestions () {
            return this.questions.filter((question) => {
                return (question.name.toLowerCase().includes(this.searchQuestion.toLowerCase()))
            })
        },
        filteredDirectIndicators () {
            return this.directIndicators.filter((indicator) => {
                return (indicator.name.toLowerCase().includes(this.searchIndicator.toLowerCase()))
            })
        }
    },
    methods: {
        startDrag (evt, item) {
            console.log(item)
            evt.dataTransfer.dropEffect = 'move'
            evt.dataTransfer.effectAllowed = 'move'
            if (typeof item === 'object') {
                item = JSON.stringify(item)
            }
            evt.dataTransfer.setData('draggedItem', item)
        }
    }
}
</script>

<style lang="scss" scoped>
    .questions:hover {
        background-color: #EEEEEE;
    }
</style>
