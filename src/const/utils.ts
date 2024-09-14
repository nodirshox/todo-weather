import * as bcrypt from 'bcrypt';
import { PASSWORD_SALT } from '@const/jwt-token';

export const generateBcrypt = async (password: string) => {
  return bcrypt.hash(password, PASSWORD_SALT);
};

export const compareHash = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  return bcrypt.compareSync(password, hash);
};
