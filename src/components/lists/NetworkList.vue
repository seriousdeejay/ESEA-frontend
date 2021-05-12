<template>
        <ProgressSpinner v-if="loading" />
        <div v-else-if="networks.length" class="p-grid p-m-5">
                <div v-for="network in filteredNetworks" :key="network.id" class="p-col-12 p-md-6 p-lg-4" style="width: 300px; height: auto;">
                        <div class="p-p-3" :class="network.hover ? 'p-shadow-2 p-m-1' : 'p-shadow-1 p-m-2'" :style="(network.hover ? styleObject : '')" @mouseover="network.hover=true" @mouseleave="network.hover=false" @click.left="goToNetwork(network)">
                                <img :src="network.image" alt="Network Image" style="max-width: 150px; max-height: 150px; border-radius: 50%;" format="PNG" />
                                <p class="p-text-italic">{{network.name}}</p>
                        </div>
                </div>
        </div>
        <div v-else class="p-text-italic">No Networks to display!</div>
</template>

<script>
    import ProgressSpinner from 'primevue/progressspinner'

    export default {
        components: {
            ProgressSpinner
        },
        props: {
            networks: {
                type: Array,
                default: () => []
            },
            search: {
                type: String,
                default: ''
            },
            loading: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                styleObject: { backgroundColor: '#EFEEEE' }
            }
        },
        computed: {
            filteredNetworks () {
                return this.networks.filter(network => { return network.name.toLowerCase().includes(this.search.toLowerCase()) })
            }
        },
        methods: {
            goToNetwork (network) {
                this.$emit('clicked-network', network)
            }
        }
    }
</script>
