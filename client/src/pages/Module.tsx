import Sidebar from "../components/Sidebar/Sidebar";
import UtilBar from "../components/UtilBar/UtilBar";
import { useParams } from 'react-router-dom';
import axios from "axios";
import { useEffect, useState } from "react";

interface Module {
  modulename: string;
  moduledescription: string;
  modulepassinggrade: string;
}

function Module() {
  const { moduleid } = useParams();
  const [moduleName, setModuleName] = useState("");
  const [moduleDesc, setModuleDesc] = useState("");
  const [modulePass, setModulePass] = useState("");
  const MODULE_URL = `http://localhost:5000/api/modules/${moduleid}`;


  const defaultSideLinks = [
    { name: "Overview", link: `${moduleid}/overview`, view: "module" },
    { name: "Resources", link: `${moduleid}/resources`, view: "module" },
    { name: "Assessments", link: `${moduleid}/assessments`, view: "module" },
    { name: "Grades", link: `${moduleid}/grades`, view: "module" },
  ];

  const getModuleInfo = async () => {
    try {
      const response = await axios.get(MODULE_URL); 
      const modulesArray = response.data as Module[];
        
      setModuleName(modulesArray[0].modulename);
      setModuleDesc(modulesArray[0].moduledescription);
      setModulePass(modulesArray[0].modulepassinggrade);
      
    } catch (err : any) {
      console.error(err.message);
    }
  }

  useEffect(() => {
    getModuleInfo();
  }, [getModuleInfo]);

  return (
    <div className="">
    <div className="flex">
      <Sidebar sideLinks={defaultSideLinks} />
      <div className="flex-1">
        <UtilBar student={true} />
        <div className="ml-2">
          <h1 className="text-3xl my-4">Module : {moduleName}</h1>
        </div>
        <h1 className="mb-4 text-lg ml-5">Description:</h1>
        <p className="text-sm mb-4 font-thin ml-5">{moduleDesc}</p>
        <h1 className="mb-4 text-lg ml-5">Passing Grade: {modulePass}</h1>
      </div>
    </div>
  </div>
  )
}

export default Module;