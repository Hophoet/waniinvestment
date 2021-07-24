import React from 'react'
import { Dimensions, BackHandler, StyleSheet, StatusBar, View, Text, ActivityIndicator, TextInput, TouchableOpacity} from 'react-native'
import { connect } from 'react-redux'
import  {SET_AUTH_USER_TOKEN, SET_AUTH_USER} from '../../redux/store/actions'
import {loginWithUsernameOrEmail} from '../../backend/requests/auth';
import MainHeader from '../../components/MainHeader';
import toasts from '../../components/toasts'	


type Prop = {
	authUserToken:string,
	authUser:any,
	navigation:any,
	dispatch:Function,
	presentationRead:boolean,

}

type State = {
	username:string,
	password:string,
	usernameTextInputIsFocus:boolean,
	passwordTextInputIsFocus:boolean,
	isLoading:boolean,
	usernameTextInputIsFocused?:boolean,
	passwordTextInputIsFocused?:boolean,

}

class  SignIn extends React.Component<Prop,State> { 

	_isMounted:boolean;
	usernameRef:any;
	passwordRef:any;
    constructor(props:Prop){
        super(props);
		this._isMounted = false;
		//state
        this.state = {
			usernameTextInputIsFocus:false,
			passwordTextInputIsFocus:false,
            isLoading:false,
			username:'',
			password:'',
        }
    }

	componentWillUnmount(){
		//clean up
		this._isMounted = false;
		this.setState({isLoading:false});
	}

	closeAuth = () => {
       this.props.navigation.navigate('App',{});

	}


