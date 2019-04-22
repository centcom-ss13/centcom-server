import BookRepository from '../repository/books';
import BookCategoryRepository from '../repository/bookCategories';

async function getBooks() {
  return await BookRepository.getBooks();
}

async function createBook({ title, content, category_id = null }) {
  return await BookRepository.createBook(title, content, category_id);
}

async function editBook({ id, title, content, category_id = null }) {
  return await BookRepository.editBook(id, title, content, category_id);
}

async function deleteBook(id) {
  return await BookRepository.deleteBook(id);
}

async function getBookCategories() {
  return await BookCategoryRepository.getBookCategories();
}

async function createBookCategory({ name, color }) {
  return await BookCategoryRepository.createBookCategory(name, color);
}

async function editBookCategory({ id, name, color }) {
  return await BookCategoryRepository.editBookCategory(id, name, color);
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