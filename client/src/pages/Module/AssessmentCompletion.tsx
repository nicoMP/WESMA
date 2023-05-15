import ModulePage from "./ModulePage";
import { useParams, Navigate } from "react-router-dom";
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Sidebar from "../../components/Sidebar/Sidebar";
import UtilBar from "../../components/UtilBar/UtilBar";
import Quiz from "../../classes/Quiz.ts";
import { connect } from 'react-redux';
import * as formats from "../../classes/QuizQuestionFormats.ts";
const ASSESSMENT_BASE_URL = "http://localhost:5000/api/module-contents";
const SUBMIT_BASE_URL = "http://localhost:5000/api/quiz-management";
const COMPLETE_MODULE_URL = "http://localhost:5000/api/modules/complete";

interface Module {
    moduleid: string;
    modulename: string;
  }

function AssessmentCompletion({ auth }) {
    let { quizId } = useParams();
    let [quiz, setQuiz] = useState([]);
    let [questions, setQuestions] = useState([]);
    let [choices, setChoices] = useState([]);
    let [results, setResults] = useState([]);
    let [redirect, setRedirect] = useState(false);  
    const { moduleid } = useParams();
    const [moduleName, setModuleName] = useState<string>("");  
    const [studentID, setStudentID] = useState<string>("");

    const getQuiz = async () => {
        try {
            const response = await axios.get(ASSESSMENT_BASE_URL + "/student/quiz-questions/" + moduleid + "/" + quizId.toString());
            setQuiz(new Quiz(response.data.contentname, moduleid, response.data.isgraded, response.data.quizcontent, quizId.toString()));
            let incomingQuestions = [];
            let studentResults = [];
            response.data.quizcontent.forEach((question, i) => {
                incomingQuestions.push(new formats.SingleChoiceMC(question.marks, question.question, question.choices, ""));
                studentResults.push({"question": question.question, "questionType": incomingQuestions[i].type, "studentAnswer": null});
            });
            setQuestions([...incomingQuestions]);
            setResults([...studentResults])
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

    const getStudent = async () => {
        if(auth?.user?.id) {
          setStudentID(auth.user.id);
        }
    } 

    useEffect(() => {
        getStudent();
        getQuiz();
        getModuleName();
    }, [])

    async function submitQuiz() {
        try {
            let data = {
                "quizID": quizId.toString(),
                "studentID" : studentID,
                "moduleID": moduleid,
                "results" : results
            };
            const headers = { "Content-Type": "application/json" };
            const response = await axios.post(SUBMIT_BASE_URL + "/grade", data, headers);
            setRedirect(true);
        } catch (err) {
            console.error(err.message);      
        }
    }
    
    function selectAnswer(i, j) {
        let res = results;
        res[i].studentAnswer = questions[i].choices[j];
        setResults((prev) => ([...res]));
    }

    function selectedAnswer(i, j, choice) {
        let res = results;
        return res[i].studentAnswer == questions[i].choices[j];
    }

    return (
      <div className="">
      <div className="flex">
        <Sidebar sideLinks={defaultSideLinks} />
        <div className="flex-1">
          <UtilBar student={true} />
          <div className="ml-2">
            <h1 className="text-3xl my-4">Module {moduleName}</h1>
            <div className="my-2.5">
                <form>
                    { 
                        questions.map((question, i) => (
                            <div key={i.toString() + question.question + question.answer} className="my-2.5 border-2 text-md rounded-lg">
                                <p className="m-2.5"> Question {i+1}: {question.question} </p>
                                <p className="m-2.5"> Marks: {question.marks} </p>
                                <div className="m-2.5">
                                    {
                                        question.choices.map((choice, j) => (
                                            <div key={i.toString() + choice + j.toString()}>
                                                <input className="mx-2.5" id={i.toString() + "," + j.toString()} type="radio" value={question.choices[j]} name={i.toString() + "," + j.toString()} onChange={e => {selectAnswer(i, j)}} checked={selectedAnswer(i, j, choice)} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                                <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                                    {question.choices[j]}
                                                </label>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        )) 
                    }
                </form>
            </div>
            <div className="my-2.5">
                <button type="button" className="bg-slate-400 px-4 py-2 text-black rounded-md m-2.5" onClick={submitQuiz}>
                    Submit
                </button>
                {
                    redirect &&
                    <Navigate to={"/module/" + moduleid + "/assessments"}/>
                }
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
  
  export default connect(mapStateToProps)(AssessmentCompletion);
