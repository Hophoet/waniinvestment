import {
		CLEAN, 
		SET_AUTH_USER_TOKEN,
		SET_AUTH_USER,
		
} from '../actions';

const intialState:any = {  presentationRead:false };


const reducer = (state = intialState, action:any) => {
  let newState:any;
  switch (action.type) {

    case SET_AUTH_USER_TOKEN:
		const authUserToken:any = action.value;
		newState = {
			...state,
			authUserToken:authUserToken,
		};
		return newState;

    case SET_AUTH_USER:
		const authUser:any = action.value;
		newState = {
			...state,
			authUser: authUser,
		};
		return newState;

	case CLEAN:
		newState = {}
		return newState
		
		
    default:
		return state;
  }
};
export default reducer;
