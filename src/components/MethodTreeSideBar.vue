<template>
    <div style="width: 400px;">
        <div class="p-d-flex p-mt-2">
            <div v-for="item in libraryComponents" :key="item" class="p-col-6" style="font-size: 20px;" :style="(item === activeComponentType) ? 'border-bottom: 3px solid  #00695C; font-weight: bold;':'border-bottom: 3px solid lightgrey;'" @click="activeComponentType = item">
                {{item}}
            </div>
        </div>
        <div v-if="activeComponentType === 'Calculations'" class="p-text-left">
            <div class="p-m-2" style="height: 50px;">
                 <div class="p-d-flex p-mt-2" style="">
                    <div v-for="item in ComponentOptions" :key="item" class="p-col-4" style="font-size: 14px;" :style="(item === activeComponentOption) ? 'border-bottom: 1px solid #00695C; font-size;':'border-bottom: 1px solid lightgrey;'" @click="activeComponentOption = item">
                        {{item}}
                    </div>
                </div>
                <div v-if="!searchbarCalculations" class="p-px-3 p-d-flex p-jc-between p-ai-center" @click="searchbarCalculations = !searchbarCalculations">
                    <h3>Indicators</h3><i class="pi pi-search" />
                </div>
                <span v-else class="p-input-icon-left" style="width: 100%">
                    <i class="pi pi-search" /><InputText ref="searchbarQuestions" v-model="searchCalculation" @blur="checkSearchbarContentQuestion" placeholder="Search Indirect Indicators..." style="width: 100%;" />
                </span>
            </div>
            <div class="p-mt-5" style="height: calc(100vh - 350px); overflow-y: scroll;">
                <div v-for="calculation in filteredIndirectIndicators" :key="calculation.id" class="questions p-px-3" style="font-size: 16px; padding: 10px; overflow: hidden; border: 1px solid lightgrey; cursor: grab;" :style="(calculation.id === active?.id) ? 'background-color: #EEEEEE;':''" :draggable="true">
                    {{calculation.name}}
                </div>
            </div>
            <!-- <div style="height: calc(100vh - 350px); overflow-y: scroll;">
                <div v-for="question in filteredQuestions" :key="question.id" class="questions p-px-3" style="font-size: 16px; padding: 10px; overflow: hidden; border: 1px solid lightgrey; cursor: grab;" :style="(question.id === activeQuestion?.id) ? 'background-color: #EEEEEE;':''" :draggable="true">
                    {{question.name}}
                </div>
            </div> -->
        </div>
         <!-- <div v-if="activeComponentType === 'Indicators'" class="p-text-left"> </div>
            <div class="p-m-2" style="height: 50px;"> -->
                <div v-if="activeComponentType === 'Indicators'" class="p-text-left">
                <div class="p-m-2" style="height: 50px;">
                     <div class="p-d-flex p-mt-2" style="">
                        <div v-for="item in ComponentOptions" :key="item" class="p-col-4" style="font-size: 14px;" :style="(item === activeComponentOption) ? 'border-bottom: 1px solid #00695C; font-size;':'border-bottom: 1px solid lightgrey;'" @click="activeComponentOption = item">
                            {{item}}
                        </div>
                    </div>

                    <div v-if="!searchbarIndicators" class="p-px-3 p-d-flex p-jc-between p-ai-center" @click="searchbarIndicators = !searchbarIndicators" @blur="searchbarIndicators = false">
                        <h3>Direct Indicators</h3><i class="pi pi-search" />
                    </div>
                <span v-else class="p-input-icon-left" style="width: 100%">
                    <i class="pi pi-search" /><InputText ref="searchbarQuestions" v-model="searchIndicator" @blur="checksSearchbarContentIndicator" placeholder="Search Direct Indicators..." style="width: 100%;" />
                </span>
            </div>
            <div class="p-mt-5" style="height: calc(100vh - 280px); overflow-y: scroll;">
                <div v-for="indicator in filteredDirectIndicators" :key="indicator.id" class="directIndicators" style="font-size: 16px; padding: 10px; overflow: hidden; border: 1px solid lightgrey; cursor: grab;"  @dragstart="startDrag($event, indicator)" @dragover.prevent @dragenter.prevent :draggable="true">
                    {{indicator.key}}
                </div>
            </div>
        </div>

        <div class="p-d-flex p-ai-center p-shadow-5" style="position: fixed; top: 45%; right: 0px; width: 100px; background-color: #fcfcfc; border: 2px solid grey;">
            <div>
                <div v-for="option in addBar" :key="option.choice" class="p-d-flex p-jc-center p-ai-center" style="height: 100px; width: 100px; border: 1px solid lightgrey" :style="(option.hover ? 'background-color: lightgrey;' : '')" @mouseover="option.hover=true" @mouseleave="option.hover=false" @click="addBarMethod(option.choice)">
                    <div>
                        <i :class="option.icon? option.icon : 'pi pi-plus'" />
                        <p class="p-text-italic p-m-2">{{option.choice}}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- <div v-for="question in methodQuestions" :key="question.id">
        {{question.name}}
    </div> -->
    <!-- {{selectedKey1}}
    {{items}} -->
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
// import getMethodItems from '../utils/getMethodItems'
// import Tree from 'primevue/tree'
// import TreeSelect from 'primevue/treeselect'

