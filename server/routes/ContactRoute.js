import { Router } from "express";
import { getContactsForDMList, searchedContacts, getAllContacts } from "../controllers/ContactControllers.js";
import { verifyToken } from "../middlewares/AuthMiddlewares.js";
const contactroutes = Router();

contactroutes.post("/search-contacts", verifyToken, searchedContacts);
contactroutes.get("/get-contacts-for-dm", verifyToken, getContactsForDMList);
contactroutes.get("/get-all-contacts",verifyToken, getAllContacts);

export default contactroutes;