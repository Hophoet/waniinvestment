import React from 'react'
import Icon from "react-native-vector-icons/Ionicons";
import { createStackNavigator } from '@react-navigation/stack';

import SignUp from '../layouts/authentification/SignUp' 
import SignIn from '../layouts/authentification/SignIn'
import Loader from '../layouts/authentification/Loader'
import SendPasswordResetEmail from '../layouts/authentification/SendPasswordResetEmail'
import SetNewPassword from '../layouts/authentification/SetNewPassword'

import VerifyPasswordResetCode from '../layouts/authentification/VerifyPasswordResetCode'


const Auth = createStackNavigator()
const AuthStack = () => (
	<Auth.Navigator >
		<Auth.Screen 
			name='SignIn' 
			component={SignIn}/>
		<Auth.Screen 
			name='SignUp' 
			component={SignUp}/>
		<Auth.Screen 
			name='SendPasswordResetEmail' 
			component={SendPasswordResetEmail}/>
		<Auth.Screen 
			name='VerifyPasswordResetCode' 
			component={VerifyPasswordResetCode}
		/>
		<Auth.Screen 
			name='SetNewPassword' 
			component={SetNewPassword}
		/>
	</Auth.Navigator>
)


const App = createStackNavigator()
const AppStack = () => (
	<Auth.Navigator 
		keyboardHandlingEnabled={true}	
		initialRouteName='Loader'
	>
		<Auth.Screen 
			options={{
				headerShown:false,
			}}
			name='Auth' 
			component={AuthStack}/>
		<Auth.Screen 
			options={{
				headerShown:false,
			}}
			name='Loader' 
			component={Loader}/>
	</Auth.Navigator>
)


  export default AppStack
