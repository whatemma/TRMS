import logger from '../log';
import userService from './user.service';

export class User {
    name: string = '';
    password: string = '';
    role: string = '';
    department: string = '';
    supervisor: { name: string; role: string } = { name: '', role: '' };
    //total (1000) - pending (open applciation) - awarded (closed applications)
    availableReimburstment: number = 1000;
}

export async function login(
    name: string,
    password: string
): Promise<User | null> {
    logger.debug(`${name + ' ' + password}`);
    return await userService.getUserByName(name).then((user) => {
        if (user && user.password === password) {
            return user;
        } else {
            return null;
        }
    });
}
