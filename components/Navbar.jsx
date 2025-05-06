import React from 'react'

const Navbar = () => {
  return (
    <nav className='bg-slate-900 flex justify-between p-2'>
        <div className="logo font-bold ml-5">
            <span className='text-white'>{'<'}Pass</span>
            <span className='text-green-500'>OP{'/>'}</span>
        </div>
        <ul>
            <li className='space-x-7.5 mr-5.5 text-white flex'>
                <a href="#">Home</a>
                <a href="https://github.com/nileXrana" target='_blank'>GitHub</a>
                <a href="https://www.linkedin.com/in/nilexrana/" target='_blank'>LinkedIn</a>
            </li>
        </ul>
    </nav>
  )
}

export default Navbar
