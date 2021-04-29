import NetworkService from '../../services/NetworkService'
export default {
    namespaced: true,
    state: {
        networks: [],
        network: {},
        // networkorganisations: [],
        error: []
    },
    mutations: {
        setNetworks (state, { data }) {
            state.networks = data
        },
        setNetwork (state, { data }) {
            state.network = data || {}
        },
        updateNetwork (state, { id, data }) {
            state.networks = state.networks.map((item) => {
                if (item.id !== id) { return item }
                return { ...item, ...data }
            })
        },
        deleteNetwork (state, { id }) {
            state.networks = state.networks.filter(n => n.id !== id)
        },
        // setNetworkOrganisations (state, { data }) {
        //     state.networkorganisations = data.organisations || {}
        // },
        // deleteNetworkOrganisations (state, { id }) {
        //     state.networkorganisations = state.networkorganisations.filter(o => o.id !== id)
        // },
        setError (state, { error }) {
            state.error = error
        }
    },
    actions: {
        async fetchNetworks ({ commit }, payload) {
            const { response, error } = await NetworkService.get(payload)
            if (error) {
				commit('setError', { error })
                return
            }
            commit('setNetworks', response)
        },
        async fetchNetwork ({ commit }, payload) {
            const { response, error } = await NetworkService.get(payload)
            if (error) {
                commit('setError', { error })
                return
            }
            commit('setNetwork', response)
            // commit('setNetworkOrganisations', response)
        },
        async createNetwork ({ commit, dispatch }, { data }) {
            const { response, error } = await NetworkService.post({ data: data, headers: { 'Content-Type': 'multipart/form-data' } })
            if (error) {
                commit('setError', { error })
                return
            }
            await dispatch('fetchNetworks', {})
            dispatch('setNetwork', response.data)
        },
        async updateNetwork ({ state, commit }) {
            const id = state.network.id
            const data = state.network
            const { response, error } = await NetworkService.put({ id, data, headers: { 'Content-Type': 'multipart/form-data' } })
            if (error) {
                commit('setError', { error })
                return
            }
            commit('updateNetwork', { ...response, id })
            commit('setNetwork', response)
        },
        async deleteNetwork ({ commit, dispatch }, payload) {
            const { error } = await NetworkService.delete(payload)
            if (error) {
                commit('setError', { error })
                return
            }
            commit('deleteNetwork', payload)
            dispatch('setNetwork', {})
        },
        async patchNetwork ({ state, commit }, payload) {
            const id = parseInt(state.network.id)
            const { response, error } = await NetworkService.patch({ id, data: payload, headers: { 'Content-Type': 'application/json' } })
            if (error) {
                commit('setError', { error })
                return
            }
            commit('updateNetwork', { ...response, id })
            commit('setNetwork', response)
            // commit('deleteNetworkOrganisations', payload)
        },
        setNetwork ({ state, commit }, { id }) {
            if (id) {
                const data = state.networks.find(n => n.id === id)
                commit('setNetwork', { data: data })
            } else {
                commit('setNetwork', {})
            }
        }
    }
}
        // if (!data) {
        //     [data] = state.networks
        // }
        // async fetchNetworkUsers ({ commit }, payload) {
        //     const query = `network=${payload.id}`
        //     const { response, error } = await UserService.get({ query: query })
        //     if (error) {
		// 		commit('setError', { error })
        //         return
        //     }
        //     commit('setNetworkUsers', response)
        // },
    // computed: {
    //     ...mapState('authentication', ['accesToken'])
    // },
    // getters: {
    //     AuthenticationToken (state, getters, rootState, rootGetters) { // Apparently state, getters & rootState are needed here
    //        return rootGetters['authentication/AuthenticationToken']
    //      }
    // },

    // import { mapMutations } from 'vuex'
// import { mapState } from 'vuex'
// import axios from 'axios'
// import axios from 'axios'
// import { AxiosInstance } from '../../plugins/axios'
// import { getRequestData } from '../../utils/helpers'

//  var config = { headers: { 'Authorization': 'Bearer ' +this.accessToken }
// axios({ method: 'get', url: 'http://localhost:8000/networks/', headers: { Authorization: 'Bearer ' + this.accessToken } })
// axios.get('http://localhost:8000/networks/', config)
// .then(response => (console.log(response.data)))

// const { response, error } = axios({ method: 'get', url: 'http://localhost:8000/networkorganisations/1/', headers: { Authorization: 'Bearer ' + this.accessToken } })
// if (error) {
// 	commit('setError', { error })
//     return
// }
//
// response.data.forEach(item => console.log(item.organisations))
// console.log(response.data[all nested dicts].organisations)

// setNetworkUsers (state, { data }) {
//     state.networkparticipants = data || {}
// },
