import { DownloadIcon, Save, Link, X, Copy } from 'lucide-react'
import logo from '../../assets/loggoo1.png'

const EditorNavbar = ({ fileName, addTextEditor, addCodeEditor, onSaveHandler, onShareHandler, downloadPDF }) => (
  <nav className='navbar'>
    <div className='flex gap-2 items-center'>
      <img src={logo} alt='logo' className='h-6 w-6 rounded-full' />
      <div className='file-name'>{fileName}</div>
    </div>
    <div className='text-code'>
      <button className='btn' onClick={addTextEditor}>Text</button>
      <button className='btn' onClick={addCodeEditor}>Code</button>
    </div>
    <div className='save-share' style={{ display: 'flex' }}>
      <div className='save flex gap-1 items-center' onClick={onSaveHandler}><Save className='h-5 w-5' /> Save</div>
      <div className='share flex gap-1 items-center' onClick={onShareHandler}>Share <Link className='h-5 w-5' /></div>
      <div className='download flex items-center ml-2 hover:bg-gray-200 rounded-full p-3' onClick={downloadPDF}><DownloadIcon className='h-5 w-5' /></div>
    </div>
  </nav>
);

export default EditorNavbar