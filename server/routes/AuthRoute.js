import { Router } from "express";
import { getUserInfo,signup, login,updateProfile,addProfileImage,removeProfileImage, logOut} from "../controllers/AuthControllers.js";
import { verifyToken } from "../middlewares/AuthMiddlewares.js";
const authroutes = Router();
import multer from 'multer';
const upload = multer({dest: "uploads/profiles"})

authroutes.post("/signup", signup);
authroutes.post("/login", login);
authroutes.get('/user-Info',verifyToken ,getUserInfo)
authroutes.post("/update-profile",verifyToken ,updateProfile);
authroutes.post('/add-profile-image', verifyToken,upload.single("profile-image"),addProfileImage); //
authroutes.delete('/remove-profile-image',verifyToken,removeProfileImage);
authroutes.post('/logout',logOut);

export default authroutes;