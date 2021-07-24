import React from 'react'
import {StyleSheet, ActivityIndicator, StatusBar, View, Text} from 'react-native'
import {NavigationActions} from '@react-navigation/compat'
import { connect } from 'react-redux'


type Prop = {
	authUserToken:string,
	authUser:any,
	navigation:any,
	presentationRead:boolean,
}

type State = {

}

// Loading screen component
class Loader extends React.Component<Prop, State>{
    constructor(props:Prop){
        super(props);
    }
     
	// method to dynamic navigation to the authentification or the app home screen
	_actionManager = async () => {
		// method for navigation, depends on the user state(authentificated or not)
		if(this.props.authUserToken && this.props.authUser){
			// Navigation to the app home screen because the user exists
			this.props.navigation.navigate(
				'Auth',
				{},
				NavigationActions.navigate({
					routeName:'Home'
				})
			);
		}
		else{
			let presenationRead:boolean = this.props.presentationRead
			if(!presenationRead){
				// Navigation to the presenation because the user did not read the presentation
				this.props.navigation.navigate(
					'Auth', 
					{}
				);
				
			}
			else{
				// Navigation to the authentification sigin because the user not exists(not yet authentificated)
				this.props.navigation.navigate(
					'Auth', 
					{},
					NavigationActions.navigate({
						routeName:'SignIn'
					})
				);
			}
		}
	}
	componentDidMount(){
		this.props.navigation.addListener('focus', (e:Event) => {
			//call the component navigation handler on every component focus state
			this._actionManager();
		});
		this.props.navigation.addListener('blur', (e:Event) => {
			//call the component navigation handler on every component focus state
		});
	}
    render(){
        return (
            <View style={styles.container}>
				<StatusBar backgroundColor='white' />
				<View 
					style={styles.contentContainer}>
					<ActivityIndicator 
						color='gray'	
						size='large'
					/>
					<Text style={styles.title}>Wani</Text>
					<Text style={styles.description}>Investment</Text>
				</View>
            </View>
        )
    }
}

//maps with the state global
const mapDispatchToProps = (dispatch:any) => {
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

export default connect(mapStateToProps, mapDispatchToProps)(Loader)


const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
		backgroundColor:'white',

	},
	title:{
		fontSize:30,
		fontWeight:'bold',
		textAlign:'center',
	},
	description:{
		textAlign:'center',
		
	}
})
