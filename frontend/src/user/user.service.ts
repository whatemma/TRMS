import axios from 'axios';
import { User } from './user';

class UserService {
    private URI: string;
    constructor() {
        // URL of the express server
        this.URI = 'http://localhost:3000/users';
    }
    getLogin(): Promise<User> {
        return axios
            .get(this.URI, { withCredentials: true })
            .then((result) => result.data);
    }
    getUserByName(name: string): Promise<User> {
        return axios
            .get(this.URI + '/' + name, { withCredentials: true })
            .then((result) => result.data);
    }

    login(user: User): Promise<User> {
        return axios
            .post(this.URI, user, { withCredentials: true })
            .then((result) => result.data);
    }
    logout(): Promise<null> {
        return axios
            .delete(this.URI, { withCredentials: true })
            .then((result) => null);
    }
    update(user: User): Promise<null> {
        return axios
            .patch(this.URI, user, { withCredentials: true })
            .then((result) => null);
    }
    findDepartmentHead(
        depart: string
    ): Promise<User> {
        return axios
            .get(
                this.URI + '/' + depart + '-dephead',
                { withCredentials: true }
            )
            .then((result) => result.data[0]);
    }
}

export default new UserService();
