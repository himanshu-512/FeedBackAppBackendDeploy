import { createProxyMiddleware } from 'http-proxy-middleware';
import express from 'express'

const router = express.Router();

router.use(
  '/',
  createProxyMiddleware({
    target:process.env.AUTH_SERVICE_URL || 'http://auth-service:4001',
    changeOrigin: true,
   
  })
  
);

export default router;
