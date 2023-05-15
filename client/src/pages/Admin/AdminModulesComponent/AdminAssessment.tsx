import AdminModules from "../AdminModules";
import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import { useParams } from 'react-router-dom';
import AdminPage from "../AdminPage";
import UtilBar from "../../../components/UtilBar/UtilBar";
import Sidebar from "../../../components/Sidebar/Sidebar";
import CoreUtilBar from "../../../components/CoreUtilBar/CoreUtilBar";
import axios from "axios";
import authService from "../../../services/auth.service";
import { connect } from 'react-redux';
const ASSESSMENT_BASE_URL = "http://localhost:5000/api/module-contents";

interface Module {
  moduleid: string;
  modulename: string;
}

function AdminAssessment({ auth }) {
  const [instructorID, setInstructorID] = useState<string>("");
  const { moduleid } = useParams();
  const [moduleName, setModuleName] = useState<string>("");
  let [assessments, setAssessments] = useState([]);

  const getInstructor = async () => {
    if(auth?.user?.id) {
      setInstructorID(auth.user.id);
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
      { name: "Overview", link: `${moduleid}/overview`, view: "admin/modules" },
      { name: "Resources", link: `${moduleid}/resources`, view: "admin/modules" },
      { name: "Assessments", link: `${moduleid}/assessments`, view: "admin/modules" },
      { name: "Grades", link: `${moduleid}/grades`, view: "admin/modules" },
  ];

  const getAssessments = async () => {
    try {
      const response = await axios.get(ASSESSMENT_BASE_URL + "/instructor/quiz/" + moduleid);
      setAssessments(response.data);
    } catch (err) {
      console.error(err.message);      
    }
  }

  useEffect(() => {
    getInstructor();
    getModuleName();
    getAssessments();
  }, []);

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
                      <td className="border px-4 py-2">{assessment.contentname}</td>
                      <td className="border px-4 py-2">
                        <Link to={"/admin/modules/" + moduleid + "/AdminQuizManagement/" + "edit/" + assessment.contentid.toString()}>
                          <EditIcon></EditIcon>
                        </Link>
                      </td>
                    </tr>
                  ))
                }
                <tr>
                  <td className="border px-4 py-2">
                    <Link to={"/admin/modules/" + moduleid + "/AdminQuizManagement/"  + "add/new"}>
                        <AddIcon></AddIcon>
                        Add New Assessment
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(AdminAssessment);
