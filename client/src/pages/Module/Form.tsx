import { TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import axios from "axios";
const RESOURCES_URL = "http://localhost:5000/api/module-contents/multimedia";

function Form( {moduleID} : any) {
  const [fileSelected, setFileSelected] = useState('');
  const [resourceName, setResourceName] = useState('');
  const [fileType, setFileType] = useState('');
  const [filePath, setFilePath] = useState('');
  const [filebase64, setFileBase64] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [fileData, setFileData] = useState<{
    type: string;
    dataUrl: string;
    filename: string;
  }>({type: "", dataUrl: "", filename: ""});

  const handleFile = (data: any, fileType: any) => {
    setFileSelected(data);
    setFileType(fileType);
  }

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

        handleFile(files[0], fileType);
    }
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("file", fileSelected);
    formData.append("upload_preset", "fumh00nx"); // cloud name

    if (!resourceName || !fileSelected) {
      setSuccessMessage("Failed to create resource");
      alert("Please enter a resource name and select a file.");
      return;
    } else {
      if(fileType.includes("image")) {
        // currently using cloudinary as cloud based file storage
        axios.post(
          "https://api.cloudinary.com/v1_1/dzi4nszat/image/upload", 
          formData
        ).then((response) => {
          console.log(response);
          setFilePath(response.data.secure_url);
          setSuccessMessage("Successfully created resource!");
        });
      } else if(fileType.includes("video")) {
        axios.post(
          "https://api.cloudinary.com/v1_1/dzi4nszat/video/upload", 
          formData
        ).then((response) => {
          console.log(response.data);
          setFilePath(response.data.secure_url);
          setSuccessMessage("Successfully created resource!");          
        });
      } else if(fileType.includes("pdf")) {
        axios.post(
          "https://api.cloudinary.com/v1_1/dzi4nszat/upload", 
          formData,
          {
            params: {
              resource_type: "auto"
            }
          }
          ).then((response) => {
            console.log(response);
            setFilePath(response.data.secure_url);
            setSuccessMessage("Successfully created resource!");
          });
      } else {
        axios.post(
          "https://api.cloudinary.com/v1_1/dzi4nszat/raw/upload", 
          formData
        ).then((response) => {
          console.log(response.data.secure_url);
          setFilePath(response.data.secure_url);
          setSuccessMessage("Successfully created resource!");
        });      
      }   
  
      try {
        const data = {contentName: resourceName, contentLocation: filePath, mediaType: fileType, moduleID: moduleID};
        console.log(data);
        const res = await axios.post(RESOURCES_URL, data)
      } catch (error) {
        console.log(error);
      }
  
      setResourceName("");
      setFileSelected("");
      setFileBase64("");
      setFilePath("");
      setFileType("");
      setFileData({type: "", dataUrl: "", filename: ""});
    }
  }

  return (
    <div className="border rounded-md p-4 mb-2 max-w-2xl">
      <form onSubmit={handleSubmit}>
        <h1 className="text-4xl mb-6">Create a Resource</h1>
        <TextInput 
          name="resource-name" 
          placeholder="Enter Resource Name" 
          className="mb-4 max-w-xl"
          onChange={e => setResourceName(e.target.value)}
          value={resourceName}
        >
        </TextInput>
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
        <button type="submit" className="bg-violet-900 hover:bg-violet-600 px-4 py-2 text-white rounded-md mt-4">
          Submit
        </button>
        { successMessage && (
            <p className="mt-4">{successMessage}</p>
          )
        }
      </form>
    </div>
  )
}

export default Form;