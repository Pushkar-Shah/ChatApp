
import { useEffect, useRef,useState } from "react"
import {GrAttachment} from 'react-icons/gr'
import { IoSend } from "react-icons/io5";
import { RiEmojiStickerLine } from "react-icons/ri";
import EmojiPicker from 'emoji-picker-react';
import { useAppStore } from "@/store";
import { useSocket } from "@/context/socketContext";
import { UPLOAD_FILE_ROUTE } from "@/utils/constants";
import { apiClient } from "@/lib/api-client";
const MessageBar = () => {
        const socket = useSocket();
        const {selectedChatType,selectedChatData,userInfo,setIsUploading,setFileUploadProgress} = useAppStore();
        const emojiRef = useRef();
        const fileInputRef = useRef();
        const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
        
        const handleAttachmentClick = () =>{
                if(fileInputRef.current){
                        fileInputRef.current.click();
                }
        }

        const handleAttachmentChange = async (event)=>{
                try {
                        //
                        const file = event.target.files[0];
                        console.log(file);
                        if(file){
                                const formData = new FormData();
                                formData.append("file", file);
                                setIsUploading(true);
                                const response = await apiClient.post(UPLOAD_FILE_ROUTE, formData, {
                                        withCredentials: true,
                                        onUploadProgress: (data) => {
                                                setFileUploadProgress(Math.round((100*data.loaded)/data.total))
                                        },
                                });
                                if(response.status === 200 && response.data.filePath){
                                        setIsUploading(false);
                                        if(selectedChatType === "contact"){
                                                socket.emit('sendMessage',{
                                                        sender: userInfo.id,
                                                        recipient: selectedChatData._id,
                                                        messageType: 'file',
                                                        content: undefined,
                                                        createdAt: new Date(),
                                                        fileUrl : response.data.filePath,
                                                });
                                        }
                                        else if (selectedChatType === "channel"){
                                                socket.emit('send-channel-message',{
                                                        sender: userInfo.id,
                                                        messageType: 'file',
                                                        content: undefined,
                                                        createdAt: new Date(),
                                                        fileUrl : response.data.filePath,
                                                        channelId: selectedChatData._id,
                                                })
                                        }
                                }
                        }
                } catch (error) {
                        setIsUploading(false);
 
                       console.log(error); 
                }
        }

        const handleAddEmoji = (emoji)=>{
                setMessage((msg) => msg + emoji.emoji);
        }
        
        const handleSendMessage = async()=>{
                if (selectedChatType ==='contact'){
                        socket.emit('sendMessage',{
                                sender: userInfo.id,
                                recipient: selectedChatData._id,
                                messageType: 'text',
                                content: message,
                                createdAt: new Date(),
                                fileUrl : undefined,
                        });
                        setMessage('');
                }else if (selectedChatType === "channel"){
                        socket.emit("send-channel-message",{
                                sender: userInfo.id,
                                messageType: 'text',
                                content: message,
                                createdAt: new Date(),
                                fileUrl : undefined,
                                channelId: selectedChatData._id,
                        })
                }
                setMessage('');

        }
        const handleKeyPress = (event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault(); // Prevent default behavior of adding a new line
                  handleSendMessage(); // Call the send message function
                }
        };

        useEffect(() =>{
                function handleClickOutside(event){
                        if(emojiRef.current &&!emojiRef.current.contains(event.target)){
                                setEmojiPickerOpen(false);
                        }
                }
                document.addEventListener('mousedown', handleClickOutside);
                return () => document.removeEventListener('mousedown', handleClickOutside);
        },[emojiRef])

        const [message,setMessage] = useState("");
  return (
    <div className=" h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mt-5 gap-6">
        <div className="flex1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5">
                <input type="text" className="flex-1 rounded-md bg-transparent p-5 focus:border-none focus:outline-none" 
                placeholder="Enter Message" value={message} onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress} />
                <button className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all'
                        onClick={handleAttachmentClick}
                >
                        <GrAttachment className="text-2xl"/>
                </button>
                <input type="file" className="hidden" ref = {fileInputRef} onChange={handleAttachmentChange} />
                <div className="relative ">
                        <button onClick={()=>setEmojiPickerOpen(true)}
                         className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all'>
                                <RiEmojiStickerLine className="text-2xl"/>
                        </button>
                        <div className="absolute bottom-16 right-0" ref={emojiRef}>
                                <EmojiPicker  theme="dark" open = {emojiPickerOpen} autoFocusSearch = {false} onEmojiClick={handleAddEmoji}/>
                        </div>
                </div> 
        </div>
                <button className='bg-[#8417ff] items-center justify-center p-5 rounded-md focus:bg-[#741bda] hover:bg-[#741bda] focus:border-none focus:outline-none focus:text-white duration-300 transition-all' onClick={handleSendMessage}>
                                        <IoSend className="text-2xl"/>
                </button>

    </div>
  )
}

export default MessageBar;
