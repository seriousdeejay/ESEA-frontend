import { API_URL } from '../utils/constants'
import BaseApiService from './BaseApiService'

const createUrl = ({ oId = 0, eaId, id, query = '' }) => {
	let base = `${API_URL}/organisations/${oId}/esea-accounts/${eaId}/responses`
	base = id ? `${base}/${id}` : base
	return `${base}/${query}`
}

export default new BaseApiService(createUrl)
