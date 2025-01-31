import {React, useState, useEffect, useRef} from 'react'
import CodeEditor from './components/CodeEditor'
import TextEditor from './components/TextEditor'
import "./css/navbar.css"
import { DownloadIcon, Save, Link, X } from 'lucide-react'
import logo from './assets/loggoo1.png'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import jsPDF from 'jspdf'

function Editor() {
    const {id} = useParams();
    const [components, setComponents] = useState([]);
    const [fileName, setFileName] = useState('File Name');
    const [userEmail, setUserEmail] = useState('');
    const [debounceTimeout, setDebounceTimeout] = useState(null);
    const [share, setShare] = useState(false);
    const [shareEmail, setShareEmail] = useState('');
    const [shareLink, setShareLink] = useState('');
    const [accessLevel, setAccessLevel] = useState('Editor');
    

    useEffect(() => {
        const fetchFileData = async () => {
          try {
            const response = await axios.get(`http://localhost:8081/api/file/${id}`);
            console.log(response.data);
            const {name, content, email} = response.data.file;
            setFileName(name);
            setUserEmail(email);
            setComponents(content || []);
          } catch (error) {
            console.error("Error while fetching file data:", error);
          }
        };
    
        fetchFileData();
      }, [id]);
    

    const addTextEditor = () => {
        setComponents([...components, {type: 'TextEditor', content: '', id: Date.now()}]);
    };

    const addCodeEditor = () => {
        setComponents([...components, {type: 'CodeEditor', content: '', id: Date.now()}]);
    };

    const handleContentChange = (id, content) => {
      setComponents((prevComponents) =>
          prevComponents.map((component) => component.id === id ? {...component, content} : component
          )
      );
  };
    const onSaveHandler = async () => {
        console.log("saving file")
        try {
          const response = await axios.post("http://localhost:8081/api/file/save", {
            fileId: id,
            content: components
          });
        //   console.log(components[0].content)    
        //   if (response.status === 200) {
            // alert("File content saved successfully!");
        //   }
        } catch (error) {
          console.error("Error saving file content:", error);
          console.log("Failed to save the file content.");
        }
    };

    useEffect(() => {
        if (debounceTimeout) {
          clearTimeout(debounceTimeout);
        }    
        const timeout = setTimeout(() => {
          onSaveHandler();
        }, 1000); 
        setDebounceTimeout(timeout);
        return () => clearTimeout(timeout);
    }, [components]);


    const onShareHandler = () => {
      setShare(true);
    }

    const closeDialog = () => {
      setShare(false);
      setShareEmail('');
      setShareLink('');
    };

    const sendHandler = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post("http://localhost:8081/api/file/share", {
          fileId: id,
          email: shareEmail
        });
        const shareUrl = window.location.href;
        console.log(shareUrl);
        setShareLink(shareUrl);
      } catch (error) {
        console.error("Error sharing file:", error);
      }
    };


    const downloadPDF = () => {
      console.log('pdf downloading')
      const file = new jsPDF();
      file.setFontSize(12);
      let y = 20;
      let textIndex = 0;
      let codeIndex = 0;
      console.log(components);
      components.forEach((component, index) => {
        if(component.type=="TextEditor"){
          textIndex++;
          file.text(`Text Editor ${textIndex} :`, 10, y);
          y += 10;
          const content = component.content.replace(/<\/?[^>]+(>|$)/g, "");
          const lines = file.splitTextToSize(content, 180);
          lines.forEach(line => {
            file.text(line, 20, y);
            y += 5;
          });
        } else if(component.type == "CodeEditor"){
          codeIndex++;
          file.text(`Code Editor ${codeIndex} :`, 10, y);
          y += 10;
          const content = component.content;
          const lines = file.splitTextToSize(content, 180);
          lines.forEach(line => {
            file.text(line, 20, y);
            y += 5;
          })
        }
        y += 10;
        if (y > 280) {
          file.addPage();
          y = 10;
        }
      })
      file.save(`${fileName}.pdf`);
    }


  return (
    <>
        <nav className='navbar'>
            <div className='flex gap-2 items-center'>
                <img src={logo} alt="logo" className='h-6 w-6 rounded-full'/>
                <div className="file-name">{fileName}</div>
            </div>
            <div className="text-code">
                <button className='btn' onClick={addTextEditor}>Text</button>
                <button className='btn' onClick={addCodeEditor}>Code</button>
            </div>
            <div className="save-share" style={{display:"flex"}}>
                <div className="save flex gap-1 items-center" onClick={onSaveHandler}><Save className='h-5 w-5'/> Save</div>
                <div className="share flex gap-1 items-center" onClick={onShareHandler} >Share <Link className='h-5 w-5'/> </div>
                <div className='download flex items-center ml-2 hover:bg-gray-200 rounded-full p-3' onClick={downloadPDF}> <DownloadIcon className='h-5 w-5'/> </div>
            </div>
        </nav>

        
        {share && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[40%] relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Share with others</h3>
              <X 
                className="text-gray-500 hover:text-red-600"
                onClick={closeDialog}
              />
            </div>
            {/* Form */}
            <form >
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Your Email:</label>
                <input
                  type="text"
                  name="input1"
                  value={userEmail}
                  readOnly 
                  className="border border-gray-300 px-4 py-2 rounded w-full focus:outline-none focus:border-blue-600"
                />
              </div>
              {/* <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Send to:</label>
                <input
                  type="email"
                  name="input"
                  value={shareEmail}
                  onChange={(e) => setShareEmail(e.target.value)}
                  className="border border-gray-300 px-4 py-2 rounded w-full focus:outline-none focus:border-blue-600"
                  required
                />
              </div> */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Access Level:</label>
                <select
                  name="accessLevel"
                  value={accessLevel}
                  onChange={(e) => setAccessLevel(e.target.value)}
                  className="border border-gray-300 px-4 py-2 rounded w-full focus:outline-none focus:border-blue-600"
                >
                  <option value="Editor">Editor</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </div>
              <div className="flex justify-end">
                <button type="submit" className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700`} onClick={sendHandler}>
                  Generate Link
                </button>
              </div>
              {shareLink && (
                <div className="mt-4">
                  <p className="text-sm font-semibold">Share this link with others:</p>
                  <a
                    href={shareLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline">
                    {shareLink}
                    </a>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

       <div>
        {components.map((component, index) => {
                    if (component.type === 'TextEditor') {
                      console.log(accessLevel)
                        return (
                            <TextEditor
                                key={component.id}
                                id={index}
                                fileId={id}
                                content={component.content}
                                onChange={(content) => handleContentChange(component.id, content)}
                                accessLevel={accessLevel}
                            />
      
                        );
                    } else if (component.type === 'CodeEditor') {
                        return (
                            <CodeEditor
                                key={component.id}
                                id={index}
                                content={component.content}
                                onChange={(content) => handleContentChange(component.id, content)}
                                accessLevel={accessLevel}
                            />
                        );
                    }
                    return null;
                })}
            </div>
    </>
  )
}

export default Editor