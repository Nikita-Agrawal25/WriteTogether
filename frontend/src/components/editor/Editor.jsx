import {React, useState, useEffect} from 'react'
import CodeEditor from '../CodeEditor'
import TextEditor from '../TextEditor'
import "../../css/navbar.css"
import { DownloadIcon, Save, Link, X, Copy } from 'lucide-react'
import logo from '../../assets/loggoo1.png'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import jsPDF from 'jspdf'
import EditorNavbar from './EditorNavbar'
import ShareModal from './ShareModal'

function Editor({ userInfo }) {
  const { id } = useParams();
  const [components, setComponents] = useState([]);
  const [fileName, setFileName] = useState('File Name');
  const [userEmail, setUserEmail] = useState('');
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [share, setShare] = useState(false);
  const [shareOption, setShareOption] = useState('');
  const [shareEmail, setShareEmail] = useState('');
  const [shareLink, setShareLink] = useState('');
  const [sendMail, setSendMail] = useState('');
  const [copyLink, setCopyLink] = useState('');
  const [accessLevel, setAccessLevel] = useState('Editor');

  useEffect(() => {
    const fetchFileData = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/api/file/${id}`);
        const { name, content, email } = response.data.file;
        setFileName(name);
        setUserEmail(email);
        setComponents(content || []);
      } catch (error) {
        console.error('Error while fetching file data:', error);
      }
    };
    fetchFileData();
  }, [id]);

  const addTextEditor = () => setComponents([...components, { type: 'TextEditor', content: '', id: Date.now() }]);
  const addCodeEditor = () => setComponents([...components, { type: 'CodeEditor', content: '', id: Date.now() }]);

  const handleContentChange = (id, content) => setComponents((prev) => prev.map((c) => c.id === id ? { ...c, content } : c));

  const onSaveHandler = async () => {
    try {
      await axios.post('http://localhost:8081/api/file/save', { fileId: id, content: components });
    } catch (error) {
      console.log('Failed to save the file content.', error);
    }
  };

  useEffect(() => {
    if (debounceTimeout) clearTimeout(debounceTimeout);
    const timeout = setTimeout(onSaveHandler, 1000);
    setDebounceTimeout(timeout);
    return () => clearTimeout(timeout);
  }, [components]);

  const onShareHandler = () => {
    setShare(true);
    setShareOption('');
    setSendMail('');
    setCopyLink('');
    setShareEmail('');
  };
  const closeDialog = () => setShare(false);

  // const handleEmail = async (e) => {
  //   e.preventDefault();
  //   try {
  //     await axios.post('http://localhost:8081/api/file/share', {
  //       fileId: id,
  //       senderEmail: userEmail,
  //       receiverEmail: shareEmail,
  //       access: accessLevel,
  //       accessToken: userInfo.access_token,
  //       refreshToken: userInfo.refresh_token
  //     });
  //     setSendMail('File shared successfully!');
  //   } catch (error) {
  //     setSendMail('Email is required');
  //   }
  // };

   const handleEmail = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post("http://localhost:8081/api/file/share", {
          fileId: id,
          email: shareEmail,
          access : accessLevel
        });
        setSendMail("File shared successfully!");
      } catch (error) {
        console.log(sendMail.message);
        console.error("Error sharing file:", error);
        setSendMail("Email is required");
      }
    };

  const handleShareLink = () => setShareLink(`${window.location.origin}/editor/${id}`);
  const handleCopyLink = () => navigator.clipboard.writeText(shareLink).then(() => setCopyLink('Link copied!'));

  const downloadPDF = () => {
    const file = new jsPDF();
    file.setFontSize(12);
    let y = 20;
    let textIndex = 0;
    let codeIndex = 0;
    components.forEach((component) => {
      if (component.type === 'TextEditor') {
        textIndex++;
        file.text(`Text Editor ${textIndex}:`, 10, y);
        y += 10;
        const content = component.content.replace(/<[^>]+>/g, '');
        const lines = file.splitTextToSize(content, 180);
        lines.forEach((line) => { file.text(line, 20, y); y += 5; });
      } else if (component.type === 'CodeEditor') {
        codeIndex++;
        file.text(`Code Editor ${codeIndex}:`, 10, y);
        y += 10;
        const lines = file.splitTextToSize(component.content, 180);
        lines.forEach((line) => { file.text(line, 20, y); y += 5; });
      }
      y += 10;
      if (y > 280) { file.addPage(); y = 10; }
    });
    file.save(`${fileName}.pdf`);
  };

  return (
    <>
      <EditorNavbar {...{ fileName, addTextEditor, addCodeEditor, onSaveHandler, onShareHandler, downloadPDF }} />
      <ShareModal {...{ share, closeDialog, shareOption, setShareOption, handleEmail, handleShareLink, shareLink, handleCopyLink, userEmail, shareEmail, setShareEmail, sendMail, copyLink, accessLevel, setAccessLevel }} />
      <div>
        {components.map((component, index) => (
          component.type === 'TextEditor' ? (
            <TextEditor key={component.id} id={index} fileId={id} content={component.content} onChange={(c) => handleContentChange(component.id, c)} accessLevel={accessLevel} />
          ) : (
            <CodeEditor key={component.id} id={index} fileId={id} content={component.content} onChange={(c) => handleContentChange(component.id, c)} accessLevel={accessLevel} />
          )
        ))}
      </div>
    </>
  );
}

export default Editor;