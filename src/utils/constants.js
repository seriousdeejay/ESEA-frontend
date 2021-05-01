const API_URL = process.env.VUE_APP_ROOT_API // process.env.baseURL || process.env.apiUrl ||
const STATUS = {
    IDLE: 'idle',
    IN_PROGRESS: 'in progress',
    LOADING: 'Loading',
    ERROR: 'Error',
    SUCCESS: 'Succes'
}
const QUESTION_TYPES = {
    TEXT: 'TEXT',
	NUMBER: 'NUMBER',
	RADIO: 'RADIO',
	CHECKBOX: 'CHECKBOX'
}

export { STATUS, API_URL, QUESTION_TYPES }