export default {
    components: {
        // Tree
        // TreeSelect
    },
    data () {
        return {
            libraryComponents: ['Indicators', 'Calculations'],
            ComponentOptions: ['Unused', 'Used', 'All'],
            activeComponentType: 'Calculations',
            activeComponentOption: 'Unused',
            searchbarCalculations: true,
            searchQuestion: '',
            searchbarIndicators: true,
            searchIndicator: '',
            indicatorss: [
                { key: 'indicator_1' },
                { key: 'indicator_2' },
                { key: 'indicator_3' },
                { key: 'indicator_4' }
            ],
            addBar: [
                    { choice: 'indicator' },
                    { choice: 'calculation' }
                ],
            searchbarDirect: false,
            searchbarIndirect: false,
            searchDirect: '',
            searchIndirect: ''
            // selectedKey1: null,
            // expandedKeys: {}
        }
    },
    computed: {
        ...mapState('method', ['method']),
        ...mapState('topic', { activeTopic: 'topic' }),
        ...mapState('question', { activeQuestion: 'question', methodQuestions: 'questions' }),
        ...mapState('directIndicator', { activeDirectIndicator: 'directIndicator', directIndicators: 'directIndicators' }),
		...mapState('indirectIndicator', { activeIndirectIndicator: 'indirectIndicator', indirectIndicators: 'indirectIndicators' }),

        ...mapGetters('topic', ['methodTopics', 'subTopics']),
		...mapGetters('question', { topicQuestions: 'topicQuestions' }),
		...mapGetters('indirectIndicator', ['topicIndirectIndicators']),
        filteredDirectIndicators () {
            return this.directIndicators.filter((indicator) => {
                return (indicator.key?.toLowerCase().includes(this.searchDirect.toLowerCase()))
            })
        },
        filteredIndirectIndicators () {
            if (this.indirectIndicators.length) {
            return this.indirectIndicators.filter((indicator) => {
                return (indicator.key?.toLowerCase().includes(this.searchIndirect.toLowerCase()))
            })
            } else { return [] }
        }
		// items () {
        //     const data = getMethodItems(this.methodTopics,
		// 		this.subTopics,
		// 		this.topicQuestions,
		// 		this.topicIndirectIndicators)
        //     if (data?.length) {
        //         for (const topic of data) {
        //             topic.label = topic.name
        //             if (topic?.children?.length) {
        //                 for (const subtopic of topic?.children) {
        //                     subtopic.label = subtopic.name
        //                     if (subtopic?.children?.length) {
        //                     for (const indicator of subtopic?.children) {
        //                         indicator.label = indicator.name
        //                         if (indicator.objType === 'calculation') {
        //                             indicator.icon = 'pi pi-percentage'
        //                         } else {
        //                             indicator.icon = 'pi pi-pencil'
        //                         }
        //                     }
        //                     }
        //                 }
        //             }
        //         }
        //     }
        //     return data
    //     }
    },
    watch: {
        activeItem () {
            if (this.activeQuestion.id) {
				this.itemsOpen.push(`topic_${this.activeQuestion.topic}`)
			}
			if (this.activeIndirectIndicator.id) {
				this.itemsOpen.push(`topic_${this.activeIndirectIndicator.topic}`)
			}
			if (this.activeTopic.parent_topic) {
				this.itemsOpen.push(`topic_${this.activeTopic.parent_topic}`)
			}
        },
        searchbarDirect (val) {
            if (val) {
                this.$nextTick(() => this.$refs.searchbardirect.$el.focus())
            }
        },
        searchbarIndirect (val) {
            if (val) {
                this.$nextTick(() => this.$refs.searchbarindirect.$el.focus())
            }
        }
    },
    crated () {
        this.fetchItems()
    },
    methods: {
        ...mapActions('topic', ['setTopic']),
		...mapActions('question', ['fetchQuestions', 'setQuestion']),
		...mapActions('indirectIndicator', [
			'setIndirectIndicator',
			'updateIndirectIndicator'
		]),
          startDrag (evt, item) {
            console.log(item)
            evt.dataTransfer.dropEffect = 'move'
            evt.dataTransfer.effectAllowed = 'move'
            if (typeof item === 'object') {
                item = JSON.stringify(item)
            }
            evt.dataTransfer.setData('draggedItem', item)
            this.directIndicators = this.directIndicators.filter(indicator => indicator.id !== item.id)
        },
        async fetchItems () {
            await this.fetchQuestions({ mId: this.method.id, SuId: 0, SeId: 0 })
        },
        activateItem (item) {
            console.log('ss', item)
        },
		setActiveItem (active) {
			const [type, id] = active.split('_')
			const parsedId = parseInt(id, 10)
			if (type === 'topic') {
				this.setTopic({ id: parsedId })
				this.setQuestion()
				this.setIndirectIndicator()
			} else if (type === 'question') {
				this.setQuestion({ id: parsedId })
				this.setIndirectIndicator()
			} else if (type === 'calculation') {
				this.setIndirectIndicator({ id: parsedId })
				this.setQuestion()
			}
        },
        addToCalculation (item) {
			this.updateIndirectIndicator({
				mId: this.method.id,
				indirectIndicator: {
					...this.activeIndirectIndicator,
					formula: `${this.activeIndirectIndicator.formula} [${item.key}]`
				}
			})
        },
        checkSearchbarContentDirect () {
            if (this.searchDirect === '') {
                this.searchbarDirect = false
            }
        },
        checkSearchbarContentIndirect () {
            if (this.searchIndirect === '') {
                this.searchbarIndirect = false
            }
        }
        // expandAll () {
        //     for (const node of this.items) {
        //         this.expandNode(node)
        //     }

        //     this.expandedKeys = { ...this.expandedKeys }
        // },
        // expandNode (node) {
        //     this.expandedKeys[node.key] = true
        //     if (node.children && node.children.length) {
        //         for (const child of node.children) {
        //             this.expandNode(child)
        //         }
        //     }
        // }
    }
}
</script>

