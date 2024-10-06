import { RiCloseFill } from 'react-icons/ri'
import { useAppStore } from '../../../../../../store'
import {Avatar,AvatarImage} from '@/components/ui/avatar'
import { HOST } from "@/utils/constants";
import {getColor} from '@/lib/utils'
const ChatHeader = () => {
        const {closeChat,selectedChatData,selectedChatType} = useAppStore();
  return (
    <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-20 ">
        <div className="flex gap-5 items-center w-full  justify-between ">
                <div className="flex gap-3 items-center justify-center ">
                        <div className="w-14 h-13 relative pt-1">
                                {selectedChatType === "contact"?<Avatar className = "h-13 w-14 rounded-full overflow-hidden">
                                        { selectedChatData.image ? <AvatarImage src={`${HOST}/${selectedChatData.image}`} alt = 'profile' className = 'object-cover w-full h-full bg-black' /> : (
                                                <div className = {`h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(selectedChatData.color)}`}  > 
                                                        {selectedChatData.firstName ? selectedChatData.firstName.split("").shift() : selectedChatData.email.split("").shift()}
                                                </div>) }
                                                
                                </Avatar>:<div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full ">#</div>}
                                
                        </div>
                        <div>
                        {selectedChatType === "channel" && selectedChatData.name}
                        {selectedChatType === 'contact' && <div className="flex flex-col pl-4 ">
                                        <span>{
                                                selectedChatData.firstName && selectedChatData.lastName ? `${selectedChatData.firstName} ${selectedChatData.lastName}`:selectedChatData.email
                                        }</span>
                                        <span className="text-xs">
                                                {selectedChatData.email}
                                        </span>
                        
                        </div> }
                        </div>
                </div>
                
                
                <div className="flex gap-5 items-center justify-center  ">
                        <button className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all text-3xl'
                        onClick = {closeChat}>
                                <RiCloseFill/>
                        </button>
                </div> 

        </div>
     </div>
  )
}

export default ChatHeader