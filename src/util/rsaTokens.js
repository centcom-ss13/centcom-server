import LocalStorage from 'localstorage-memory';
import RSA from 'node-rsa';

async function generateKey() {
  const key = new RSA({b: 512});

  const publicKey = key.exportKey('public');
  const privateKey = key.exportKey('private');

  LocalStorage.setItem('client_rsa_public', publicKey);
  LocalStorage.setItem('client_rsa_private', privateKey);

  return key;
}

async function getRsaKey() {
  const storedPublicKey = LocalStorage.getItem('client_rsa_public');
  const storedPrivateKey = LocalStorage.getItem('client_rsa_private');

  if(!storedPublicKey || !storedPrivateKey) {
    return await generateKey();
  }

  const key = new RSA();

  key.importKey(storedPublicKey, 'public');
  key.importKey(storedPrivateKey, 'private');

  return key;
}

async function getPublicKey() {
  const key = await getRsaKey();

  return key.exportKey('public');
}

async function decrypt(value) {
  const key = await getRsaKey();

  return key.decrypt(value, 'utf8');
}

async function encrypt(value) {
  const key = await getRsaKey();

  return key.encrypt(value, 'base64', 'utf8');
}

export default {
  decrypt,
  encrypt,
  getPublicKey,
}