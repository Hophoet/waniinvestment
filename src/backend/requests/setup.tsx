import axios from 'axios';

//const HOST ='http://127.0.0.1:8000';//'https://byiapi.herokuapp.com';
const HOST ='https://byiapi.herokuapp.com';

// Authentication urls 
const LOGIN_URL = `${HOST}/api/v1/auth/signin`;
const LOGOUT_URL = `${HOST}/rest-auth/logout/`;
const REGISTER_URL = `${HOST}/api/v1/auth/signup`;
const SEND_PASSWORD_RESET_CODE_URL = `${HOST}/api/v1/auth/password-reset/send-code`;
const VERIFY_PASSWORD_RESET_CODE_URL = `${HOST}/api/v1/auth/password-reset/verify-code`;
const SET_PASSWORD_RESET_NEW_PASSWORD_URL = `${HOST}/api/v1/auth/password-reset/set-new-password`;
const PASSWORD_CHANGE_URL = `${HOST}/rest-auth/password/change/`;

export {
	axios,
	LOGIN_URL,
	LOGOUT_URL,
	SEND_PASSWORD_RESET_CODE_URL,
	VERIFY_PASSWORD_RESET_CODE_URL,
	SET_PASSWORD_RESET_NEW_PASSWORD_URL,
	PASSWORD_CHANGE_URL,
	REGISTER_URL,
};
