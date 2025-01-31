import React from 'react'
import FileList from './FileList'

const Main = ({activeTeam, userInfo }) => {
  return (
    <div className='p-6'>
        <FileList activeTeam={activeTeam} userInfo={userInfo}/>
    </div>
  )
}

export default Main