import { useAppStore } from "@/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ContactContainer from "./components/contacts-container";
import EmptyChatContainer from "./components/empty-chat-container";
import ChatContainer from "./components/chat-container";
const Chat = () => {
        const {userInfo,selectedChatType,selectedChatData,
                isUploading,
                isDownloading,
                fileUploadProgress,
                fileDownloadProgress,} = useAppStore();
        const navigate = useNavigate();
        // console.log(userInfo);
        useEffect(()=>{
                if(!userInfo.profileSetup){
                        toast('Please setup your profile to continue');
                        navigate('/profile');
                }

        })
  return (
    <div className="flex h-[100vh] text-white overflow-hidden">
        {isUploading && <div className="h-[100vh] w-[100vw] bg-black/80 fixed top-0 z-10 left-0 flex flex-col items-center justify-center gap-5 backdrop-blur-lg "> 
                <h5 className="text-5xl animate-pulse  ">Uploading File</h5>
                {fileUploadProgress}% 
        </div>}
        {isDownloading && <div className="h-[100vh] w-[100vw] bg-black/80 fixed top-0 z-10 left-0 flex flex-col items-center justify-center gap-5 backdrop-blur-lg "> 
                <h5 className="text-5xl animate-pulse  ">Downloading File</h5>
                {fileDownloadProgress}% 
        </div>}
        <ContactContainer/>
        {selectedChatType === undefined ? <EmptyChatContainer/>: <ChatContainer/>}
    </div>
  )
}

export default Chat