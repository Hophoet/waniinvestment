import React from 'react';
import {TextInput, Dimensions, Linking, StyleSheet, StatusBar, View, Text, ActivityIndicator, TouchableOpacity} from 'react-native';
import { connect } from 'react-redux';
import toasts from '../../components/toasts';
import Ionicons from 'react-native-vector-icons/Ionicons';
import  {SET_AUTH_USER_TOKEN, SET_AUTH_USER} from '../../redux/store/actions'
import MainHeader from '../../components/MainHeader';
import {register} from '../../backend/requests/auth';
import { authGoogle } from '../../backend/modules/google';

type Prop = {
	authUserToken:string,
	authUser:any,
	navigation:any,
	dispatch:Function,

}

type State = {
	username:string,
	usernameFocused:boolean,
	emailFocused:boolean,
	passwordFocused:boolean,
	password:string,
	isLoading:boolean,
	isFieldsFilled:boolean,
	passwordTextInputTextIsVisible:boolean,
	termsAndConditionsChecked:boolean,
	email:string,

}


// User account creation component
class  SignUp extends React.Component<Prop, State>{ 

	_isMounted:boolean;
    constructor(props:Prop){
        super(props);
		// Set the compnent state
		this._isMounted = false;
        //set state
        this.state = {
            isLoading:false,
            isFieldsFilled:false,
			passwordTextInputTextIsVisible:false,
			termsAndConditionsChecked:true,
			username:'',
			email:'',
			password:'',
			usernameFocused:false,
			emailFocused:false,
			passwordFocused:false,
        };
    }

	componentWillUnmount(){
		// Set the components state
		this._isMounted = false;
		this.setState({
			isLoading:false,
			isFieldsFilled:false,
		});
    }

   _customNav = () => {

        this.props.navigation.setOptions({
          header: () => (
            <MainHeader 
				firstAction={() => this.props.navigation.goBack()}	
				firstActionIcon='arrow-back'
			/>
          ),
        });
    }

    componentDidMount(){
		// Set the component state
		this._isMounted = true;
		this._customNav();
    }
	closeAuth = () => {
       this.props.navigation.navigate('App',{});

	}
	
	// Method for the text inputs validation
	fieldsAreValid = () => {
		let username = this.state.username.trim();
		let password = this.state.password;
		let email = this.state.email.trim();
		const mailFormat =  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
		if(
			email 
			&&  mailFormat.test(email)
			&& password 
			&& this.state.termsAndConditionsChecked){
			if(password.length < 5){
				toasts._show_bottom_toast('Votre mot de passe est trop faible');	
				return false;
			}	
			return true;
		}
		else{
			if(!email){
				toasts._show_bottom_toast('Entrez votre email');	
			}
			else if(!mailFormat.test(email)){
				toasts._show_bottom_toast('Entrez un email valid');	
			}
			else if(!password){
				toasts._show_bottom_toast('Entrez votre mot de passe');	
			}
			else if(!this.state.termsAndConditionsChecked){
				toasts._show_bottom_toast('Acceptez les termes et conditions');	

			}
				
		}

	}

					

    // User account creation method 
    _signup = () => {
        // Check the validation of the user inputs
		if(this.fieldsAreValid()){
			if(!this.state.isLoading){     
				// Start the request loading
				this.setState({isLoading:true})
				//console.log('registration...')
				// Request to create the user account
				register(this.state.email, this.state.password)
				.then((response:any) => {
					if(this._isMounted){
						this.setState({isLoading:false});
						let authUserTokenAction = {type:SET_AUTH_USER_TOKEN, value:response.data.key}
						let authUserAction = {type:SET_AUTH_USER, value:response.data.user}
						
						//console.log(authUserAction)
						this.props.dispatch(authUserTokenAction)
						this.props.dispatch(authUserAction)
						this.props.navigation.navigate('Loader',{});
						//console.log(this.props.authUser);
						//console.log(this.props.authUserToken);
						toasts._show_bottom_toast('connexion reussie');
					}
				})
				.catch(error => {
					if(this._isMounted){
						this.setState({isLoading:false});
						if (error.response) {
						  // The request was made and the server responded with a status code
						  // that falls out of the range of 2xx
						  console.log(error.response.data);
						  console.log(error.response.status);
						  //console.log(error.response.headers);
						  // that falls out of the range of 2xx
						//   console.log(error.response.data);
						  let errorData = error.response.data;
						  if(errorData.code == 'auth/username-can-not-be-used'){
								toasts._show_bottom_toast("veuillez utilisé un autre nom d'utilisateur");	
						  }
						  else if(errorData.code == 'auth/username-already-used'){
								toasts._show_bottom_toast("nom d'utilisateur déja utilisé, veuillez utilisé un autre nom d'utilisateur");	
						  }
						  else if(errorData.code == 'auth/email-already-used'){
								toasts._show_bottom_toast("email déja utilisé, veuillez utilisé un autre email");	
						  }
						} else if (error.request) {
						  // The request was made but no response was received
						  // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
						  // http.ClientRequest in node.js
						  console.log(error.request);
						} else {
						  // Something happened in setting up the request that triggered an Error
						  //console.log('Error', error.message);
						}
						//console.log(error.config);
					}
				  });
			}
		}
		
    }
     //loading activity render 
	 _loader = () => {
        if(this.state.isLoading){
            return (
                <View style={styles.signUpLoadingIndicatorContainer}>
                    <ActivityIndicator size='small' color={'white'}/>
                </View>
            )
        }
		return(
            <Text style={styles.buttonText}>S'inscrire</Text>
		)
    }


