import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import dynamo from '../dynamo/dynamo';
import logger from '../log';
import { Application } from './application';

class ApplicationService {
    private doc: DocumentClient;
    constructor() {
        // The documentClient. This is our interface with DynamoDB
        this.doc = dynamo; // We imported the DocumentClient from dyamo.ts
    }

    async getApplications(): Promise<Application[]> {
        const params = {
            TableName: 'applications'
        };
        return await this.doc
            .scan(params)
            .promise()
            .then((data) => {
                return data.Items as Application[];
            })
            .catch((err) => {
                logger.error(err);
                return [];
            });
    }

    async getApplicationsByIDAndName(
        name: string,
        id: number
    ): Promise<Application | null> {
        const params = {
            TableName: 'applications',
            Key: {
                'name': name,
                'applicationDate': id
            }
        };
        return await this.doc
            .get(params)
            .promise()
            .then((data) => {
                return data.Item as Application;
            })
            .catch((err) => {
                logger.error(err);
                return null;
            });
    }

    async getApplicationByName(name: string): Promise<Application[]> {
        const params = {
            TableName: 'applications',
            KeyConditionExpression: '#name = :name',
            ExpressionAttributeNames: {
                '#name': 'name'
            },
            ExpressionAttributeValues: {
                ':name': name
            }
        };
        return await this.doc
            .query(params)
            .promise()
            .then((data) => {
                return data.Items as Application[];
            })
            .catch((err) => {
                logger.error(err);
                return [];
            });
    }

    async addApplication(app: Application): Promise<boolean> {
        // object to be sent to AWS.
        const params = {
            // TableName - the name of the table we are sending it to
            TableName: 'applications',
            // Item - the object we are sending
            Item: app,
            ConditionExpression: '#name <> :name AND #time <> :time',
            ExpressionAttributeNames: {
                '#name': 'name',
                '#time': 'applicationDate'
            },
            ExpressionAttributeValues: {
                ':name': app.name,
                ':time': app.applicationDate
            }
        };

        return await this.doc
            .put(params)
            .promise()
            .then((result) => {
                logger.info('Successfully added application');
                return true;
            })
            .catch((error) => {
                logger.error(error);
                return false;
            });
    }

    async updateApplication(app: Application): Promise<boolean> {
        const params = {
            TableName: 'applications',
            Key: {
                'name': app.name,
                'applicationDate': app.applicationDate
            },
            UpdateExpression:
                'set #w=:w, #lrd=:lrd, #rfc=:rfc, #s=:s, #g=:g, #a=:a, #r=:r, #e=:e, #ar=:ar, #areim=:areim',
            ExpressionAttributeValues: {
                ':w': app.waitApprovalFrom,
                ':a': app.approvedBy,
                ':lrd': app.lastRequestDate,
                ':rfc': app.rfc,
                ':s': app.status,
                ':g': app.grade,
                ':r': app.reimbursement,
                ':e': app.exceedingFund,
                ':ar': app.adjustmentReason,
                ':areim': app.adjustedReimbursement
            },
            ExpressionAttributeNames: {
                '#w': 'waitApprovalFrom',
                '#a': 'approvedBy',
                '#lrd': 'lastRequestDate',
                '#rfc': 'rfc',
                '#s': 'status',
                '#g': 'grade',
                '#r': 'reimbursement',
                '#e': 'exceedingFund',
                '#ar': 'adjustmentReason',
                '#areim': 'adjustedReimbursement'
            },
            ReturnValue: 'UPDATED_NEW'
        };
        return await this.doc
            .update(params)
            .promise()
            .then(() => {
                logger.info('Successfully updated application');
                return true;
            })
            .catch((error) => {
                logger.error(error);
                return false;
            });
    }
}

const applicationService = new ApplicationService();
export default applicationService;
