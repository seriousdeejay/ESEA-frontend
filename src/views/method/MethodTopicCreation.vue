<template>
    <div class="p-d-flex" style="height: calc(100vh - 145px); width: 100%; border-top: solid lightgrey; display: flex;">
        <method-tree-sidebar style="height: 100%; width: 400px; flex: 0 0 400px;" />
        <div v-if="methodTopics.length" class="p-m-4" style="width: 100%; height: calc(100vh - 200px); background-color: white; overflow-y: scroll;">
            <div class="p-d-flex" style="width: 100%; height: 50px; background-color: #f6f6f6; border-bottom: 2px solid lightgrey;">
                <div v-for="(topic, topicIndex) in methodTopics" :key="`topic_${topicIndex}`" class="topicTabs" @click="switchTopic(topic)" @dblclick="changeName(topic.edit = true)" :style="(currentTopic?.id === topic.id) ? 'border-bottom: 3px solid #00695C; color: #00695C;':''">
                    <InputText v-if="topic.edit" v-model="topic.name" @blur="(topic.edit=false && this.saveActive('topic', topic))" /> <span v-else>{{topic.name}}</span> <icon class="topic-remove-button pi pi-times" @click="removeTopic(topic)" />
                </div>
                <i class="pi pi-plus topic-add-button" @click="addTopic" />
            </div>
            <div v-if="Object.getOwnPropertyNames(currentTopic).length > 0"  style="border: 1px solid lightgrey;"> <!-- Object.getOwnPropertyNames(currentTopic).length > 0" -->
                <h3 v-if="true" class="p-col p-text-center p-text-italic p-text-light p-m-5 p-p-5" style="border: 2px dashed rgba(192,192,192,0.7); background-color:rgba(192,192,192,0.25); color: grey;"  @drop='onDrop($event, currentTopic)'  @dragover.prevent @dragenter.prevent >'Add Indicator to the main topic by dragging it into the box'</h3>
                <div v-for="(topicChild, index) in items.children" :key="`topicChild_${index}`">
                    <div :class="(topicChild?.children?.length ? 'p-pb-2': 'p-p-0')" style="background-color: #fcfcfc;">
                        <component :is="`${topicChild.objType}-form`" :errors="errors[topicChild.objType] && errors[topicChild.objType][topicChild.id]" ref="items" :topic="topicChild" :question="topicChild" :direct-indicator="topicChild" :indirect-indicator="topicChild" :active="activeItem.objType === topicChild.objType && activeItem.id === topicChild.id" @input="saveActive(topicChild.objType, $event)" @click="toggleActive(topicChild)" @delete="deleteActive(topicChild.objType, $event)" @dragstart="startDrag($event, topicChild)" @dragover.prevent @dragenter.prevent :draggable="true" />
                        <div v-for="(subTopicChild, idx) in topicChild.children" :key="`subTopicChild-${idx}`">
                            <component :is="`${subTopicChild.objType}-form`" ref="items" :errors="errors[subTopicChild.objType] && errors[subTopicChild.objType][subTopicChild.id]" :topic="subTopicChild" :question="subTopicChild" :direct-indicator="subTopicChild" :indirect-indicator="subTopicChild"  :active="activeItem.objType === subTopicChild.objType && activeItem.id === subTopicChild.id" @input="saveActive(subTopicChild.objType, $event)"  @click="toggleActive(subTopicChild)" @delete="deleteActive(subTopicChild.objType, $event)" @dragstart="startDrag($event, subTopicChild)" @dragover.prevent @dragenter.prevent :draggable="true" class="p-m-5" />
                        </div>
                        <h3 v-if="(topicChild.objType === 'topic')" class="p-col p-text-center p-text-italic p-text-light p-m-5 p-p-5" style="border: 2px dashed rgba(192,192,192,0.7); background-color:rgba(192,192,192,0.25);color: grey;"  @drop='onDrop($event, topicChild)'  @dragover.prevent @dragenter.prevent >'Add Indicator by dragging it into the box'</h3>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="p-m-5" style="display: flex; width: 100%; height: 50px; background-color: #00695C; border-radius: 5px; cursor: pointer;" @click="addTopic"><span style="margin: auto; color: white; font-weight: bold;">Add Topic</span></div>
        <!-- <div class="p-m-5" style="display: flex; width: 100%; background-color: #00695C; cursor: pointer;"><span style="width: 50%; height: 50%; margin: auto; font-size: 50px; font-weight: bold; color: white; background-color: grey;">Create topic</span></div>
     -->
    </div>

    <div class="p-d-flex p-ai-center p-shadow-5" style="position: fixed; top: 45%; right: 0px; width: 100px; background-color: #fcfcfc; border: 2px solid grey;">
    <div>
        <div v-for="option in addBar" :key="option.choice" class="p-d-flex p-jc-center p-ai-center" style="height: 100px; width: 100px; border: 1px solid lightgrey" :style="(option.hover ? 'background-color: lightgrey;' : '')" @mouseover="option.hover=true" @mouseleave="option.hover=false">
            <div v-if="!(option.choice ==='SubTopic' && !currentTopic.id)" @click="addBarMethod(option.choice)">
                <i :class="option.icon? option.icon : 'pi pi-plus'" />
                <p class="p-text-italic p-m-2">{{option.choice}}</p>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import MethodTreeSidebar from '@/components/MethodTreeSideBar'
