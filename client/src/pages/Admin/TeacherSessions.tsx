import axios from "axios";
import { useEffect, useState } from "react";
import { EventonCalendar } from "../../components/Calendar/dateTypes";
import { ITrainingSession } from "../../types";
import Calendar from "../../components/Calendar/WESMACalendar";
import { MemoizedModal } from "../../components/SessionModules/SessionModule";
import { getInitials, IsSameDateAs } from "../../components/Calendar/GeneralFunctions";
import {MyStudentSessions, MyTeacherSessions} from "../../components/SessionModules/MySessions";

const GET_SESSIONS_URL = "http://localhost:5000/api/sessions/";
const GET_ISESSIONS_URL = "http://localhost:5000/api/sessions/instructor"

interface StudentSessions{
    changes: number,
    instructorID: string,
    dictionary:{name:string, id:string, type:string}[],
    changeDB: ()=>void
}
export default function TeacherSessions({instructorID, dictionary, changes, changeDB}:StudentSessions){
    const [modalSelected, selectModal] = useState<number>(0);// to control modal
    const [sessions, setSessions] = useState<ITrainingSession[]>([]);// to get all sessions student can take 
    const [sessionOnCalender, setCalendarSessions] = useState<EventonCalendar[]>([]);
    const [daySelected, setSelectedDay] = useState<string>('');
    const [selectedSessions, selectSessions] = useState<ITrainingSession[]>([]);
    const [showMyModule, showMyEvents] = useState<boolean>(false);
    const [InstSessions, setMySessions] = useState<ITrainingSession[]>([]);

    useEffect(()=>{
        getSessions(setSessions, instructorID);
        getMySessions(setMySessions, instructorID, dictionary);
    }, [changes, dictionary])
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
    }, [sessions,dictionary])
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

            <h1 className='relative mx-auto text-3xl text-center text-purple-900 mt-4'>Scheduled Sessions</h1>
            <Calendar tileEvents={sessionOnCalender} selectDay = {setSelectedDay} controlModal ={()=>selectModal(3)}/>
            <MemoizedModal onClose = {()=>{selectModal(0);showMyEvents(false)}} ChangesToDB={changeDB} dayWithEvents={selectedSessions} state= {modalSelected} userID = {instructorID} dictionary={dictionary}/>
            <MyTeacherSessions events={InstSessions} userID={instructorID} visible={showMyModule} onClose={()=>{selectModal(0);showMyEvents(false)}} changeDB={changeDB} dictionary={dictionary}/>
            <div className='flex flex-col z-0'>
                <button onClick = {()=>{selectModal(0); showMyEvents(true)}} className="relative left-3/4 mt-1  p-1 text-center bg-purple-900 w-32 text-white text-lg font-bold rounded-2xl">My Events</button>
                <button onClick={()=>{selectModal(1);showMyEvents(false)}} className="relative mt-1 left-3/4  mb-2  p-1 text-center  bg-purple-900 w-32 text-white text-lg font-bold rounded-2xl">Add Event</button>
            </div>
        </>
    )
}

const getSessions = async(setSessions:(s:any)=>void, id:string) =>{
    const {data} = await axios.get(GET_SESSIONS_URL);
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
    const {data} = await axios.get(GET_ISESSIONS_URL, {params:{instructorId: id}});

    setSessions(data.map((e:ITrainingSession)=>{
        const start = new Date(e.sessionstarttime);
        const end = new Date(e.sessionendtime);
        var levelName  = dictionary.find(d => d.id == e.levelid)?.name;

        return({
            sessionid: e.sessionid,
            sessionstarttime: start,
            sessionendtime: end,
            sessionlocation: e.sessionlocation,
            sessioncapacity: e.sessioncapacity,
            levelid:levelName===undefined?" ":levelName})
    }))
}