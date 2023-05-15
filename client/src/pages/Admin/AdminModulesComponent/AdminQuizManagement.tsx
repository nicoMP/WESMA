import AdminModules from "../AdminModules";
import { useParams, Navigate } from "react-router-dom";
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Quiz from "../../../classes/Quiz.ts";
import { connect } from 'react-redux';
import * as formats from "../../../classes/QuizQuestionFormats.ts";
import Sidebar from "../../../components/Sidebar/Sidebar";
import UtilBar from "../../../components/UtilBar/UtilBar";
import CoreUtilBar from "../../../components/CoreUtilBar/CoreUtilBar";
const ASSESSMENT_BASE_URL = "http://localhost:5000/api/module-contents";

interface Module {
    moduleid: string;
    modulename: string;
  }

function AdminQuizManagement({ auth }) {
    const [instructorID, setInstructorID] = useState<string>("");
    const { moduleid } = useParams();
    const [moduleName, setModuleName] = useState<string>("");  
    let [incompleteWarning, setIncompleteWarning] = useState(false);
    let [redirect, setRedirect] = useState(false);
    let { quizId, type } = useParams();
    let [questions, setQuestions] = useState([]);
    let [choices, setChoices] = useState([]);
    let [quiz, setQuiz] = useState([]);

    const getQuiz = async () => {
        if(type === "edit") {
            try {
                const response = await axios.get(ASSESSMENT_BASE_URL + "/instructor/singlequiz/" + moduleid + "/" + quizId.toString());
                setQuiz(new Quiz(response.data[0].contentname, moduleid, response.data[0].isgraded, response.data[0].quizcontent, quizId));
                let incomingQuestions = [];
                response.data[0].quizcontent.forEach(question => {
                    incomingQuestions.push(new formats.SingleChoiceMC(question.marks, question.question, question.choices, question.answer))
                });
                setQuestions([...incomingQuestions])
              } catch (err) {
                console.error(err.message);      
              }
        } else {
            setQuiz(new Quiz("", moduleid, true, [], null));
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

    useEffect(() => {
        getInstructor();
        getQuiz();
        getModuleName();
    }, [])
    
    function addQuestion() {
        let newQ = new formats.SingleChoiceMC(1, "", [], null);
        setQuestions((prev) => ([...prev, newQ]));
    }

    function addChoice(index) {
        let questionsList = questions;
        questionsList[index].choices.push("");
        setQuestions((prev) => ([...questionsList]));
    }

    function changeAnswer(i, j) {
        let questionsList = questions;
        questionsList[i].answer = questionsList[i].choices[j];
        setQuestions((prev) => ([...questionsList]));
    }

    async function submitQuiz() {
        try {
            let finalQuestions = questions;
            if(finalQuestions.length < 1) {
                setIncompleteWarning(true);
                throw new Error('Incomplete');
            }
            finalQuestions.forEach((question, i) => {
                finalQuestions[i].choices = finalQuestions[i].choices.filter((choice) => (choice));
            });
            finalQuestions.forEach((question, i) => {
                if(question.choices.length < 1 || question.choices.indexOf(question.answer) < 0) {
                    setIncompleteWarning(true);
                    throw new Error('Incomplete');
                }
                if(!question.question) {
                    setIncompleteWarning(true);
                    throw new Error('Incomplete');
                }
                if(!question.marks) {
                    setIncompleteWarning(true);
                    throw new Error('Incomplete');
                }
            });
            let finalQuiz = quiz;
            if(!finalQuiz.quizName) {
                setIncompleteWarning(true);
                throw new Error('Incomplete');
            }
            setIncompleteWarning(false);
            finalQuestions.forEach((question, i) => {
                finalQuestions[i] = finalQuestions[i].asJSON();
            });
            finalQuiz.quizContent = finalQuestions;
            if (type === "edit") {
                const data = finalQuiz.asJSON();
                const headers = { "Content-Type": "application/json" };
                const response = await axios.put(ASSESSMENT_BASE_URL + "/quiz", data, headers);
            } 
            else {
                const data = finalQuiz.asJSON();
                const headers = { "Content-Type": "application/json" };
                const response = await axios.post(ASSESSMENT_BASE_URL + "/quiz", data, headers);
            }
            setRedirect(true);
        } catch (err) {
            console.error(err.message);      
        }
    }

    function deleteChoice(i, j) {
        let questionsList = questions;
        questionsList[i].choices.splice(j, 1);
        setQuestions((prev) => ([...questionsList]));
    }

    function deleteQuestion(index) {
        let questionsList = questions;
        questionsList.splice(index, 1);
        setQuestions((prev) => ([...questionsList]));
    }

    const onChange = (e) => {
        let newQuiz = quiz;
        newQuiz.quizName = e;
        setQuiz(newQuiz);
    }

    const getInstructor = async () => {
        if(auth?.user?.id) {
          setInstructorID(auth.user.id);
        }
      } 

      const defaultSideLinks = [
        { name: "Overview", link: `${moduleid}/overview`, view: "admin/modules" },
        { name: "Resources", link: `${moduleid}/resources`, view: "admin/modules" },
        { name: "Assessments", link: `${moduleid}/assessments`, view: "admin/modules" },
        { name: "Grades", link: `${moduleid}/grades`, view: "admin/modules" },
    ];

    return (
    <div className="">
      <div className="flex">
        <CoreUtilBar/>
      </div>
      <div className="flex">
        <Sidebar sideLinks={defaultSideLinks} />
        <div className="flex-1">
          <UtilBar instructorID={instructorID}/>
          <div className="ml-2">
            <h1 className="text-3xl my-4">Module {moduleName}</h1>
          </div>
          <div className="my-2.5">
                <form>
                    <div>
                        <label>Quiz Name: </label>
                        <input type="text" name="quizname" defaultValue ={quiz.quizName} onChange={(e) => onChange(e.target.value)}/>
                    </div>
                    { 
                        questions.map((question, i) => (
                            <div key={i.toString() + question.question + question.answer} className="my-2.5 border-2 text-sm rounded-lg">
                                <label className="m-2.5"> Question: </label>
                                <input className="m-2.5 w-11/12 rounded-lg" type="text" defaultValue ={question.question} onChange={(e) => (question.question = e.target.value)}/>
                                <div className="m-2.5">
                                    Choices:
                                    {
                                        question.choices.map((choice, j) => (
                                            <div key={i.toString() + choice + j.toString()}>
                                                <input id={i.toString() + "," + j.toString()} type="radio" value={question.choices[j]} name={i.toString() + "," + j.toString()} onChange={e => {changeAnswer(i, j)}} checked={choice === question.answer} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                                <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                                    <input className="m-2.5 w-3/12 rounded-md" type="text" defaultValue={question.choices[j]} onChange={(e) => (question.choices[j] = e.target.value)}/>
                                                    <button type="button" className="bg-slate-400 px-2 py-1 text-black rounded-md" onClick={() => {deleteChoice(i, j)}}>
                                                        <DeleteIcon></DeleteIcon>
                                                    </button>
                                                </label>
                                            </div>
                                        ))
                                    }
                                    <div>
                                        <button type="button" className="bg-slate-400 px-2 py-1 text-black rounded-md m-2.5" onClick={() => {addChoice(i)}}>
                                            <AddIcon></AddIcon>
                                            Add New Choice
                                        </button>
                                        <button type="button" className="bg-slate-400 px-2 py-1 text-black rounded-md m-2.5" onClick={() => {deleteQuestion(i)}}>
                                            <DeleteIcon></DeleteIcon>
                                            Delete Question
                                        </button>
                                        <label className="m-2.5"> Marks: </label>
                                        <input className="m-2.5 w-1/12 rounded-lg" type="number" defaultValue ={question.marks} onChange={(e) => (question.marks = e.target.value)}/>
                                    </div>
                                </div>
                            </div>
                        )) 
                    }
                </form>
            </div>
            <div className="my-2.5">
                <button type="button" className="bg-slate-400 px-4 py-2 text-black rounded-md m-2.5" onClick={addQuestion}>
                    <AddIcon></AddIcon>
                    Add Question
                </button>
                <button type="button" className="bg-slate-400 px-4 py-2 text-black rounded-md m-2.5" onClick={submitQuiz}>
                    <AddIcon></AddIcon>
                    Save
                </button>
                {
                    incompleteWarning &&
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold"> Error!</strong>
                    </div>
                }
                {
                    !incompleteWarning && redirect &&
                    <Navigate to={"/admin/modules/" + moduleid + "/assessments"} />
                }
            </div>
        </div>
      </div>
    </div>
    );
}


const mapStateToProps = state => ({
    auth: state.auth
  });
  
  export default connect(mapStateToProps)(AdminQuizManagement);
