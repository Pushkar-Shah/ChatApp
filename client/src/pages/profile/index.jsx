import { useAppStore } from "../../store"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {IoArrowBack} from 'react-icons/io5'
import {Avatar,AvatarImage} from "@/components/ui/avatar"
import { toast } from "sonner";
import {getColor,colors } from '@/lib/utils'
import {FaPlus, FaTrash} from 'react-icons/fa'
import { Input } from '@/components/ui/input';
import {Button } from '@/components/ui/button';
import { apiClient } from "../../lib/api-client";
import { UPDATE_PROFILE_ROUTE,ADD_PROFILE_IMAGE_ROUTE,HOST,REMOVE_PROFILE_IMAGE_ROUTE } from "../../utils/constants.js";
import { useRef } from "react";

function Profile() {
        const navigate = useNavigate();
        const {userInfo,setUserInfo} = useAppStore();
        const [firstName, setFirstName] = useState('');
        const [lastName, setLastName] = useState('');
        const [image, setImage] = useState(null);
        const [hovered, setHovered] = useState(false);
        const [selectedColor, setselectedColor] = useState(0);

        const fileInputRef = useRef(null);

        const handleFileInput  = ()=>{
                fileInputRef.current.click();
        }
        
        const handleImageChange = async (event) => {
                const file = event.target.files[0];
                // setImage(file);
                if (file){
                        const formData = new FormData();
                        formData.append("profile-image", file);
                        const response = await apiClient.post(ADD_PROFILE_IMAGE_ROUTE, formData, {
                                withCredentials: true,
                        });
                        console.log(response.data);
                        if(response.status === 200 && response.data.image){
                                setUserInfo({...userInfo, image: response.data.image});
                                setImage(`${HOST}/${response.data.image}`); // Ensure that HOST is correctly set
                                toast.success("Image updated successfully");
                        }
                        // const reader = new FileReader();
                        // reader.onload = ()=>{
                        //         setImage(reader.result);
                        // };
                        // reader.readAsDataURL(file);
                }
                // console.log(file);
        }
        const handleDeleteImage = async () => {
                try {
                        const response = await apiClient.delete(REMOVE_PROFILE_IMAGE_ROUTE,{withCredentials:true});
                        if(response.status === 200){
                                setUserInfo({...userInfo, image: null});
                                
                                toast.success("Image deleted successfully");
                                setImage(null);
                        }
                } catch (error) {
                        console.log(error);
                }
        }

        useEffect(()=>{
                if(userInfo.profileSetup){
                        setFirstName(userInfo.firstName);
                        setLastName(userInfo.lastName);
                        setselectedColor(userInfo.color);
                }
                console.log(userInfo.image);
                if (userInfo.image){
                        console.log(`${HOST}/${userInfo.image}`);
                        setImage(`${HOST}/${userInfo.image}`);
                }
        },[userInfo])

        const handleNavigate =  ()=>{
                if(userInfo.profileSetup){
                        navigate('/chat');
                }else{
                        toast.error("Please setup your Profile first")
                }
                
                
        }

        const saveChanges= async ()=>{
                if(validateProfile()){
                        // alert('Sucess');
                        try {
                                // with credentials true is required for this to send cookies to backend
                                const response = await apiClient.post(UPDATE_PROFILE_ROUTE,{firstName,lastName,color:selectedColor},{withCredentials:true});
                                if (response.status === 200 && response.data) {
                                        setUserInfo({...response.data});
                                        toast.success("Profile updated successfully");
                                        navigate("/chat");
                                }
                        } catch (error) {
                                console.log(error);
                        }
                };
        }

        const validateProfile = ()=>{
                if (!firstName) {
                        toast.error("First Name is required");
                        return false;
                }
                else if (!lastName) {
                        toast.error("Last Name is required");
                        return false;
                }
                return true;
        }
        


  return (
    <div className="bg-[#1b1c24] h-[100vh] flex flex-col items-center justify-center gap-10">

        {/* <img src={image} alt="Girl in a jacket" width="500" height="600"></img> */}
        <div className="flex flex-col gap-10 w-[80vw] ms:w-max">
               <div>
                <IoArrowBack onClick ={handleNavigate} className="text-4xl lg:text-6xl text-white/90 cursor-pointer"></IoArrowBack>
                </div>  
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

                        <div className="h-full w-32 md:w-48 md:h-48 relative justify-center flex items-center"
                        onMouseEnter={()=> setHovered(true)}
                        onMouseLeave={()=> setHovered(false)}>
                                <Avatar className = "h-32 w-32 md:h-48 md:w-48 rounded-full overflow-hidden">
                                { image ? <AvatarImage src={image} alt = 'profile' className = 'object-cover w-full h-full bg-white' /> : (
                                        <div className = {`h-32 w-32 md:h-48 md:w-48 text-5xl border-[1px] flex items-center justify-center rounded-full ${getColor(selectedColor)}`}  > 
                                        {firstName ? firstName.split("").shift() : userInfo.email.split("").shift()}
                                        </div>) }
                                </Avatar>
                                { hovered && ( <div onClick  = {image ? handleDeleteImage : handleFileInput }
                                 className="absolute inset-0 flex items-center justify-center bg-black/50 ring-fuchsia-50 rounded-full ">
                                        {image ? <FaTrash className="text-white text-3xl cursor-pointer"/> : <FaPlus className="text-white text-3xl cursor-pointer"/> }
                                </div>)}
                                <input type="file" ref = {fileInputRef} className="hidden" onChange = {handleImageChange} name = "profile-image" accept=".png, .jpg, .jpeg, .svg, .webp"/> 

                        </div>
                        <div className="flex min-w-32 md:min-w-64 flex-col gap-5 text-white items-center justify-center">
                                <div className="w-full ">
                                      <Input placeholder = 'email' type ='email' disabled value = {userInfo.email} className='rounded-lg p-6 bg-[#2c2e3b]  border-none'></Input> 
                                </div>
                                <div className="w-full">
                                      <Input placeholder = 'First Name' type ='text' value = {firstName} 
                                      onChange = {(e)=> {setFirstName(e.target.value)}} 
                                      className='rounded-lg p-6 bg-[#2c2e3b]  border-none'></Input>  
                                </div>
                                <div className="w-full ">
                                      <Input placeholder = 'Last Name' type ='text'  value = {lastName} 
                                      onChange = {(e)=> {setLastName(e.target.value)}}
                                      className='rounded-lg p-6 bg-[#2c2e3b] border-none'></Input>   
                                </div>
                                <div className="w-full flex gap-5 ">
                                     { colors.map( (color,index) => (<div key = {index} onClick={()=> setselectedColor(index)} className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300 ${(selectedColor === index) ?  "outline outline-white/70 outline-2": "  "}`}> </div> ))}

                                </div>


                        </div>
                        
                </div>  
                <div className="w-full ">
                        <Button onClick = {saveChanges}className = "h-16 w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"> Save Changes</Button>
                </div>  
        </div>
    </div>
  )
}

export default Profile