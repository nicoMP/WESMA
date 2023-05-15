import Calendar from "../components/Calendar/WESMACalendar";
import axios from "axios"
import { useEffect, useState } from "react";
import { ITrainingSession } from "../types";
import { EventonCalendar } from "../components/Calendar/dateTypes";
 
import { getInitials, IsSameDateAs } from "../components/Calendar/GeneralFunctions";
const EXERCISE_URL = "http://localhost:5000/api/sessions/";
const GET_INAMES = 'http://localhost:5000/api/get-name/instructor_name';
const GET_LNAMES = 'http://localhost:5000/api/get-name/level_name'



export default function TrainingSessiones(){
    const userID = "0dba2760-6580-4f36-b02d-957c290767a9";
    const getInstructors = async() =>{
        try{
            const res = await axios.get(GET_INAMES);
            setInstructors(res.data);
        } catch(e) {
            console.log(e )
        }
    }
    const getLevels = async() =>{
        try{
            const res = await axios.get(GET_LNAMES);
            setLevels(res.data);
        } catch(e) {
            console.log(e )
        }
    }
    const getSessions = async() =>{
        const {data} = await axios.get(EXERCISE_URL);
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
    const [dictionary, setDictionary] = useState<{name:string, id:string, type:string}[]>([]);// both I and S need this
    const [changesCount, setChangesCount] = useState(0);// both need to update 
    const [sessions, setSessions] = useState<ITrainingSession[]>([]);// both
    const [instructors, setInstructors] = useState<{instructorid:string, instructorname:string}[]>([]);
    const [levels, setLevels] = useState<{levelid:string, levelname:string}[]>();
    const [CalendarSessions, setCalSessions] = useState<EventonCalendar[]>([]);
    const [selectedSessions, selectSessions] = useState<ITrainingSession[]>([]);
    const [showModal, controlModal] = useState<number>(0);
    const [showMyModule, showMyEvents] = useState<boolean>(false);
    const [daySelected, setSelectedDay] = useState<string>('');
    useEffect(()=>{
        getSessions();
        getInstructors();
        getLevels();
    },[changesCount]);
    useEffect(()=>{

        if(sessions!== undefined && levels !== undefined) setCalSessions(sessions.map(e=>({
            date: e.sessionstarttime,
            name: levels[levels.map((e)=> e.levelid).indexOf(e.levelid)].levelname,
            content: e
        })))
    },[sessions, levels]);
    useEffect(()=>{
        if(levels !== undefined && instructors !== undefined){
            var tempDic = levels.map((l)=>{
                return{id: l.levelid, name: l.levelname, type: 'level'}
            }).concat(instructors.map(i=>{
                return {id: i.instructorid, name: i.instructorname, type: 'instructor'}
            }))
            setDictionary(tempDic);
        }
        

    },[showModal]);
    useEffect(()=>{
        if(sessions!== undefined && levels!==undefined && instructors!== undefined) selectSessions(sessions.filter((e)=>{
            return IsSameDateAs(new Date(daySelected),e.sessionstarttime);
        }).map(e=>{
            return({
                sessionid: e.sessionid,
                sessionstarttime: e.sessionstarttime,
                sessionendtime: e.sessionendtime,
                sessionlocation: e.sessionlocation,
                sessioncapacity: e.sessioncapacity,
                instructorid: getInitials(instructors[instructors.map((e)=> e.instructorid).indexOf(e.instructorid)].instructorname),
                levelid:levels[levels.map((e)=> e.levelid).indexOf(e.levelid)].levelname})
        }));
    },[daySelected,showModal]);
    return(
        <div className={'absolute flex flex-col w-fit'}>
          <p className=' text-3xl border- mt-4 text-purple-900 text-center'>Training Sessions</p>
            <div className="snap-y w-screen">
            <Calendar tileEvents={CalendarSessions} selectDay = {setSelectedDay} controlModal ={()=>controlModal}/>
            </div>
            <button onClick={()=>{controlModal(1)}} className="relative left-1/4 transform mb-2 translate-x-1/4 p-1 text-center mx-auto bg-purple-900 w-32 text-white text-lg font-bold rounded-2xl">Add Event</button>
            <button onClick = {()=>{showMyEvents(true)}} className="relative left-1/4 transform mb-2 translate-x-1/4 p-1 text-center mx-auto bg-purple-900 w-32 text-white text-lg font-bold rounded-2xl">My Events</button>
            

        </div>
    )
}