	// Method to toggle the password textinput text visibility
	_togglePasswordTextInputVisibility = () => {
		this.setState({passwordTextInputTextIsVisible:!this.state.passwordTextInputTextIsVisible});
	}
	
	_toggleTermsAndConditionsState = () => {
		this.setState({termsAndConditionsChecked:!this.state.termsAndConditionsChecked});
	}
    

	_openTermsAndConditionsLink = () => {
		let url = 'https://www.freeprivacypolicy.com/live/9486572b-64d1-40c1-9278-5e5b93c7d00f';
		Linking.canOpenURL(url)
		.then(response => {
			Linking.openURL(url)
			.then(() => {
			
			})
			.catch(error => {
				toasts._show_bottom_toast('Operation echouée, Réessayer plus tard');	
			})
		})

	}

	setUsername = (username:string) => {
		this.setState({username});
	}

	setEmail = (email:string) => {
		this.setState({email});
	}

	setPassword = (password:string) => {
		this.setState({password});
	}

	formValid = () =>{
		if (
			this.state.email && this.state.password
			){
				return true
		}
	}
    //components rending method
    render(){
        return(
            <View style={styles.container}>
                <StatusBar backgroundColor={'black'}/>
                <View style={styles.headerContainer}>
					<Text style={styles.title}>Wani Investment</Text>
					<Text style={styles.description}>Inscrivez-vous pour commencer votre expérience</Text>
                </View>
				{this._loader()}
                <View style={styles.formContainer}>
					<View style={styles.textInputContainer} >
						<TextInput
							placeholder={(!this.state.emailTextInputIsFocused)
								?"email"
								:""
							}
							ref={'emailRef'}
							onFocus={() => {
								this.setState({emailTextInputIsFocused:true});
							}}
							onBlur={() => {
								console.log('username blur')
								this.setState({emailTextInputIsFocused:false});
							}}
							style={[styles.textInput,styles.textInputFocused,
							]}
							value={this.state.email}
							onChangeText={email=>{this.setState({email})}}
							onSubmitEditing={()=>{
								if(this.refs.passwordRef){
									if(!this.state.password){
										this.refs.passwordRef.focus();
									}
									else{
										this._signup();
									}
								}
							}}
						/>
					</View>
					<View style={styles.textInputContainer} >
						<TextInput
							placeholder={(!this.state.passwordTextInputIsFocused)
								?"mot de passe"
								:""
							}
							ref={'passwordRef'}
							onFocus={() => {
								console.log('username focus')
								this.setState({passwordTextInputIsFocused:true});
							}}
							onBlur={() => {
								this.setState({passwordTextInputIsFocused:false});
							}}
							style={[styles.textInput,styles.textInputFocused,
							]}
							value={this.state.password}
							onChangeText={password=>{this.setState({password})}}
							onSubmitEditing={()=>{
								if(this.refs.passwordRef){
									if(!this.state.password){
										this.refs.passwordRef.focus();
									}
									else{
										this._signup();
									}
								}
							}}
						/>
					</View>
					{/* <CTextInput
						first={true}
						focused={this.state.emailFocused}
						setValue={this.setEmail}
						label={"adresse e-mail"}	
						placeholder="adresse e-mail"
                		onSubmitEditing={this.onSubmit}
					/>
					<CTextInput
						last={true}
						focused={this.state.passwordFocused}
						setValue={this.setPassword}
						label={"mot de passe"}	
						placeholder="mot de passe"
						isPassword={true}
                		onSubmitEditing={this.onSubmit}
					/> */}
                </View>
                <TouchableOpacity 
					style={[
						styles.buttonContainer,
						!this.formValid() && {opacity:.5}
					]} 
                    activeOpacity={.5}
                    onPress={this._signup}
					disabled={(this.state.isLoading || !( this.state.email && this.state.password))?true:false}
                    >
						{this._loader()}
                </TouchableOpacity>
                <View style={styles.footer}>
                    <Text  
						onPress={()=>this.props.navigation.navigate('SignIn', {})} 
						style={styles.footerTitle}
					>déja un compte Wani Investment? <Text style={styles.signinText}>Se Connecter</Text></Text>
					<View style={styles.termsConditionsContainer}>
						<TouchableOpacity 
							style={styles.checkButton}
							activeOpacity={.5}
							onPress={this._toggleTermsAndConditionsState}
						>
							<Ionicons name={(this.state.termsAndConditionsChecked)?'md-checkbox':'md-checkbox-outline'} color='black' size={25} />
						</TouchableOpacity>
						<Text>J'accepte les</Text>
						<TouchableOpacity 
							onPress={this._openTermsAndConditionsLink}	
							activeOpacity={.5}
							style={styles.termsAndConditionsLinkContainer}>
							<Text style={styles.termsAndConditionsLinkLabel}> Termes et conditions </Text>
						</TouchableOpacity>
						<Text> d'utilisation</Text>
						</View>
					</View>
                </View>
        )
    }
}

