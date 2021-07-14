<template>
    <div class="p-grid p-m-0 p-p-0" style="height: 100%;">
        <div class="p-col-fixed p-m-0 p-p-0" style="height: 100%;">
            <!-- <organisation-sidebar :links="links" :name="network.name" @reroute="goToPage"/> -->
            <sub-sidebar :links="links" />
        </div>
        <div class="p-col">
            <div class="p-col-12 p-text-left p-text-italic p-m-0 p-px-5">
                <p>{{network.name}}</p>
                <h3>{{pagename || this.$route.meta.breadcrumb[this.$route.meta.breadcrumb.length-1].label}}</h3>
            </div>
            <router-view />
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
// import OrganisationSidebar from '../../components/OrganisationSidebar'
import SubSidebar from '../../components/SubSidebar.vue'
export default {
    components: {
        // OrganisationSidebar,
        SubSidebar
        },
    data () {
        return {
            links: [
                 {
                    name: 'Overview',
                    icon: 'pi pi-desktop',
                    path: 'networkoverview'
                },
                {
                    name: 'Organisations',
                    icon: 'pi pi-globe',
                    path: 'networkorganisations'
                },
                {
                    name: 'Methods',
                    icon: 'pi pi-file',
                    path: 'networkmethods'
                },
                {
                    name: 'Campaigns',
                    icon: 'pi pi-calendar',
                    path: 'networkcampaigns'
                },
                {
                    name: 'Settings',
                    icon: 'pi pi-cog',
                    path: 'networksettings'
                }
            ]
            // links: [
            //     { label: 'Overview', icon: 'home' },
            //     { label: 'Organisations', icon: 'cloud' },
            //     { label: 'Methods', icon: 'chart-bar' },
            //     { label: 'Campaigns', icon: 'book' },
            //     // { label: 'Stakeholders', icon: 'users' },
            //     { label: 'Settings', icon: 'cog' }
            // ],
            // pagename: undefined
        }
    },
    computed: {
        ...mapState('network', ['network']),
        ...mapState('authentication', ['currentuser'])
    },
    methods: {
        goToPage (name) {
            this.pagename = name
            this.$router.push({ name: `network${name.toLowerCase()}`, params: { NetworkId: this.network?.id || 0 } })
        }
    }
}
</script>
