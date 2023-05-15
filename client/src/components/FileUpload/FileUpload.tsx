import { useState } from "react";

function FileUpload({ onData } : any) {
    const [filebase64, setFileBase64] = useState<string>("");
    const [fileData, setFileData] = useState<{
        type: string;
        dataUrl: string;
        filename: string;
    }>({type: "", dataUrl: "", filename: ""});
   

    const convertFile = (files: FileList|null) => {
        if (files) {
            const fileRef = files[0] || "";
            const fileType: string= fileRef.type || "";
            console.log("This file upload is of type:", fileType);
            const reader = new FileReader();
            reader.readAsBinaryString(fileRef);
            reader.onload=(ev: any) => {
              // convert it to base64
              setFileBase64(`data:${fileType};base64,${btoa(ev.target.result)}`);

              const dataUrl = `data:${fileType};base64,${btoa(ev.target.result)}`;
              setFileData({
                type: fileType,
                dataUrl: dataUrl,
                filename: fileRef.name,
              });
            }

            onData(files[0], fileType);
        }
    }

    return (
        <div>
            <input 
                type="file"
                onChange={(e)=> convertFile(e.target.files)}
                className="border border-7 rounded-md" 
            />
            { filebase64 && 
                <>
                <p className="mb-2 mt-6">File is ready to be submitted!</p>

                {/* if it's an image */ }
                {(filebase64.indexOf("image/") > -1) && 
                    <img src={filebase64} width={500} />
                }

                {/* if it's a video */}
                {(filebase64.indexOf("video/") > -1) &&
                    <video controls width={500}>
                        <source src={filebase64} />
                    </video>
                }
                
                {/* if it's another type of file */}
                {fileData.type.indexOf("image/") === -1 &&
                    fileData.type.indexOf("video/") === -1 && (
                    <a href={fileData.dataUrl} download={fileData.filename} style={{ textDecoration: "underline" }}>
                        {fileData.filename}
                    </a>
                )}
                </>
            }
        </div>
    )
  }
  
  export default FileUpload