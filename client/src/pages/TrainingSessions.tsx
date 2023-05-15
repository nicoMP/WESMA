import axios from "axios";
import { useEffect, useState } from "react";
import TeacherSessions from "./Admin/TeacherSessions";
import StudentSessions from "./Student/StudentSessions";
import { IAuthState } from "../types";
import { connect } from 'react-redux';

const GET_INAMES = 'http://localhost:5000/api/get-name/instructor_name';
const GET_LNAMES = 'http://localhost:5000/api/get-name/level_name'
type SeshProps = {
    auth: IAuthState;
  }
const getInstructors = async(setInstructors:(e:any)=>void) =>{
    try{
        const res = await axios.get(GET_INAMES);
        setInstructors(res.data);
    } catch(e) {
        console.log(e )
    }
}
const getLevels = async(setLevel:(e:any)=>void) =>{
    try{
        const res = await axios.get(GET_LNAMES);
        setLevel(res.data);
    } catch(e) {
        console.log(e )
    }
}

function TrainingSessiones({auth:{isAuthenticated, user}}:SeshProps){

    const [changesCount, setChangesCount] = useState(0);// Used with useEffect to rerender the page on changes to database
    const [dictionary, setDictionary] = useState<{name:string, id:string, type:string}[]>([]);//Used to transform Hidden ID's into User visible Names
    const [instructors, setInstructors] = useState<{instructorid:string, instructorname:string}[]>(); // used to store  instructur name id pair
    const [levels, setLevels] = useState<{levelid:string, levelname:string}[]>(); //used to store level name id pair

    useEffect(()=>{
        getInstructors(setInstructors);
        getLevels(setLevels);
    },[]);
    useEffect(()=>{
        if(levels !== undefined && instructors !== undefined){
            var tempDic = levels.map((l)=>{
                return{id: l.levelid, name: l.levelname, type: 'level'}
            }).concat(instructors.map(i=>{
                return {id: i.instructorid, name: i.instructorname, type: 'instructor'}
            }))
            setDictionary(tempDic);
        }
    },[instructors, levels])

    return(
        <div className='bg-slate h-screen'>
            {!user?.isInstructor?<StudentSessions studentID = {user?.id} changes = {changesCount} dictionary={dictionary.filter(e => e.type == 'level' || e.type == 'instructor')} changeDB = {()=>{setChangesCount(changesCount+1)}}/>:
            <TeacherSessions instructorID={user?.id} dictionary={dictionary} changes = {changesCount} changeDB={()=> setChangesCount(changesCount+1)}/>}
        </div>
    )
}
const mapStateToProps = (state:any) =>({
    auth: state.auth
});
export default connect(mapStateToProps,{})(TrainingSessiones);