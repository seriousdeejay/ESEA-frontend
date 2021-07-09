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
    TEXT: 'Text',
    INTEGER: 'Integer',
    DOUBLE: 'Double',
    DATE: 'Date',
    BOOLEAN: 'Boolean',
    SINGLECHOICE: 'SingleChoice',
    MULTIPLECHOICE: 'MultipleChoice'
}
const UI_COMPONENTS = {
    FIELD: 'field',
    LINE: 'line',
    TEXTBOX: 'textbox',
    DROPDOWN: 'dropdown',
    RADIOBUTTON: 'radiobutton',
    CHECKBOX: 'checkbox'
}
const RESPONSE_TYPE = {
    MULTIPLE: 'multiple',
    SINGLE: 'single'
}

export { STATUS, API_URL, QUESTION_TYPES, DATA_TYPES, UI_COMPONENTS, RESPONSE_TYPE }
