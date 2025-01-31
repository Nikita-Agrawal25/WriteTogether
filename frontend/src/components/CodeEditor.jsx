import React, { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import LanguageSelector from './LanguageSelector';
import '../css/codeEditor.css';
import { io } from 'socket.io-client';

function CodeEditor({content, onChange, accessLevel}) {
  const [socket, setSocket] = useState();
  const [code, setCode] = useState(content || "");
  const [language, setLanguage] = useState("javascript");

  useEffect(() => {
    const s = io('http://localhost:3001');
    setSocket(s);
    s.on('receive-code-change', (data) => {
      setCode(data);
    });
    s.on('receive-language-change', (data) => {
      setLanguage(data);
    });
    return () => {
      s.disconnect();
    };
  }, []);

  const handleLanguageChange = (lang) => {
    if(accessLevel !== "Editor") return
    setLanguage(lang);
    socket.emit('language-change', lang);
  };

  const handleCodeChange = (value) => {
    if(accessLevel !== "Editor") return
    setCode(value);
    onChange(value);
    socket.emit('code-change', value);
  };

  return (
    <div className='code-editor'>
      <div className='container'>
        {(accessLevel === "Editor") && (
          <LanguageSelector language={language} onSelect={handleLanguageChange} />
        )}
        <Editor
          height="50vh"
          width="50vw"
          theme="vs-dark"
          language={language}
          defaultValue='console.log("Hello World");' 
          value={code}
          onChange={handleCodeChange}
          options={{readOnly: accessLevel==="Viewer"}}
        />
      </div>
    </div>
  );
}

export default CodeEditor;
