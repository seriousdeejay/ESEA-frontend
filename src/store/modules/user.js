import UserService from '../../services/UserService'

export default {
    namespaced: true,
    state: {
        users: [],
        user: {},
        error: []
    },
    mutations: {
        setUsers (state, { data }) {
            state.users = data
        },
        setUser (state, { data }) {
            state.user = data || {}
        },
        updateUser (state, { id, data }) {
            state.users = state.users.map((item) => {
                if (item.id !== id) { return item }
                return { ...item, ...data }
            })
        },
        deleteUser (state, { id }) {
            state.users = state.users.filter(o => o.id !== id)
        },
        setError (state, { error }) {
            state.error = error
        }
    },
    actions: {
        async fetchUsers ({ commit }, payload) {
            const { response, error } = await UserService.get(payload)
            if (error) {
                commit('setError', { error })
                return
            }
            commit('setUsers', response)
        },
        async fetchUser ({ commit }, payload) {
            const { response, error } = await UserService.get(payload)
            if (error) {
                commit('setError', { error })
                return
            }
            commit('setUser', response)
        },
        async updateUser ({ state, commit }) {
            const id = state.user.id
            const data = state.user
            const { response, error } = await UserService.put({ id, data, headers: { 'Content-Type': 'multipart/form-data' } })
            if (error) {
                commit('setError', { error })
                return
            }
            commit('updateUser', response)
        },
        async deleteUser ({ commit, dispatch }, payload) {
            const { error } = await UserService.delete(payload)
            if (error) {
                commit('setError', { error })
                return
            }
            commit('deleteUser', payload)
            dispatch('setUser', {})
        },
        setUser ({ state, commit }, { id }) {
            console.log(id)
            if (id) {
                const data = state.users.find(u => u.id === id)
                commit('setUser', { data })
            } else {
                commit('setUser', {})
            }
        }
    }
}
