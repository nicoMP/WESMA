import AdminPage from "./AdminPage";
import DeleteIcon from "@material-ui/icons/Delete";
import { useEffect, useState } from "react";
import { TextInput } from "flowbite-react";
import UtilBar from "../../components/UtilBar/UtilBar";
import CoreUtilBar from "../../components/CoreUtilBar/CoreUtilBar";
import { IDefaultPage, IGenericLink } from "../../types";
import { connect } from 'react-redux';
import { Link, Routes, Route } from "react-router-dom";
import axios from "axios";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import authService from "../../services/auth.service";
import setAuthToken from '../../utils/setAuthToken';

const MODULES_URL = "http://localhost:5000/api/modules/";

interface Module {
  moduleid: string;
  modulename: string;
}

function AdminModules({ auth }, { children, name }: IDefaultPage) {
  const [instructorID, setInstructorID] = useState<string>("");
  const [modules, setModules] = useState<Module[]>([]);
  const [moduleName, setModuleName] = useState<string>("");
  const [moduleDescription, setModuleDescription] = useState<string>("");
  const [moduleProgress, setModuleProgress] = useState<number>();
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [selectedModuleId, setSelectedModuleId] = useState("");
  const [open, setOpen] = useState(false);

   const handleClickOpen = () => {
    setOpen(true);
   };

   const handleClose = () => {
    setOpen(false);
   };

   const handleDelete = () => {
    deleteModule(selectedModuleId);
    setOpen(false);
   }; 

   const getModules = async () => {
    try {
      if(localStorage.token) {
        setAuthToken(localStorage.token)
      }
      const response = await axios.get(MODULES_URL + `instructor`); 
      const modulesArray = response.data as Module[];
      setModules(modulesArray);
    } catch (err : any) {
      console.error(err.message);
    }
  }

  const deleteModule = async (moduleID : string) => {
    try {
      const response = await axios.delete(MODULES_URL + `${moduleID}`).then(() => alert("Module Deleted"));
    } catch (err: any) {
      console.error(err.message);
    }
  }

  const getInstructor = async () => {
    if(auth?.user?.id) {
      setInstructorID(auth.user.id);
    }
  } 

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if ((!moduleName || !moduleDescription || !moduleProgress || !instructorID) || moduleProgress < 0 || moduleProgress > 100) {
      setSuccessMessage("Failed to create module");
      alert("Missing fields or invalid values");
      return;
    } else {
      try {
        const response = await axios.post(MODULES_URL, {
          moduleName: moduleName,
          moduleDesc: moduleDescription,
          modulePassingGrade: moduleProgress,
          instructorID: instructorID
      });
        console.log(response.data);
        setSuccessMessage("Successfully created module");
        setModuleName("");
        setModuleDescription("");
        setModuleProgress(undefined);
        (document.getElementsByName("module-progress")[0] as HTMLSelectElement).selectedIndex = 0;
      } catch (err : any) {
        console.error(err.message);
      }
    }
  }

  useEffect(() => {
    getInstructor();
    getModules();
  }, []);

  return (
    <div>
      <div className="flex">
        <CoreUtilBar/>
      </div>
      <div className="flex-1">
        <UtilBar instructorID={instructorID} />
        <div className="ml-2">
          <h1 className="text-4xl my-4 mb-10">Modules</h1>
          <div className="border border-4 border-grey-200 rounded-md p-4 mb-2 max-w-3xl">
            <form onSubmit={handleSubmit}>
              <h1 className="text-3xl mb-6">Create a Module</h1>
              <TextInput 
                name="module-name" 
                placeholder="Enter Module Name" 
                className="mb-4 w-full focus:border-black"
                onChange={e => setModuleName(e.target.value)}
                value={moduleName} 
                required
              >
              </TextInput>
              <textarea 
                name="module-desc" 
                placeholder="Enter Module Description"
                className="w-full resize-none mb-4 rounded-md border-gray-300 focus:border-black"
                rows={4}
                onChange={e => setModuleDescription(e.target.value)}
                value={moduleDescription}
                required
              >
              </textarea>
              <input className="mb-4 w-full focus:border-black" type="number" onChange={e => setModuleProgress(e.target.value)}/>
              <TextInput 
                name="instructor-id"
                readOnly 
                className="mb-4 w-full"
                value={`InstructorID : ${instructorID}`}
              >
              </TextInput>
              <button type="submit" className="bg-violet-900 hover:bg-violet-600 px-4 py-2 text-white rounded-md mt-4">
                Submit
              </button>
              { successMessage && (
                  <p className="mt-4">{successMessage}</p>
                )
              }
            </form>
          </div>
          <div className="border border-4 border-grey-200 rounded-md p-4 mt-20 max-w-3xl">
            <h1 className="text-3xl mb-6">Delete a Module</h1>
            <label htmlFor="module-dropdown">Select a Module to Delete:</label>
            <select
              id="module-dropdown"
              className="mb-6 mt-4 w-full rounded-md border-gray-300 focus:border-black"
              value={selectedModuleId}
              onChange={(e) => setSelectedModuleId(e.target.value)}
            >
              <option value="">Select a Module</option>
              {modules.map((module) => (
                <option key={module.moduleid} value={module.moduleid}>
                  {module.modulename}
                </option>
              ))}
            </select>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleClickOpen}
              disabled={!selectedModuleId}
              >
              <DeleteIcon /> Delete Module
            </Button>
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {"Are you sure you want to delete this module?"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  This action cannot be undone.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Cancel
                </Button>
                <Button onClick={handleDelete} color="secondary" autoFocus>
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(AdminModules);
