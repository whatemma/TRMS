import { SyntheticEvent, useEffect, useState} from 'react';
import { useHistory } from 'react-router-dom';
import { Application } from './application';
import applicationService from './application.service';
import { ApplicationState, UserState } from '../reducer';
import { useDispatch, useSelector } from 'react-redux';
import { changeApplication } from '../actions';

import Card from 'react-bootstrap/Card';
import CardDeck from 'react-bootstrap/CardDeck';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Badge from 'react-bootstrap/Badge';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import userService from '../user/user.service';

interface ApplicationDetailProps {
    match: any;
}

function AppDetailComponent(props: ApplicationDetailProps) {
    const applicationSelector = (state: ApplicationState) => state.app;
    const application = useSelector(applicationSelector);
    const user = useSelector((state: UserState) => state.user);
    const dispatch = useDispatch();
    const history = useHistory();
    useEffect(()=>{
        applicationService.getApplication(props.match.params.id, props.match.params.name).then((data)=> {
            dispatch(changeApplication(data));
        }).catch(err=>{
            console.log(err);
        })
    }, [dispatch,props.match.params]);

    function moneyAfterRejected(name: string, reimbursement: number){
        userService.getUserByName(name).then((user)=>{
            let temp = {...user};
            temp.availableReimburstment += reimbursement;
            userService.update(temp).then().catch(err=>{
                console.log(err);
            })
        }).catch(err=>{
            console.log(err);
        })
    }

    function handleApprove(){
        let app = {...application};
        app.approvedBy.push({name: user.name, role: user.role});
        if(user.role === 'BenCo'){
            //user need to update grade after
            if(application.grade === 'pending'){
                app.status = 'pending grade';
                app.waitApprovalFrom = {name: user.name, role: user.role}
            }else if(application.grade === 'passed'){
                app.status = 'completed';
            }
        }else if(user.role === 'Department Head'){
            app.waitApprovalFrom = {name: 'BenCo', role: 'BenCo'};
        }else{
            userService.findDepartmentHead(user.department).then(data=>{
                app.waitApprovalFrom = {name: data.name, role: data.role};
                applicationService.updateApplication(app).then(()=>{
                    history.push('/pendingActions');
                }).catch(err=>{
                    console.log(err);
                });
            }).catch(err=>{
                console.log(err);
            });
        }
        applicationService.updateApplication(app).then(()=>{
            history.push('/pendingActions');
        }).catch(err=>{
            console.log(err);
        });
    }

    function handleReject(){
        let app: Application = {...application};
        app.status = 'rejected';
        app.waitApprovalFrom = {name: user.name, role: user.role};
        if(app.rejectedReason){
            applicationService.updateApplication(app).then(()=>{
                moneyAfterRejected(app.name, app.reimbursement);
                history.push('/pendingActions');
            }).catch(err=>{
                console.log(err);
            });          
        }
    }

    function handleRFC(){
        let app: Application = {...application};
        app.currentRFC.from = user.name;
        app.rfc.push(app.currentRFC);
        app.status = 'pending response'
        app.waitApprovalFrom = {name: user.name, role: user.role};
        applicationService.updateApplication(app).then(()=>{
            history.push('/pendingActions');
        }).catch(err=>{
            console.log(err);
        });
    }

    function handleGrade(){
        let app: Application = {...application};
        if(app.grade === 'passed'){
            app.status = 'pending approval';
            applicationService.updateApplication(app).then(()=>{
                history.push('/pendingActions');
            }).catch(err=>{
                console.log(err);
            });
        }else{
            app.status = 'rejected';
            applicationService.updateApplication(app).then(()=>{
                moneyAfterRejected(app.name, app.reimbursement);
                history.push('/pendingActions');                
            }).catch(err=>{
                console.log(err);
            });
        }
    }

    function handleAdjust(){
        let app: Application = {...application};
        if(app.adjustedReimbursement > 0 && app.adjustmentReason){
            app.status = 'pending review';
            app.waitApprovalFrom = {name: user.name, role: user.role};
            if(app.adjustedReimbursement > app.reimbursement){
                app.exceedingFund = true;
            }
            applicationService.updateApplication(app).then(()=>{
                history.push('/pendingActions');                
            }).catch(err=>{
                console.log(err);
            });
        }
    }

    function handleResponse(){
        let app: Application = {...application};
        const index = app.rfc.findIndex(item=>{
            return item.to === user.name && item.from === app.waitApprovalFrom.name
        });
        app.rfc[index].response = app.currentRFC.response;
        app.status = 'pending approval';
        applicationService.updateApplication(app).then(()=>{
            history.push('/pendingActions');
        }).catch(err=>{
            console.log(err);
        })
    }

    function handleCancel(){
        let app: Application = {...application};
        app.status = 'canceled';
        applicationService.updateApplication(app).then(()=>{
            moneyAfterRejected(app.name, app.reimbursement);
            history.push('/pendingActions');
        }).catch(err=>{
            console.log(err);
        });
    }

    function handleConfirm(){
        let app: Application = {...application};
        app.status = 'pending approval';
        applicationService.updateApplication(app).then(()=>{
            history.push('/pendingActions');
        }).catch(err=>{
            console.log(err);
        });
    }

    function handleChange(e: SyntheticEvent){
        let app: any = {...application};
        app[
            (e.target as HTMLInputElement).name
        ] = (e.target as HTMLInputElement).value;
        dispatch(changeApplication(app));
    }

    function handleRFCChange(e:SyntheticEvent){
        let app: Application = {...application};
        const n = (e.target as HTMLInputElement).name;
        const v = (e.target as HTMLInputElement).value;
        if(n === 'question'){
            app.currentRFC.question = v;
        }else if(n === 'to'){
            app.currentRFC.to = v;
        }else if(n === 'response'){
            app.currentRFC.response = v;
        }
        dispatch(changeApplication(app));
    }

    const [show, setShow] = useState(false);
    const [action, setAction] = useState('');

    const handleClose = () => {
        let app: Application = {...application};
        app.rejectedReason = '';
        app.currentRFC = {to: '', from: '', question: '', response: ''};
        dispatch(changeApplication(app));
        setShow(false);
    }
    const handleRejectShow = () => {
        setAction('Reject');
        setShow(true);
    }
    const handleRFCShow = () => {
        setAction('RFC');
        setShow(true);
    }
    const handleGradeShow = () => {
        setAction('Grade');
        setShow(true);
    }
    const handleAdjustShow = () => {
        setAction('Adjust');
        setShow(true);
    }

    const handleResponseShow = () => {
        let app: Application = {...application};
        const item = app.rfc.find(item=>{
            return item.to === user.name && item.from === app.waitApprovalFrom.name;
        });
        if(item){
            app.currentRFC = item;
        }
        dispatch(changeApplication(app));
        setAction('Response');
        setShow(true);
    }

    const handleReviewShow = () => {
        setAction('Review');
        setShow(true);
    }

    return (
        <div>
            <Card className='detail-card'>
                <Card.Body>
                    <Card.Title>{application.type} {application.urgent && <Badge variant="secondary">Urgent</Badge>}</Card.Title>
                    <Card.Text>{application.description}</Card.Text>
                </Card.Body>
                <ListGroup className="list-group-flush">
                    {application.exceedingFund && <ListGroupItem>Exceeding Available Fund: {application.exceedingFund}</ListGroupItem>}
                    <ListGroupItem>Application submitted on: {(new Date(application.applicationDate)).toDateString()}</ListGroupItem>
                    <ListGroupItem>Application status: {application.status}</ListGroupItem>
                    <ListGroupItem>Name of participant: {application.name}</ListGroupItem>
                    <ListGroupItem>Event starts on: {(new Date(application.eventstartDate)).toDateString()}</ListGroupItem>
                    <ListGroupItem>Cost of event: {application.cost}</ListGroupItem>
                    <ListGroupItem>Projected reimbursement: {application.adjustedReimbursement ? application.adjustedReimbursement : application.reimbursement}</ListGroupItem>
                    <ListGroupItem>Grade: {application.grade}</ListGroupItem>
                    <ListGroupItem>Application approved by: {application.approvedBy.length>0 && application.approvedBy.map(item=>`${item.name} `)}</ListGroupItem>
                    {application.status !== 'rejected' 
                    ? <ListGroupItem>Waiting approval from: {application.waitApprovalFrom.name}</ListGroupItem>
                    : <ListGroupItem>Application rejected by: {application.waitApprovalFrom.name}</ListGroupItem>}
                    {application.rfc.length ?
                    <ListGroupItem>
                        <CardDeck>
                             {application.rfc.map((item)=>{
                                return (
                                    <Card border="dark" style={{ width: '18rem', borderRadius: '3%' }}>
                                            <Card.Header>Request For Comments</Card.Header>
                                            <Card.Body>
                                                <Card.Text>RFC from: {item.from}</Card.Text>
                                                <Card.Text>RFC Question: {item.question}</Card.Text>
                                                <Card.Text>RFC To: {item.to}</Card.Text>
                                                <Card.Text>RFC Response: {item.response}</Card.Text>
                                            </Card.Body>                                         
                                        </Card>
                                );
                            })}
                            
                        </CardDeck>
                    </ListGroupItem>
                    : ' '
                    }
                </ListGroup>
                <Card.Body className='button-body'>
                    {
                    (user.name === application.waitApprovalFrom.name || 
                    (application.waitApprovalFrom.name === 'BenCo' && application.name !== user.name)) ?
                        <div className="btn-group" role="group">
                            <button type="button" className="btn btn-outline-secondary" onClick={handleApprove}>Approve</button>
                            <button type="button" className="btn btn-outline-secondary" onClick={handleRFCShow}>Request For Comment</button>
                            {user.role === 'BenCo' && 
                            <button type="button" className="btn btn-outline-secondary" onClick={handleAdjustShow}>Adjust Reimbursement</button>
                            }
                            <button type="button" className="btn btn-outline-secondary" onClick={handleRejectShow}>Reject</button>
                        </div> :
                        <div className="btn-group" role="group">
                            {application.status === 'pending grade' 
                            ? <button type="button" className="btn btn-outline-secondary" onClick={handleGradeShow}>Submit Grade</button>
                            : application.status === 'pending response'
                            ? <button type="button" className="btn btn-outline-secondary" onClick={handleResponseShow}>Submit Response</button>
                            : application.status === 'pending review'
                            ? <button type="button" className="btn btn-outline-secondary" onClick={handleReviewShow}>Review Changes</button>
                            : 'No Action Is Required At The Moment'}
                        </div>                   
                    }

                </Card.Body>
            </Card>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Pending Action</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {
                        action === 'Reject' ?
                        <Form.Group controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Reason for rejection: </Form.Label>
                            <Form.Control 
                                as="textarea" 
                                rows={3} 
                                name='rejectedReason'
                                value={application.rejectedReason}
                                onChange={handleChange}
                                placeholder='Reason for rejection'
                            />
                        </Form.Group> :
                        action === 'RFC' ?
                        <>
                            <Form.Group controlId="exampleForm.SelectCustom">
                                <Form.Label>Select a participant: </Form.Label>
                                <Form.Control onChange={handleRFCChange} name='to' as="select" custom>
                                    <option value=''></option>
                                    <option value={application.name}>{application.name}</option>
                                    {application.approvedBy.length && application.approvedBy.map((ppl, index)=>{
                                        if(ppl.name !== user.name){
                                            return <option key={index} value={ppl.name}>{ppl.name}</option>
                                        }
                                        return false;
                                    })}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="exampleForm.ControlTextarea1">
                                <Form.Label>Request for comment:</Form.Label>
                                <Form.Control 
                                    as="textarea" 
                                    rows={3} 
                                    name='question'
                                    value={application.currentRFC.question}
                                    onChange={handleRFCChange}
                                    placeholder='comment'
                                />
                            </Form.Group> 

                        </>:
                        action === 'Grade' ?
                        <Form.Group>
                            <Form.Label>Your final grade: </Form.Label>
                            <div className="mb-3" onChange={handleChange}>
                                <Form.Check 
                                    inline
                                    type='radio'
                                    id='default-radio'
                                    label='Passed'
                                    value='passed'
                                    name='grade'
                                />
                                <Form.Check 
                                    inline
                                    type='radio'
                                    id='default-radio'
                                    label='Failed'
                                    value='failed'
                                    name='grade'
                                    defaultChecked
                                />                        
                            </div>
                        </Form.Group> :
                        action === 'Response' ?
                        <Form.Group controlId="exampleForm.ControlTextarea1">
                            {<>
                                <p>Question: {application.currentRFC.question}</p>
                                <p>From: {application.currentRFC.from}</p>
                            </>}
                            <Form.Label>Response: </Form.Label>
                            <Form.Control 
                                as="textarea" 
                                rows={3} 
                                name='response'
                                value={application.currentRFC.response}
                                onChange={handleRFCChange}
                                placeholder='response'
                            />
                        </Form.Group> :
                        action === 'Adjust' ?
                        <>
                            <Form.Group controlId="exampleForm.ControlTextarea1">
                                <Form.Label>Update Reimbursement: </Form.Label>
                                {<p>Projected Reimbursement: {application.reimbursement}</p>}
                                <Form.Control 
                                    type="text" 
                                    name='adjustedReimbursement'
                                    value={application.adjustedReimbursement}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="exampleForm.ControlTextarea1">
                                <Form.Label>Reason for adjustment:</Form.Label>
                                <Form.Control 
                                    as="textarea" 
                                    rows={3}
                                    name='adjustmentReason'
                                    value={application.adjustmentReason}
                                    onChange={handleChange}
                                    placeholder='reason for adjustment'
                                />
                            </Form.Group>
                        </> :
                        <>
                        <p>{application.waitApprovalFrom.name} changed your projected reimbursement</p>
                        <p>Reason: {application.adjustmentReason}</p>
                        <p>Your New Reimbursement: {application.adjustedReimbursement}</p>
                        </>
                    }
                </Modal.Body>
                <Modal.Footer>
                    <button className='btn btn-outline-secondary' onClick={handleClose}>
                        Close
                    </button>
                    {
                        action === 'Reject' 
                        ? <button className='btn btn-secondary' onClick={handleReject}>
                            Reject
                        </button> 
                        : action === 'RFC' 
                        ? <button className='btn btn-secondary' onClick={handleRFC}>
                            Request For Comment
                        </button> 
                        : action === 'Grade'
                        ? <button className='btn btn-secondary' onClick={handleGrade}>
                            Submit Grade
                        </button>
                        : action === 'Response'
                        ? <button className='btn btn-secondary' onClick={handleResponse}>
                            Submit Response
                        </button>
                        : action === 'Adjust'
                        ? <button className='btn btn-secondary' onClick={handleAdjust}>
                            Submit New Reimbursement
                        </button>
                        : <div className="btn-group" role="group">
                            <button type="button" className="btn btn-secondary" onClick={handleConfirm}>Approve Changes</button>
                            <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancel Application</button>
                        </div>
                    }
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default AppDetailComponent;