<style lang="scss" scoped>
.p-tree {
    background: none;
    border: 1px solid lightgray;
}
.directIndicators:hover {
    background-color: #EEEEEE;
}

//     <div style="width: 300px; justify-content: between;">
//             <h2 class="height: 500px;">Indicator Libary</h2>
//             <!-- <div v-if="items.length">
//             <Tree :value="items" v-model:selectionKeys="selectedKey1" selectionMode="single" :expandedKeys="expandedKeys" @nodeSelect="activateItem" style="border-top: 3px solid lightgrey;" />
//             </div>
//             <div v-else> No components to display!</div> -->
//             <!-- <TreeSelect /> -->
//             <div class="p-ml-1 p-mt-5" style="height: 50px;">
//             <div v-if="!searchbarDirect" class="p-px-3 p-d-flex p-jc-between p-ai-center" @click="searchbarDirect = !searchbarDirect"><h3>Direct Indicators</h3><i class="pi pi-search" /></div>
//             <span v-else class="p-input-icon-left" style="width: 100%;">
//                             <i class="pi pi-search" /><InputText ref="searchbardirect" v-model="searchDirect" @blur="checkSearchbarContentDirect" placeholder="Search Direct Indicators..." style="width: 100%;" />
//                         </span>
//             </div>
//             <hr>
//             <div v-for="indicator in filteredDirectIndicators" :key="indicator.id" class="directIndicators" style="height: 50px; line-height: 50px; border: 1px solid white; cursor: grab;" :style="(indicator.key === activeDirectIndicator.key) ? 'background-color: #EEEEEE;':''" :draggable="true">
//                 {{indicator.key}}
//             </div>

//             <div class="p-ml-1 p-mt-5" style="height: 50px;">
//             <div v-if="!searchbarIndirect" class="p-px-3 p-d-flex p-jc-between p-ai-center" @click="searchbarIndirect = !searchbarIndirect"><h3>Indirect Indicators</h3><i class="pi pi-search" /></div>
//             <span v-else class="p-input-icon-left" style="width: 100%;">
//                             <i class="pi pi-search" /><InputText ref="searchbarindirect" v-model="searchIndirect" @blur="checkSearchbarContentIndirect" placeholder="Search Indirect Indicators..." style="width: 100%;" />
//                         </span>
//             </div>
//             <hr>
//             <div v-for="indicator in filteredIndirectIndicators" :key="indicator.id" class="directIndicators" style="height: 50px; line-height: 50px; border-bottom: 1px solid lightgrey; cursor: grab;" :style="(indicator.key === activeIndirectIndicator.key) ? 'background-color: #EEEEEE;':''" :draggable="true">
//                 {{indicator.key}}
//             </div>
//          <div class="p-d-flex p-ai-center p-shadow-5" style="position: relative; margin-top: 300px; margin-top: 1500; background-color: yellow;">
//             <div v-for="option in addBar" :key="option.choice" class="p-d-flex p-jc-center p-ai-center" style="height: 70px; width: 150px; border: 1px solid lightgrey;" :style="(option.hover) ? 'background-color: lightgrey': ''"  @mouseover="option.hover=true" @mouseleave="option.hover=false" @click="addBarMethod(option.choice)">
//                 <div>
//                     <i :class="option.icon ? option.icon : 'pi pi-plus'" />
//                     <p class="p-text-italic p-m-2">{{option.choice}}</p>
//                 </div>
//             </div>
//         </div>
//     </div>
// const arr = []
// console.log('::', data)
// data.forEach(el => console.log(el)) // arr.push({ label: el.name, key: el.name }))
// return arr
// return arr
// return getMethodItems(
//     this.methodTopics,
//     this.subTopics,
//     this.topicQuestions,
//     this.topicIndirectIndicators
// )
</style>
