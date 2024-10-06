import User from "../models/UserModel.js";
import mongoose from'mongoose';
import Message from "../models/MessagesModel.js";

export const searchedContacts = async (request,response,next) => {
        try {
                
                console.log(request.userId);
                const{searchTerm}= request.body;
                console.log(request.body)
                if(searchTerm === undefined|| searchTerm === null ){
                        return response.status(400).send('Searched Term is required');
                }
                const sanitizedSearchTerm = searchTerm.replace(
                        /[.*+?^4{}()|[\]\\]/g,"\\$&"
                );

                const regex = new RegExp(sanitizedSearchTerm,"i");

                const contacts = await User.find({$and:[{_id:{$ne:request.userId}},{$or:[{firstName:regex},{lastName:regex},{email:regex}]},],
                });
                console.log(contacts);
                return response.status(200).json({contacts});
    
        } catch (error) {
            console.log({error});
            return response.status(500).send('Internal Server Error');    
        }
}

export const getContactsForDMList = async (request,response,next) => {
        try {
                let {userId }= request;
                userId = new mongoose.Types.ObjectId(userId);
                const contacts = await Message.aggregate([{
                        $match: { $or: [{ sender: userId }, { recipient: userId }] },

                },
        {$sort : {timestamp:-1}},
        {$group:{_id:
                        {
                                $cond:{
                                        if: {$eq: ["$sender", userId]},
                                        then: "$recipient",
                                        else: "$sender"
                                }
                        },
                lastMessageTime:{$first:'$timestamp'},
                }
        },
        {$lookup:{
                from: "users",
                localField: "_id",
                foreignField: "_id",
                as: "contactInfo"
        }},
        {
                $unwind:"$contactInfo",
        },
        {$project:{
                _id:1,
                firstName:"$contactInfo.firstName",
                lastName:"$contactInfo.lastName",
                image:"$contactInfo.image",
                color:"$contactInfo.color",
                email:"$contactInfo.email",
                lastMessageTime:1,
        }},
        {$sort:{lastMessageTime:-1}}
        
]);
                
                return response.status(200).json({contacts});
    
        } catch (error) {
            console.log({error});
            return response.status(500).send('Internal Server Error');    
        }
}



export const getAllContacts = async (request,response,next) => {
        try {

                const users = await User.find({_id:{$ne:request.userId}},"firstName lastName _id email");
                
                const contacts = users.map((user) =>({
                        label: user.firstName? `${user.firstName} ${user.lastName}`: `${user.email}`,value:user._id,
                }))
        
                return response.status(200).json({contacts});
    
        } catch (error) {
            console.log({error});
            return response.status(500).send('Internal Server Error');    
        }
}