import React from 'react'
import {Link} from 'react-router-dom'
import "./css/navbar.css"
import { Save, Link } from 'lucide-react'

const Navbar = () => {

  return (
    <div>
        <nav className='navbar'>
            <div className="file-name">File Name</div>
            <div className="text-code">
                <Link to="/texteditor">Text</Link>
                <Link to="/codeeditor">Code</Link>
            </div>
            <div className="save-share" style={{display:"flex"}}>
                <div className="save"><Save/> Save</div>
                <btn className="share">Share <Link /> </btn>
            </div>
        </nav>
    </div>
  )
}

export default Navbar