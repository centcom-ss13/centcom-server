const index = {
  method: 'GET',
  path: '/',
  handler: function () {
    return 'Hello world!';
  },
};

export default [
  index,
];