//maps with the state global
const mapDispatchToProps = (dispatch:Function) => {
    return {
        dispatch: (action:any) => {dispatch(action)}
    }
}

const mapStateToProps = (state:any) => {
    return {
		authUserToken:state.authUserToken,
		authUser:state.authUser
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);

const {width, height} = Dimensions.get('window');
//set screen styles
const styles = StyleSheet.create({
    container:{
        flex:1,
		backgroundColor:'white',
        paddingHorizontal:20,
    },
    buttonContainer:{
        backgroundColor:'black',
        padding:10,
        justifyContent:'center',
		marginBottom:20,
		minHeight:width/9,
        alignItems:'center',
		borderRadius:3,
    },
    buttonText:{
        color:'white',
        fontWeight:'bold',
    }
    ,
    title:{
		fontSize:22,
        fontWeight:'bold',
    },

    textInput:{
        backgroundColor:'#ffff',
		//backgroundColor:'red',
        paddingHorizontal:8,
		fontSize:17,
		minHeight:width/7,
    },
    headerContainer:{
        marginBottom:20
    },
    formContainer:{
		marginBottom:20,
    },
	footer:{
	},
    footerTitle:{
        color:'black',
    },
    signinText:{
        //color:colors.core,
        fontWeight:'bold',
    },
    signUpTitleContainer:{
        justifyContent:'center',
        alignItems:'center',
    },
    signUpLoadingIndicatorContainer:{
		alignSelf:'center'
    },
	passwordTextInputContainer:{
		flexDirection:'row',
		alignItems:'center',
		// backgroundColor:'red',
		marginHorizontal:10,
		borderWidth:StyleSheet.hairlineWidth,
		borderRadius:5,
        marginBottom:10,
	},
	passwordTextInput:{
		flex:1,
		marginHorizontal:0,
		justifyContent:'center',
        backgroundColor:'#ffff',
        padding:8,
        paddingLeft:20,
		borderRadius:5,
		fontSize:17,
	},
	eyeButton:{
		paddingHorizontal:10,
	},
	termsConditionsContainer:{
		flexDirection:'row',
		alignItems:'center',
		marginTop:5
	},
	checkButton:{
		paddingRight:5
		
	},
	termsAndConditionsLinkLabel:{
		color:'black',
		fontWeight:'bold',
	},
	termsAndConditionsLinkContainer:{

	},

	googleSignInButtonLabel:{
		color:'white',
		paddingHorizontal:10,
		//padding:10,
	},
	labelStyle:{
		paddingHorizontal:10,	
	},
	orLabel:{
		paddingVertical:20,
		textAlign:'center',
		fontSize:17,
	},
	separator:{
		paddingVertical:20,
	},
	textInputContainer:{
		borderColor:'gray',
		borderWidth:1,//StyleSheet.hairlineWidth,
		marginBottom:10,
		borderRadius:3,
		//borderRadius:5,
		//marginHorizontal:10,
		//backgroundColor:'blue',
	},
})
