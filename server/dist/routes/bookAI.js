"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const bookAI_1 = require("../controllers/bookAI");
const router = express_1.default.Router();
// Book AI endpoints
router.post('/book-ai/market-research', auth_1.auth, bookAI_1.generateMarketResearch);
router.post('/book-ai/generate-structure', auth_1.auth, bookAI_1.generateBookStructure);
router.post('/book-ai/generate-chapter', auth_1.auth, bookAI_1.generateChapter);
router.post('/book-ai/revise-chapter', auth_1.auth, bookAI_1.reviseChapter);
exports.default = router;