import { mapState, mapActions, mapGetters } from 'vuex'
import getTopicItems from '../../utils/getTopicItems'
import TopicForm from '@/components/forms/TopicForm'
import CalculationForm from '@/components/forms/CalculationForm'
import IndicatorForm from '@/components/forms/IndicatorForm'

export default {
    components: {
        MethodTreeSidebar,
        CalculationForm,
        IndicatorForm,
        TopicForm
    },
    data () {
        return {
            addBar: [
                { choice: 'Topic' },
                { choice: 'SubTopic' }
            ],
            currentTopic: null
        }
    },
    computed: {
        ...mapState('method', ['method', 'error']),
        ...mapState('topic', { topics: 'topics', activeTopic: 'topic', topicErrors: 'errors' }),
        ...mapGetters('topic', ['methodTopics', 'subTopics']),
        // ...mapState('question', { activeQuestion: 'question', questionErrors: 'errors' }),
        // ...mapGetters('question', ['topicQuestions']),
        ...mapState('directIndicator', { activeDirectIndicator: 'directIndicator', directIndicatorErrors: 'errors' }),
        ...mapGetters('directIndicator', ['topicDirectIndicators']),
        ...mapState('indirectIndicator', { activeIndirectIndicator: 'indirectIndicator', indirectIndicatorErrors: 'errors' }),
        ...mapGetters('indirectIndicator', ['topicIndirectIndicators']),
        items () {
            return getTopicItems(
                this.currentTopic, // this.methodTopics,
                this.subTopics,
                this.topicDirectIndicators,
                this.topicIndirectIndicators
            )
        },
        activeItem () {
            let objType = 'topic'
            let { id } = this.activeTopic
            if (this.activeDirectIndicator.id) {
                objType = 'indicator'
                id = this.activeDirectIndicator.id
            }
            if (this.activeIndirectIndicator.id) {
                objType = 'calculation'
                id = this.activeIndirectIndicator.id
            }
            return { objType, id }
        },
        errors () {
            return {
                indicator: this.directIndicatorErrors,
                topic: this.topicErrors,
                calculation: this.indirectIndicatorErrors
            }
        }
    },
    created () {
        if (!this.currentTopic) {
            this.currentTopic = this.methodTopics?.[0] || {}
        }
        this.initialize()
    },
    methods: {
        ...mapActions('method', ['fetchMethod', 'updateMethod', 'saveMethod']),
        ...mapActions('topic', ['fetchTopics', 'setTopic', 'createTopic', 'updateTopic', 'addNewTopic', 'deleteTopic']),
        ...mapActions('directIndicator', ['fetchDirectIndicators', 'setDirectIndicator', 'addNewDirectIndicator', 'updateDirectIndicator', 'patchDirectIndicator', 'deleteDirectIndicator']),
        ...mapActions('indirectIndicator', ['fetchIndirectIndicators', 'setIndirectIndicator', 'addNewIndirectIndicator', 'updateIndirectIndicator', 'patchIndirectIndicator', 'deleteIndirectIndicator']),
        async initialize () {
        },
        startDrag (evt, item) {
            console.log(item)
            evt.dataTransfer.dropEffect = 'move'
            evt.dataTransfer.effectAllowed = 'move'
            if (typeof item === 'object') {
                item = JSON.stringify(item)
            }
            evt.dataTransfer.setData('draggedItem', item)
        },
        addBarMethod (choice) {
            if (choice === 'Topic') { this.addTopic() }
            if (choice === 'SubTopic') { this.addSubTopic() }
        },
        async addTopic () {
            await this.createTopic({ mId: this.method.id }) // addNewTopic()
            this.currentTopic = this.activeTopic
            this.setDirectIndicator()
            this.setIndirectIndicator()
        },
        addSubTopic () {
            this.addNewTopic({ parent: this.currentTopic.id || this.activeTopic.parent_topic }) // this.activeTopic.parent_topic || this.activeTopic.id
            this.setDirectIndicator()
            this.setIndirectIndicator()
        },
        switchTopic (topic) {
            console.log('single clicking')
            this.currentTopic = topic
            this.setTopic(topic)
        },
        async removeTopic (topic) {
            await this.deleteTopic({ mId: this.method.id, id: topic.id })
            this.currentTopic = this.methodTopics?.[0] || {}
        },
        async onDrop (evt, topic) {
            console.log(topic)
            const myitem = evt.dataTransfer.getData('draggedItem')
            const parseditem = JSON.parse(myitem)
            if (!topic.id || !parseditem.id) { return }
            if (parseditem.objType === ('direct_indicator' || 'indicator')) {
                await this.patchDirectIndicator({ mId: this.method.id, id: parseditem.id, data: { topic: topic.id } })
            } else if (parseditem.objType === 'calculation') {
                await this.patchIndirectIndicator({ mId: this.method.id, id: parseditem.id, data: { topic: topic.id } })
            }
            // delete parseditem.method
            // delete parseditem.question
            // this.lazyQuestion.direct_indicator = [parseditem]
            // console.log('-->', this.lazyQuestion)
        },
        toggleActive (item) {
            console.log('breee')
            const { objType } = item
            const topic = { id: item.topic || item.id }
            if (objType === 'topic') {
                this.setTopic(topic)
                this.setDirectIndicator()
                this.setIndirectIndicator()
            } else if (objType === 'indicator' && item.id !== this.activeDirectIndicator.id) {
                console.log('check')
                this.setDirectIndicator(item)
                this.setIndirectIndicator()
            } else if (objType === 'calculation' && item.id !== this.activeIndirectIndicator.id) {
                this.setIndirectIndicator(item)
                this.setDirectIndicator()
            }
        },
        async saveActive (type, object) {
            console.log('!!', 'type:', type, 'object:', object)
            if (object.target) { return } // Checks whether the $event contains an object or only an inputEvent
            console.log('saving object...')
            if (type === 'topic') {
                await this.updateTopic({
                    mId: this.method.id,
                    topic: object
                })
                await this.fetchTopics({ mId: this.method.id || this.$route.params.id })
            }
            if (type === 'indicator') {
                await this.updateDirectIndicator({
                    mId: this.method.id,
                    directIndicator: object
                })
            }
            if (type === 'calculation') {
                console.log(';reee')
                await this.updateIndirectIndicator({
                    mId: this.method.id,
                    indirectIndicator: object
                })
            }
        },
        deleteActive () {
            const objType = this.activeItem.objType
            const id = this.activeItem.id
            console.log('{{{{{', objType, id)
            // const { objType, id } = this.activeitem
            if (objType === 'topic') {
                this.deleteTopic({ mId: this.method.id, id })
            }
            if (objType === 'indicator') {
                this.deleteDirectIndicator({ mId: this.method.id, SuId: 0, SeId: 0, id: id })
            }
            if (objType === 'calculation') {
                this.deleteIndirectIndicator({ mId: this.method.id, id })
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.p-divider {
}
.topicTabs {
    padding: 0px 20px 0px 20px;
    font-weight: bold;
    font-size: 20px;
    line-height: 50px;
    // background-color: #fcfcfc;
    border-right: 1px solid lightgrey;
    color: grey;
    // color: #00695C;
    // border-bottom: 3px solid #00695C;
}
.topicTabs:hover {
    color: #00695C;
    border-bottom: 3px solid #00695C;
}
.topic-add-button {
    line-height: 50px;
    padding: 0px 20px;
    width: 20px;
    font-size: 18px;
    font-weight: bold;
}
.topic-add-button:hover {
    color: #00695C;
    font-size: 22px;
    border-radius: 40%;
}
.topic-remove-button {
    font-size: 16px;
    padding-left: 10px;
}
.topic-remove-button:hover {
    color: red;
}
</style>
