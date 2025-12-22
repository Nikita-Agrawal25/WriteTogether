import { DownloadIcon, Save, Link, X, Copy } from 'lucide-react'

const ShareModal = ({
  share, closeDialog, shareOption, setShareOption, handleEmail, handleShareLink, shareLink, handleCopyLink, userEmail, shareEmail, setShareEmail, sendMail,
  copyLink, accessLevel, setAccessLevel
}) => share && (
  <div className='fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50'>
    <div className='bg-white p-6 rounded-lg shadow-lg w-[40%] relative'>
      <div className='flex justify-between items-center mb-4'>
        <h3 className='text-lg font-semibold'>Share with others</h3>
        <X className='text-gray-500 hover:text-red-600' onClick={closeDialog} />
      </div>

      <div className='mb-4'>
        <label className='block text-sm font-medium mb-2'>Access Level:</label>
        <select
          value={accessLevel}
          onChange={(e) => setAccessLevel(e.target.value)}
          className='border border-gray-300 px-4 py-2 rounded w-full focus:outline-none focus:border-blue-600'
        >
          <option value='Editor'>Editor</option>
          <option value='Viewer'>Viewer</option>
        </select>
      </div>

      <div className='flex gap-4 mb-4'>
        <button className={`px-4 py-2 rounded hover:bg-blue-500 hover:text-white ${shareOption === 'email' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`} onClick={() => setShareOption('email')}>
          Share via Email
        </button>
        <button className={`px-4 py-2 rounded hover:bg-blue-500 hover:text-white ${shareOption === 'link' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`} onClick={() => { setShareOption('link'); handleShareLink(); }}>
          Generate Link
        </button>
      </div>

      {shareOption === 'email' && (
        <form onSubmit={handleEmail}>
          <div className='mb-4'>
            <label className='block text-sm font-medium mb-2'>Your Email:</label>
            <input type='text' value={userEmail} readOnly className='border border-gray-300 px-4 py-2 rounded w-full focus:outline-none focus:border-blue-600' />
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-medium mb-2'>Send to:</label>
            <input type='email' value={shareEmail} required onChange={(e) => setShareEmail(e.target.value)} className='border border-gray-300 px-4 py-2 rounded w-full focus:outline-none focus:border-blue-600' />
          </div>
          <div className='flex justify-end'>
            <button type='submit' className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'>Share</button>
          </div>
          {sendMail && <p className='mt-4 text-gray-700'>{sendMail}</p>}
        </form>
      )}

      {shareOption === 'link' && shareLink && (
        <div className='mt-4'>
          <p className='text-sm font-semibold'>Share with this link:</p>
          <div className='flex items-center gap-2 mb-2'>
            <input type='text' value={shareLink} readOnly className='border border-gray-300 px-2 py-1 rounded w-full focus:outline-none text-blue-600' />
            <button onClick={handleCopyLink} className='bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 flex items-center'>
              <Copy className='h-4 w-4' />
            </button>
          </div>
          {copyLink && <p className='text-gray-700'>{copyLink}</p>}
        </div>
      )}
    </div>
  </div>
);

export default ShareModal;