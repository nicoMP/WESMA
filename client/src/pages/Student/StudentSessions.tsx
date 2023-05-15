import axios from "axios";
import { useEffect, useState } from "react";
import { EventonCalendar } from "../../components/Calendar/dateTypes";
import { ITrainingSession } from "../../types";
import Calendar from "../../components/Calendar/WESMACalendar";
import { MemoizedModal } from "../../components/SessionModules/SessionModule";
import { getInitials, IsSameDateAs } from "../../components/Calendar/GeneralFunctions";
import {MyStudentSessions} from "../../components/SessionModules/MySessions";

const GET_SESSIONS_URL = "http://localhost:5000/api/sessions/";
const GET_ENROLLED_URL = "http://localhost:5000/api/sessions/enrolled/student";

interface StudentSessions{
    changes: number,
    studentID: string,
    dictionary:{name:string, id:string, type:string}[],
    changeDB: ()=>void
}
export default function StudentSessions({studentID, dictionary, changeDB, changes}:StudentSessions){
    const [modalSelected, selectModal] = useState<number>(0);// to control modal
    const [sessions, setSessions] = useState<ITrainingSession[]>([]);// to get all sessions student can take 
    const [sessionOnCalender, setCalendarSessions] = useState<EventonCalendar[]>([]);
    const [daySelected, setSelectedDay] = useState<string>('');
    const [selectedSessions, selectSessions] = useState<ITrainingSession[]>([]);
    const [showMyModule, showMyEvents] = useState<boolean>(false);
    const [enrolledSessions, setMySessions] = useState<ITrainingSession[]>([]);

    useEffect(()=>{
        getSessions(setSessions, studentID);
        getMySessions(setMySessions, studentID, dictionary);
    }, [dictionary, changes])
    useEffect(()=>{
        var tempCalSession:EventonCalendar[] = [];
        if(sessions !== undefined && dictionary !== undefined){
            sessions.forEach((s)=>{
                var levelName  = dictionary.find(d => d.id === s.levelid)?.name;
                tempCalSession.push({date: s.sessionstarttime, name:levelName===undefined?"":levelName, content: s})
                }
            )
        }
        setCalendarSessions(tempCalSession)
    }, [sessions, dictionary, enrolledSessions])
    useEffect(()=>{
        if(sessions!== undefined && dictionary!== undefined) selectSessions(sessions.filter((e)=>{
            return IsSameDateAs(new Date(daySelected),e.sessionstarttime);
        }).map(s=>{
            var levelName  = dictionary.find(d => d.id === s.levelid)?.name;
            var instName  = dictionary.find(d => d.id === s.instructorid)?.name;

            return({
                sessionid: s.sessionid,
                sessionstarttime: s.sessionstarttime,
                sessionendtime: s.sessionendtime,
                sessionlocation: s.sessionlocation,
                sessioncapacity: s.sessioncapacity,
                instructorid: getInitials(instName===undefined?"":instName),
                levelid:levelName===undefined?"":levelName
        })}));
    },[modalSelected]);

    return (
        <>
            <div className='relative flex '>
                <h1 className='relative mx-auto text-3xl text-center text-purple-900 mt-4'>Available Sessions</h1>
                <button onClick = {()=>{showMyEvents(true)}} className="absolute left-3/4 mt-4  p-1 text-center bg-purple-900 w-32 text-white text-lg font-bold rounded-2xl">My Events</button>
            </div>
            <Calendar tileEvents={sessionOnCalender} selectDay = {setSelectedDay} controlModal ={()=>selectModal(2)}/>
            <MemoizedModal onClose = {()=>{selectModal(0)}} ChangesToDB={changeDB} dayWithEvents={selectedSessions} state= {modalSelected} userID = {studentID} dictionary={dictionary}/>
            <MyStudentSessions events={enrolledSessions} userID={studentID} visible={showMyModule} onClose={()=>{showMyEvents(false)}} changeDB={changeDB} dictionary={[]}/>
            
        </>
    )
}

const getSessions = async(setSessions:(s:any)=>void, id:string) =>{
    const {data} = await axios.get(GET_SESSIONS_URL, {params:{studentId: id}});
    setSessions(data.map((e:ITrainingSession)=>{
        const start = new Date(e.sessionstarttime);
        const end = new Date(e.sessionendtime);
        return({
            sessionid: e.sessionid,
            sessionstarttime: start,
            sessionendtime: end,
            sessionlocation: e.sessionlocation,
            sessioncapacity: e.sessioncapacity,
            instructorid: e.instructorid,
            levelid: e.levelid})
    }))
}
const getMySessions = async(setSessions:(s:any)=>void, id:string, dictionary:{name:string, id:string, type:string}[]) =>{
    const {data} = await axios.get(GET_ENROLLED_URL, {params:{studentid: id}});
    setSessions(data.map((e:any)=>{
        const start = new Date(e.sessionstarttime);
        const end = new Date(e.sessionendtime);
        var levelName  = dictionary.find(d => d.id === e.levelid)?.name;
        var instName  = dictionary.find(d => d.id === e.instructorid)?.name;
        return({
            sessionid: e.sessionid,
            sessionstarttime: start,
            sessionendtime: end,
            sessionlocation: e.sessionlocation,
            sessioncapacity: e.sessioncapacity,
            instructorid: getInitials(instName===undefined?"":instName),
            levelid:levelName===undefined?"":levelName})
    }))
}