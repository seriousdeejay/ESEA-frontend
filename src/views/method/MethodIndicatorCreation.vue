<template>
    <div class="p-d-flex" style="height: calc(100vh - 145px); border-top: solid lightgrey;">
        <method-tree-sidebar style="height: 100%;" />
        <div class="p-px-5" style="width: 100%; background-color: #EFEFE8FF; overflow-y: scroll;">
            <div v-for="indicator in items" :key="indicator.key">
                <component :is="`${indicator.objType}-form`" :errors="errors[indicator.objType] && errors[indicator.objType][indicator.id]" ref="items"
                :direct-indicator="indicator" :indirect-indicator="indicator" :active="activeItem.objType === indicator.objType && activeItem.id === indicator.id"
                @input="saveActive(indicator.objType, $event)" @click="toggleActive(indicator)" @delete="deleteActive(indicator.objType, $event)" />
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
    <!-- <div class="p-d-flex p-ai-center p-shadow-5" style="position: fixed; top: 10%; right: 0px; width: 100px; background-color: #fcfcfc; border: 2px solid grey;">
        <div>
            <div v-for="option in addBar" :key="option.choice" class="p-d-flex p-jc-center p-ai-center" style="height: 100px; width: 100px; border: 1px solid lightgrey" :style="(option.hover ? 'background-color: lightgrey;' : '')" @mouseover="option.hover=true" @mouseleave="option.hover=false" @click="addBarMethod(option.choice)">
                <div>
                    <i :class="option.icon? option.icon : 'pi pi-plus'" />
                    <p class="p-text-italic p-m-2">{{option.choice}}</p>
                </div>
            </div>
        </div>
    </div> -->
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import MethodTreeSidebar from '@/components/MethodTreeSideBar'
import CalculationForm from '@/components/forms/CalculationForm'
import IndicatorForm from '@/components/forms/IndicatorForm'

export default {
    components: {
        MethodTreeSidebar,
        CalculationForm,
        IndicatorForm
    },
    data () {
        return {
            addBar: [
                { choice: 'indicator' },
                { choice: 'calculation' }
            ]
        }
    },
    computed: {
        ...mapState('method', ['method']),
         ...mapState('directIndicator', { activeDirectIndicator: 'directIndicator', directIndicators: 'directIndicators', directIndicatorErrors: 'errors' }),
        ...mapGetters('directIndicator', ['topicDirectIndicators']),
        ...mapState('indirectIndicator', { activeIndirectIndicator: 'indirectIndicator', indirectIndicators: 'indirectIndicators', indirectIndicatorErrors: 'errors' }),
        ...mapGetters('indirectIndicator', ['topicIndirectIndicators']),

        items () {
            this.directIndicators.forEach(direct => { direct.objType = 'indicator' })
             this.indirectIndicators.forEach(indirect => { indirect.objType = 'calculation' })
            return this.directIndicators.concat(this.indirectIndicators)
        },
        activeItem () {
            let objType = null
            let id = null
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
                calculation: this.indirectIndicatorErrors
            }
        }
    },
    created () {
        this.initialize()
    },
    methods: {
        ...mapActions('method', ['fetchMethod', 'updateMethod', 'saveMethod']),
        ...mapActions('topic', ['fetchTopics', 'setTopic', 'createTopic', 'updateTopic', 'addNewTopic', 'deleteTopic']),
        ...mapActions('directIndicator', ['fetchDirectIndicators', 'setDirectIndicator', 'addNewDirectIndicator', 'updateDirectIndicator', 'deleteDirectIndicator']),
        ...mapActions('indirectIndicator', ['fetchIndirectIndicators', 'addNewIndirectIndicator', 'updateIndirectIndicator', 'setIndirectIndicator', 'deleteIndirectIndicator']),
        async initialize () {
            const methodId = parseInt(this.$route.params.id, 10)
            if (this.method.id !== methodId) {
                await this.fetchMethod({ id: methodId })
                if (this.error) {
                    this.$router.push({ name: 'methods' })
                }
            }
            await this.fetchDirectIndicators({ mId: this.method.id })
            await this.fetchIndirectIndicators({ mId: this.method.id })
        },
        addBarMethod (choice) {
            if (choice === 'indicator') { this.addDirectIndicator() }
            if (choice === 'calculation') { this.addIndirectIndicator() }
        },
        addDirectIndicator () {
            this.addNewDirectIndicator({ mId: this.method.id })
            this.setIndirectIndicator()
        },
        addIndirectIndicator () {
            this.addNewIndirectIndicator({ mId: this.method.id })
            this.setDirectIndicator()
        },
        toggleActive (item) {
            const { objType } = item
            console.log('yeeeha', item)
            if (objType === 'indicator' && item.id !== this.activeDirectIndicator.id) {
                this.setDirectIndicator(item)
                this.setIndirectIndicator()
            } else if (objType === 'calculation' && item.id !== this.activeIndirectIndicator.id) {
                this.setIndirectIndicator(item)
                this.setDirectIndicator()
            }
        },
        saveActive (type, object) {
            if (object.target) { return } // Checks whether the $event contains an object or only an inputEvent
            console.log('saving object...')
            if (type === 'indicator') {
                this.updateDirectIndicator({
                    mId: this.method.id,
                    directIndicator: object
                })
            }
            if (type === 'calculation') {
                console.log(';reee')
                this.updateIndirectIndicator({
                    mId: this.method.id,
                    indirectIndicator: object
                })
            }
        },
        deleteActive (objType, object) {
            console.log('ddddd', object)
            if (objType === 'indicator') {
                this.deleteDirectIndicator({ mId: this.method.id, SuId: 0, SeId: 0, id: object.id })
            }
            if (objType === 'calculation') {
                this.deleteIndirectIndicator({ mId: this.method.id, SuID: 0, SeId: 0, id: object.id })
            }
        }
    }
}
</script>
