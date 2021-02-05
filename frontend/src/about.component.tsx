import React from 'react'

export default function aboutComponent() {
    return(
    <div>
        <h1>Tuition Reimbursement Management System (TRMS)</h1>
        <h2>1. TRMS Overview</h2>
        <p>
        The purpose of TRMS is to provide a system that encourages quality knowledge growth relevant to an individual’s expertise.   
        Currently, TRMS provides reimbursements for university courses, seminars, certification preparation classes, certifications, 
        and technical training.  The current system relies solely on email communication, requiring manual lookups of available funds 
        and is error-prone due to inbox clutter and incorrect routing of tasks.  Furthermore, there is no way to record and report 
        on reimbursements awarded, and so the company has no way to identify highly-invested courses that could be developed to be 
        offered in-house.
        </p>    
        <h3>1.1 Business Rules</h3>    
        <p>
        Each employee is allowed to claim up to $1000 in tuition reimbursement a year.  The amount available to an employee is 
        reset on the new year.  Event types have different standard reimbursement coverage: University Courses 80%, Seminars 60%, 
        Certification Preparation Classes 75%, Certification 100%, Technical Training 90%, Other 30%.  After a BenCo has approved 
        a reimbursement, the reimbursement is pending until a passing grade or presentation over the event is provided.  The 
        monetary amount available for an employee to reimburse is defined by the following equation: AvailableReimburstment = 
        TotalReimburstment ($1000) – PendingReimburstments – AwardedReimburstments.  If the projected reimbursement for an event 
        exceeds the available reimbursement amount, it is adjusted to the amount available.  Reimbursements do not cover course 
        materials such as books.
        </p>
        <h2>2 Complete the Tuition Reimbursement Form</h2>
        <p>
        All Employees must complete the Tuition Reimbursement form one week prior to the start of the event.  This form must 
        collect (required): basic employee information; date, time, location, description, cost, grading format, and type of 
        event; work-related justification.  The employee can optionally include: event-related attachments of pdf, png, jpeg, 
        txt, or doc file type, attachments of approvals already provided of .msg (Outlook Email File) file type and type of 
        approval, work time that will be missed.  The projected reimbursement should be provided as a read-only field.
        </p>
        <h3>2.1	Business Rules</h3>
        <p>
        Grading formats are pulled from a reference table.  Certain grading formats require the employee to perform a presentation 
        to management after the event’s completion and prior to awarded reimbursement.  A passing grade is needed for reimbursement 
        otherwise.  Employee must provide the passing grade cutoff for the course, or choose to use a default passing grade if 
        unknown.  If an employee provides an approval email, that approval step is skipped (cannot skip BenCo Approval).  If the 
        course is &lt; 2 weeks from beginning, the request is marked urgent.
        </p>
        <h2>3 Direct Supervisor Approval</h2>
        <p>
        The direct supervisor must provide approval for Tuition Reimbursement.  The Direct Supervisor can request additional 
        information from the employee before approval. 
        </p>
        <h3>3.1	Business Rules</h3>
        <p>
        If denied, the Direct Supervisor must provide a reason.  If the direct supervisor is also a department head, then the 
        department head approval is skipped.  If the direct supervisor does not complete this task in a timely matter, the request 
        is auto-approved. 
        </p>
        <h2>4 Department Head Approval</h2>
        <p>
        The department head must provide approval for Tuition Reimbursement.  The Department Head can request additional information 
        from the employee or direct supervisor before approval.
        </p>
        <h3>4.1	Business Rules</h3>
        <p>
        If the Department Head does not complete this task in a timely matter, the request is auto-approved.
        </p>
        <h2>5 Benefits Coordinator Approval</h2>
        <p>
        The BenCo must provide approval for Tuition Reimbursement.   This stage is not skippable for any reason.  The BenCo can 
        request additional information from the employee, direct supervisor, or department head before approval. The BenCo has the 
        ability to alter the reimbursement amount.
        </p>
        <h3>5.1	Business Rules</h3>
        <p>
        If the BenCo changes the reimbursement amount, the Employee should be notified and given the option to cancel the request.  
        If the BenCo does not approval in a timely matter, an escalation email should be sent to the BenCo’s direct supervisor.  
        The BenCo is allowed to award an amount larger than the amount available for the employee.  The BenCo must provide reason 
        for this, and the reimbursement must be marked as exceeding available funds for reporting purposes.
        </p>
        <h2>6 Grade/Presentation Upload</h2>
        <p>
        Upon completion of the event, the employee should attach either the Grade or Presentation as appropriate.  After upload of 
        a grade, the BenCo must confirm that the grade is passing.  After upload of a presentation, the direct manager must confirm 
        that the presentation was satisfactory and presented to the appropriate parties.  Upon confirmation, the amount is awarded 
        to the requestor.
        </p>
        <h3>6.1	Business Rules</h3>
        <p>
        Only interested parties should be able to access the grades/presentations.  Interested parties include the requestor and 
        approvers.  
        </p>
    </div>
    );
}