import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Search, Edit, SquareCheck, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FileList = ({ activeTeam, userInfo }) => {
  const [files, setFiles] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [searchFiles, setSearchFiles] = useState([]);
  const [isSearchFile, setIsSearchFile] = useState(false);
  const [isFilteredFile, setIsFilteredFile] = useState(true);
  const [editFileId, setEditFileId] = useState('');
  const [newFileName, setNewFileName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get('http://localhost:8081/api/file/fetchFiles', {
          params: { email: userInfo.email, teamName: activeTeam },
        });
        if (response.data.length > 0) {
          const sortedFiles = response.data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
          setFiles(sortedFiles);
          setFilteredFiles(sortedFiles);
        }
        else {
          setFiles([])
          setFilteredFiles([]);
        }
      } catch (error) {
          console.error('Error fetching files:', error);
      }
    };
    fetchFiles();
  }, [userInfo, activeTeam, filteredFiles, files]);


  const saveEditedName = (async (fileId, newName) => {
    try {
      const response = await axios.patch(`http://localhost:8081/api/file/${fileId}`, {
        name: newName, email: userInfo.email, teamName: activeTeam
      });
      if (response.status === 200) {
        setFiles((prev) =>
          prev.map((file) =>
            file._id === fileId ? {...file, name: newName} : file
          )
        );
        setFilteredFiles((prev) =>
          prev.map((file) =>
            file._id === fileId ? {...file, name: newName} : file
          )
        );
        setEditFileId(null);
      }
      if(response.status === 201){
        alert('File name already exist. Try new name');
      }
    } catch (error) {            
        console.error('Error editing file name:', error);
    }
  })

  const deleteFile = async (fileId, fileName) => {
    // console.log("file deleted")
    try {
      const response = await axios.delete(`http://localhost:8081/api/file?fileId=${fileId}`);
      if (response.status === 200) {
        // alert(`File ${fileName} deleted successfully`)
        setFiles((prevFiles) => prevFiles.filter((file) => file._id !== fileId));
      }
    } catch (error) {
        console.error('Error deleting file:', error);
    }
  }

    // Search input change
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearch(value);
        const filtered = files.filter((file) =>
          file.name.toLowerCase().includes(value.toLowerCase())
        );
        console.log(filtered);
        setSearchFiles(filtered);
        if(filtered.length != files.length){
            setIsFilteredFile(false);
            setIsSearchFile(true);
        } else{
            setIsFilteredFile(true);
            setFilteredFiles(filtered);
            setIsSearchFile(false);
        }
    };
      

  return (
    <>
      {/* Header Section */}
      <div className='flex justify-end w-full items-center gap-2'>
        {/* Search button */}
        <div className='flex gap-2 items-center border rounded-md p-1'>
          <Search className='h-4 w-4' />
          <input type="text" placeholder='Search' value={search}
            onChange={handleSearchChange} className='bg-transparent focus:outline-none' />
        </div>
        {/* User's image icon */}
        <img src={userInfo.image} alt="image" className='h-7 w-7 rounded-full' />

      </div>

      {/* File List */}
      <div className="overflow-x-auto mt-6">
        <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
          <thead className="ltr:text-left rtl:text-right">
            <tr>
              <td className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">File Name</td>
              <td className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">Created At</td>
              <td className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">Edited</td>
              <td className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">Author</td>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {isFilteredFile && 
            (filteredFiles.length > 0 ? (
              filteredFiles.map((file) => (
                <tr key={file._id} className="odd:bg-gray-50">
                  <td className="whitespace-nowrap px-4 py-2 font-semibold text-gray-800 hover:cursor-pointer hover:text-gray-950">
                    {editFileId === file._id ? (
                      <div className='flex gap-2 items-center'>
                        <input type='text' value={newFileName} onChange={(e) => setNewFileName(e.target.value)} className='focus:outline-none border-[1px] border-gray-600 px-2 py-1 rounded-md'/>
                        <SquareCheck onClick={() => saveEditedName(file._id, newFileName)} className='h-5 w-5 hover:cursor-pointer hover:text-green-800'/>
                        <X onClick={() => setEditFileId(null)} className='h-5 w-5 hover:cursor-pointer hover:text-red-800'/>
                      </div>
                    ) : (
                      <h2  onClick={() => { navigate(`/editor/:${file._id}`) }}>{file.name}</h2>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                    {new Date(file.createdAt).toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                    {new Date(file.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700"><img src= {userInfo.image} alt='img' className='h-6 w-6 rounded-full'/></td>
                            
                  <td className='whitespace-nowrap px-4 py-2' >
                    <div className='flex gap-2'>
                    <Trash2 className='h-5 w-5 hover:cursor-pointer' onClick={() => deleteFile(file._id, file.name)} />
                    <Edit className='h-5 w-5 hover:cursor-pointer' onClick={() => {setEditFileId(file._id); setNewFileName(file.name)}}/>
                    </div>
                  </td>
                </tr>
              ))) : (
                <tr>
                <td colSpan="4" className="text-center py-4">
                    No files found.
                </td>
            </tr>
              )
          )}

            {isSearchFile && 
            (searchFiles.length > 0 ? (
              searchFiles.map((file) => (
                <tr key={file._id} className="odd:bg-gray-50">
                  <td className="whitespace-nowrap px-4 py-2 font-semibold text-gray-800 hover:cursor-pointer hover:text-gray-950">
                    {editFileId === file._id ? (
                      <div className='flex gap-2 items-center'>
                        <input type='text' value={newFileName} onChange={(e) => setNewFileName(e.target.value)} className='focus:outline-none border-[1px] border-gray-600 px-2 py-1 rounded-md'/>
                        <SquareCheck onClick={() => saveEditedName(file._id, newFileName)} className='h-5 w-5 hover:cursor-pointer hover:text-green-800'/>
                        <X onClick={() => setEditFileId(null)} className='h-5 w-5 hover:cursor-pointer hover:text-red-800'/>
                      </div>
                    ) : (
                      <h2  onClick={() => { navigate(`/editor/:${file._id}`) }}>{file.name}</h2>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                    {new Date(file.createdAt).toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                    {new Date(file.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700"><img src= {userInfo.image} alt='img' className='h-6 w-6 rounded-full'/></td>
                            
                  <td className='whitespace-nowrap px-4 py-2' >
                    <div className='flex gap-2'>
                    <Trash2 className='h-5 w-5 hover:cursor-pointer' onClick={() => deleteFile(file._id, file.name)} />
                    <Edit className='h-5 w-5 hover:cursor-pointer' onClick={() => {setEditFileId(file._id); setNewFileName(file.name)}}/>
                    </div>
                  </td>
                </tr>
              ))) : (
                <tr>
                   <td colSpan="4" className="text-center py-4">
                       No files found.
                    </td>
                </tr>
              )
          )}

          </tbody>
        </table>
      </div>

    </>
  )
}

export default FileList