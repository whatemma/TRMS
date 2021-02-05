import * as AWS from 'aws-sdk';
import userService from '../user/user.service';
import { User } from '../user/user'
// import restaurantService from '../restaurant/restaurant.service';

// Set the region
AWS.config.update({ region: 'us-west-2' });

// Create a DynamoDB service object
const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

const removeUsers = {
    TableName: 'users'
}
const removeApps = {
    TableName: 'applications'
}

const userSchema = {
    AttributeDefinitions: [
        {
            AttributeName: 'name',
            AttributeType: 'S'
        }
    ],
    KeySchema: [
        {
            AttributeName: 'name',
            KeyType: 'HASH'
        }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
    },
    TableName: 'users',
    StreamSpecification: {
        StreamEnabled: false
    }
};

const appSchema = {
    AttributeDefinitions: [
        {
            AttributeName: 'name',
            AttributeType: 'S'
        },
        {
            AttributeName: 'applicationDate',
            AttributeType: 'N'
        }
    ],
    KeySchema: [
        {
            AttributeName: 'name',
            KeyType: 'HASH'
        },
        {
            AttributeName: 'applicationDate',
            KeyType: 'RANGE'
        }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
    },
    TableName: 'applications',
    StreamSpecification: {
        StreamEnabled: false
    }
};

ddb.deleteTable(removeUsers, function (err, data) {
    if (err) {
        console.error('Unable to delete table. Error JSON:', JSON.stringify(err, null, 2));
    } else {
        console.log('Deleted table. Table description JSON:', JSON.stringify(data, null, 2));
    }
    setTimeout(()=>{
        ddb.createTable(userSchema, (err, data) => {
            if (err) {
                // log the error
                console.log('Error', err);
            } else {
                // celebrate, I guess
                console.log('Table Created', data);
                setTimeout(()=>{
                    populateUserTable();
                }, 10000);
            }
        });
    }, 5000);
});

function populateUserTable() {
    // userService.addUser({name: 'Emma', password: 'pass', role: 'Employee', availableReimburstment: 1000, supervisor: 'Jane'}).then(()=>{});
    // register('Emma', 'pass', 'Employee', 'Jane');
    userService.addUser(
        {name: 'Emma', password: 'pass', department: 'IT', role: 'Employee', availableReimburstment: 1000, supervisor: {name: 'Jane', role: 'Project Manager'}}
    ).then(()=>{});
    userService.addUser(
        {name: 'Jane', password: 'pass', department: 'IT', role: 'Project Manager', availableReimburstment: 1000, supervisor: {name: 'Chris', role: 'Department Head'}}
    ).then(()=>{});
    userService.addUser(
        {name: 'Chris', password: 'pass', department: 'IT', role: 'Department Head', availableReimburstment: 1000, supervisor: {name: '', role: ''}}
    ).then(()=>{});
    userService.addUser(
        {name: 'Haru', password: 'pass', department: 'HR', role: 'BenCo', availableReimburstment: 1000, supervisor: {name: 'Rin', role: 'BenCo'}}
    ).then(()=>{});
    userService.addUser(
        {name: 'Rin', password: 'pass', department: 'HR', role: 'BenCo', availableReimburstment: 1000, supervisor: {name: '', role: ''}}
    ).then(()=>{});
}

ddb.deleteTable(removeApps, function (err, data) {
    if (err) {
        console.error('Unable to delete table. Error JSON:', JSON.stringify(err, null, 2));
    } else {
        console.log('Deleted table. Table description JSON:', JSON.stringify(data, null, 2));
    }
    setTimeout(()=>{
        ddb.createTable(appSchema, (err, data) => {
            if (err) {
                // log the error
                console.log('Error', err);
            } else {
                console.log('Table Created', data);
            }
        });
    }, 5000);
});