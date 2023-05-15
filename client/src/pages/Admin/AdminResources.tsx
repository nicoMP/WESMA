import { useState, useEffect } from "react";
import AdminPage from "./AdminPage";
import AdminItem from "./AdminModulesComponent/AdminItem";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import { IGenericLink } from "../../types";
import authService from "../../services/auth.service";
import { connect } from 'react-redux';
import UtilBar from "../../components/UtilBar/UtilBar";
import CoreUtilBar from "../../components/CoreUtilBar/CoreUtilBar";

const MODULES_INSTRUCTOR_URL = "http://localhost:5000/api/modules/instructor";
const RESOURCES_URL = "http://localhost:5000/api/module-contents/multimedia";

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
 
function AdminResourcesGeneral({ auth }) {
  const [instructorID, setInstructorID] = useState<string>("");
  const [modules, setModules] = useState<Module[]>([]);
  const [items, setItems] = useState<Resource[]>([]);

  const getInstructor = async () => {
    if(auth?.user?.id) {
      setInstructorID(auth.user.id);
    }
  } 

  const getModules = async () => {
    try {
      const response = await axios.get(MODULES_INSTRUCTOR_URL + `/${instructorID}`); 
      const modulesArray = response.data as Module[];
      setModules(modulesArray);

      let modulesList = [] as IGenericLink[];

      if (modules !== null) {  
        modules.map((m) => {
          modulesList.push({ name: `Module ${m.moduleid} : ${m.modulename}`, link: m.moduleid, view: "admin/modules" });
        })
      }
    } catch (err : any) {
      console.error(err.message);
    }
  }

  const getResources = async () => {
    try {
      let combinedItems = [] as Resource[];
      for (const module of modules) {
        const response = await axios.get(RESOURCES_URL + `/${module.moduleid}`);
        combinedItems = [...combinedItems, ...response.data];
      }
      setItems(combinedItems);
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

  useEffect(() => {
    getInstructor();
    getModules();
    getResources();
  }, []);

  return (
    <div className="">
      <div className="flex">
        <CoreUtilBar/>
      </div>
      <div className="flex-1">
        <div className="border rounded-md p-4 mb-2 mt-10 max-w-2xl">
          <h1 className="text-4xl mb-6">All Available Resources</h1>
          <div className="grid grid-cols-1 gap-4 mt-10">
            {items.length > 0 ?  
              items.map((i) => (
                <AdminItem item={i} deleteItem={deleteItem}/>
              )) : <CircularProgress /> 
            }
          </div>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(AdminResourcesGeneral);
