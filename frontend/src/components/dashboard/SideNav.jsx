import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/loggoo1.png';
import { ChevronDown, Edit, LogOut, SquareCheck, Trash2, Users, X} from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const SideNav = ({activeTeam, setActiveTeam, userInfo}) => {

  // Drop-down toggle
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const[teams, setTeams] = useState(['Team Name'])  
  const [isInputBox, setIsInputBox] = useState(false);
  const [fileName, setFileName] = useState('');
  const [message, setMessage] = useState('');

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if(dropdownRef.current && !dropdownRef.current.contains(event.target)){
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('user-info')
    navigate('/')
  }


  // teams list
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get('http://localhost:8081/api/teams', {params : {email: userInfo.email}});
        if(response.data.length > 0){
          // console.log(response.data);
          setTeams(response.data);
          setActiveTeam(response.data[0].name)
        }
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
  };
  fetchTeams();
}, [userInfo]);


// delete a particular team
const deleteTeam = async (teamId, teamName) => {
  // console.log(teamId);
  console.log("team deleted")
  try {
    const response = await axios.delete(`http://localhost:8081/api/teams/${teamId}`);
    const res = await axios.delete(`http://localhost:8081/api/file?teamName=${teamName}`);
    if (response.status === 200) {
      setTeams((prevTeams) => {
        const remainingTeam = prevTeams.filter((team) => team._id !== teamId);
        // console.log("Teams after deletion:", remainingTeam)
        alert(`Team ${teamName} deleted successfully`)
        return remainingTeam;
      });
      if(teams.length > 1){
        setActiveTeam(teams[teams.length-2].name);
      } else{
        setActiveTeam('Team Name')
      }
    }
  } catch (error) {
    console.error('Error while deleting file:', error);
  }
}

// new file box
  const newFileHandler = () => {
    setIsInputBox(true);
  }

  const handleCreateFile = async () => {
    try{
      const res = await axios.post('http://localhost:8081/api/file/createFile', {
        name: fileName, email: userInfo.email, teamName: activeTeam
      })
      // console.log(fileName)
      setMessage('File created successfully!');
    } catch(error){
      if (error.response && error.response.status === 409) {
        setMessage('File name already exists.');
      } else {
        setMessage('Failed to create file.');
      }
    // console.error('Error creating file:', error);
    }
    setFileName('')
    setTimeout(() => {
      setIsInputBox(false)
    }, 900);
    setTimeout(() => {
      setMessage('')
    }, 1000);
  }


  return (
    <div className="bg-gray-200 h-screen fixed w-[21%] border-r p-4 flex flex-col justify-between">

      {/* top section */}
      <div className="flex gap-3 relative px-4 py-3 hover:bg-gray-300 rounded-lg items-center" ref={dropdownRef}>
        <img src={logo} alt="logo" className="w-9 h-9" />
        <h2 className="font-bold">
          {activeTeam}
        </h2>
        <div onClick={toggleDropdown}>
          <ChevronDown className='cursor-pointer'/>
        </div>


        {/* Dropdown Popup */}
        {isDropdownOpen && (
          <div className="absolute top-16 left-0 w-64 bg-white shadow-md rounded-md border cursor-pointer">
            <div className='px-2 mt-2'>
              <h2>
                {(teams.length >= 1 && teams[0].name) ? (
                <ul>
                    {teams.map((team) => (
                        <div key={team._id} className='flex items-center gap-2'>
                          <h2 key={team._id} className={`mb-1 w-56 flex justify-between hover:bg-blue-500 hover:text-white px-2 py-1 rounded-lg ${activeTeam === team.name && 'bg-blue-500 text-white'}`}  
                        onClick={ () => {
                          setActiveTeam(team.name);
                          setIsDropdownOpen(false);
                        }}>
                            {team.name}
                        </h2>
                        <Trash2 className='h-5 w-5 hover:cursor-pointer' onClick={() => deleteTeam(team._id, team.name)}/>
                        </div>
                    ))}
                </ul>
                ) : (
                  <div>No teams found.</div>
                )}
              </h2>
            </div>

            <div className='w-60 h-[1px] ml-2 mt-[2px] bg-gray-300'></div>

            <div className=' px-2 flex flex-col '>
              <Link to='/team/create' className='flex gap-2 hover:bg-gray-100 p-2 rounded-lg text-sm'> <Users className='h-4 w-4'/>Create Team</Link>
              <h2 className='flex gap-2 hover:bg-gray-100 p-2 rounded-lg text-sm' onClick={handleLogout}> <LogOut className='h-4 w-4'/>Logout</h2>
            </div>

            <div className='w-60 h-[1px] ml-2 mt-[2px] bg-gray-300'></div>

            <div className='flex items-center px-2'>
              <img src={userInfo.image} alt="user" className='h-8 w-8 rounded-full'/>
              <div className='text-sm m-2'>
                <h2>{userInfo.name}</h2>
                <p>{userInfo.email}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* bottom section */}
      <div className='m-4'>
        <button className='w-56 bg-blue-600 rounded-md p-2 text-center text-white font-bold cursor-pointer hover:bg-blue-700' onClick={newFileHandler}>New File</button>
        

        {isInputBox && 
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[50%] relative">
            <div className='flex justify-between'>
              <h3 className="text-lg font-semibold mb-4">Create New File</h3>
              <X className='cursor-pointer hover:text-red-800 rounded-full' onClick={() => {setIsInputBox(false)}}/>
            </div>
            <input 
              type="text"
              value={fileName} 
              placeholder="Enter file name" 
              onChange={(e) => setFileName(e.target.value)}
              className="border border-gray-300 px-4 py-2 rounded w-full mb-4 focus:outline-none focus:border-gray-600"
              />
            <div className='flex justify-end'>
              <button className={`bg-blue-600 text-white px-4 py-1 rounded-lg hover:bg-blue-700 ${
                !fileName.trim() ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`} disabled={!fileName.trim()} 
                onClick={handleCreateFile}>
                Create
              </button>
            </div>
            {message && <p className="mt-5 text-lg text-gray-700">{message}</p>}
          </div>
        </div>
        }
      </div>
    </div>
  );
}


export default SideNav;


