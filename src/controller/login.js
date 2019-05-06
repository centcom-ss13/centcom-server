import Boom from '@hapi/boom';
import UserService from "../service/users";
import RsaTokens from '../util/rsaTokens';
import { compareHash } from "../util/hash";
import { stripKeysFromObject } from "../util/queryUtils";

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

      let user;
      try {
        user = await UserService.getUserByUsername(username);
      } catch(e) {
        return Boom.badRequest('Invalid username/password');
      }

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

const register = {
  method: 'POST',
  path: '/register',
  options: {
    auth: {
      mode: 'try'
    },
    handler: async function (request, h) {
      try {
        const credentials = await request.auth.credentials;

        const userId = credentials && credentials.id;

        if (userId) {
          return Boom.forbidden('Please logout to register an account');
        }
      } catch (e) {
      }

      const { username, email, password } = request.payload;

      if (!username) {
        return Boom.badRequest('Username is required');
      }
      if (!email) {
        return Boom.badRequest('Email is required');
      }
      if (!password) {
        return Boom.badRequest('Password is required');
      }

      let decryptedPassword;
      try {
        decryptedPassword = await RsaTokens.decrypt(password);

        if (!decryptedPassword) {
          return Boom.badRequest('Password must be encrypted using an RSA public key available at /publicKey');
        }
      } catch (e) {
        return Boom.badRequest('Password must be encrypted using an RSA public key available at /publicKey');
      }

      const createdUser = await UserService.createUser({
        username,
        email,
        password: decryptedPassword,
      });

      request.cookieAuth.set({ id: createdUser.id });

      return {
        registered: true,
        authenticated: true,
      };
    },
  },
};

const currentUser = {
  method: 'GET',
  path: '/currentUser',
  options: {
    auth: {
      mode: 'try'
    },
    handler: async (request, h) => {
      let userId;
      try {
        const credentials = await request.auth.credentials;

        userId = credentials && credentials.id;

        if(!userId) {
          return Boom.unauthorized('Invalid credentials');
        }

        const user = await UserService.getUser(userId);

        if(!user) {
          return Boom.unauthorized('Invalid credentials');
        }

        const prunedUser = stripKeysFromObject(user, ['password']);

        return prunedUser;
      } catch(e) {
        return Boom.unauthorized('Invalid credentials');
      }
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
  register,
];