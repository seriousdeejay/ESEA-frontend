<template>
    <div class="p-d-flex" style="height: calc(100vh - 145px); width: 100%; border-top: solid lightgrey; display: flex;">
        <method-tree-sidebar :topicsdisplay="true" style="height: 100%; width: 400px; flex: 0 0 400px;" />
        <div v-if="methodTopics.length" class="" style="width: 100%; height: calc(100vh - 145px); background-color: white; overflow-y: auto;">
            <div class="p-m-5">
                 <div v-for="(topic, topicIndex) in items2" :key="`topic-${topicIndex}`" class="p-my-5 p-shadow-5" style="width: 100%; background-color: #f8f9fe; border: 1px solid lightgrey;"> <!-- #f7f7f7 #e6f3ff-->
                    <topic-form
                        :topic="topic"
                        :active="activeItem.objType === topic.objType && activeItem.id === topic.id"
                        :check-saving-status="checkSavingStatus"
                        @savingstatus="savingStatus(topic, $event)"
                        @refreshsidebar="refreshSidebar()"
                        @click="toggleActive(topic)"
                    />
                    <h3 v-if="(topic.id > 0)"
                        class="p-col p-text-center p-text-italic p-text-light p-m-4 p-p-5"
                        style="border: 2px dashed rgba(192,192,192,0.7); background-color:rgba(192,192,192,0.25); color: grey;"
                        @drop='onDrop($event, topic)'
                        @dragover.prevent
                        @dragenter.prevent>
                        'Add Indicator to the main topic by dragging it into the box'
                    </h3>
                    <div v-for="(topicChild, index) in topic.children" :key="`topicChild-${index}`" >
                        <div class="p-ml-5">
                                <component
                                    :is="`${topicChild.objType}-form`"
                                    :topic="topicChild"
                                    :direct-indicator="topicChild"
                                    :indirect-indicator="topicChild"
                                    :errors="errors[topicChild.objType] && errors[topicChild.objType][topicChild.id]"
                                    :active="activeItem.objType === topicChild.objType && activeItem.id === topicChild.id"
                                    :check-saving-status="checkSavingStatus"
                                    @click="toggleActive(topicChild)"
                                    @refreshsidebar="refreshSidebar()"
                                    @savingstatus="savingStatus(topicChild, $event)"
                                    @dragstart="startDrag($event, topicChild)"
                                    @dragover.prevent @dragenter.prevent :draggable="true"
                                />
                                <div v-for="(subTopicChild, index) in topicChild.children" :key="`subTopicChild-${index}`" class="p-ml-5">
                                    <component
                                        :is="`${subTopicChild.objType}-form`"
                                        :direct-indicator="subTopicChild"
                                        :indirect-indicator="subTopicChild"
                                        :errors="errors[subTopicChild.objType] && errors[subTopicChild.objType][subTopicChild.id]"
                                        :active="activeItem.objType === subTopicChild.objType && activeItem.id === subTopicChild.id"
                                        @input="saveActive(subTopicChild.objType, $event)"
                                        @click="toggleActive(subTopicChild)"
                                        @dragstart="startDrag($event, subTopicChild)"
                                        @dragover.prevent @dragenter.prevent :draggable="true"
                                    />
                                </div>
                                <h3
                                    v-if="(topicChild.objType === 'topic' && topicChild.id > 0)"
                                    class="p-col p-text-center p-text-italic p-text-light p-m-4 p-p-5"
                                    style="border: 2px dashed rgba(192,192,192,0.7); background-color:rgba(192,192,192,0.25);color: grey;"
                                    @drop='onDrop($event, topicChild)'  @dragover.prevent @dragenter.prevent>
                                    'Add Indicator by dragging it into the box'
                                </h3>
                            <!-- <Button label="Add Question" icon="pi pi-plus" class="p-button-text p-text-left p-p-5" @click="addQuestion()" /> :class="(topicChild?.children?.length ? 'p-p-0': 'p-p-0')" -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div
            v-else class="p-m-5"
            style="display: flex; width: 100%; height: 50px; background-color: #00695C; border-radius: 5px; cursor: pointer;"
            @click="addTopic">
            <span style="margin: auto; color: white; font-weight: bold;">Add Topic</span>
        </div>
    </div>

    <div class="p-d-flex p-ai-center p-shadow-5" style="position: fixed; top: 45%; right: 0px; width: 100px; background-color: #fcfcfc; border: 2px solid grey;">
        <div>
            <div v-for="option in addBar" :key="option.choice"
                class="p-d-flex p-jc-center p-ai-center"
                style="height: 100px; width: 100px; border: 1px solid lightgrey" :style="(option.hover ? 'background-color: lightgrey;' : '')"
                @mouseover="option.hover=true" @mouseleave="option.hover=false">
                <div v-if="!(option.choice ==='SubTopic' && !items2.length)" @click="addBarMethod(option.choice)">
                    <i :class="option.icon? option.icon : 'pi pi-plus'" />
                    <p class="p-text-italic p-m-2">{{option.choice}}</p>
                </div>
            </div>
        </div>
    </div>
    <Dialog v-model:visible="unsavedChangesDialog" style="width: 600px;" header="Unsaved Changes" :modal="true" :dismissableMask="true">
        <div class="confirmation-content">
            This page contains unsaved changes, leaving the page now will destroy these. Do you still wish to leave the page?
        </div>
        <template #footer>
            <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="unsavedChangesChoice(true)" />
            <Button label="No" icon="pi pi-times" class="p-button-text" @click="unsavedChangesChoice(false)"/>
        </template>
    </Dialog>
