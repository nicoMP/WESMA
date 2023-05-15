import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { CircularProgress } from '@material-ui/core'; 
import AdminModules from "../AdminModules";
import AdminPage from "../AdminPage";
import UtilBar from "../../../components/UtilBar/UtilBar";
import Sidebar from "../../../components/Sidebar/Sidebar";
import CoreUtilBar from "../../../components/CoreUtilBar/CoreUtilBar";
import Form from "../../Module/Form";
import AdminItem from "./AdminItem";
import axios from "axios";
import authService from "../../../services/auth.service";
import { connect } from 'react-redux';
const RESOURCES_URL = "http://localhost:5000/api/module-contents/multimedia";
const MODULES_URL = "http://localhost:5000/api/modules";

interface Resource {
  contentid: string,
  contentname: string,
  contentlocation: string,
  mediatype: string,
  moduleid: string
}

interface Module {
  moduleid: string;
  modulename: string;
}

function AdminResources({ auth }) {
  const [items, setItems] = useState<Resource[]>([]);
  const [instructorID, setInstructorID] = useState<string>("");
  const { moduleid } = useParams();
  const [moduleName, setModuleName] = useState<string>("");

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

  const getItems = async () => {
    try {
      const response = await axios.get(RESOURCES_URL + `/${moduleid}`);
      setItems(response.data);
      
    } catch (error : any) {
      console.log(error.message);
    }
  }

  const deleteItem = async (id: any) => {
    try {
      const response = await axios.delete(RESOURCES_URL + `/${id}`);
      console.log(response.data);
      setItems(items.filter(i => i.contentid !== id));
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const getModuleName = async () => {
    try {
      const response = await axios.get(MODULES_URL + `/${moduleid}`); 
      const modulesArray = response.data as Module[];
      setModuleName(modulesArray[0].modulename);
    } catch (err : any) {
      console.error(err.message);
    }
  }

  useEffect(() => {
    getInstructor();
    getModuleName();
    getItems();
  }, [deleteItem]);

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
            <h1 className="text-3xl my-4">Module {moduleName}</h1>
            <Form moduleID={moduleid}/>
            <div className="border rounded-md p-4 mb-2 mt-10 max-w-2xl">
              <h1 className="text-4xl mb-6">Available Resources</h1>
              <div className="grid grid-cols-1 gap-4 mt-10">
                {items.length > 0 ?  
                  items.map((i) => (
                    <AdminItem item={i} deleteItem={deleteItem} />
                  )) : <CircularProgress /> 
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>  
  );
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(AdminResources);
