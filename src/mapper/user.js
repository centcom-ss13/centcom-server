import RsaTokens from '../util/rsaTokens';

const decryptUserSecrets = async (user) => {
  const decryptKeys = ['password'];

  const decryptResults = await Promise.all(Object.entries(user).map(async ([key, value]) => {
    if (!value) {
      return null;
    }

    if (value && decryptKeys.includes(key.toLowerCase())) {
      const decryptedValue = await RsaTokens.decrypt(value);

      return { [key]: decryptedValue };
    }

    return { [key]: value };
  }));

  return decryptResults
  .reduce((acc, cur) => ({ ...acc, ...(!!cur && cur) }));
};

export {
  decryptUserSecrets,
}