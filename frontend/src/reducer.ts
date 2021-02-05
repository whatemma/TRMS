import * as Actions from './actions';
import { Application } from './application/application';
import { User } from './user/user';

// Define the items that are in our state
export interface ApplicationState {
    // The list of all restaurants, loaded from the db.
    apps: Application[];
    // The specific restaurant we have selected for view, edit, or add
    app: Application;
}
export interface UserState {
    user: User;
}
export interface AppState extends UserState, ApplicationState { }

// We need to define the initial state of the application and that
// state should include everything that the application might keep track of.

const initialState: AppState = {
    user: new User(),
    apps: [],
    app: new Application()
}

// Make sure that the reducer has a default argument of the inital state or it will not work.
const reducer = (state: AppState = initialState, action: Actions.AppAction): AppState => {
    // We want to call setState. (redux will do that when we return a new state object from the reducer)
    const newState = {...state}; // If we return this, it will re render the application. (call setState)
    switch (action.type) {    
        case Actions.ApplicationActions.GetApplications:
            newState.apps = action.payload as Application[];
            return newState;
        case Actions.ApplicationActions.ChangeApplication:
            newState.app = action.payload as Application;
            return newState;
        case Actions.UserActions.GetUser:
            newState.user = action.payload as User;
            return newState;
        default: 
            return state;
    }
}

export default reducer;