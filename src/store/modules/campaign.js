import CampaignService from '../../services/CampaignService'
// import { AxiosInstance } from '../../../plugins/axios'

export default {
    namespaced: true,
    state: {
        campaigns: [],
        campaign: {},
        error: []
    },
    mutations: {
        setCampaigns (state, { data }) {
            state.campaigns = data || {}
        },
        setCampaign (state, { data }) {
            state.campaign = data || {}
        },
        addCampaignToList (state, { data }) {
            state.campaigns.push(data)
        },
        updateCampaign (state, { data, id }) {
            state.campaigns = state.campaigns.map((item) => {
                if (item.id !== id) { return item }
                return { ...item, ...data }
            })
        },
        deleteCampaign (state, { id }) {
            state.campaigns = state.campaigns.filter(c => c.id !== id)
        },
        setError (state, { error }) {
            console.log(error?.response.data)
            state.error = error?.response.data || []
        },
        clearError (state) {
            state.error = []
        }
    },
    actions: {
        async fetchCampaigns ({ commit, state }, payload) {
            const { response, error } = await CampaignService.get(payload)
            state.error = []
            // var error = []
            // commit('setError', { error })
            if (error) {
                commit('setError', { error })
                return
            }
            commit('setCampaigns', response)
        },
        async fetchCampaign ({ commit }, payload) {
            const { response, error } = await CampaignService.get(payload)
            if (error) {
                commit('setError', { error })
                return
            }
            commit('setCampaign', response)
        },
        async createCampaign ({ commit, dispatch }, { nId, data }) {
            const { response, error } = await CampaignService.post({ nId, data: data })
            if (error) {
                commit('setError', { error })
                return
            }
            await dispatch('fetchCampaigns', { nId: nId })
            await dispatch('setCampaign', response.data)
        },
        async updateCampaign ({ state, commit }, { nId, data }) {
            const id = state.campaign.id
            state.error = []
            const { response, error } = await CampaignService.put({ nId, id, data: data, headers: { 'Content-Type': 'multipart/form-data' } })
            if (error) {
                commit('setError', { error })
                return
            }
            commit('updateCampaign', response)
        },
        async deleteCampaign ({ commit, dispatch }, payload) {
            const { error } = await CampaignService.delete(payload)
            if (error) {
                commit('setError', { error })
                return
            }
            commit('deleteCampaign', { payload })
            await dispatch('setCampaign', {})
        },
        setCampaign ({ state, commit }, { id }) {
            if (id) {
                console.log(id)
                const data = state.campaigns.find(c => c.id === id)
                commit('setCampaign', { data })
            } else {
                commit('setCampaign', {})
            }
        }
    }
}
