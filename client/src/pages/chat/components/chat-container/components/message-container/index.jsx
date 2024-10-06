import { useAppStore } from "@/store";
import {useRef,useEffect, useState } from 'react'
import { apiClient } from "@/lib/api-client";
import moment from "moment";
import { GET_ALL_MESSAGES_ROUTE,GET_CHANNEL_MESSAGES } from "@/utils/constants";
import { HOST } from "@/utils/constants";
import {MdFolderZip} from 'react-icons/md'
import{IoMdArrowRoundDown} from 'react-icons/io'
import { IoCloseSharp } from "react-icons/io5";
import {Avatar,AvatarImage,AvatarFallback} from '@/components/ui/avatar'
import {getColor} from '@/lib/utils'
const MessageContainer = () => {
  const scrollRef = useRef();
  const [showImage, setShowImage] = useState(false);
  const [ImageURL, setImageURL] = useState(null);
  const {selectedChatType,selectedChatData,selectedChatMessages,setSelectedChatMessages,setIsDownloading,setFileDownloadProgress,userInfo} = useAppStore();
  useEffect(() => {
    const getMessages = async () =>{
      try {
        const response = await apiClient.post(GET_ALL_MESSAGES_ROUTE, {
          id : selectedChatData._id},{withCredentials:true});
        if(response.data.messages){
          setSelectedChatMessages(response.data.messages);
        }
      } catch (error) {
        console.log(error);
      }
    }

    const getChannelMessages = async () =>{
      try {
        const response = await apiClient.get(`${GET_CHANNEL_MESSAGES}/${selectedChatData._id}`,{withCredentials:true});
        console.log(response.data.messages);
        if(response.data.messages){
          setSelectedChatMessages(response.data.messages);
        }
      } catch (error) {
        console.log(error);
      }
    }
    if(selectedChatData._id){
      //
      if(selectedChatType === "contact"){
        // 
        getMessages();
      }
      else if (selectedChatType === "channel"){
        getChannelMessages();
      }
    }
  }
  ,[selectedChatData,selectedChatType,setSelectedChatMessages]);

  const checkIfImage = (filePath)=>{
    const imageRegex = /\.(png|jpg|jpeg|gif|bmp|svg|tiff|tif|webp|ico|heic|heif)$/i;
    return imageRegex.test(filePath);
  }

  const downloadFile = async (url)=>{
    setIsDownloading(true);
    setFileDownloadProgress(0);
    //
    const response = await apiClient.get(`${HOST}/${url}`, {
      responseType: 'blob',
      withCredentials: true,
      onDownloadProgress: (progressEvent) => {
        const{loaded,total}= progressEvent;
        const percentagCompleted = Math.round((loaded*100)/total);
        setFileDownloadProgress(percentagCompleted);
      },
    });
    const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = urlBlob;
    link.setAttribute('download',url.split('/').pop());
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(urlBlob);
    setIsDownloading(false);
    setFileDownloadProgress(0);
  }

 

  const renderMessages = ()=>{
    let lastDate  = null;
    return selectedChatMessages.map((message,index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      // className={`flex items-start gap-2 ${showDate? 'border-t border-gray-200 py-2': ''}`}
      return (
        <div key={index} >
          {showDate&& <div className="text-center text-gray-500 my-2">
            {moment(message.timestamp).format('LL')}</div>}
          {/* {renderDMMessages(message)}
          {console.log(selectedChatType)} */}
          {selectedChatType === "contact" &&renderDMMessages(message)}
          {selectedChatType === "channel" &&renderChannelMessages(message)}
        </div>)
    
    })
    
    // Fetch messages from selectedChatData
    // return messages.map(msg => <Message key={msg._id} message={msg} />)
  };

  const renderChannelMessages = (message)=>{
    console.log(message , userInfo);
    return (
      <div className={`mt-5 ${message.sender._id !== userInfo.id? "text-left" : "text-right"}`}>
          { message.messageType === "text" &&(
            <div className={` ${message.sender._id === userInfo.id ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50 ":"bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20 "} border inline-block p-4 rounded my-1 max-w-[50%] break-words `}>
            {/* {console.log(message.content)} */}
            {message.content}
            </div>)
          }

      {
        message.messageType === "file" &&(
          <div className={`${message.sender._id === userInfo.id ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50 ":"bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20 "} border inline-block p-4 rounded my-1 max-w-[50%] break-words `}>
            {/* {console.log(message.content)} */}
            {checkIfImage(message.fileUrl)?
            <div className="cursor-pointer" onClick={()=>{setShowImage(true)
              setImageURL(message.fileUrl)
            }}>
                <img src={`${HOST}/${message.fileUrl}`} height={300} width={300} alt="" />
            </div> :
            <div className="flex items-center justify-center gap-4">
              <span className="text-white/80 text-3xl bg-black/20 rounded-full p-3">
                  <MdFolderZip/>
              </span>
              <span>{message.fileUrl.split("/").pop()}</span>
              <span className="bg-black/20 p-3 rounded-full text-2xl hover:bg-white/80 cursor-pointer transition-all duration-300"
              onClick={()=>downloadFile(message.fileUrl)}>
                <IoMdArrowRoundDown/>
              </span>

            </div> }
          </div>)
      }
 
          {
            message.sender._id !== userInfo.id ? <div className="flex items-center justify-start gap-3 mt-1"><Avatar className = "h-8 w-8 rounded-full overflow-hidden">
            { message.sender.image && <AvatarImage src={`${HOST}/${message.sender.image}`} alt = 'profile' className = 'object-cover w-full h-full bg-black' /> }
             {<AvatarFallback className = {`h-8 w-8 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(message.sender.color)}`}  > 
              {console.log(message)}
                            {message.sender.firstName ? message.sender.firstName.split("").shift() : message.sender.email.split("").shift()}
              </AvatarFallback> }
                    
                    
            </Avatar>
          <div className="flex  text-white/60 text-sm ">
                                              <span>{
                                                      message.sender.firstName && message.sender.lastName ? `${message.sender.firstName} ${message.sender.lastName}`:message.sender.email
                                              }</span>
                                              <span className="pl-2 text-xs pt-0.5">{
                                                      moment(message.timestamp).format("LT")
                                              }</span>
                              </div>
          </div> :<div className="flex flex-col text-white/60 text-sm "> <span className="pl-2 text-xs pt-0.5">{
                                                      moment(message.timestamp).format("LT")
                                              }</span> </div>
          }
      </div>
    )
      
  }

  const renderDMMessages = (message)=>
    <div className={`${message.sender === selectedChatData._id ? "text-left" : "text-right"} `}>
      { message.messageType === "text" &&(
      <div className={`${message.sender !== selectedChatData._id ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50 ":"bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20 "} border inline-block p-4 rounded my-1 max-w-[50%] break-words `}>
        {/* {console.log(message.content)} */}
        {message.content}
      </div>)
      }
      {
        message.messageType === "file" &&(
          <div className={`${message.sender !== selectedChatData._id ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50 ":"bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20 "} border inline-block p-4 rounded my-1 max-w-[50%] break-words `}>
            {/* {console.log(message.content)} */}
            {checkIfImage(message.fileUrl)?
            <div className="cursor-pointer" onClick={()=>{setShowImage(true)
              setImageURL(message.fileUrl)
            }}>
                <img src={`${HOST}/${message.fileUrl}`} height={300} width={300} alt="" />
            </div> :
            <div className="flex items-center justify-center gap-4">
              <span className="text-white/80 text-3xl bg-black/20 rounded-full p-3">
                  <MdFolderZip/>
              </span>
              <span>{message.fileUrl.split("/").pop()}</span>
              <span className="bg-black/20 p-3 rounded-full text-2xl hover:bg-white/80 cursor-pointer transition-all duration-300"
              onClick={()=>downloadFile(message.fileUrl)}>
                <IoMdArrowRoundDown/>
              </span>

            </div> }
          </div>)
      }
      <div className="text-xs text-gray-600 ">
        {moment(message.timestamp).format("LT")}
      </div>
    </div>
    
  useEffect(()=>{
    if (scrollRef.current) {
      // Fetch more messages onScroll={e => {}}
        scrollRef.current.scrollIntoView({behavior: "smooth"})

    }
    //
    
  },[selectedChatMessages]);
  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full ">
      {renderMessages()}
      <div ref={scrollRef} ></div>
        {/* <div></div>MessageContainer */}
        {showImage && <div className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg flex-col">
          <div><img src={`${HOST}/${ImageURL}`} alt="" 
            className="h-[80vh] w-full bg-cover"/>
          </div>
          <div className="flex fixed top-0 mt-5  gap-5">
            <button className="bg-black/20 p-3 rounded-full text-2xl hover:bg-white/80 cursor-pointer transition-all duration-300"
            onClick={()=>downloadFile(ImageURL)}>
              <IoMdArrowRoundDown/>
            </button>
            <button className="bg-black/20 p-3 rounded-full text-2xl hover:bg-white/80 cursor-pointer transition-all duration-300"
            onClick={()=>{setShowImage(false)
              setImageURL(null);
            }}>
              <IoCloseSharp/>
            </button>
          </div>
          
            

          </div>}

        </div>
  )
}

export default MessageContainer