# TRMS
Tuition Reimbursement Management System

## What is TRMS
TRMS, or Tuition Reimbursement Management System is a full-stack web application that allows employees to submit requests for reimbursements for courses, events, and certifications. These requests can then be approved or rejected by the employee's direct supervisor, department head, and a benefits coordinator while the employee is able to track the status of their requests.

## Technologies used
JavaScript, Express.js, DynamoDB, React, HTML, CSS, Redux, TypeScript, Axios

## How to run
The project is split into 2 folders, front-end and back-end.
### Back-end
1. Create a .env file to specify the port for express server to run on, and the react app server uri address that react is running in (You can copy the .env.example file to your .env file).
2. Run `npm run setup` to create the database in AWS DynamoDB.
3. Run `npm run start` to start the express server.

### Front-end
1. Run `npm run start` to start the React Application 
