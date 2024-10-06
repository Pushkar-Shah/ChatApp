// eslint-disable-next-line
import React from 'react';
import Lottie from 'react-lottie';

import {defaultOptions} from '@/lib/utils'


const EmptyChatContainer = () => {
  return (
    <div className='hidden flex-1 md:bg-[#1c1d25] md:flex flex-col justify-center  items-center  duration-1000 transition-all'> 
     <Lottie isClickToPauseDisabled = {true} options={defaultOptions} height={200} width={200} />
     <div className='text-opacity-80 text-white flex flex-col gap-5 items-center mt-10 lg:text-4xl text-3xl transition-all duration-300 text-center'>
        <h3 className='poppins-medium'>
                Hi <span className='text text-purple-500'>!</span> Welcome to 
                <span className=' text-purple-500' > Synchronous </span> Chat App <span className='text text-purple-500'>.</span>
        </h3>
     </div>
     </div>
  )
}

export default EmptyChatContainer;