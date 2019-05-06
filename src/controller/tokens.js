import RsaTokens from '../util/rsaTokens';

const getPublicKey = {
  method: 'GET',
  path: '/publicKey',
  handler: async function (request, h) {
    return await RsaTokens.getPublicKey();
  },
  options: {
    auth: false,
  },
};

const encrypt = {
  method: 'POST',
  path: '/encrypt',
  handler: async function (request, h) {
    return await RsaTokens.encrypt(request.payload);
  },
};

const decrypt = {
  method: 'POST',
  path: '/decrypt',
  handler: async function (request, h) {
    return await RsaTokens.decrypt(request.payload);
  },
};

export default [
  getPublicKey,
  encrypt,
  decrypt,
];