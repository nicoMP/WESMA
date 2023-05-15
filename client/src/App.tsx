//Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
// import Skills from "./pages/Skills";
import StudentTracking from "./pages/StudentTracking";
import Module from "./pages/Module";
import Overview from "./pages/Module/Overview";
import AssessmentCompletion from "./pages/Module/AssessmentCompletion";
import Assessment from "./pages/Module/Assessment";
import Grades from "./pages/Module/Grades";
import Resources from "./pages/Module/Resources";
import TrainingSessions from "./pages/TrainingSessions";

import Admin from "./pages/Admin";
import Exercises from "./pages/Admin/Exercises";
import Skills from "./pages/Admin/Skills";
import AdminModules from "./pages/Admin/AdminModules";
import AdminModule from "./pages/Admin/AdminModule";
import AdminAssessment from "./pages/Admin/AdminModulesComponent/AdminAssessment";
import AdminOverview from "./pages/Admin/AdminModulesComponent/AdminOverview";
import AdminResources from "./pages/Admin/AdminModulesComponent/AdminResources";
import AdminGrades from "./pages/Admin/AdminModulesComponent/AdminGrades";
import AdminQuizManagement from "./pages/Admin/AdminModulesComponent/AdminQuizManagement";
import AdminResourcesGeneral from "./pages/Admin/AdminResources";
import TrainingLevels from "./pages/Admin/TrainingLevels";
//Components
import Sidebar from "./components/Sidebar/Sidebar";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import ModulePage from "./pages/Module/ModulePage";
import PrivateRoute from "./components/PrivateRoute";

//Redux
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';
import { useEffect } from "react";

if(localStorage.token) {
  setAuthToken(localStorage.token)
}

function App() {
  
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Navbar />
      <div className="">
        <Routes>
          <Route path="/skills" element={<PrivateRoute type={'student'} /> }>
            <Route path="/skills" element={<Skills />} />
          </Route>
          
          <Route path="/" element={<Home />} /> 

          <Route path="/login" element={<PrivateRoute type={'not'} /> }>
            <Route path="/login" element={<Login />} />
          </Route>

          <Route path="/module" element={<PrivateRoute type={'student'} /> }>
            <Route path="/module" element={<ModulePage children={[]} name=""/>} />
          </Route>

          <Route path="/module/:moduleid" element={<PrivateRoute type={'student'} /> }>
            <Route path="/module/:moduleid" element={<Module />} />
          </Route>

          <Route path="/module/:moduleid/overview" element={<PrivateRoute type={'student'} /> }>
            <Route path="/module/:moduleid/overview" element={<Overview />} />
          </Route>

          <Route path="/module/:moduleid/resources" element={<PrivateRoute type={'student'} /> }>
            <Route path="/module/:moduleid/resources" element={<Resources />} />
          </Route>

          <Route path="/module/:moduleid/assessments" element={<PrivateRoute type={'student'} /> }>
            <Route path="/module/:moduleid/assessments" element={<Assessment />} />
          </Route>

          <Route path="/module/:moduleid/assessments/:quizId" element={<PrivateRoute type={'student'} /> }>
            <Route path="/module/:moduleid/assessments/:quizId" element={<AssessmentCompletion />} />
          </Route>

          <Route path="/module/:moduleid/grades" element={<PrivateRoute type={'student'} /> }>
            <Route path="/module/:moduleid/grades" element={<Grades />} />
          </Route>

          <Route path="/students" element={<PrivateRoute type={'instructor'} /> }>
            <Route path="/students" element={<StudentTracking />} />
          </Route>

          <Route path="/admin" element={<PrivateRoute type={'instructor'} /> }>
            <Route path="/admin" element={<Admin />} />
            
          </Route>

          <Route path="/admin/exercises" element={<PrivateRoute type={'instructor'} /> }>
            <Route path="/admin/exercises" element={<Exercises />} />
            
          </Route>

          <Route path="/admin/skills" element={<PrivateRoute type={'instructor'} /> }>
            <Route path="/admin/skills" element={<Skills />} />
            
          </Route>

          <Route path="/admin/modules/" element={<PrivateRoute type={'instructor'} /> }>
            <Route
              path="/admin/modules/"
              element={<AdminModules children={[]} name="" />}
            />
          </Route>
          

          <Route path="/admin/modules/:moduleid" element={<PrivateRoute type={'instructor'} /> }>
            <Route path="/admin/modules/:moduleid" element={<AdminModule />} />
            
          </Route>

          <Route path="/admin/modules/:moduleid/overview" element={<PrivateRoute type={'instructor'} /> }>
            <Route path="/admin/modules/:moduleid/overview" element={<AdminOverview />} />
            
          </Route>

          <Route path="/admin/modules/:moduleid/resources" element={<PrivateRoute type={'instructor'} /> }>
            <Route path="/admin/modules/:moduleid/resources" element={<AdminResources />} />
            
          </Route>

          <Route path="/admin/modules/:moduleid/assessments" element={<PrivateRoute type={'instructor'} /> }>
            <Route
              path="/admin/modules/:moduleid/assessments"
              element={<AdminAssessment />}
            />
          </Route>
          

          <Route path="/admin/modules/:moduleid/grades" element={<PrivateRoute type={'instructor'} /> }>
            <Route path="/admin/modules/:moduleid/grades" element={<AdminGrades />} />
            
          </Route>

          <Route path="/admin/resources" element={<PrivateRoute type={'instructor'} /> }>
            <Route
              path="/admin/resources"
              element={<AdminResourcesGeneral></AdminResourcesGeneral>}
            />
          </Route>
          

          <Route path="/admin/training-levels" element={<PrivateRoute type={'instructor'} /> }>
            <Route
              path="/admin/training-levels"
              element={<TrainingLevels></TrainingLevels>}
            />
          </Route>

          <Route path = "/sessions" element = {<TrainingSessions/>} />


          <Route path="/admin/modules/:moduleid/AdminQuizManagement/:type/:quizId" element={<PrivateRoute type={'instructor'} /> }>
            <Route path="/admin/modules/:moduleid/AdminQuizManagement/:type/:quizId" element={<AdminQuizManagement />} />

          </Route>
        </Routes>
      </div>
    </Provider>
  );
}

export default App;
