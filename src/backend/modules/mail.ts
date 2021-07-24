const mailFormatIsValid = (mail:string) => {
	const mailFormat =  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
	if(mailFormat.test(mail)){
		return true;
	}
	return false;
}

export {
	mailFormatIsValid
}
