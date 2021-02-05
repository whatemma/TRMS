import {AppState} from './reducer';
import {AppAction, getApplications} from './actions';
import {ThunkAction} from 'redux-thunk';
import applicationService from './application/application.service';

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, AppAction>;

export const thunkGetApplications = (): AppThunk => async dispatch => {
    const asyncResp = await applicationService.getApplications();
    console.log('before thunk dispatch');
    dispatch(getApplications(asyncResp));
}

