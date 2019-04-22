import BookService from '../service/books';

const getBooks = {
  method: 'GET',
  path: '/books',
  handler: async function (request, h) {
    return await BookService.getBooks();
  },
};

const editBook = {
  method: 'PUT',
  path: '/books/{id}',
  handler: async function (request, h) {
    const bookInput = {
      ...request.payload,
      id: request.params.id,
    };

    return await BookService.editBook(bookInput);
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
    return await BookService.createBook(request.payload);
  },
};

const getBookCategories = {
  method: 'GET',
  path: '/bookCategories',
  handler: async function (request, h) {
    return await BookService.getBookCategories();
  },
};

const editBookCategory = {
  method: 'PUT',
  path: '/bookCategories/{id}',
  handler: async function (request, h) {
    const bookInput = {
      ...request.payload,
      id: request.params.id,
    };

    return await BookService.editBookCategory(bookInput);
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
    return await BookService.createBookCategory(request.payload);
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