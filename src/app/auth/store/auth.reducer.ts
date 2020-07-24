import { User } from '../user.model';
import * as aa from './auth.actions';
export interface State {
  user: User;
  authError: string;
  loading: boolean;
}

const initialState: State = {
  user: null,
  authError: null,
  loading: false,
};

export function authReducer(state = initialState, action: aa.AuthActions) {
  // rven if you are dispatching shopping-list related actions,
  // auth reducer will still receive them
  // console.log(state);
  switch (action.type) {
    case aa.AUTHENTICATE_SUCCESS:
      const user = new User(
        action.payload.email,
        action.payload.userId,
        action.payload.token,
        action.payload.expirationDate
      );
      return {
        ...state,
        authError: null,
        user,
        loading: false,
      };
    case aa.LOGIN_START:
    case aa.SIGNUP_START:
      return {
        ...state,
        authError: null,
        loading: true,
      };
    case aa.AUTHENTICATE_FAIL:
      return {
        ...state,
        user: null,
        authError: action.payload,
        loading: false,
      };
    case aa.LOGOUT:
      return {
        ...state,
        user: null,
      };
    case aa.CLEAR_ERROR:
      return {
        ...state,
        authError: null,
      };
    // very important that you return the current state
    // if you do not recognize the incoming actions
    default:
      return state;
  }
}
