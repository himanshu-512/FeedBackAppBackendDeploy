import express from 'express';
import {
  listChannels,
  createChannel,
  joinChannel,
  getChannelById,
  checkMember,
  searchChannels
} from '../controllers/channel.controller.js';
 import verifyJWT  from '../../mid/ver.js';

const router = express.Router();

router.get("/all", listChannels);
router.get("/search", searchChannels);

// 🔥 SPECIFIC ROUTES FIRST
router.get("/:id/is-member/:userId", checkMember);

router.post("/createChannel", createChannel);
router.post("/:id/join", verifyJWT, joinChannel);
router.get("/:id", verifyJWT, getChannelById);

export default router;
