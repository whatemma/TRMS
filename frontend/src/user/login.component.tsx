import { SyntheticEvent } from 'react';
import userService from './user.service';
import { useHistory } from 'react-router-dom';
import { UserState } from '../reducer';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../actions';
import Form from 'react-bootstrap/Form';


// Function Component
function LoginComponent() {
    const userSelector = (state: UserState) => state.user;
    const user = useSelector(userSelector);
    const dispatch = useDispatch();
    const history = useHistory();

    function handleFormInput(e: SyntheticEvent) {
        let u: any = { ...user };
        if((e.target as HTMLInputElement).name === 'username'){
            u.name = (e.target as HTMLInputElement).value;
        } else {
            u.password = (e.target as HTMLInputElement).value;
        }
        dispatch(getUser(u));
    }
    function submitForm() {
        userService.login(user).then((user) => {
            dispatch(getUser(user));
            history.push('/myApplications');
        }).catch((err)=>{
            console.log(err);
        });
    }
    return (
        <div className="form">
            <Form>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label className='text-dark'>Username</Form.Label>
                    <Form.Control type="text" placeholder="Name" name='username' onChange={handleFormInput}/>
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label className='text-dark'>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" name='password' onChange={handleFormInput}/>
                </Form.Group>

                <button className='login-button btn btn-outline-secondary' type='button' onClick={submitForm}>
                    Log in
                </button>
            </Form>            
        </div>
    );
}

export default LoginComponent;
