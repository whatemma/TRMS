import { useDispatch, useSelector } from 'react-redux';
import Table from 'react-bootstrap/Table'
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom'

import { ApplicationState, UserState } from '../reducer';
import { thunkGetApplications } from '../thunks';
import { Application } from './application';

function MyApplicationsComponent() {
    const userSelector = (state: UserState) => state.user;
    const user = useSelector(userSelector);
    const selectapp = (state: ApplicationState) => state.apps;
    const applications = useSelector(selectapp);
    const dispatch = useDispatch();
    const history = useHistory();
    useEffect(() => {
        dispatch(thunkGetApplications());
    }, [dispatch]);
    const filteredApps = applications.filter(item=>item.name === user.name);

    function handleClick(item: Application){
        history.push(`/applications/${item.applicationDate}-${item.name}`);
    }

    return (
        <Table striped bordered hover variant="light">
            <thead>
                <tr>
                    <th> </th>
                    <th>Type</th>
                    <th>Tuition</th>
                    <th>Projected Reimbursement</th>
                    <th>Application Status</th>
                </tr>
            </thead>
            <tbody>
                {
                    filteredApps.map((item, index)=>{
                        return (   
                                <tr key={index}>
                                    <td>
                                        <button className='btn btn-outline-secondary' onClick={()=>{handleClick(item)}}>
                                            See Details
                                        </button>   
                                    </td>
                                    <td>{item.type}</td>
                                    <td>{item.cost}</td>
                                    <td>{item.adjustedReimbursement ? item.adjustedReimbursement : item.reimbursement}</td>
                                    <td>{item.status}</td>
                                </tr>             
                        )
                    })
                }

            </tbody>

        </Table>
    );
}

export default MyApplicationsComponent;