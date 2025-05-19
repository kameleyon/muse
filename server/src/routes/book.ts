import express from 'express';
import { auth } from '../middleware/auth';
import {
  createBook,
  getUserBooks,
  getBook,
  updateBook,
  deleteBook,
  createChapters,
  updateChapter,
  getChapter
} from '../controllers/bookController';
import {
  uploadMiddleware,
  uploadBookReference,
  getBookUploads,
  deleteUpload,
  getDownloadUrl
} from '../controllers/bookUpload';

const router = express.Router();

// Book CRUD operations
router.post('/books', auth, createBook);
router.get('/books/user/:userId', auth, getUserBooks);
router.get('/books/:bookId', auth, getBook);
router.put('/books/:bookId', auth, updateBook);
router.delete('/books/:bookId', auth, deleteBook);

// Chapter operations
router.post('/books/:bookId/chapters', auth, createChapters);
router.get('/chapters/:chapterId', auth, getChapter);
router.put('/chapters/:chapterId', auth, updateChapter);

// Upload operations
router.post('/books/:bookId/upload', auth, uploadMiddleware, uploadBookReference);
router.get('/books/:bookId/uploads', auth, getBookUploads);
router.delete('/uploads/:uploadId', auth, deleteUpload);
router.get('/uploads/:uploadId/download', auth, getDownloadUrl);

export default router;