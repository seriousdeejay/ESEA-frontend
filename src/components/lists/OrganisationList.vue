<template>
    <ProgressSpinner v-if="loading" />
    <div v-else-if="filteredOrganisations.length" class="p-grid p-m-5">
        <div v-for="organisation in filteredOrganisations" :key="organisation.id" class="p-col-12 p-md-6 p-lg-4" style="width: 300px; height: auto;">
            <div class="p-p-3" :class="organisation.hover ? 'p-shadow-2 p-m-1' : 'p-shadow-1 p-m-2'" :style="(organisation.hover ? styleObject : '')" @mouseover="organisation.hover=true" @mouseleave="organisation.hover=false" @click.left="goToOrganisation(organisation)">
                <img :src="organisation.image" alt="Organisation Image" style="max-width: 150px; max-height: 150px; border-radius: 50%;" format="PNG" />
                <p class="p-text-italic">{{organisation.name}}</p>
            </div>
        </div>
    </div>
    <h3 v-else class="p-text-light p-text-italic">No Organisations to display!</h3>
</template>

<script>
    import ProgressSpinner from 'primevue/progressspinner'

    export default {
        components: {
            ProgressSpinner
        },
        props: {
            organisations: {
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
            filteredOrganisations () {
                return this.organisations.filter(organisation => { return organisation.name.toLowerCase().includes(this.search.toLowerCase()) })
            }
        },
        methods: {
            goToOrganisation (organisation) {
                this.$emit('clicked-organisation', organisation)
            }
        }
    }
</script>
