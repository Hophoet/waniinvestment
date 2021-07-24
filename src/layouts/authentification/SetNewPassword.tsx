import React from 'react'
import {StyleSheet, Dimensions, TextInput, View} from 'react-native'
import toasts from '../../components/toasts'	
import {setNewPassword} from '../../backend/requests/auth';
import {SetNewPasswordType} from '../../backend/requests/types';
import MainHeader from '../../components/MainHeader';
import IconButton from '../../components/buttons/IconButton';
import {mailFormatIsValid} from '../../backend/modules/mail';



type Prop = {
	authUserToken:string,
	authUser:any,
	navigation:any,
	route:any,

}

type State = {
    isLoading:boolean,
    itIsSends:boolean,
}

export default class SendPasswordResetEmail extends React.Component<Prop, State>{

    _isMounted:boolean;
    email:string;
    code:string;
    password1:string;
    password2:string;
	constructor(props:Prop){

        super(props);
		this._isMounted = false;
		this.email = this.props.route.params && this.props.route.params.email,
		this.code = this.props.route.params && this.props.route.params.code,
		this.password1 = '';
		this.password2 = '';
        this.state = {
            itIsSends: false,
            isLoading:false
        };
    }

	componentWillUnmount(){
		//clean up
		this._isMounted = false;
		this.setState({
			isLoading:false,
			itIsSends:false
		});
	}

   _customNav = () => {
	this.props.navigation.setOptions({
	  header: () => (
		<MainHeader
			firstAction={this.props.navigation.goBack}
			title='Nouveau mot de passe'
			description="entrer votre nouveau mot de passe"

		/>
	  ),
	});
    }
	
	componentDidMount(){	
		this._isMounted = true;
		this._customNav()
	}


	_mailFormatIsValid = () =>{
		if(mailFormatIsValid(this.email)){
			return true;
		}
		return false;

	}

	_formValid = () => {
		if(this.password1.length >= 5 && this.password2.length >=5 ){
			if(this.password1 == this.password2){
				return true;
			}
			else {
            	toasts._show_bottom_toast('vos mot de passe ne sont pas identiques');	
			}
		}
		else if(this.password1.length == 0){
            	toasts._show_bottom_toast('enter votre nouveau mot de passe');	
		}
		else if(this.password2.length == 0){
            toasts._show_bottom_toast('confirmer votre mot de passe');	
		}
		else if(this.password1.length < 5 || this.password2.length < 5){
            toasts._show_bottom_toast('votre mot de passe est trop faible');	
		}

	}


    setNewPassword = () => {
        if(!this.state.isLoading){
            if(this._formValid()){
                this.setState({isLoading:true})
				let data: SetNewPasswordType = {
					email:this.email,
					code:this.code,
					password1:this.password1,
					password2:this.password2
				}
                setNewPassword(data)
                .then(response => {
					if(this._isMounted){
						this.setState({itIsSends:true});
						this.setState({isLoading:false});
					}
                    toasts._show_bottom_toast('mot de passe changé avec succes');
					this.props.navigation.navigate('SignIn');
                })
                .catch( (error:any) =>  {
					if(this._isMounted){
						this.setState({isLoading:false});
                        if (error.response) {
                            // The request was made and the server responded with a status code
                            // that falls out of the range of 2xx
                            console.log(error.response.data);
							let errorData = error.response.data;
							if(errorData){
								if(errorData.code = 'password-reset/password-change-expired'){
									toasts._show_bottom_toast("la durée du changement du mot de passe est expirée");	
								}
							}
                            console.log(error.response.status);
                            console.log(error.response.headers);
                        } else if (error.request) {
                            // The request was made but no response was received
                            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                            // http.ClientRequest in node.js
                            console.log(error.request);
                        } else {
                            // Something happened in setting up the request that triggered an Error
                            console.log('Error', error.message);
                        }
                        console.log(error.config);
                    }
                });

            }
        }
        
    }

	_setPassword1 = (password1:string) => this.password1=password1;
	_setPassword2 = (password2:string) => this.password2=password2;

	render(){
		return(
			<View style={styles.container}>

					<View style={styles.formContainer}>

					<View style={styles.textInputContainer}>
						<TextInput 
							placeholder='mot de passe'
							style={styles.textInput}
							onChangeText={(text) => this.password1 = text}
							onSubmitEditing={this.setNewPassword}

						/>
{/* 
						<CTextInput
							first={true}
							setValue={this._setPassword1}
							label={"Enter votre nouveau mot de passe"}
							placeholder="mot de passe"
							onSubmitEditing={this.setNewPassword}
						/>
						<CTextInput
							last={true}
							setValue={this._setPassword2}
							label={"Entrer à nouveau votre nouveau mot de passe"}
							placeholder="confirmation"
							onSubmitEditing={this.setNewPassword}
						/> */}
					</View>

					<View style={styles.textInputContainer}>
						<TextInput 
							placeholder='confirmation'
							style={styles.textInput}
							onChangeText={(text) => this.password2 = text}
							onSubmitEditing={this.setNewPassword}

						/>
					</View>
					<View style={styles.buttonContainer}>
						<IconButton
							onPress={ () => {
								this.props.navigation.navigate('SignIn');
								//this.setNewPassword
							}
							}
							loading={this.state.isLoading}
							disabled={this.state.isLoading}
							label={'Confirmer'}
						/>
					</View>
					</View>

			</View>
		)
	}

}

const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({
	container:{
        flex:1,
        backgroundColor:'white',
        paddingHorizontal:10,
    },
    textInput:{
        backgroundColor:'#ffff',
		//backgroundColor:'red',
        paddingHorizontal:8,
		fontSize:17,
		minHeight:width/7,
    },
	textInputContainer:{
		borderColor:'gray',
		borderWidth:1,//StyleSheet.hairlineWidth,
		marginBottom:10,
		borderRadius:3,

	},
    formContainer:{
		marginBottom:20,
		marginVertical:20,
    },
})


