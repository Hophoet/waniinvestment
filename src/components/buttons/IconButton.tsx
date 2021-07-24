import React,{useEffect, useState} from 'react';

import {Text, View, StyleSheet, ActivityIndicator, Dimensions, TouchableOpacity} from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";

const IconButton = ({loading, disabled, onPress, icon, iconSize, label, labelStyle, buttonStyle}:any) => {

	return (
		<TouchableOpacity
			activeOpacity={.5}
			disabled={disabled}
			style={styles.buttonContainer}
			onPress={onPress}
		>
			{ loading &&
			<ActivityIndicator size='small' color='white'/>
			}
			{ !loading && icon &&
			<Icon 
				name={icon?icon:'menu'}  
				size={(iconSize)?iconSize:25}
				color='white'/>
			}
			<Text style={[styles.label, labelStyle]}>{(label)?label:'dk'}</Text>
		</TouchableOpacity>
	)	




}


const {width, height} = Dimensions.get('window')
const styles = StyleSheet.create({
	buttonContainer:{
		backgroundColor:'black',
		justifyContent:'center',
		alignItems:'center',
		minHeight:width/8,
		flexDirection:'row',
		borderRadius:5,
	},
	label:{
		color:'white',
		
	}
})


export default IconButton;
