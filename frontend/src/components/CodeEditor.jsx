import React, { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import LanguageSelector from './LanguageSelector';
import { CODE_SNIPPETS } from '../constraints';
import '../css/codeEditor.css';
import { io } from 'socket.io-client';
import { executeCode } from '../api/codeEditor';

function CodeEditor({id, content, onChange, accessLevel}) {
  const [socket, setSocket] = useState();
  const [code, setCode] = useState(content || "");
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [isError, setIsError] = useState(false);
  const [showOutput, setShowOutput] = useState(false);

  useEffect(() => {
    const s = io('http://localhost:3001');
    setSocket(s);

    s.emit('join-room', id);

    s.on('receive-code-change', ({fileId, value}) => {
      if(fileId === id){
        setCode(value);
      }
    });

    s.on('receive-language-change', ({fileId, lang}) => {
      if(fileId === id){
        setLanguage(lang);
      }
    });
    
    return () => {
      s.disconnect();
    };
  }, [id]);

  const handleLanguageChange = (lang) => {
    if(accessLevel !== "Editor") return
    setLanguage(lang);
    if(socket){
        socket.emit('language-change', {fileId: id, lang});
        setCode(CODE_SNIPPETS[lang]);
        socket.emit('code-change', {fileId: id, value: CODE_SNIPPETS[lang]});
    }
  };

  const handleCodeChange = (value) => {
    if(accessLevel !== "Editor") return
    setCode(value);
    onChange(value);
    if(socket){
        socket.emit('code-change', {fileId: id, value});
    }
  };

  const runCode = async() => {
    if(!code) return;
    setShowOutput(true);
    try{
      const res = await executeCode(language, code);
      console.log(res)
      const out = res.run.output;
      res.run.stderr ? setIsError(true) : setIsError(false);
      setOutput(out);
    }
    catch(error){
      setOutput("Error in executing code!")
      setIsError(true)
      console.log(error)
    }
  }

  return (
    <div className='code-editor'>
      <div className='container'>
        {(accessLevel === "Editor") && (
          <LanguageSelector language={language} onSelect={handleLanguageChange} />
        )}
        <div className="code">
          <Editor
            height="50vh"
            width="50vw"
            theme="vs-dark"
            language={language}
            defaultValue='//some comment' 
            value={code}
            onChange={handleCodeChange}
            options={{readOnly: accessLevel==="Viewer"}}
          />
        </div>
        {accessLevel === "Editor" && (
          <button className='run-code' onClick={runCode}>Run Code</button>
        )}
        {showOutput && (
          <div>
            <h3 style={{marginTop:'8px'}}>Output:</h3>
            <div className="output-section" style={{ 
              height: '50vh',
              width: '50vw',
              backgroundColor: '#1e1e1e', 
              color: isError ? 'red' : 'white', 
              padding: '10px',
              overflow: 'auto'
            }}>
              <pre>{output}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CodeEditor;