
import { EventonCalendar } from "./dateTypes";
import { CalendarLabel } from "./CalendarContent";
import {useState} from 'react';
import { HeaderCal } from "./CalendarContent";
import { IsSameDateAs } from "./GeneralFunctions";
import { Alert } from "flowbite-react";

export  function CalenderDays(){
    var x:JSX.Element[] = [];
    var HeaderStyle:string = "px-6 py-3 text-center font-thin text-m text-white";

    
    HeaderCal.forEach(element => {
        x.push(//here to change style of header
        <th scope="col" key = {'header-' + element.content} className={HeaderStyle}>
            {element.content}
        </th>
        )
    });//creates tables header
    return (<>{x}</>);
}
interface Props{
    date: Date,
    events: EventonCalendar[],
    selectDay: (i:string)=>void,
    controlModal: ()=> void
}//creates interface for props object will be added here for events
export const DaysInMonth: React.FC<Props> = ({ date, events, selectDay, controlModal }) => {
    const viewMonth = new Date (date.getFullYear(),date.getMonth(),1);// sets the first day of months
    const dayStartMonth = -viewMonth.getDay();//sets how many days the start of month is off from the sunday

    var x = <CreateDays date = {viewMonth} num = {dayStartMonth} events = {events} selectDay={selectDay} controlModal={controlModal}/>//passes the date to create each row and the daystart to know which day to start at
        

    return x;
}
interface DaysInWeek{
    date: Date,
    num: number,
    events: EventonCalendar[],
    selectDay: (i:string)=>void
    controlModal: ()=> void
}
const CreateDays:React.FC<DaysInWeek> = ({date,num, events, selectDay, controlModal}) =>{
    var addToCurrent = num;
    var week:JSX.Element[] = [];//single week array of td
    var weeks:JSX.Element[] = [];//al weeks array of tr
    var days:Date[] = [];//single array of days in a month
    const lastday = new Date(date.getFullYear(), date.getMonth() + 1, 0)
    
    while( (lastday.getDate() > addToCurrent) || (days.length%7 !=0)){//create an array of all the dates in a month checks that the last day of month is added and continues to complete week if needed

        var dateNum =  new Date(date.getFullYear(),date.getMonth(), 1 + addToCurrent++)
        days.push(
            dateNum       
        )
    }

    days.map((day, i) =>{
        
        const todayStyle = IsSameDateAs(day,new Date())? [" text-red-800 ", ' bg-slate-900 bg-opacity-5']: "";//check for today to give it unique style index 0 is to p el that contains num index 1 to the td el
        const styleInView = lastday.getMonth()==day.getMonth()?"":" text-gray-400 bg-purple-500 bg-opacity-5 ";//cheque for if its in the month view to give it unique style
        week.push(
            <td onClick={(e)=>{e.preventDefault();const target= e.currentTarget;var x;; if(target instanceof HTMLElement){x = target.id; controlModal();}else x = '';(selectDay(x))}} key = {day.getTime()} id = {day.toISOString()} className = {" overflow-auto sm:overflow-x-clip relative hover:bg-slate-300 "  +styleInView + todayStyle[1]}>
                <p className = {'absolute top-1 left-1 text-m' + todayStyle[0]}>
                    {day.getDate()}
                </p>
                <div className="absolute text-black sm:right-1/2  sm:transform sm:translate-x-1/2  top-5 w-11/12 flex flex-col">
                    {displayTile({currentDate: day,events:events})}
                </div>
            </td>
        )// pushes days into week
        if(week.length%7 === 0){
            weeks.push(
                <tr key = {i+ 'week'} className ={'divide-x divide-violet-200 divide-1 h-28'}>
                    {week}
                </tr>
            )//week into months when a whole week is set
            week = [];//clears
        }
    });
    
    return (
        <>
        {weeks}
        </>
    )// array of all the days in a month
}
interface DispProp{
    currentDate: Date,
    events: EventonCalendar[]
}
function displayTile({currentDate,events}:DispProp){
    var label = CalendarLabel(events)
    var content:JSX.Element[] = []
    label.map((e,i)=>{
        if(IsSameDateAs(currentDate, e.date)){
            content.push(<div key = {i} className=' mt-1 sm:-z-50  sm:absolute sm:left-1/12  sm:transform sm:translate-x-1/2 w-full '>{e.content}</div> )
        }
    });
    return content;
}