</template>

<script>
import MethodTreeSidebar from '@/components/MethodTreeSideBar'
import { mapState, mapActions, mapGetters } from 'vuex'
// import getTopicItems from '../../utils/getTopicItems'
import getMethodItems2 from '@/utils/getMethodItems2'
import TopicForm from '@/components/forms/TopicForm'
// import CalculationForm from '@/components/forms/CalculationForm'
// import IndicatorForm from '@/components/forms/IndicatorForm'
import DirectIndicatorForm from '@/components/cards/DirectIndicatorForm'
import IndirectIndicatorForm from '@/components/cards/IndirectIndicatorForm'

export default {
    components: {
        MethodTreeSidebar,
        // CalculationForm,
        // IndicatorForm,
        TopicForm,
        DirectIndicatorForm,
        IndirectIndicatorForm
    },
    data () {
        return {
            checkSavingStatus: false,
            TopicSavingStatus: {},
            to: null,
            allowRouting: false,
            unsavedChangesDialog: false,
            discardUnsavedChanges: false,
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
        ...mapState('directIndicator', { activeDirectIndicator: 'directIndicator', directIndicatorErrors: 'errors' }),
        ...mapGetters('directIndicator', ['topicDirectIndicators']),
        ...mapState('indirectIndicator', { activeIndirectIndicator: 'indirectIndicator', indirectIndicatorErrors: 'errors' }),
        ...mapGetters('indirectIndicator', ['topicIndirectIndicators']),
        items2 () {
            return getMethodItems2(
                this.methodTopics,
                this.subTopics,
                this.topicDirectIndicators,
                this.topicIndirectIndicators
            )
        },
        activeItem () {
            let objType = 'topic'
            let { id } = this.activeTopic
            if (this.activeDirectIndicator.id) {
                objType = 'direct-indicator'
                id = this.activeDirectIndicator.id
            }
            if (this.activeIndirectIndicator.id) {
                objType = 'indirect-indicator'
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
    watch: {
        TopicSavingStatus: {
            handler (val) {
                console.log(Object.keys(val).length)
                if ((Object.keys(val).length === this.topics.length) & (!Object.keys(this.topicErrors).length)) {
                    for (const key in val) {
                        if (val[key]) {
                            this.TopicSavingStatus = {}
                            this.unsavedChangesDialog = true
                            return
                        }
                    }
                    this.allowRouting = true
                    this.$router.push(this.to)
                }
            },
            deep: true
        }
    },
    beforeRouteLeave (to, from, next) {
        console.log('cheeck')
        if (!this.topics.length) { this.allowRouting = true }
        if (this.allowRouting || this.discardUnsavedChanges) { //  & !this.discardUnsavedChanges
            next(true)
        } else {
            this.to = to
            this.allowRouting = false
            this.checkSavingStatus = !this.checkSavingStatus
            next(false)
        }
    },
    methods: {
        ...mapActions('method', ['fetchMethod', 'updateMethod', 'saveMethod']),
        ...mapActions('topic', ['fetchTopics', 'setTopic', 'createTopic', 'updateTopic', 'addNewTopic', 'deleteTopic']),
        ...mapActions('directIndicator', ['fetchDirectIndicators', 'setDirectIndicator', 'addNewDirectIndicator', 'updateDirectIndicator', 'patchDirectIndicator', 'deleteDirectIndicator']),
        ...mapActions('indirectIndicator', ['fetchIndirectIndicators', 'setIndirectIndicator', 'addNewIndirectIndicator', 'updateIndirectIndicator', 'patchIndirectIndicator', 'deleteIndirectIndicator']),
        startDrag (evt, item) {
            evt.dataTransfer.dropEffect = 'move'
            evt.dataTransfer.effectAllowed = 'move'
            if (typeof item === 'object') {
                item = JSON.stringify(item)
            }
            evt.dataTransfer.setData('draggedItem', item)
        },
        async onDrop (evt, topic) {
            const myitem = evt.dataTransfer.getData('draggedItem')
            console.log(myitem)
            const parseditem = JSON.parse(myitem)
            if (!topic.id || !parseditem.id) { return }
            if ((parseditem.objType === 'direct-indicator')) {
                await this.patchDirectIndicator({ mId: this.method.id, id: parseditem.id, data: { topic: topic.id } })
            } else if (parseditem.objType === 'indirect-indicator') {
                await this.patchIndirectIndicator({ mId: this.method.id, id: parseditem.id, data: { topic: topic.id } })
            }
        },
        addBarMethod (choice) {
            if (choice === 'Topic') { this.addTopic() }
            if (choice === 'SubTopic') { this.addSubTopic() }
        },
        async addTopic () {
            await this.createTopic({ mId: this.method.id }) // addNewTopic()
            this.setDirectIndicator()
            this.setIndirectIndicator()
        },
        async addSubTopic () {
            let parentTopic = this.activeTopic.id
            if (this.activeTopic.parent_topic) {
                parentTopic = this.activeTopic.parent_topic
            }
            await this.createTopic({ mId: this.method.id, parent: parentTopic })
            // this.addNewTopic({ parent: this.currentTopic.id || this.activeTopic.parent_topic }) // this.activeTopic.parent_topic || this.activeTopic.id
            this.setDirectIndicator()
            this.setIndirectIndicator()
        },
        async refreshSidebar () {
            await this.fetchDirectIndicators({ mId: this.method.id })
            await this.fetchIndirectIndicators({ mId: this.method.id })
        },
        toggleActive (item) {
            const { objType } = item
            const topic = { id: item.topic || item.id }
            if (objType === 'topic') {
                this.setTopic(topic)
                this.setDirectIndicator()
                this.setIndirectIndicator()
            } else if (objType === 'direct-indicator' && item.id !== this.activeDirectIndicator.id) {
                console.log('check')
                this.setDirectIndicator(item)
                this.setIndirectIndicator()
            } else if (objType === 'indirect-indicator' && item.id !== this.activeIndirectIndicator.id) {
                this.setIndirectIndicator(item)
                this.setDirectIndicator()
            }
        },
        // async saveActive (type, object) {
        //     if (object.target) { return } // Checks whether the $event contains an object or only an inputEvent
        //     console.log('saving object...', object)
        //     if (type === 'topic') {
        //         await this.updateTopic({
        //             mId: this.method.id,
        //             topic: object
        //         })
        //         // await this.fetchTopics({ mId: this.method.id || this.$route.params.id })
        //     }
        //     if (type === 'direct-indicator') {
        //         await this.updateDirectIndicator({
        //             mId: this.method.id,
        //             directIndicator: object
        //         })
        //     }
        //     if (type === 'indirect-indicator') {
        //         await this.updateIndirectIndicator({
        //             mId: this.method.id,
        //             indirectIndicator: object
        //         })
        //     }
        // },
        deleteActive () {
            const objType = this.activeItem.objType
            const id = this.activeItem.id
            if (objType === 'topic') {
                this.deleteTopic({ mId: this.method.id, id })
            }
            if (objType === 'direct-indicator') {
                this.deleteDirectIndicator({ mId: this.method.id, SuId: 0, SeId: 0, id: id })
            }
            if (objType === 'indirect-indicator') {
                this.deleteIndirectIndicator({ mId: this.method.id, id })
            }
        },
        savingStatus (topic, status) {
            console.log('eeeeeeeee', status)
            const key = topic.objType + topic.id
            this.TopicSavingStatus[key] = status
        },
        unsavedChangesChoice (choice) {
            this.unsavedChangesDialog = false
            this.discardUnsavedChanges = choice
            if (choice) {
                this.$router.push(this.to)
            }
        }
    }
}
// delete parseditem.method
// delete parseditem.question
// this.lazyQuestion.direct_indicator = [parseditem]
// console.log('-->', this.lazyQuestion)
//     <!-- <div v-for="(topic, topicIndex) in methodTopics" :key="`topic_${topicIndex}`" class="topicTabs" @click="switchTopic(topic)" @dblclick="topic.edit=true" :style="(currentTopic?.id === topic.id) ? 'border-bottom: 3px solid #00695C; color: #00695C;':''">
//         <InputText v-if="topic.edit" v-model="topic.name" @blur="saveActive('topic', topic)" /> <span v-else>{{topic.name}}</span> <icon class="topic-remove-button pi pi-times" @click="removeTopic(topic)" />
//     </div>
//     <i class="pi pi-plus topic-add-button" @click="addTopic" />
// </div>
// <div v-if="Object.getOwnPropertyNames(currentTopic).length > 0" style="border: 1px solid lightgrey;">
//     <h3 v-if="true" class="p-col p-text-center p-text-italic p-text-light p-m-5 p-p-5" style="border: 2px dashed rgba(192,192,192,0.7); background-color:rgba(192,192,192,0.25); color: grey;"  @drop='onDrop($event, currentTopic)'  @dragover.prevent @dragenter.prevent >'Add Indicator to the main topic by dragging it into the box'</h3>
//     <div v-for="(topicChild, index) in items.children" :key="`topicChild_${index}`">
//         <div :class="(topicChild?.children?.length ? 'p-pb-2': 'p-p-0')" style="background-color: #fcfcfc;">
//             <component :is="`${topicChild.objType}-form`" :errors="errors[topicChild.objType] && errors[topicChild.objType][topicChild.id]" :topic="topicChild" :question="topicChild" :direct-indicator="topicChild" :indirect-indicator="topicChild" :active="topicChild.objType === 'topic' && activeItem.id === topicChild.id" @input="saveActive(topicChild.objType, $event)" @click="toggleActive(topicChild)" @delete="deleteActive(topicChild.objType, $event)" @dragstart="startDrag($event, topicChild)" @dragover.prevent @dragenter.prevent :draggable="true" :check-saving-status="checkSavingStatus" @savingstatus="savingStatus(topicChild, $event)" />
//             <div v-for="(subTopicChild, idx) in topicChild.children" :key="`subTopicChild-${idx}`">
//                 <component :is="`${subTopicChild.objType}-form`" :errors="errors[subTopicChild.objType] && errors[subTopicChild.objType][subTopicChild.id]" :topic="subTopicChild" :question="subTopicChild" :direct-indicator="subTopicChild" :indirect-indicator="subTopicChild"  :active="activeItem.objType === subTopicChild.objType && activeItem.id === subTopicChild.id" @input="saveActive(subTopicChild.objType, $event)"  @click="toggleActive(subTopicChild)" @delete="deleteActive(subTopicChild.objType, $event)" @dragstart="startDrag($event, subTopicChild)" @dragover.prevent @dragenter.prevent :draggable="true" class="p-m-5" />
//             </div>
//             <h3 v-if="(topicChild.objType === 'topic')" class="p-col p-text-center p-text-italic p-text-light p-m-5 p-p-5" style="border: 2px dashed rgba(192,192,192,0.7); background-color:rgba(192,192,192,0.25);color: grey;"  @drop='onDrop($event, topicChild)'  @dragover.prevent @dragenter.prevent >'Add Indicator by dragging it into the box'</h3>
//         </div>
//     </div>
// </div> --> <!-- Object.getOwnPropertyNames(currentTopic).length > 0" -->
// // const self = this
// console.log(this.$refs)
// // this.$refs.items.$el.addEventListener('click', function (event) { // self.$refs.items?.$el.contains(event.target))
// //     alert('.dd.')
// // })
// document.addEventListener('click', function (event) {
//     if (this.$refs.items === event.target) { alert('...') }
// })
// //     console.log(event.target)
// //     alert('..')
// //     if (this.$refs.items === event.target) { }
// // })
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
