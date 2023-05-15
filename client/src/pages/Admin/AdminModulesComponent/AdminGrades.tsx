import AdminModules from "../AdminModules";
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AdminPage from "../AdminPage";
import UtilBar from "../../../components/UtilBar/UtilBar";
import Sidebar from "../../../components/Sidebar/Sidebar";
import CoreUtilBar from "../../../components/CoreUtilBar/CoreUtilBar";
import axios from "axios";
import { connect } from 'react-redux';
import authService from "../../../services/auth.service";
const ATTEMPTS_BASE_URL = "http://localhost:5000/api/quiz-management";

interface Module {
  moduleid: string;
  modulename: string;
}

function AdminGrades({ auth }) {
  let [attempts, setAttempts] = useState([]);
  const [instructorID, setInstructorID] = useState<string>("");
  const { moduleid } = useParams();
  const [moduleName, setModuleName] = useState<string>("");

  const getAttempts = async () => {
    try {
      const response = await axios.get(ATTEMPTS_BASE_URL + "/attempts/module",  { params: { modID: moduleid } });
      setAttempts(response.data);
    } catch (err) {
      console.error(err.message);      
    }
  }

  function getDate(ms) {
    let newDate = new Date(ms);
    let estTimezoneOffset = -300;
    newDate.setTime(newDate.getTime() + estTimezoneOffset * 60000);
    return newDate.toLocaleString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }
  
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

  useEffect(() => {
    getInstructor();
    getAttempts();
    getModuleName();
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
              <thead>
                <tr>
                  <th className="border px-4 py-2">Assessment Name</th>
                  <th className="border px-4 py-2">Student Name</th>
                  <th className="border px-4 py-2">Student Number</th>
                  <th className="border px-4 py-2">Grade</th>
                  <th className="border px-4 py-2">Compeleted On</th>
                </tr>
              </thead>
              <tbody>
                {
                  attempts.map((attempt, i) => (
                    <tr key={i}>
                      <td className="border px-4 py-2 text-sm">{attempt.contentname}</td>
                      <td className="border px-4 py-2 text-sm">{attempt.studentname}</td>
                      <td className="border px-4 py-2 text-sm">{attempt.studentnumber}</td>
                      <td className="border px-4 py-2 text-sm">{attempt.grade}%</td>
                      <td className="border px-4 py-2 text-sm">{getDate(Date.parse(attempt.attemptdate))}</td>
                    </tr>
                  ))
                }
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

export default connect(mapStateToProps)(AdminGrades);
