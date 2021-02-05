import {Application} from './application/application';
import {User} from './user/user';

export enum ApplicationActions {
    GetApplications = 'GET_APPLICATIONS',
    ChangeApplication = 'CHANGE_APPLICATIONS'
}

export enum UserActions {
    GetUser = 'GET_USER'
}

export interface AppAction {
    type: string;
    payload: any;
}

export interface UserAction extends AppAction {
    type: UserActions;
    payload: User;
}

// All of our application actions need to follow this interface.
export interface ApplicationAction extends AppAction {
    type: ApplicationActions;
    payload: Application | Application[];
}

export function getApplications(apps: Application[]): ApplicationAction {
    const action: ApplicationAction = {
        type: ApplicationActions.GetApplications,
        payload: apps
    }
    return action;
}

export function changeApplication(app: Application): ApplicationAction {
    const action: ApplicationAction = {
        type: ApplicationActions.ChangeApplication,
        payload: app
    }
    return action;
}

export function getUser(user: User): UserAction {
    const action: UserAction = {
        type: UserActions.GetUser,
        payload: user
    }
    return action;
}