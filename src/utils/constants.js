const API_URL = process.env.VUE_APP_ROOT_API // process.env.baseURL || process.env.apiUrl ||
const STATUS = {
    IDLE: 'idle',
    IN_PROGRESS: 'in progress',
    LOADING: 'Loading',
    ERROR: 'Error',
    SUCCESS: 'Succes'
}
const QUESTION_TYPES = { // can be removed in the future
    TEXT: 'TEXT',
	NUMBER: 'NUMBER',
	RADIO: 'RADIO',
	CHECKBOX: 'CHECKBOX'
}
const DATA_TYPES = {
    TEXT: 'text',
    INTEGER: 'integer',
    DOUBLE: 'double',
    DATE: 'date',
    BOOLEAN: 'boolean',
    SINGLECHOICE: 'singlechoice',
    MULTIPLECHOICE: 'multiplechoice'
}
const UI_COMPONENTS = {
    FIELD: 'field',
    LINE: 'line',
    TEXTBOX: 'textBox',
    DROPDOWN: 'dropDown',
    RADIOBUTTON: 'radioButton',
    CHECKBOX: 'checkBox'
}
const RESPONSE_TYPE = {
    MULTIPLE: 'Multiple',
    SINGLE: 'Single'
}

export { STATUS, API_URL, QUESTION_TYPES, DATA_TYPES, UI_COMPONENTS, RESPONSE_TYPE }
