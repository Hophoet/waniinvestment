
type SendPasswordResetCodeType =  {
	email:string
}

type VerifyPasswordResetCodeType =  {
	email:string,
	code:string
}

type SetNewPasswordType =  {
	password1:string,
	password2:string,
	code:string,
	email:string,
}

export type {
	SendPasswordResetCodeType,
	VerifyPasswordResetCodeType,
	SetNewPasswordType,
}
