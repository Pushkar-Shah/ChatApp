import Background from "../../assets/login2.png";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {useState} from 'react'
import{useNavigate } from 'react-router-dom'
import {apiClient} from "@/lib/api-client.js";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import Victory from '../../assets/victory.svg';
import { toast } from "sonner";
import { SIGNUP_ROUTES,LOGIN_ROUTES } from "@/utils/constants";
import { useAppStore } from "../../store/index.js";
const Auth = () => {
        const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");
        const [confirmPassword, setconfirmPassword] = useState("");

        // const navigate = useNavigate();

        const {setUserInfo} = useAppStore();

        const navigate = useNavigate();

        const handleSignUp = async () => {
                if (validateSignup()){
                        const response = await apiClient.post(SIGNUP_ROUTES,{email,password},{withCredentials:true});
                        console.log({response});
                        if(response.status === 201){
                                setUserInfo(response.data.user);
                                navigate("/profile");
                        }
                }
                // make API call to login user
        }

        const handleLogin = async (e) => {
                e.preventDefault();
                if (validateLogin()){
                        const response = await apiClient.post(LOGIN_ROUTES,{email,password},{withCredentials:true});
                        console.log(response.data);
                        if (response.data.user.id){
                                setUserInfo(response.data.user);
                                if (response.data.user.profileSetup )navigate('/chat')
                                else navigate('/profile');
                        }
                }
                // make API call to login user
        }

        const validateSignup =  () => {
                if (!email.length) {
                        toast.error("Please enter your email");
                        return false;
                }
                if(!password.length) {
                        toast.error("Password is required");
                        return false;
                }
                if(!confirmPassword.length) {
                        toast.error("Confirm Password is required");
                        return false;
                }
                if (confirmPassword != password) {
                        toast.error("Passwords do not match");
                        return false;
                }
                return true;

        }
        const validateLogin =  () => {
                if (!email.length) {
                        toast.error("Please enter your email");
                        return false;
                }
                if(!password.length) {
                        toast.error("Password is required");
                        return false;
                }
                return true;

        }
        
  return (
    <div className=" h-[100vh] w-[100vw] flex items-center justify-center">
        <div className="h-[80vh] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2 ">
                <div className="flex items-center justify-center flex-col ">
                        <div className="flex items-center justify-center ">
                                <h1 className="text-5xl font-bold md:text-6xl ">Welcome</h1>
                                <img src={Victory} alt="Victory emogi"  className="h-[100px]"/>
                                {/* Form */}
                        </div>
                        <p className="font-medium text-center"> Fill in the details to get started with the best chat app</p>
                        <div className="flex items-center justify-center w-full "> 
                        <Tabs className= "w-3/4 mt-10" defaultValue = "login">
                                <TabsList className= "bg-transparent rounded-none w-full">
                                        <TabsTrigger className= "data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]: text-black data-[state=active]: font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300 "value="login">Login</TabsTrigger>

                                        <TabsTrigger className= "data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]: text-black data-[state=active]: font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300  " value="signup">Sign Up</TabsTrigger>
                                </TabsList>
                                <TabsContent className= "flex flex-col gap-5 mt-10"  value="login">
                                        <Input placeholder = "email" type = "email" className = "rounded-full p-6" value = {email} onChange = {(e)=> setEmail(e.target.value )} />

                                        <Input placeholder = "password" type = "password" className = "rounded-full p-6" value = {password} onChange = {(e)=> setPassword(e.target.value )} />

                                        <Button className = "rounded-full p-6" onClick = {handleLogin} >Login </Button>

                                </TabsContent>
                                <TabsContent className= "flex flex-col gap-5 " value="signup">

                                        <Input placeholder = "email" type = "email" className = "rounded-full p-6" value = {email} onChange = {(e)=> setEmail(e.target.value )} />

                                        <Input placeholder = "password" type = "password" className = "rounded-full p-6" value = {password} onChange = {(e)=> setPassword(e.target.value )} />

                                        <Input placeholder = "confirmPassword" type = "confirmPassword" className = "rounded-full p-6" value = {confirmPassword} onChange = {(e)=> setconfirmPassword(e.target.value )} />

                                        <Button className = "rounded-full p-6" onClick = {handleSignUp} >Sign Up </Button>

                                </TabsContent>
                        </Tabs>

                        </div>
                </div>
                <div className="hidden xl:flex justify-center  items-center
                ">
                        <img src={Background} className = "h-[85%]" alt="background login " />
                </div>
        </div>
    </div>
  )
}

export default Auth