import axios from 'axios';
import { Application } from './application';

class ApplicationService {
    private URI: string;
    constructor() {
        // URL of the express server
        this.URI = process.env.REACT_APP_SERVER_URI + 'applications';
    }

    getApplications(): Promise<Application[]> {
        return axios.get(this.URI).then((result) => result.data);
    }
    getApplication(id: number, name: string): Promise<Application> {
        return axios
            .get(this.URI + '/' + id + '-' + name)
            .then((result) => result.data);
    }
    addApplication(app: Application): Promise<null> {
        return axios.post(this.URI, app).then((result) => null);
    }
    updateApplication(app: Application): Promise<null> {
        return axios.put(this.URI, app).then((result) => null);
    }
}

export default new ApplicationService();
