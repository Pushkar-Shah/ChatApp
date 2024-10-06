import {Avatar,AvatarImage} from "@/components/ui/avatar"
import { useAppStore } from "@/store"
import {HOST,LOGOUT_ROUTES } from "@/utils/constants.js"
import { apiClient } from "@/lib/api-client"
import {
        Tooltip,
        TooltipContent,
        TooltipProvider,
        TooltipTrigger,
      } from "@/components/ui/tooltip"
import { FiEdit2 } from "react-icons/fi"
import {  useNavigate } from "react-router-dom"
import {IoPowerSharp} from 'react-icons/io5'
import {getColor} from '@/lib/utils'
      

const ProfileInfo = () => {

        const navigate = useNavigate();

        const {userInfo,setUserInfo} = useAppStore();

        const logout = async ()=>{
                try {
                        const response  =  await apiClient.post(LOGOUT_ROUTES,{},{witCredentials:true});
                        if (response.status === 200){
                                navigate('/auth'); 
                                setUserInfo(null);
                        }
                        
                } catch (error) {
                        console.log(error)
                }
               
        };
  return (
    <div className="absolute bottom-0 justify-between items-center flex h-16 px-10 w-full bg-[#282b33]">
        <div className="flex gap-3 items-center justify-center">
              <div className="w-12 h-12 relative">
                        <Avatar className = "h-12 w-12 rounded-full overflow-hidden">
                                { userInfo.image ? <AvatarImage src={`${HOST}/${userInfo.image}`} alt = 'profile' className = 'object-cover w-full h-full bg-white' /> : (
                                        <div className = {`h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(userInfo.color)}`}  > 
                                        {userInfo.firstName ? userInfo.firstName.split("").shift() : userInfo.email.split("").shift()}
                                        </div>) }
                        </Avatar>
                </div>
                <div>
                        {
                                userInfo.firstName && userInfo.lastName ? `${userInfo.firstName} ${userInfo.lastName}`:""
                        }
                </div>  
        </div>
        <div className=" gap-5 flex">
                <TooltipProvider>
                        <Tooltip>
                                <TooltipTrigger>
                                        <FiEdit2 onClick = {()=> navigate("/profile")}  className="text-purple-500 text-xl font-medium"/>
                                </TooltipTrigger >
                                <TooltipContent className= "bg-[#1c1b1e] border-none text-white">
                                        <p>Edit Profile</p>
                                </TooltipContent>
                        </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                        <Tooltip>
                                <TooltipTrigger>
                                        <IoPowerSharp onClick = {logout}  className="text-red-500 text-xl font-medium"/>
                                </TooltipTrigger >
                                <TooltipContent className= "bg-[#1c1b1e] border-none text-white">
                                        <p>Logout</p>
                                </TooltipContent>
                        </Tooltip>
                </TooltipProvider>
        </div>
    </div>
  )
}

export default ProfileInfo