	// Method for the text field validation
	fieldsAreValid = () => {
		let username = this.state.username;
		let password = this.state.password;
		if((username && password)){
			return true;	
		}
		else if(!username){
			toasts._show_bottom_toast("Entez votre email ou nom d'utilisateur");
		}
		else if(!password){
			toasts._show_bottom_toast('Entez votre mot de passe');
		}


	}
	
	
    // User login method 
    _login = () => {
        // Check if loging request is loading already or not
        if(!this.state.isLoading){     
			if(this.fieldsAreValid()){
            	// Start the loading
            	this.setState({isLoading:true})
				loginWithUsernameOrEmail(this.state.username, this.state.password)
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
						//console.log(error.response.status);
						//console.log(error.response.headers);
						if (error.response) {
						  // The request was made and the server responded with a status code
						  // that falls out of the range of 2xx
						  console.log(error.response.data);
						  let errorData = error.response.data;
						  if(errorData.code == 'auth/invalid-credential'){
								toasts._show_bottom_toast("nom d'utilisateur/email ou mot de passe incorrect");	
						  }
						  else if(errorData.code == 'auth/username-and-password-required'){
								toasts._show_bottom_toast("Entrer votre nom d'utlisateur et mot de passe pour continuer");	
						  }
						  else if(errorData.code == 'auth/email-and-password-required'){
							 toasts._show_bottom_toast("Entrer votre email et mot de passe pour continuer");	

						  }
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
        
    
    // Loading activity render
    _loader = () => {
		// Render the activity indicator during the login request 
        if(this.state.isLoading){
            return (
                <View style={styles.loginLoadingIndicatorContainer}>
                    <ActivityIndicator size='small' color='white'/>
                </View>
            )
        }
		return (
			<Text style={styles.buttonText}>Connexion</Text>
		)
    }
   _customNav = () => {
        this.props.navigation.setOptions({
          header: () => (
            <MainHeader 
				// firstAction={this.closeAuth}	
				// firstActionIcon='close'
			/>
          ),
        });
    }

	componentDidMount(){
		// Set the component state 
		this._isMounted = true;
		this._customNav();
		// Add event listener to exit the back when the user press the device back button 
		this.props.navigation.addListener('beforeRemove', (e:any) => {
			//exit the app when the back button is press
			if(e.data.action.type == 'GO_BACK'){
		 		e.preventDefault();
				// exit the app if the presentation was read
				BackHandler.exitApp();

			}
		 });
	
	}

 
    //components rending method
    render(){
        return(
            <View style={styles.container}>
                <StatusBar backgroundColor={'black'}/>
                <View style={styles.headerContainer}>
					<Text style={styles.title}>Wani Investment</Text>
					<Text style={styles.description}>Connectez-vous pour continuer</Text>
                </View>
                <View style={styles.formContainer}>
					<View 
						style={[
							styles.textInputContainer
						]}

					>
                    <TextInput
                        placeholder={(!this.state.usernameTextInputIsFocused)
							?"email ou nom d'utilisateur"
							:""
						}
                        ref={'usernameRef'}
						onFocus={() => {
							console.log('username focus')
							this.setState({usernameTextInputIsFocused:true});
						}}
						onBlur={() => {
							console.log('username blur')
							this.setState({usernameTextInputIsFocused:false});
						}}
                        style={[styles.textInput,styles.usernameTextInput,
							this.state.usernameTextInputIsFocused &&
							styles.focusedTextInput

						]}
						value={this.state.username}
                        onChangeText={username=>{this.setState({username})}}
                        onSubmitEditing={()=>{
							if(this.refs.passwordRef){
								if(!this.state.password){
									this.refs.passwordRef.focus();
								}
								else{
									this._login();
								}
							}
                        }}
                    />
					</View>
					<View 
						style={[
							styles.textInputContainer
						]}

					>
                     <TextInput
						onFocus={() => {
							console.log('password focus')
							this.setState({passwordTextInputIsFocused:true});
						}}
						onBlur={() => {
							console.log('password blur')
							this.setState({passwordTextInputIsFocused:false});
						}}
                        style={[styles.textInput, styles.passwordTextInput,
							
							this.state.passwordTextInputIsFocused &&
							styles.focusedTextInput

						]}
                        placeholder={(!this.state.passwordTextInputIsFocused)
							?"mot de passe"
							:""
						}
                        ref={'passwordRef'}
                        secureTextEntry={true}
						value={this.state.password}
                        onChangeText={password=>{this.setState({password})}}
                        onSubmitEditing={()=>{
							if(this.refs.usernameRef){
								if(!this.state.username){
									this.refs.usernameRef.focus();
								}
							   else{
									this._login();
								}
							}
                        }}
						/>
					</View>
					</View>
					<TouchableOpacity 
						style={[
							styles.buttonContainer,
							(!(this.state.username && this.state.password)) && {opacity:.5}
						]} 
						onPress={this._login}
						disabled={(this.state.isLoading || !(this.state.username && this.state.password))?true:false}
						>
							{this._loader()}
					</TouchableOpacity>
					<View style={styles.footer}>
					<Text 
						onPress={()=>this.props.navigation.navigate('SignUp', {})} 
						style={styles.signUpLabel}>Pas de compte wani investment ?<Text style={styles.signupText} > Creé un compte gratuit</Text></Text>
					<Text 
						onPress={()=>{
							this.props.navigation.navigate(
								'SendPasswordResetEmail', {}
							);	
						}
						} 
						style={styles.passwordResetLabel}><Text style={styles.signupText} >Mot de passe oublié</Text></Text>
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
		authUser:state.authUser,
		presentationRead:state.presentationRead
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignIn)

const {width, height} = Dimensions.get('window');

//set screen styles
const styles = StyleSheet.create({
    container:{
        flex:1,
		backgroundColor:'white',
        paddingHorizontal:20,
     
    },
    buttonContainer:{
		flexDirection:'row',
        backgroundColor:'black',
        padding:10,
        justifyContent:'center',
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
    formContainer:{
		marginBottom:20,
    },
	focusedTextInputContainer:{
		borderColor:'black',
		borderRadius:10,
		borderWidth:2,
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
	textInputLabel:{
		opacity:.3,
        paddingHorizontal:8,
	},

	usernameTextInputContainer:{
		borderTopRightRadius:10,
		borderTopLeftRadius:10,
	},
	passwordTextInputContainer:{
		borderBottomRightRadius:10,
		borderBottomLeftRadius:10,
	},
	usernameTextInput:{
		borderTopRightRadius:10,
		borderTopLeftRadius:10,
	},
	passwordTextInput:{
		borderBottomRightRadius:10,
		borderBottomLeftRadius:10,

	},
    textInput:{
        backgroundColor:'#ffff',
		//backgroundColor:'red',
        paddingHorizontal:8,
		fontSize:17,
		minHeight:width/7,
    },
	focusedTextInput:{
		borderRadius:10,

	},
    headerContainer:{
        marginBottom:20,
		//backgroundColor:'red',
    },
    footer:{
        flexDirection:"column",
        marginVertical:20
    },
    footerTitle:{
        color:'gray',
    },
    signupText:{
        //color:colors.core,
        fontWeight:'bold',
    },
    loginTitleContainer:{
        justifyContent:'center',
        alignItems:'center',
        // backgroundColor:'red'
    },
    loginLoadingIndicatorContainer:{
		alignSelf:'center'
    },
	labelStyle:{
		paddingHorizontal:10,	
	},
	googleButton:{
		//backgroundColor:'red',
	},
	separator:{
		paddingVertical:20,
	},
	signUpLabel:{
		padding:5,
		alignSelf:'flex-start',
		//backgroundColor:'red',
	},
	passwordResetLabel:{
		padding:5,
		alignSelf:'flex-start',
		//backgroundColor:'blue',
	}

})
