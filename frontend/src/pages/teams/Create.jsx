import React, { useEffect, useState } from 'react';
import axios from 'axios';
import logo from '../../assets/loggoo1.png';
import { useNavigate } from 'react-router-dom';

const Create = () => {
  const [teamName, setTeamName] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({
    image: '',
    name: 'ABC',
    email: 'abc@gmail.com'
  });
  useEffect(() => {
    const data = localStorage.getItem('user-info')
    if(data) {
      const userData = JSON.parse(data)
      setUserInfo(userData);
    }
  }, [])


  const handleCreateTeam = async () => {
    try {
      const response = await axios.post('http://localhost:8081/api/create', {name: teamName, email: userInfo.email});
      setMessage('Team created successfully!');
      setTeamName('');
      setTimeout(() => {
        navigate('/dashboard')
      }, 500);
    } catch (error) {
        if (error.response && error.response.status === 409) {
            setMessage('Team name already exists.');
        } else {
            setMessage('Failed to create team.');
        }
        console.error('Error while creating team:', error);
    }
  };

  return (
    <div className="px-14 mt-9">
      <div className="flex">
        <img src={logo} alt="" className="w-14 h-14 mt-4" />
        <span className="font-bold mt-7 text-2xl px-3">WriteTogether</span>
      </div>
      <div className="flex flex-col items-center mt-7">
        <h2 className="font-bold text-4xl py-7">What should we call your team?</h2>
        <h2 className="text-gray-600 text-lg mt-2">You can't change this later.</h2>

        <div className="flex flex-col mt-10 w-[35%]">
          <label className="text-gray-600 text-lg">Team Name</label>
          <input
            type="text"
            placeholder="Team Name"
            value={teamName}
            className="bg-gray-200 mt-3 py-2 px-4 rounded-lg text-black border-[1px] border-gray-600 focus:outline-none"
            onChange={(e) => setTeamName(e.target.value)}
          />
        </div>
        <button
          className={`bg-blue-600 mt-16 w-[25%] py-2 text-white text-lg rounded-lg hover:bg-blue-500 ${
            !teamName.trim() ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
          }`}
          onClick={handleCreateTeam}
          disabled={!teamName.trim()}
        >
          Create Team
        </button>
        {message && <p className="mt-5 text-lg text-gray-700">{message}</p>}
      </div>
    </div>
  );
};

export default Create;
