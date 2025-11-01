import React from 'react'

const Navbar = () => {
  return (
    <nav className='bg-slate-800 text-white'>
      <div className="mycontainer flex justify-between items-center px-3 py-3 h-14">

        <div className="logo font-bold text-2xl ml-10">
          <span className='text-green-500'>&lt;</span>
          Pass
          <span className='text-green-500'>Op/&gt;</span>
        </div>
        <ul>
          <li className='flex gap-4 mr-10'>
            <a className='hover:font-bold' href='/'>Home</a>
            <a className='hover:font-bold' href='/'>About</a>
            <a className='hover:font-bold' href='/'>Contact</a>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
