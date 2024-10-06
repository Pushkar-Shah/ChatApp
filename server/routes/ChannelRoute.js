import {Router} from 'express';
import { verifyToken } from '../middlewares/AuthMiddlewares.js';
import { CreateChannel,getUserChannels,getChannelMessages } from '../controllers/ChannelControllers.js';
const channelRoutes = Router();
channelRoutes.post("/create-channel",verifyToken,CreateChannel);
channelRoutes.get("/get-user-channels",verifyToken,getUserChannels);
channelRoutes.get("/get-channel-messages/:channelId",verifyToken,getChannelMessages);

export default channelRoutes;