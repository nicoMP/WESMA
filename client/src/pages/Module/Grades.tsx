import ModulePage from "./ModulePage"
import React, { useEffect, useState } from 'react';
import Sidebar from "../../components/Sidebar/Sidebar";
import UtilBar from "../../components/UtilBar/UtilBar";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { connect } from 'react-redux';
const ATTEMPTS_BASE_URL = "http://localhost:5000/api/quiz-management";

interface Module {
  moduleid: string;
  modulename: string;
}

function Grades({ auth }) {
  const { moduleid } = useParams();
  const [moduleName, setModuleName] = useState<string>("");  
  let [attempts, setAttempts] = useState([]);
  const [studentID, setStudentID] = useState<string>("");

  const getAttempts = async () => {
    try {
      if(studentID.length > 0) {
        const response = await axios.get(ATTEMPTS_BASE_URL + "/student-attempts",  { params: { modID: moduleid, studentID: studentID } });
        setAttempts(response.data);
      }
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
      minute: "2-digit"
    });
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
  
  const getStudent = async () => {
    if(auth?.user?.id) {
      setStudentID(auth.user.id);
    }
  } 

  const defaultSideLinks = [
    { name: "Overview", link: `${moduleid}/overview`, view: "module" },
    { name: "Resources", link: `${moduleid}/resources`, view: "module" },
    { name: "Assessments", link: `${moduleid}/assessments`, view: "module" },
    { name: "Grades", link: `${moduleid}/grades`, view: "module" },
  ];

  useEffect(() => {
    getStudent();
    getAttempts();
    getModuleName();
  }, [studentID]);

  return (
    <div className="">
      <div className="flex">
        <Sidebar sideLinks={defaultSideLinks} />
        <div className="flex-1">
          <UtilBar student={true} />
          <div className="ml-2">
            <h1 className="text-3xl my-4">Module {moduleName}</h1>
            <table className="table-auto border border-collapse">
              <thead>
                <tr>
                  <th className="border px-4 py-2">Assessment Name</th>
                  <th className="border px-4 py-2">Grade</th>
                  <th className="border px-4 py-2">Compeleted On</th>
                </tr>
              </thead>
              <tbody>
                {
                  attempts.map((attempt, i) => (
                    <tr key={i}>
                      <td className="border px-4 py-2 text-sm">{attempt.contentname}</td>
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
  )
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(Grades);