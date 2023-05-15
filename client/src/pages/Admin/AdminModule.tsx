import AdminPage from "./AdminPage";
import { useParams } from 'react-router-dom';
import { useEffect, useState } from "react";
import axios from "axios";
import UtilBar from "../../components/UtilBar/UtilBar";
import Sidebar from "../../components/Sidebar/Sidebar";
import CoreUtilBar from "../../components/CoreUtilBar/CoreUtilBar";
import authService from "../../services/auth.service";
import { connect } from 'react-redux';

interface Module {
  modulename: string;
  moduledescription: string;
  modulepassinggrade: string;
}

function AdminModule({ auth }) {
  const [instructorID, setInstructorID] = useState<string>("");
  const { moduleid } = useParams();
  const [moduleName, setModuleName] = useState("");
  const [moduleDesc, setModuleDesc] = useState("");
  const [modulePass, setModulePass] = useState("");
  const MODULE_URL = `http://localhost:5000/api/modules/${moduleid}`;


  const getInstructor = async () => {
    if(auth?.user?.id) {
      setInstructorID(auth.user.id);
    }
  } 

  const defaultSideLinks = [
      { name: "Overview", link: `${moduleid}/overview`, view: "admin/modules" },
      { name: "Resources", link: `${moduleid}/resources`, view: "admin/modules" },
      { name: "Assessments", link: `${moduleid}/assessments`, view: "admin/modules" },
      { name: "Grades", link: `${moduleid}/grades`, view: "admin/modules" },
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
    getInstructor();
    getModuleInfo();
  }, [getModuleInfo]);

  return (
    <div className="">
      <div className="flex">
        <CoreUtilBar/>
      </div>
      <div className="flex">
        <Sidebar sideLinks={defaultSideLinks} />
        <div className="flex-1">
          <UtilBar instructorID={instructorID} />
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

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(AdminModule);

