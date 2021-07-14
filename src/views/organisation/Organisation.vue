<template>
    <div class="p-grid" style="height: 100vh;">
        <div class="p-col-fixed" style="width: 50px;">
            <!-- <organisation-sidebar :links="links" :name="organisation.name" @reroute="goToPage" /> -->
            <sub-sidebar :links="links" />
        </div>
        <div class="p-col p-px-5">
            <div class="p-col-12 p-text-left p-text-italic p-m-0">
                <p>{{organisation.name}}</p>
                <h3>{{pagename || this.$route.meta.breadcrumb[this.$route.meta.breadcrumb.length-1].label}}</h3>
            </div>
            <router-view />
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
// import OrganisationSidebar from '../../components/OrganisationSidebar'
import SubSidebar from '../../components/SubSidebar'

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
                    path: 'organisationoverview'
                },
                {
                    name: 'Networks',
                    icon: 'pi pi-cloud',
                    path: 'organisationnetworks'
                },
                {
                    name: 'Esea Accounts',
                    icon: 'pi pi-book',
                    path: 'organisationeseaaccounts'
                },
                {
                    name: 'Reports',
                    icon: 'pi pi-chart-bar',
                    path: 'organisationreports'
                },
                // {
                //     name: 'Surveys',
                //     icon: 'pi pi-book',
                //     path: 'organisationsurveys'
                // },
                // {
                //     name: 'Stakeholders',
                //     icon: 'pi pi-users',
                //     path: 'organisationstakeholders'
                // },
                {
                    name: 'Team',
                    icon: 'pi pi-users',
                    path: 'organisationteam'
                },
                {
                    name: 'Settings',
                    icon: 'pi pi-cog',
                    path: 'organisationsettings'
                }
            ]
            // links: [
            //     { label: 'Overview', icon: 'home' },
            //     // { label: 'Methods', icon: 'chart-bar' },
            //     { label: 'EseaAccounts', icon: 'book' },
            //     { label: 'Reports', icon: 'chart-bar' },
            //     { label: 'Surveys', icon: 'book' },
            //     { label: 'Stakeholders', icon: 'users' },
            //     { label: 'Networks', icon: 'cloud' },
            //     { label: 'Settings', icon: 'cog' }
            // ],
            // pagename: undefined
        }
    },
    computed: {
        ...mapState('organisation', ['organisation'])
    },
    methods: {
        goToPage (name) {
            this.pagename = name
            this.$router.push({ name: `organisation${name.toLowerCase()}`, params: { OrganisationId: this.organisation?.id } })
        }
    }
}
</script>
