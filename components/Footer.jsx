import React from 'react'

const Footer = () => {
    return (
        <div className='bg-slate-900 text-white flex flex-col justify-center items-center  w-[100vw] fixed bottom-0  p-2'>
            <div className='flex justify-center items-center'> Made with <lord-icon
    src="https://cdn.lordicon.com/gbkitytd.json"
    trigger="loop"
    delay="1000"
    colors="primary:#e83a30"
    >
</lord-icon> <a href="https://github.com/nileXrana" target='_blank'>by <b className='hover:text-xl transition-all duration-300 underline text-green-500'>nileXrana</b></a> </div>
        </div>
    )
}

export default Footer