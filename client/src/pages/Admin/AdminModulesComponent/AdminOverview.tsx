import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { IOverviewData } from "../../../types";
import AdminPage from "../AdminPage";
import Sidebar from "../../../components/Sidebar/Sidebar";
import UtilBar from "../../../components/UtilBar/UtilBar";
import CoreUtilBar from "../../../components/CoreUtilBar/CoreUtilBar";
import axios from "axios";
import authService from "../../../services/auth.service";
import { connect } from 'react-redux';

interface Module {
  moduleid: string;
  modulename: string;
}

function AdminOverview({ auth }) {
  const [instructorID, setInstructorID] = useState<string>("");
  const { moduleid } = useParams();
  const [moduleName, setModuleName] = useState<string>("");

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

  const [pageState, setPageState] = useState<IOverviewData>({
    instructor: "Instructor Name",
    exercises: [
      {
        name: "Exercise 1",
        description: "exercise 1 description",
        skills: [
          {
            name: "Skill 1",
            description: "This is a skill description",
          },
          {
            name: "Skill 2",
            description: "This is a skill description",
          },
          {
            name: "Skill 3",
            description: "This is a skill description",
          },
        ],
      },
      {
        name: "Exercise 2",
        description: "exercise 1 description",
        skills: [
          {
            name: "Skill 1",
            description: "This is a skill description",
          },
        ],
      },
    ],
    assessments: [
      {
        name: "Assessment 1",
        link: "/assessment",
      },
      {
        name: "Assessment 2",
        link: "/assessment",
      },
    ],
  });

  useEffect(() => {
    getInstructor();
    getModuleName();
  }, []);

  const { instructor, exercises, assessments } = pageState;

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
            <div className="">
              <h1 className=" mb-8 text-lg">
                Instructor:
                <span className="ml-4">{instructor}</span>
              </h1>

              <h1 className="text-lg mb-4">Exercises:</h1>
              {exercises.map((exer, i) => (
                <div className="border rounded-md p-4 mb-2 max-w-7xl" key={i}>
                  <h1 className="">{exer.name}</h1>
                  <p className="text-sm mb-4 font-thin">{exer.description}</p>

                  <h1 className="">Skills:</h1>
                  {exer.skills.map((skill, i) => (
                    <p key={i} className="font-thin text-sm my-1">
                      {skill.name} - {skill.description}
                    </p>
                  ))}
                </div>
              ))}

              <div className="text-lg my-4">Assessments:</div>
              {assessments.map((ass, i) => (
                <Link key={i} to={ass.link}>
                  <div className="border rounded-md p-4 mb-2 max-w-7xl hover:bg-gray-100 cursor-pointer">
                    <h1>{ass.name}</h1>
                  </div>
                </Link>
              ))}
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

export default connect(mapStateToProps)(AdminOverview);
