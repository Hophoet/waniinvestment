import {
	axios,
	LOGIN_URL, 
	LOGOUT_URL, 
	REGISTER_URL,
	SEND_PASSWORD_RESET_CODE_URL,
	VERIFY_PASSWORD_RESET_CODE_URL,
	SET_PASSWORD_RESET_NEW_PASSWORD_URL,
	PASSWORD_CHANGE_URL,
} from './setup';

import { 
	SendPasswordResetCodeType,
	VerifyPasswordResetCodeType,
	SetNewPasswordType

} from './types';




function loginWithUsernameOrEmail(usernameOrEmail:string, password:string){
	return new Promise( (resolve, reject) => {
		const mailFormat =  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
		let data:any = {
			password:password,
		}
		if(mailFormat.test(usernameOrEmail)){
			data.email = usernameOrEmail
		}
		else{
			data.username=usernameOrEmail
		}

		axios.post(
			LOGIN_URL,
			data
		)
		.then((response:any) => {
			resolve(response);
		})
		.catch((error:any) => {
			reject(error);
		})

	})
}

function logout(authToken:string){
	return new Promise( (resolve, reject) => {
		axios.post(
			LOGOUT_URL,
			{
				data:{
				},
				headers:{
					'Authorization':`Token ${authToken}`	
				}
			}
		)
		.then((response:any) => {
			resolve(response);
		})
		.catch((error:any) => {
			reject(error);
		})

	})
}

function register(email:string, password:string){
	return new Promise( (resolve, reject) => {
		console.log('request data')
		console.log(email, password)
		axios.post(
			REGISTER_URL,
			{
				//username:username,
				email:email,
				password1:password,
				password2:password,
			}
		)
		.then((response:any) => {
			resolve(response);
		})
		.catch((error:any) => {
			reject(error);
		})

	})
}

function resetPassword(email:string){
	return new Promise( (resolve, reject) => {
		axios.post(
			'PASSWORD_RESET_URL',
			{
				email:email,
			}
		)
		.then((response:any) => {
			resolve(response);
		})
		.catch((error:any) => {
			reject(error);
		})

	})
}


function sendPasswordResetCode(data:SendPasswordResetCodeType){
	return new Promise( (resolve, reject) => {
		axios.post(
			SEND_PASSWORD_RESET_CODE_URL,
			{
				email:data.email,
			}
		)
		.then((response:any) => {
			resolve(response);
		})
		.catch((error:any) => {
			reject(error);
		})

	})
}

function verifyPasswordResetCode(data:VerifyPasswordResetCodeType){
	return new Promise( (resolve, reject) => {
		axios.post(
			VERIFY_PASSWORD_RESET_CODE_URL,
			{
				email:data.email,
				code:data.code
			}
		)
		.then((response:any) => {
			resolve(response);
		})
		.catch((error:any) => {
			reject(error);
		})

	})
}

function setNewPassword(data:SetNewPasswordType){
	return new Promise( (resolve, reject) => {
		axios.post(
			SET_PASSWORD_RESET_NEW_PASSWORD_URL,
			{
				email:data.email,
				code:data.code,
				password1:data.password1,
				password2:data.password2,
			}
		)
		.then((response:any) => {
			resolve(response);
		})
		.catch((error:any) => {
			reject(error);
		})

	})
}

function passwordChange(authToken:string, password:string){
	return new Promise( (resolve, reject) => {
		axios.post(
			PASSWORD_CHANGE_URL,
			{
				data:{
					new_password1:password,
					new_password2:password,
				},
				headers:{
					'Authorization':`Token ${authToken}`	
				}
			}
		)
		.then((response:any) => {
			resolve(response);
		})
		.catch((error:any) => {
			reject(error);
		})

	})
}


export {
	logout,
	register,
	resetPassword,
	passwordChange,
	loginWithUsernameOrEmail,
	sendPasswordResetCode,
	verifyPasswordResetCode,
	setNewPassword,
}
