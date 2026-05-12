import bcrypt from 'bcrypt';

export class PasswordService {
    public async hash(password: string): Promise<string> {
        return bcrypt.hash(password, 10);
    }

    public async compare(plain: string, hashed: string): Promise<boolean> {
        return bcrypt.compare(plain, hashed);
    }
}
