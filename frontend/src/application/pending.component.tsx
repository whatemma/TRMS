import { useDispatch, useSelector } from 'react-redux';
import Table from 'react-bootstrap/Table';
import Badge from 'react-bootstrap/Badge';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { ApplicationState, UserState } from '../reducer';
import { thunkGetApplications } from '../thunks';
import { Application } from './application';

function PendingAppComponent() {
    const userSelector = (state: UserState) => state.user;
    const history = useHistory();
    const user = useSelector(userSelector);
    const selectapp = (state: ApplicationState) => state.apps;
    const applications = useSelector(selectapp);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(thunkGetApplications());
    }, [dispatch]);
    
    const filteredApps = applications.filter(item=>{
        if(item.status === 'pending approval' && user.name !== item.name){
            if(user.role === 'BenCo' && item.waitApprovalFrom.name==='BenCo'){
                return true;
            }else{
                return item.waitApprovalFrom.name === user.name;
            }            
        }else if(item.status === 'pending response'){
            let rfc = item.rfc.find(rfcItem=>{
                return rfcItem.to === user.name && rfcItem.from === item.waitApprovalFrom.name;
            });
            return rfc && rfc.to === user.name;
        }else if(item.status === 'pending grade' || item.status === 'pending review'){
            return item.name === user.name;
        }
        return false;
    });

    function handleClick(item: Application){
        history.push(`/applications/${item.applicationDate}-${item.name}`);
    }

    return (
        <Table striped bordered hover variant="light">
            <thead>
                <tr>
                    <th> </th>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Tuition</th>
                    <th>Projected Reimbursement</th>
                    <th>Application Status</th>
                    <th>Urgent</th>
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
                                <td>{item.name}</td>
                                <td>{item.type}</td>
                                <td>{item.cost}</td>
                                <td>{item.adjustedReimbursement ? item.adjustedReimbursement : item.reimbursement}</td>
                                <td>{item.status}</td>
                                <td>{item.urgent ? <Badge variant="secondary">Urgent</Badge> : ''}</td>
                            </tr>
                        )
                    })
                }

            </tbody>
        </Table>
    );
}

export default PendingAppComponent;