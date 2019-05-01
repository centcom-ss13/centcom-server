import BookRepository from '../repository/books';
import BookCategoryRepository from '../repository/bookCategories';

async function getBooks() {
  return await BookRepository.getBooks();
}

async function createBook(input) {
  return await BookRepository.createBook(input);
}

async function editBook(id, input) {
  return await BookRepository.editBook(id, input);
}

async function deleteBook(id) {
  return await BookRepository.deleteBook(id);
}

async function getBookCategories() {
  return await BookCategoryRepository.getBookCategories();
}

async function createBookCategory(input) {
  return await BookCategoryRepository.createBookCategory(input);
}

async function editBookCategory(id, input) {
  return await BookCategoryRepository.editBookCategory(id, input);
}

async function deleteBookCategory(id) {
  return await BookCategoryRepository.deleteBookCategory(id);
}

export default {
  getBooks,
  createBook,
  editBook,
  deleteBook,
  getBookCategories,
  createBookCategory,
  editBookCategory,
  deleteBookCategory,
}