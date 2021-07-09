import { random, debounce } from 'lodash'
import DirectIndicatorService from '../../../services/DirectIndicatorService'

const baseDirectIndicator = { key: '', name: 'new direct indicator', description: '', isMandatory: true, datatype: '', options: [] }

export default {
    namespaced: true,
    state: {
        directIndicators: [],
        directIndicator: {},
        error: undefined,
        debouncers: {},
        errors: {},
        isSaved: {}
    },
    getters: {
        getById: state => id => state.directIndicators.find(object => object.id === id),
        topicdirectIndicators: (state) => {
            const filtered = {}
            state.directIndicators.forEach((indicator) => { filtered[indicator.topic] = !filtered[indicator.topic] ? [indicator] : [...filtered[indicator.topic], indicator] })
            return filtered
        }
        // getValidDirectIndicatorNumber
    },
    mutations: {
        setDirectIndicators (state, { data }) {
            state.directIndicators = data || {}
            state.debouncers = {}
            state.errors = {}
            state.isSaved = {}
        },
        setDirectIndicator (state, { data }) {
            state.directIndicator = data || {}
        },
        deleteDirectIndicator (state, { id }) {
            delete state.debouncers[id]
            delete state.errors[id]
            delete state.isSaved[id]
            state.directIndicators = state.directIndicators.filter(i => i.id !== id)
        },
        updateList (state, { id, data }) {
            if (id !== data.id) {
                delete state.debouncers[id]
                delete state.errors[id]
                delete state.isSaved[id]
            }
            state.directIndicators = state.directIndicators.map((item) => {
                if (item.id !== id) { return item }
                return Object.assign(item, data)
            })
        },
        addNewDirectIndicator (state, { topic, question }) {
            const directIndicator = { ...baseDirectIndicator, id: random(-1000000, -1), topic, question }
            console.log(directIndicator)
            state.directIndicators.push(directIndicator)
            state.directIndicator = directIndicator
        },
        setDebouncer (state, { id, commit }) {
            state.debouncers[id] = debounce(
                async ({ mId, directIndicator }) => {
                    const method = directIndicator.id > 0 ? 'put' : 'post'
                    const { response, error } = await DirectIndicatorService[method]({ mId, id, data: directIndicator })
                    if (error) {
                        commit('setError', { error, id: directIndicator.id })
                        return
                    }
                    commit('setError', { error: {}, id: directIndicator.id })
					commit('setIsSaved', { id: directIndicator.id, isSaved: true })
					commit('updateList', { id: directIndicator.id, data: response.data })
                },
                1000
            )
        },
        setIsSaved (state, { id, isSaved = false }) {
            if (id) {
                state.isSaved = {
                    ...state.isSaved,
                    [id]: isSaved
                }
            }
        }
    },
    actions: {
        async fetchDirectIndicators ({ commit }, payload) {
            const { response, error } = await DirectIndicatorService.get(payload)
            if (error) {
                commit('setError', { error })
                return
            }
            commit('setDirectIndicators', response)
        },
        // async fetchDirectIndicator ({ commit }, payload) {
        //     const { response, error } = await DirectIndicatorService.get(payload)
        // }
        async deleteDirectIndicator ({ commit }, payload) {
            if (payload.id > 0) {
                const { error } = await DirectIndicatorService.delete(payload)
                if (error) {
                    commit('setError', { error })
                    return
                }
            }
            commit('deleteDirectIndicator')
        },
        updateDirectIndicator ({ state, commit }, { mId, directIndicator }) {
            if (!directIndicator || !mId) { return }
            if (!state.debouncers[directIndicator.id]) {
                commit('setDebouncer', { id: directIndicator.id, commit })
            }
            if (directIndicator.id < 0) {
                commit('updateList', { id: directIndicator.id, data: directIndicator })
            }
            commit('setIsSaved', { id: directIndicator.id })
            if (!directIndicator.name || !directIndicator.key) { return }
            state.debouncers[directIndicator.id]({ mId, directIndicator })
        },
        setDirectIndicator ({ state, commit }, { id } = {}) {
            const data = state.directIndicators.find(indicator => indicator.id === id)
            if (data && data.id === state.directIndicator.id) { return data }
            commit('setDirectIndicator', { data })
        },
        resetError ({ commit }) {
            commit('setError', { error: undefined })
        },
        addNewDirectIndicator ({ commit }, payload) {
            commit('addNewDirectIndicator', payload)
        }
    }
}
