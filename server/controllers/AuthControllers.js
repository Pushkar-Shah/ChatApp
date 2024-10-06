import User from "../models/UserModel.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
dotenv.config();
import path from 'path';
import bcrypt,{compare} from 'bcrypt';
import {renameSync,unlinkSync} from 'fs'
const maxAge = 3*34*60*60*1000;
const createToken =(email,userID)=>{
        return jwt.sign({ email,userID }, process.env.JWT_KEY, { expiresIn: maxAge });
}
export const signup = async (request,response,next) => {
        try {
                const {email, password} = request.body ;
                if (!email || !password) {
                        return response.status(400).send('Email and password are required');
                }
                const user = await User.create({email, password});
                response.cookie('jwt', createToken(email,user.id), { sameSite:'None', maxAge,secure: true });
                // const existingUser = await User.findOne({ email });
                // if (existingUser) {
                //     return response.status(400).send('Email already exists');
                // }

                // const newUser = new User({ email, password, firstName, lastName });
                // await newUser.save();
                return response.status(201).json({user: {
                        id : user.id, 
                        email : user.email,
                        // firstName : user.firstName, 
                        // lastName : user.lastName,
                        // image: user.image,
                        // color: user.color,
                        profileSetup: user.profileSetup
                }});
    
                
        } catch (error) {
            console.log({error});
            return response.status(500).send('Internal Server Error');    
        }
}

export const login = async (request,response,next) => {
        try {
                const {email, password} = request.body ;
                if (!email || !password) {
                        return response.status(400).send('Email and password are required');
                }
                const user = await User.findOne({ email });
                if (!user) {
                    return response.status(404).send("User with this Email doesn't exists");
                }
                const isMatch = await compare(password, user.password);
                if (!isMatch) {
                    return response.status(400).send("Invalid Password");
                }
                response.cookie('jwt', createToken(email,user.id), { sameSite:'None', maxAge,secure: true });
                

                // const newUser = new User({ email, password, firstName, lastName });
                // await newUser.save();
                
                return response.status(200).json({user: {
                        id : user.id, 
                        email : user.email,
                        firstName : user.firstName, 
                        lastName : user.lastName,
                        image: user.image,
                        color: user.color,
                        profileSetup: user.profileSetup
                }});
    
                
        } catch (error) {
            console.log({error});
            return response.status(500).send('Internal Server Error');    
        }
}
export const getUserInfo = async (request,response,next) => {
        try {
                console.log(request.userId);
                const userData = await User.findById(request.userId);
                if (!userData){
                        return response.status(404).send('User with the given email not found');
                }
                // const newUser = new User({ email, password, firstName, lastName });
                // await newUser.save();
                // console.log(userData);
                return response.status(200).json({
                        id : userData.id, 
                        email : userData.email,
                        firstName : userData.firstName, 
                        lastName : userData.lastName,
                        image: userData.image,
                        color: userData.color,
                        profileSetup: userData.profileSetup
                });
    
                
        } catch (error) {
            console.log({error});
            return response.status(500).send('Internal Server Error');    
        }
}

export const updateProfile = async (request,response,next) => {
        try {
                
                console.log(request.userId);
                const{firstName,lastName,color}= request.body;
                console.log(request.body)
                if(!firstName || !lastName ){
                        return response.status(400).send('First Name, Last Name and Color are required');
                }
                const userData = await User.findByIdAndUpdate(request.userId,{firstName, lastName,color,profileSetup:true},{new:true,runValidators:true});
                // if (!userData){
                //         return response.status(404).send('User with the given email not found');
                // }
                // const newUser = new User({ email, password, firstName, lastName });
                // await newUser.save();
                // console.log(userData);
                return response.status(200).json({
                        id : userData.id, 
                        email : userData.email,
                        firstName : userData.firstName, 
                        lastName : userData.lastName,
                        image: userData.image,
                        color: userData.color,
                        profileSetup: userData.profileSetup
                });
    
                
        } catch (error) {
            console.log({error});
            return response.status(500).send('Internal Server Error');    
        }
}

export const addProfileImage = async (request,response,next) => {

        try {
                if(!request.file ){
                        response.status(400).send('File is required');
                }
                const date = Date.now();
                let fileName = path.join('uploads', 'profiles', date + request.file.originalname);
                renameSync(request.file.path,fileName);
                console.log("Saved file to: ", fileName);

                
                const updatedUser = await User.findByIdAndUpdate(request.userId,{image:fileName},{new:true,runValidators:true});
                // if (!userData){
                //         return response.status(404).send('User with the given email not found');
                // }
                // const newUser = new User({ email, password, firstName, lastName });
                // await newUser.save();
                // console.log(userData);
                return response.status(200).json({
                        image : updatedUser.image
                });
    
                
        } catch (error) {
            console.log({error});
            return response.status(500).send('Internal Server Error');    
        }
}

export const removeProfileImage = async (request,response,next) => {
        try {
                
                const userId = request.userId;
                
                if(!userId){
                        return response.status(400).send('User not found');
                }
                const user = await User.findById(userId);
                if (user.image){
                        unlinkSync(user.image);
                }
                user.image = null;
                await user.save();
               
                // if (!userData){
                //         return response.status(404).send('User with the given email not found');
                // }
                // const newUser = new User({ email, password, firstName, lastName });
                // await newUser.save();
                // console.log(userData);
                return response.status(200).send(' Profile Image removed successfully')
    
                
        } catch (error) {
            console.log({error});
            return response.status(500).send('Internal Server Error');    
        }
}

// export const logOut = async (request,response,next) => {
//         try {
//                 // response.cookie('jwt', "", { maxAge:10000,secure: true,sameSite:'None'});
//                 response.clearCookie("jwt",{ sameSite:'None', maxAge,secure: true });
//                 console.log('logout success')
//                 return response.status(200).send('LogOut successful');
    
                
//         } catch (error) {
//             console.log({error});
//             return response.status(500).send('Internal Server Error');    
//         }
// }
export const logOut = async (request, response, next) => {
        try {
            response.clearCookie("jwt", {
                path: '/',
                sameSite: 'None', // Match the sameSite attribute
                secure: true // Set this to false for local testing if needed
            });
            console.log('Logout successful, cookie cleared');
            return response.status(200).send('LogOut successful');
        } catch (error) {
            console.log({ error });
            return response.status(500).send('Internal Server Error');
        }
    };