import React, {useState, useEffect} from 'react'
import SideNav from '../components/dashboard/SideNav'
import Main from '../components/dashboard/Main'

const Dashboard = () => {
  const [activeTeam, setActiveTeam] = useState('Team Name');
  const [userInfo, setUserInfo] = useState({
    image: '',
    name: 'ABC',
    email: 'abc@gmail.com',
  });

  useEffect(() => {
    const data = localStorage.getItem('user-info')
    if(data) {
      const userData = JSON.parse(data);
      setUserInfo(userData);
    }
  }, [])

  return (
    <div className='flex gap-0'>
      <div className='w-[21%]'>
        <SideNav activeTeam={activeTeam} setActiveTeam={setActiveTeam} userInfo={userInfo}/>
      </div>
      <div className='w-[79%]'>
        <Main activeTeam={activeTeam} userInfo={userInfo}/>
      </div>
    </div>

  )
}

export default Dashboard