import {
        Tooltip,
        TooltipContent,
        TooltipProvider,
        TooltipTrigger,
      } from "@/components/ui/tooltip"
      import {
        Dialog,
        DialogContent,
        DialogDescription,
        DialogHeader,
        DialogTitle,
      } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import {Input} from "@/components/ui/input"

import { apiClient } from "@/lib/api-client";

import { FaPlus } from "react-icons/fa"
import { useEffect, useState } from "react";
import {  GET_ALL_CONTACTS,CREATE_CHANNEL_ROUTE } from "@/utils/constants";
import { useAppStore } from "../../../../../../store";
import {Button} from "@/components/ui/button";
import MultiSelecter from "@/components/ui/multipleselect.jsx";
      

const CreateChannel = () => {
        const [NewChannelModel, setNewChannelModel] = useState(false);

        const{setSelectedChatType,setSelectedChatData,addChannel} = useAppStore();
        const [allContacts, setAllContacts] = useState([])
        const [selectedContacts, setSelectedContacts] = useState([]);
        const [channelName, setChannelName] = useState("");
        useEffect(()=>{
                const getData = async ()=>{
                        const response  = await apiClient.get(GET_ALL_CONTACTS,{withCredentials:true});
                        setAllContacts(response.data.contacts);
                        
                };
                getData();
        },[])
        const createChannel = async() =>{
                //

                try {
                        if(channelName.length > 0 && selectedContacts.length > 0){
                                const response = await apiClient.post(CREATE_CHANNEL_ROUTE,{name:channelName,members:selectedContacts.map((contact)=> contact.value),},{withCredentials:true});
                                if(response.status === 201){
                                        // setSelectedChatType('channel');
                                        // setSelectedChatData(response.data.channel);
                                        addChannel(response.data.channel);
                                        setNewChannelModel(false);
                                        setChannelName('');
                                        setSelectedContacts([]);
                                }
                        }
                        //
                        
                } catch (error) {
                        console.log(error);
                }
        }
        

  return (
    <div className="">
        <TooltipProvider>
                <Tooltip>
                        <TooltipTrigger>
                                <FaPlus className="text-neutral-400 text-sm font-light text-opacity-90 hover:text-neutral-100 cursor-pointer transition-all duration-300"
                                onClick={()=> setNewChannelModel(true)}
                                />
                        </TooltipTrigger>
                        <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
                                <p>Create New Channel</p>
                        </TooltipContent>
                </Tooltip>
        </TooltipProvider>
        <Dialog open = {NewChannelModel} onOpenChange = {setNewChannelModel}>
                {/* <DialogTrigger>Open</DialogTrigger> */}
                <DialogContent className = "bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
                        <DialogHeader>
                                <DialogTitle>Please fill up the details for new channel</DialogTitle>
                                <DialogDescription>
                                </DialogDescription>
                        </DialogHeader>
                        <div>
                                <Input placeholder = 'Channel Name' className = ' rounded-lg p-6 bg-[#2c2e3b] '
                                onChange = {(e)=> setChannelName(e.target.value)}
                                value = {channelName}/>
                        </div>
                        <div>
                                <MultiSelecter className="rounded-lg bg-[#2c2e3b] border-none text-white py-2"
                                defaultOptions = {allContacts} 
                                placeholder = "Search Contacts"
                                value = {selectedContacts}
                                onChange = {setSelectedContacts}
                                emptyIndicator = {<p className="text-center text-lg leading-10 text-gray-600">No Results found</p>}/>
                        </div>
                        <div>
                                <Button className= "w-full bg-purple-700 hover:bg-purple-900 duration-300 transition-all"
                        onClick = {createChannel}>
                                Create Channel
                        </Button>
                        </div>
                        
                        
                        <ScrollArea className= "h-[250px]">
                                <div className="flex flex-col gap-5">
                                        
                                </div>

                        </ScrollArea>
                        
                </DialogContent>
        </Dialog>


    </div>
  )
}

export default CreateChannel