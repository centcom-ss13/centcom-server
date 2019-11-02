import BookService from '../service/books';

const getBooks = {
  method: 'GET',
  path: '/books',
  handler: async function (request, h) {
    return await BookService.getBooks();
  },
  options: {
    auth: false,
  },
};

const editBook = {
  method: 'PUT',
  path: '/books/{id}',
  handler: async function (request, h) {
    const id = parseInt(request.params.id, 10);

    return await BookService.editBook(id, request.payload);
  },
};

const deleteBook = {
  method: 'DELETE',
  path: '/books/{id}',
  handler: async function (request, h) {
    return await BookService.deleteBook(request.params.id);
  },
};

const createBook = {
  method: 'POST',
  path: '/books',
  handler: async function (request, h) {
    return await BookService.createBook(request.payload.input, request.payload.sender_id);
  },
};

const getBookCategories = {
  method: 'GET',
  path: '/bookCategories',
  handler: async function (request, h) {
    return await BookService.getBookCategories();
  },
  options: {
    auth: false,
  },
};

const editBookCategory = {
  method: 'PUT',
  path: '/bookCategories/{id}',
  handler: async function (request, h) {
    const id = parseInt(request.params.id, 10);

    return await BookService.editBookCategory(id, request.payload);
  },
};

const deleteBookCategory = {
  method: 'DELETE',
  path: '/bookCategories/{id}',
  handler: async function (request, h) {
    return await BookService.deleteBookCategory(request.params.id);
  },
};

const createBookCategory = {
  method: 'POST',
  path: '/bookCategories',
  handler: async function (request, h) {
    return await BookService.createBookCategory(request.payload.input, request.payload.sender_id);
  },
};

export default [
  getBooks,
  createBook,
  editBook,
  deleteBook,
  getBookCategories,
  editBookCategory,
  deleteBookCategory,
  createBookCategory,
];