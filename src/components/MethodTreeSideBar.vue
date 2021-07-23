<template>
    <div style="">
        <h2>Indicator Libary</h2>
        <!-- <div v-if="items.length">
        <Tree :value="items" v-model:selectionKeys="selectedKey1" selectionMode="single" :expandedKeys="expandedKeys" @nodeSelect="activateItem" style="border-top: 3px solid lightgrey;" />
        </div>
        <div v-else> No components to display!</div> -->
        <!-- <TreeSelect /> -->
        <div class="p-ml-1 p-mt-5" style="height: 50px;">
        <div v-if="!searchbarDirect" class="p-px-3 p-d-flex p-jc-between p-ai-center" @click="searchbarDirect = !searchbarDirect"><h3>Direct Indicators</h3><i class="pi pi-search" /></div>
        <span v-else class="p-input-icon-left" style="width: 100%;">
                        <i class="pi pi-search" /><InputText ref="searchbardirect" v-model="searchDirect" @blur="checkSearchbarContentDirect" placeholder="Search Direct Indicators..." style="width: 100%;" />
                    </span>
        </div>
        <hr>
        <div v-for="indicator in filteredDirectIndicators" :key="indicator.id" class="directIndicators" style="height: 50px; line-height: 50px; border: 1px solid white; cursor: grab;" :style="(indicator.key === activeDirectIndicator.key) ? 'background-color: #EEEEEE;':''" :draggable="true">
            {{indicator.key}}
        </div>

        <div class="p-ml-1 p-mt-5" style="height: 50px;">
        <div v-if="!searchbarIndirect" class="p-px-3 p-d-flex p-jc-between p-ai-center" @click="searchbarIndirect = !searchbarIndirect"><h3>Indirect Indicators</h3><i class="pi pi-search" /></div>
        <span v-else class="p-input-icon-left" style="width: 100%;">
                        <i class="pi pi-search" /><InputText ref="searchbarindirect" v-model="searchIndirect" @blur="checkSearchbarContentIndirect" placeholder="Search Indirect Indicators..." style="width: 100%;" />
                    </span>
        </div>
        <hr>
        <div v-for="indicator in filteredIndirectIndicators" :key="indicator.id" class="directIndicators" style="height: 50px; line-height: 50px; border-bottom: 1px solid lightgrey; cursor: grab;" :style="(indicator.key === activeIndirectIndicator.key) ? 'background-color: #EEEEEE;':''" :draggable="true">
            {{indicator.key}}
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
import getMethodItems from '../utils/getMethodItems'
// import Tree from 'primevue/tree'
// import TreeSelect from 'primevue/treeselect'

export default {
    components: {
        // Tree
        // TreeSelect
    },
    data () {
        return {
            indicatorss: [
                { key: 'indicator_1' },
                { key: 'indicator_2' },
                { key: 'indicator_3' },
                { key: 'indicator_4' }
            ],
            searchbarDirect: false,
            searchbarIndirect: false,
            searchDirect: '',
            searchIndirect: '',
            selectedKey1: null,
            expandedKeys: {}
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
                return (indicator.key.toLowerCase().includes(this.searchDirect.toLowerCase()))
            })
        },
        filteredIndirectIndicators () {
            return this.indirectIndicators.filter((indicator) => {
                return (indicator.key.toLowerCase().includes(this.searchIndirect.toLowerCase()))
            })
        },
		items () {
            const data = getMethodItems(this.methodTopics,
				this.subTopics,
				this.topicQuestions,
				this.topicIndirectIndicators)
            if (data?.length) {
                for (const topic of data) {
                    topic.label = topic.name
                    if (topic?.children?.length) {
                        for (const subtopic of topic?.children) {
                            subtopic.label = subtopic.name
                            if (subtopic?.children?.length) {
                            for (const indicator of subtopic?.children) {
                                indicator.label = indicator.name
                                if (indicator.objType === 'calculation') {
                                    indicator.icon = 'pi pi-percentage'
                                } else {
                                    indicator.icon = 'pi pi-pencil'
                                }
                            }
                            }
                        }
                    }
                }
            }
            return data
        }
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
    mounted () {
        this.expandAll()
        this.fetchItems()
    },
    methods: {
        ...mapActions('topic', ['setTopic']),
		...mapActions('question', ['fetchQuestions', 'setQuestion']),
		...mapActions('indirectIndicator', [
			'setIndirectIndicator',
			'updateIndirectIndicator'
		]),
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
        },
        expandAll () {
            for (const node of this.items) {
                this.expandNode(node)
            }

            this.expandedKeys = { ...this.expandedKeys }
        },
        expandNode (node) {
            this.expandedKeys[node.key] = true
            if (node.children && node.children.length) {
                for (const child of node.children) {
                    this.expandNode(child)
                }
            }
        }
    }
}
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
</script>

<style lang="scss" scoped>
.p-tree {
    background: none;
    border: 1px solid lightgray;
}
.directIndicators:hover {
    background-color: #EEEEEE;
}
</style>
