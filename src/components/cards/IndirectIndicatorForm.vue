<template>
    <div class="p-grid p-my-0 p-mr-0 p-p-3 p-py-1 p-shadow-1 p-text-left" :style="[(hover) ? 'background-color: white;':'background-color: #F7F7F7;']" style="border: 1px solid lightgrey;" @mouseover="hover=true" @mouseleave="hover=false"> <!-- #dcdcdc"> -->
        <!-- <h3 class="p-col p-text-center p-m-0">Indirect Indicator - [{{indirectIndicator.key || 'No Key'}}]</h3> -->
        <div class="attribute-name p-col-4 p-m-0 p-p-0"><span class="value">{{ indirectIndicator.key || 'None' }}</span></div>
        <div class="p-col-2"></div>
        <div class="attribute-name p-col p-m-0 p-p-0"><small class="value">{{ indirectIndicator.formula || 'No Formula' }}</small></div>
        <i class="pi pi-times p-d-flex p-jc-center p-ai-center p-ml-5" style="font-size: 20px; color: red; cursor: pointer;" @click="removeFromTopic()" />
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
    props: {
        indirectIndicator: {
            type: String,
            required: undefined
        }
    },
    data () {
        return {
            hover: false
        }
    },
    computed: {
        ...mapState('method', ['method'])
    },
    methods: {
        ...mapActions('indirectIndicator', ['patchIndirectIndicator']),
        async removeFromTopic () {
            await this.patchIndirectIndicator({ mId: this.method.id, id: this.indirectIndicator.id, data: { topic: null } })
        }
    }
}
</script>

<style lang="scss" scoped>
.attribute-name {
    font-size: 16px;
    font-weight: bold;
}
.value {
    font-weight: normal;
}
</style>
