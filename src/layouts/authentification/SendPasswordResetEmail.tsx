import React from 'react'
import {StyleSheet, Dimensions, TextInput, View} from 'react-native'
import toasts from '../../components/toasts'	
import {sendPasswordResetCode} from '../../backend/requests/auth';
import {SendPasswordResetCodeType} from '../../backend/requests/types';
import MainHeader from '../../components/MainHeader';
import {mailFormatIsValid} from '../../backend/modules/mail';
import IconButton from '../../components/buttons/IconButton';



type Prop = {
	authUserToken:string,
	authUser:any,
	navigation:any,

}

type State = {
    isLoading:boolean,
    itIsSends:boolean
}

export default class SendPasswordResetEmail extends React.Component<Prop, State>{

    _isMounted:boolean;
    email:string;
	constructor(props:Prop){

        super(props);
		this._isMounted = false;
        this.email = ''
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
				firstAction={() => this.props.navigation.goBack()}	
				firstActionIcon='arrow-back'
				title='Mot de passe oublié'
				description='Entrer votre email pour continuer'
			/>
          ),
        });
    }
	
	componentDidMount(){	
		this._isMounted = true;
		this._customNav()
	}


	_mailFormatIsValid = () =>{
		console.log(this.email)
		if(mailFormatIsValid(this.email)){
			return true;
		}
		return false;

	}


	// Method to send the user reseting password link
	// to his email    
    sendCode = () => {
        if(!this.state.isLoading){
            if(this._mailFormatIsValid()){
                this.setState({isLoading:true})
				let data:SendPasswordResetCodeType = {
					email:this.email
				}
                sendPasswordResetCode(data)
                .then(response => {
					if(this._isMounted){
						this.setState({itIsSends:true});
						this.setState({isLoading:false});
                    	toasts._show_bottom_toast('Vérifiez votre boite e-mail pour changer votre mot de passe');	
						let navigationData = {
							email:this.email
						}
                    	this.props.navigation.navigate('VerifyPasswordResetCode', navigationData)
					}

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
								if(errorData.code == 'password-reset/email-not-found'){
                        			toasts._show_bottom_toast("Envoi échoué, verifier votre adresse email");	

								}
								else if(errorData.code == 'password-reset/user-not-found'){
                        			toasts._show_bottom_toast("Envoi échoué, verifier votre adresse email");	

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
                        // toasts._show_bottom_toast("Envoi échoué, Réessayez plus tard");	
                    }
                });

            }
            else{
                toasts._show_bottom_toast('Entrer votre mail valide');  
            }
        }
        
    }


	_setEmail = (email:any) => this.email=email;

	render(){
		return(
			<View style={styles.container}>
                <View style={styles.formContainer}>
					<View style={styles.textInputContainer}>
						<TextInput 
							placeholder='email'
							style={styles.textInput}
							onChangeText={(text) => this.email = text}
							onSubmitEditing={this.sendCode}

						/>
						{ /*
						<CTextInput
							first={true}
							last={true}
							setValue={this._setEmail}
							label={"Enter votre adresse e-mail"}
							placeholder="Adresse e-mail"
							onSubmitEditing={this.sendCode}
						/>
						*/}
					</View>
					<View style={styles.buttonContainer}>
						<IconButton
							onPress={ () => {
								
							let navigationData = {
								email:'email@gmail.com'
							}
							this.props.navigation.navigate('VerifyPasswordResetCode', navigationData)
									//this.sendCode
							}
							}
							loading={this.state.isLoading}
							disabled={this.state.isLoading}
							label={'Envoyer'}
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
	buttonContainer:{

	},
    formContainer:{
		marginBottom:20,
		marginVertical:20,
    },
})


