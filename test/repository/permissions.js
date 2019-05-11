import { expect, assert } from 'chai';

import permissions from '../../src/repository/permissions';

it('should list permissions alphabetically', () => {
  Object.keys(permissions)
  .reduce((prev, permission) => {
    if (prev && prev > permission) {
      assert.fail(`Permission ${prev} is not in alphabetical order.`);
    }

    return permission;
  }, undefined);
});

it('each key/value pair should contain a name that equals the key', () => {
  Object.entries(permissions)
  .map(([permission, { name }]) => {
    expect(permission).to.equal(name);
  });
});

it('each key should have a description', () => {
  Object.values(permissions)
  .map(({ name, description }) => {
    if(!description) {
      assert.fail(`Permission ${name} does not have a description`);
    }
  });
});