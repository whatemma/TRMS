import { SyntheticEvent } from 'react';
import { useHistory } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import { connect, ConnectedProps, useDispatch, useSelector } from 'react-redux';

import { ApplicationState, UserState } from '../reducer'
import applicationService from './application.service';
import userService from '../user/user.service'
import { changeApplication, getUser } from '../actions';
import { Application } from './application';



// This is the prop I want to connect from redux
const applicationProp = (state: ApplicationState) => ({app: state.app});
// This is the dispatcher I want to use from redux
const mapDispatch = {
    updateApplication: (app: Application) => changeApplication(app)
};

// Put them in the connector
const connector = connect(applicationProp, mapDispatch);

// Function Component
// get the types of the props we created above so we can tell our component about them.
type PropsFromRedux = ConnectedProps<typeof connector>;

function AddApplicationComponent(props: PropsFromRedux) {
    const userSelector = (state: UserState) => state.user;
    const user = useSelector(userSelector);
    //basic employee information; date, time, location, description, cost, 
    //grading format, and type of event; work-related justification
    const dispatch = useDispatch();
    const history = useHistory();
    // This function is going to handle my onChange event.
    // SyntheticEvent is how React simulates events.
    type costType = {
        [key: string]: number
    }

    const date = new Date();
    date.setDate(date.getDate() + 7)
    const minDate = date.toISOString().substring(0, 10);    

    const costObj: costType = {
        'University Courses': .8,
        'Seminars': .6,
        'Certification Preparation Classes': .75,
        'Certification': 1,
        'Technical Training': .9,
        'Other': .3
    }

    function handleFormInput(e: SyntheticEvent) {
        let a: any = { ...props.app };
        a[
            (e.target as HTMLInputElement).name
        ] = (e.target as HTMLInputElement).value;
        props.updateApplication(a);
    }

    function handleRadioSelect(e: SyntheticEvent) {
        let a: Application = { ...props.app };
        (e.target as HTMLInputElement).value === 'true' ? a.approvalEmail = true : a.approvalEmail = false;
        props.updateApplication(a);
    }

    function submitForm() {
        let editApp: Application = { ...props.app};
        let editUser = {...user};
        editApp.applicationDate = Date.now();
        editApp.name = user.name;
        editApp.reimbursement = Math.ceil(Number(props.app.cost) * costObj[props.app.type] * 100)/100;
        //if user's remaining reimbursement is less than the projected, projected = remaining reim
        if(editApp.reimbursement > user.availableReimburstment) {
            editApp.reimbursement = user.availableReimburstment;
        }
        editUser.availableReimburstment -= editApp.reimbursement

        if(editApp.approvalEmail || user.role === 'Department Head' || user.role === 'BenCo'){
            editApp.waitApprovalFrom = {name: 'BenCo', role: 'BenCo'};
        }else{
            editApp.waitApprovalFrom = user.supervisor;
        }
        const startDate1 = new Date(editApp.applicationDate).getTime();
        const startDate2 = new Date(editApp.eventstartDate).getTime();
        const diff = (startDate2 - startDate1);
        if(diff < (1000 * 60 * 60 * 24 * 14)){
            editApp.urgent = true;
        }
        
        applicationService.addApplication(editApp).then( () => {
            props.updateApplication(new Application());
            dispatch(getUser(editUser));
            history.push('/myApplications');
            return userService.update(editUser);
        }).then((res)=>{
        }).catch(err=>{
            console.log(err);
        });
    }

    return (
        <div className='add-form'>
            <Form>
                <Form.Group controlId="formBasicDate">
                    <Form.Label>Event Start Date</Form.Label>
                    <Form.Control 
                    type="date" 
                    placeholder="mm/dd/yyyy"  
                    name='eventstartDate' 
                    min={minDate}
                    value={(props.app).eventstartDate}
                    onChange={handleFormInput} 
                    />
                </Form.Group>

                <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Description of The Event </Form.Label>
                    <Form.Control 
                        as="textarea" 
                        rows={3} 
                        name='description'
                        value={(props.app).description}
                        onChange={handleFormInput}
                        placeholder='Description for the event'
                    />
                </Form.Group>

                <Form.Group controlId="formBasicCost">
                    <Form.Label>Cost of Tuition</Form.Label>
                    <Form.Control 
                    type="text" 
                    placeholder="Cost"  
                    name='cost' 
                    value={(props.app).cost}
                    onChange={handleFormInput} 
                    />
                </Form.Group>
                
                <Form.Group>
                    <p>
                        Available Reimbursement:&nbsp;{user.availableReimburstment}
                    </p>
                    <p>
                        Projected Reimbursement:&nbsp;
                        {
                            (props.app.cost && props.app.type) 
                            ? ((Math.ceil(Number(props.app.cost) * costObj[props.app.type] * 100)/100) < user.availableReimburstment 
                                ? (Math.ceil(Number(props.app.cost) * costObj[props.app.type] * 100)/100) 
                                : user.availableReimburstment)
                            : 0
                        }
                    </p>
                </Form.Group>

                <Form.Group controlId="exampleForm.SelectCustom">
                    <Form.Label>Select Reimbursement Type</Form.Label>
                    <Form.Control onChange={handleFormInput} name='type' as="select" custom>
                        <option value=''></option>
                        <option value='University Courses'>University Courses</option>
                        <option value='Seminars'>Seminars</option>
                        <option value='Certification Preparation Classes'>Certification Preparation Classes</option>
                        <option value='Certification'>Certification</option>
                        <option value='Technical Training'>Technical Training</option>
                        <option value='Other'>Other</option>
                    </Form.Control>
                </Form.Group> 

                <Form.Group>
                    <Form.Label>Do you have an approval email?</Form.Label>
                    <div className="mb-3" onChange={handleRadioSelect}>
                        <Form.Check 
                            inline
                            type='radio'
                            id='default-radio'
                            label='Yes'
                            value='true'
                            name='approvalEmail'
                        />
                        <Form.Check 
                            inline
                            type='radio'
                            id='default-radio'
                            label='No'
                            value='false'
                            name='approvalEmail'
                            defaultChecked
                        />                        
                    </div>
                </Form.Group>

                <button type='button' className='btn btn-outline-secondary' onClick={submitForm}>
                    Submit Application
                </button>
            </Form>
        </div>
    );
}

//connect my prop and dispatcher to my component
export default connector(AddApplicationComponent);