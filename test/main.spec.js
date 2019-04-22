import { assert, expect } from 'chai';

it('should run the testing framework', () => {
  expect(true).to.equal(true);
});

it.skip('should fail', () => {
  assert.fail();
});