import React from 'react';
import { Route, useHistory } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav'
import Button from 'react-bootstrap/Button'
import Navbar from 'react-bootstrap/Navbar'

import LoginComponent from './user/login.component';
import userService from './user/user.service';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from './actions';
import { UserState } from './reducer';
import { User } from './user/user';
import aboutComponent from './about.component';
import AddApplicationComponent from './application/add-application.component';
import MyApplicationsComponent from './application/my-applications.component';
import PendingAppComponent from './application/pending.component';
import AppDetailComponent from './application/appDetail.component';


export default function RouterComponent() {
    const userSelector = (state: UserState) => state.user;
    const history = useHistory();
    const user = useSelector(userSelector);
    const dispatch = useDispatch();
    function logout() {
        userService.logout().then(() => {
            dispatch(getUser(new User()));
            history.push('/');
        });
    }
    return (
        <div className='wrapper'>
            <header className='header'>
                <Navbar bg="light" variant="light">
                    <Navbar.Brand href='/'>TRMS</Navbar.Brand>
                    <Nav className="mr-auto">
                        {user.role && (<>
                            <Nav.Link href="/myApplications">My Applications</Nav.Link>
                            <Nav.Link href='/newApplication'>New Application</Nav.Link>
                            <Nav.Link href="/pendingActions">Pending Actions</Nav.Link>
                        </>)}
                    </Nav>
                    <Navbar.Collapse className="justify-content-end">
                    {user.role ? 
                        <>
                            <Navbar.Text>Welcome back, {user.role}: {user.name}</Navbar.Text>
                            <Button className='btn btn-light' onClick={logout}>Log Out</Button> 
                        </> :
                        <Nav.Link className='btn btn-light' href="/login">Log In</Nav.Link>   
                    }    
                    </Navbar.Collapse>
                </Navbar>
            </header>

            <Route exact path='/' component={aboutComponent}/>
            <Route
                exact
                path='/newApplication'
                render={()=> <AddApplicationComponent/>}
            />
            <Route
                exact
                path='/applications/:id-:name'
                component={AppDetailComponent}
            />
            <Route 
                exact 
                path='/login' 
                component={LoginComponent} 
            />
            <Route 
                exact 
                path='/myApplications' 
                component={MyApplicationsComponent} 
            />
            <Route 
                exact 
                path='/pendingActions' 
                component={PendingAppComponent} 
            />
        </div>
    );
}
