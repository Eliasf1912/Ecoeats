import jwt from 'jsonwebtoken';

export class TokenService {
    public generate(payload: { id: string, role: string }): string {
        return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '24h' });
    }

    public verify(token: string): { id: string, role: string } {
        return jwt.verify(token, process.env.JWT_SECRET!) as { id: string, role: string };
    }
}