import Boom from '@hapi/boom';
import UserService from "../service/users";
import RsaTokens from '../util/rsaTokens';
import { compareHash } from "../util/hash";

const login = {
  method: 'POST',
  path: '/login',
  options: {
    auth: {
      mode: 'try'
    },
    handler: async (request, h) => {
      const { username, password } = request.payload;
      if (!username || !password) {
        return Boom.badRequest('Requires username and password');
      }

      const user = await UserService.getUserByUsername(username);

      if (!user) {
        return Boom.badRequest('Invalid username/password');
      }

      let decryptedPassword;
      try {
        decryptedPassword = await RsaTokens.decrypt(password);
      } catch (e) {
        return Boom.badRequest('Password must be encrypted using an RSA public key available at /publicKey');
      }

      let passwordMatch;
      try {
        passwordMatch = await compareHash(decryptedPassword, user.password);
      } catch (e) {
        return Boom.badRequest('Invalid username/password');
      }

      if (!passwordMatch) {
        return Boom.badRequest('Invalid username/password');
      }

      request.cookieAuth.set({ id: user.id });

      return { authenticated: true };
    }
  }
};

const currentUser = {
  method: 'GET',
  path: '/currentUser',
  options: {
    auth: {
      mode: 'try'
    },
    handler: async (request, h) => {
      return request.auth.credentials;
    }
  }
};

const logout = {
  method: 'GET',
  path: '/logout',
  options: {
    handler: (request, h) => {
      request.cookieAuth.clear();

      return { authenticated: false };
    }
  }
};

export default [
  login,
  currentUser,
  logout,
];