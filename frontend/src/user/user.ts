export class User {
    name: string = '';
    password: string = '';
    role: string = '';
    department: string = '';
    supervisor: { name: string; role: string } = { name: '', role: '' };
    //total (1000) - pending (open applciation) - awarded (closed applications)
    availableReimburstment: number = 1000;
}
