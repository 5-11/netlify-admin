import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../Config/Config";

class AuthService {

    createUserToken = (tokenData) => jwt.sign({ ...tokenData }, JWT_SECRET);

    comparePassword = (password1, password2) => bcrypt.compare(password1, password2);

    hashPassword = (password) => bcrypt.hash(password, 10);

};

export const authService = new AuthService();

export default authService;