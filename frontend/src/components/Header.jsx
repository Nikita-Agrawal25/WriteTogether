import React from 'react'
import {Link} from 'react-router-dom'
import logo from '../assets/loggoo1.png'

const Header = () => {
    return (
        <header className="bg-black">
            <div className="mx-auto flex justify-between h-16 max-w-screen-xl items-center gap-28 px-4 ">
                <div className='flex gap-3'>
                    <img src={logo} alt="logo" className='w-10 h-10 mt-2'/>
                    <div className='text-white font-bold mt-3'> 
                        WriteTogether
                    </div>
                </div>

                <div className="flex flex-1 items-center justify-end md:justify-between">
                    <nav aria-label="Global" className="hidden md:block">
                        <ul className="flex items-center gap-6 text-sm">
                            <li>
                                <a className="text-white transition hover:text-gray-500/75" href="#"> Home </a>
                            </li>
                            <li>
                                <a className="text-white transition hover:text-gray-500/75" href="#"> Features </a>
                            </li>
                        </ul>
                    </nav>

                    <div className="flex items-center gap-4">
                        <div className="sm:flex sm:gap-4">
                            <Link
                                className="block rounded-md font-medium px-5 py-2.5 text-sm  text-white transition "
                                to="/login"
                            >
                                Login
                            </Link>

                            <Link
                                className="hidden rounded-md bg-gray-100 px-5 py-2.5 text-sm text-black font-medium transition  sm:block hover:bg-slate-200"
                                to="/signup"
                            >
                                Register
                            </Link>
                        </div>

                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header