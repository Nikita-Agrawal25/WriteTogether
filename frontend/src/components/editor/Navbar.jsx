import React from 'react'

function Navbar() {

    const addTextEditor = () => {
        setComponents([...components, {type: 'TextEditor', content: '', id: Date.now()}]);
    };

    const addCodeEditor = () => {
        setComponents([...components, {type: 'CodeEditor', content: '', id: Date.now()}]);
    };

    const onSaveHandler = async () => {
        console.log("saving file")
        try {
          const response = await axios.post("http://localhost:8081/api/file/save", {
            fileId: id,
            content: components
          });
        } catch (error) {
          console.error("Error saving file content:", error);
          console.log("Failed to save the file content.");
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
    <div>
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
    </div>
  )
}

export default Navbar