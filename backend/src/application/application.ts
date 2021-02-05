export class Application {
    name: string = '';
    type: string = '';
    cost: string = '';
    description: string = '';
    eventstartDate: string = '';

    applicationDate: number = Date.now();
    reimbursement: number = 0;
    urgent: boolean = false;
    approvedBy: Person[] = [];
    waitApprovalFrom: Person = { name: '', role: '' };
    lastRequestDate: number = this.applicationDate;
    rfc: RFC[] = [];
    currentRFC: RFC = { from: '', to: '', question: '', response: '' };
    adjustedReimbursement: number = 0;
    adjustmentReason: string = '';
    exceedingFund: boolean = false;
    //rejected, canceled, pending approval, pending response, pending grade, pending review or completed
    status: string = 'pending approval';
    //if employee submitted grade, pending is unsubmitted, pass -> next step, fail -> end
    grade: string = 'pending';
    approvalEmail: boolean = false;
    rejectedReason: string = '';
}

interface Person {
    name: string;
    role: string;
}

interface RFC {
    from: string;
    to: string;
    question: string;
    response: string;
}
