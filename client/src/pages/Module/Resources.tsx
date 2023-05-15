import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import UtilBar from "../../components/UtilBar/UtilBar";
import { Link, useParams } from "react-router-dom";
import { CircularProgress } from '@material-ui/core';
import Item from "./Item";
import axios from "axios";
const URL = "http://localhost:5000/api/module-contents/multimedia";

interface Module {
  moduleid: string;
  modulename: string;
}

interface Resource {
  contentid: string,
  contentname: string,
  contentlocation: string,
  mediatype: string,
  moduleid: string
}

function Resources() {
  const { moduleid } = useParams();
  const [items, setItems] = useState<Resource[]>([]);
  const [moduleName, setModuleName] = useState<string>("");

  const getModuleName = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/modules/" + `${moduleid}`); 
      const modulesArray = response.data as Module[];
      setModuleName(modulesArray[0].modulename);
    } catch (err : any) {
      console.error(err.message);
    }
  }

  const defaultSideLinks = [
    { name: "Overview", link: `${moduleid}/overview`, view: "module" },
    { name: "Resources", link: `${moduleid}/resources`, view: "module" },
    { name: "Assessments", link: `${moduleid}/assessments`, view: "module" },
    { name: "Grades", link: `${moduleid}/grades`, view: "module" },
  ];
 
  const getItems = async () => {
    try {
      const response = await axios.get(URL + `/${moduleid}`);
      setItems(response.data);
    } catch (error : any) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    getModuleName();
    getItems();
  }, []);

  return (
    <div className="">
      <div className="flex">
        <Sidebar sideLinks={defaultSideLinks} />
        <div className="flex-1">
          <UtilBar student={true} />
          <div className="ml-2">
            <h1 className="text-3xl my-4">Module {moduleName}</h1>
            <div className="border rounded-md p-4 mb-2 mt-10 max-w-2xl">
              <h1 className="text-4xl mb-6">Available Resources</h1>
              <div className="grid grid-cols-1 gap-4 mt-10">
              {items.length > 0 ? 
                items.map((i) => (
                  <Item item={i} />
                )) : <CircularProgress />
              }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Resources;