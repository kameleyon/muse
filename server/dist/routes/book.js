"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const bookController_1 = require("../controllers/bookController");
const bookUpload_1 = require("../controllers/bookUpload");
const router = express_1.default.Router();
// Book CRUD operations
router.post('/books', auth_1.auth, bookController_1.createBook);
router.get('/books/user/:userId', auth_1.auth, bookController_1.getUserBooks);
router.get('/books/:bookId', auth_1.auth, bookController_1.getBook);
router.put('/books/:bookId', auth_1.auth, bookController_1.updateBook);
router.delete('/books/:bookId', auth_1.auth, bookController_1.deleteBook);
// Chapter operations
router.post('/books/:bookId/chapters', auth_1.auth, bookController_1.createChapters);
router.get('/chapters/:chapterId', auth_1.auth, bookController_1.getChapter);
router.put('/chapters/:chapterId', auth_1.auth, bookController_1.updateChapter);
// Upload operations
router.post('/books/:bookId/upload', auth_1.auth, bookUpload_1.uploadMiddleware, bookUpload_1.uploadBookReference);
router.get('/books/:bookId/uploads', auth_1.auth, bookUpload_1.getBookUploads);
router.delete('/uploads/:uploadId', auth_1.auth, bookUpload_1.deleteUpload);
router.get('/uploads/:uploadId/download', auth_1.auth, bookUpload_1.getDownloadUrl);
exports.default = router;
