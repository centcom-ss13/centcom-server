import bcrypt from 'bcrypt';
import { promisify } from 'util';

const hash = promisify(bcrypt.hash);
const compare = promisify(bcrypt.compare);

const SALT_ROUNDS = 10;

async function getHash(value) {
  return await hash(value, SALT_ROUNDS);
}

async function compareHash(value, hash) {
  return await compare(value, hash);
}

export {
  getHash,
  compareHash,
};