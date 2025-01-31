import "../css/textEditor.css"
import {useCallback, useEffect, useState} from 'react'
import hljs from 'highlight.js'
import 'highlight.js/styles/default.css';
import Quill from 'quill'
import "quill/dist/quill.snow.css" 
import {io} from 'socket.io-client';

window.hljs = hljs;

function TextEditor({id, content, onChange, accessLevel}) {
    const [socket, setSocket] = useState()
    const [quill, setQuill] = useState()
    // console.log(accessLevel);
    useEffect(() => {
        const s = io('http://localhost:3001');
        s.emit('join-file', id);
        setSocket(s);
        return () => {
            s.disconnect()
        }
    }, [])

    useEffect(() => {
        if(socket == null || quill == null) return;
        const handler = delta => {
            quill.updateContents(delta)
        };
        socket.on(`receive-changes`, handler);

        return () => {
            socket.off(`receive-changes`, handler)
        }
    }, [socket, quill])

    useEffect(() => {
        if(socket == null || quill == null || accessLevel !== "Editor") return;
        
        const handler = (delta, oldDelta, source) => {
            if(source !== 'user') return;
            socket.emit('send-changes', {id, delta});
        }
        quill.on('text-change', handler);

        return () => {
            quill.off('text-change', handler)
        }
    }, [socket, quill, accessLevel])

    const wrapperRef = useCallback((wrapper) => {
        if (wrapper == null) return
        wrapper.innerHTML = ""
        const editor = document.createElement("div")
        wrapper.append(editor)
        const q = new Quill(editor, { 
            theme: "snow",
            modules: {
                syntax:{
                    hljs
                },
                toolbar: (accessLevel === "Editor") ? [
                    [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
                    [{size: []}],
                    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                    [{'list': 'ordered'}, {'list': 'bullet'}, 
                     {'indent': '-1'}, {'indent': '+1'}],
                    ['link', 'image', 'video'],
                    ['clean'],
                ] : false,
            },
            readOnly : accessLevel === "Viewer"
        })
        q.on("text-change", () => {
            if(accessLevel === "Editor")
                onChange(q.root.innerHTML); 
        });
        if(content){
            q.root.innerHTML = content;
        }
        setQuill(q);
    }, [accessLevel])

    return (
        <div id="container" ref={wrapperRef}></div>
    )
}

export default TextEditor



