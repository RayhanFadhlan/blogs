export class UserDto {
    id: number;
    username: string;
    name: string;

    constructor(id: number, username: string, name: string) {
        this.id = id;
        this.username = username;
        this.name = name;
    }
}