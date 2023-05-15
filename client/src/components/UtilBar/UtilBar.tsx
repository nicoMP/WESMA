import { IUtilbar } from "../../types";
import { IGenericLink } from "../../types";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { connect } from 'react-redux';
import setAuthToken from '../../utils/setAuthToken';

const MODULES_URL = "http://localhost:5000/api/modules";
const MODULES_INSTRUCTOR_URL = "http://localhost:5000/api/modules/instructor";

interface Module {
  moduleid: string;
  modulename: string;
}

interface UtilBarProps {
  links?: IGenericLink[];
}

function UtilBar({ auth }, { links }: UtilBarProps) {
  const [instructorID, setInstructorID] = useState<string>("");
  const [utilLinks, setUtilLinks] = useState<IGenericLink[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [allModules, setAllModules] = useState<Module[]>([]);
  const [studentUtilLinks, setStudentUtilLinks] = useState<IGenericLink[]>([]);

  const getInstructor = async () => {
    if(auth?.user?.id) {
      setInstructorID(auth.user.id);
    }
  } 

  const getModules = async () => {
    try {
      await axios.get(MODULES_URL).then(response => {
        let modulesList = [] as IGenericLink[];
        if (response.data !== null) {  
          if(auth?.user?.isInstructor) {
            response.data.map((m) => {
              modulesList.push({ name: `Module : ${m.modulename}`, link: m.moduleid, view: "admin/modules" });
            })
          } else {
            response.data.map((m) => {
              modulesList.push({ name: `Module : ${m.modulename}`, link: m.moduleid, view: "module" });
            })
          }
          
        }
        setUtilLinks(modulesList);
      }); 
    } catch (err : any) {
      console.error(err.message);
    }
  }

  useEffect(() => {
    getInstructor();
    getModules();
  }, []);

  return (
    <div className="bg-gray-900 border-b border-gray-900 w-full py-1 px-2">
      <div className="flex">  
        {utilLinks.map((link, i) => (
            <Link key={i} to={`/${link.view}/${link.link}`}>
            <div className="text-gray-200 mr-4 hover: underline text-sm">{link.name}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(UtilBar);
