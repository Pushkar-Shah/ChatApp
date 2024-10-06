import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddlewares.js";
import { getMessages,uploadFile } from "../controllers/MessagesControllers.js";
import multer from 'multer';

const messagesRoute = Router();
const upload = multer({dest:"uploads/files"})
messagesRoute.post("/get-messages",verifyToken,getMessages);
messagesRoute.post("/upload-file", verifyToken, upload.single("file"), uploadFile); //


export default messagesRoute;