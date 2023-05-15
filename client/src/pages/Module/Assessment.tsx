import ModulePage from "./ModulePage"
import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import Sidebar from "../../components/Sidebar/Sidebar";
import UtilBar from "../../components/UtilBar/UtilBar";
import { useParams } from "react-router-dom";
import axios from "axios";
const ASSESSMENT_BASE_URL = "http://localhost:5000/api/module-contents";

interface Module {
  moduleid: string;
  modulename: string;
}

function Assessment() {
  const { moduleid } = useParams();
  const [moduleName, setModuleName] = useState<string>("");
  let [assessments, setAssessments] = useState([]);

  const getAssessments = async () => {
    try {
      const response = await axios.get(ASSESSMENT_BASE_URL + "/student/quiz/" + moduleid);
      setAssessments(response.data);
    } catch (err) {
      console.error(err.message);      
    }
  }
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

  useEffect(() => {
    getAssessments();
    getModuleName();
  }, []);

  return (
    <div className="">
      <div className="flex">
        <Sidebar sideLinks={defaultSideLinks} />
        <div className="flex-1">
          <UtilBar student={true} />
          <div className="ml-2">
            <h1 className="text-3xl my-4">Module {moduleName}</h1>
              <table className="table-auto border border-collapse">
                <tbody>
                  <tr>
                    <th className="border px-4 py-2">
                      Assessment Name
                    </th>
                  </tr>
                  {
                    assessments.map(assessment => (
                      <tr key={assessment.contentid}>
                        <td className="border px-4 py-2">
                          <Link to={assessment.contentid.toString()}>
                            <p className="text-blue-600">{assessment.contentname}</p>
                          </Link>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Assessment