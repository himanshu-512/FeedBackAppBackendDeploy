import { createProxyMiddleware } from 'http-proxy-middleware';
import express from 'express'
import verifyJWT from '../middlewares/auth.middleware.js';
const router = express.Router();
router.use(
  '/',
  verifyJWT, // 🔥 MUST
  createProxyMiddleware({
    target: process.env.CHAT_SERVICE_URL,
    changeOrigin: true
  })
);

export default router;
