import React from 'react'
import {StyleSheet, Dimensions, TextInput, View} from 'react-native'
import toasts from '../../components/toasts'	
import MainHeader from '../../components/MainHeader';
import {verifyPasswordResetCode} from '../../backend/requests/auth';
import {VerifyPasswordResetCodeType} from '../../backend/requests/types';
import IconButton from '../../components/buttons/IconButton';


type Prop = {
	authUserToken:string,
	authUser:any,
	navigation:any,
	route:any,

}

type State = {
    isLoading:boolean,
    itIsSends:boolean
}

export default class SendPasswordResetEmail extends React.Component<Prop, State>{

    _isMounted:boolean;
    email:string;
    code:string;
	constructor(props:Prop){

        super(props);
		this._isMounted = false;
		this.code = '';
		this.email = this.props.route.params && this.props.route.params.email,
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
	
	componentDidMount(){	
		this._isMounted = true;
		this._customNav()
	}

   _customNav = () => {
	this.props.navigation.setOptions({
	  header: () => (
		<MainHeader
			firstAction={this.props.navigation.goBack}
			title='Vérification'
			description="confirmer votre identité en entrant le code de confirmation envoyer dans votre boite email"
		/>
	  ),
	});
    }



	//verify password reset code
    verifyCode = () => {
		if(this._formValid()){
	        if(!this.state.isLoading){
                this.setState({isLoading:true})
				let data:VerifyPasswordResetCodeType ={
					code:this.code,
					email:this.email,
				}
                verifyPasswordResetCode(data)
                .then(response => {
					if(this._isMounted){
						this.setState({itIsSends:true});
						this.setState({isLoading:false});
					}
                    toasts._show_bottom_toast('Code verifié avec succes');	
					let navigationData = {
						code:this.code,
						email:this.email,
					}
					this.props.navigation.navigate('SetNewPassword', navigationData)
                })
                .catch( (error:any) =>  {
					if(this._isMounted){
						this.setState({isLoading:false});
                        if (error.response) {
                            // The request was made and the server responded with a status code
                            // that falls out of the range of 2xx
                            console.log(error.response.data);
							let errorData = error.response.data;
							if(errorData.code = 'password-reset/code-not-valid'){
								toasts._show_bottom_toast("votre code de verification est invalide");	
							}
							else if(errorData.code = 'password-reset/password-reset/code-expired'){
								toasts._show_bottom_toast("votre code de verification est expirée");	

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
                        // toasts._show_bottom_toast("Verification échouée, Réessayez plus tard");	
                    }
                });
            }
		}
    }

	_formValid = () => {
		if(!this.code){
            toasts._show_bottom_toast("Enter votre code de verification");
			return false;
		}
		return true;
	}

	_setCode = (code:string) => this.code=code;

	render(){
		return(
			<View style={styles.container}>
					<View style={styles.formContainer}>
					<View style={styles.textInputContainer}>
						
						<TextInput 
							placeholder='code'
							style={styles.textInput}
							onChangeText={(text) => this.code = code}
							onSubmitEditing={this.verifyCode}

						/>
						{/* <CTextInput
							first={true}
							last={true}
							setValue={this._setCode}
                			keyboardType='numeric'
							label={"code de verification"}
							placeholder="code"
							onSubmitEditing={this.verifyCode}
						/> */}

					</View>
					<View style={styles.buttonContainer}>
						<IconButton
							onPress={() => {
								//this.verifyCode
								let navigationData = {
									code:'8473',
									email:'email@gmail.com',
								}
								this.props.navigation.navigate('SetNewPassword', navigationData)
								
							}}
							loading={this.state.isLoading}
							disabled={this.state.isLoading}
							label={'Verifier'}
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


