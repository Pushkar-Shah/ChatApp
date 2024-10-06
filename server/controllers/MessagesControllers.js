import path from 'path';
import Message from "../models/MessagesModel.js";
import {mkdirSync,renameSync} from'fs';

export const getMessages = async (request,response,next) => {
        try {
                const user1 = request.userId;
                const user2 = request.body.id;
                console.log("user1"+user1);
                console.log("user2"+user2);
                
                if(!user1|| !user2 ){
                        return response.status(400).send("Both User ID's are required.");
                }
               

                const messages = await Message.find({$or:[{sender:user1,recipient:user2},{sender:user2,recipient:user1}]}).sort({timestamp:1});
                // const contacts = await User.find({$and:[{_id:{$ne:request.userId}},{$or:[{firstName:regex},{lastName:regex},{email:regex}]},],
                // });
                // console.log(messages);
                return response.status(200).json({messages});
    
        } catch (error) {
            console.log({error});
            return response.status(500).send('Internal Server Error');    
        }
}


export const uploadFile = async (request,response,next) => {
        try {

                if (!request.file){
                        return response.status(400).send('File is required');
                }
                const date = Date.now().toString();
                let fileDir = path.join('uploads', 'files', date);
                let fileName = path.join('uploads', 'files', date , request.file.originalname);
                console.log(fileName);
                console.log("Saved file to: ", fileDir);
                
                mkdirSync(fileDir,{recursive: true});
                renameSync(request.file.path,fileName);


                // const messages = await Message.find({$or:[{sender:user1,recipient:user2},{sender:user2,recipient:user1}]}).sort({timestamp:1});
                // const contacts = await User.find({$and:[{_id:{$ne:request.userId}},{$or:[{firstName:regex},{lastName:regex},{email:regex}]},],
                // });
                // console.log(messages);
                return response.status(200).json({filePath : fileName});
    
        } catch (error) {
            console.log({error});
            return response.status(500).send('Internal Server Error');    
        }
}
