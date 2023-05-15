import { useState } from "react";
import { TableHeaders } from "../../types";
import  {CalenderDays, DaysInMonth} from "./CalendarComponents";
import { EventonCalendar } from "./dateTypes";

interface WESMACalendar{
    tileEvents: EventonCalendar[],
    selectDay: (i:string)=>void,
    controlModal: () => void
}

export default function WESMACalendar({tileEvents, selectDay, controlModal}:WESMACalendar, ){
    const currentDate:Date = new Date();
    const [DateViewing, setDate] = useState(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1));//sets state as the first day of every month
    return(
        <>
        <div className="w-full h-fit bg-violet-900 my-4 mx-auto overflow-y-auto rounded-2xl lg:h-11/12 lg:w-8/12 cols" > 

            <div className= 'h-full'>
                <div className="flex flex-row h-12x w-full px-4">
                    <button className ="" onClick={()=>{setDate(new Date(DateViewing.setMonth(DateViewing.getMonth()-1)))}/* decreases the month by 1 */}>
                        <i className="bi bi-chevron-double-left text-white"/>
                    </button>
                    <button className="w-full text-white" onClick={()=>{setDate(new Date())}}>
                        <h1 className="text-center text-xl font-bold ">{monthArr[DateViewing.getMonth()]}</h1>
                        <h1 className="text-center  text-l">{DateViewing.getFullYear()}</h1>
                    </button>
                    <button className ="" onClick={()=>{setDate(new Date(DateViewing.setMonth(DateViewing.getMonth()+1)))/* increase the month by 1 */}}>
                            <i className="bi bi-chevron-double-right text-white"/>
                    </button>
                </div>



                <hr className='mx-4 border-t-1 border-t-dotted border-violet-800'/>
                <table  className="w-full table-fixed">
                <thead>
                    <tr className=''>
                        <CalenderDays/>
                    </tr>
                </thead>
                <tbody className = 'h-max divide-y divide-purple-200 bg-slate-100 table-fixed'>
                    <DaysInMonth date = {DateViewing /*The first of the month that they are viewing */} events = {tileEvents} selectDay={selectDay} controlModal= {()=>{controlModal()}}/>
                </tbody>
                </table>
            </div>
        </div>
        </>
    )
}
const days:TableHeaders[] = [
    {
        proportion: " ",
        content: "Mon"
    },
    {
        proportion: " ",
        content: "Tue"
    },
    {
        proportion: " ",
        content: "Wed"
    },
    {
        proportion: " ",
        content: "Thu"
    },
    {
        proportion: " ",
        content: "Fri"
    },
    {
        proportion: " ",
        content: "Sat"
    },
    {
        proportion: " ",
        content: "Sun"
    },
]//Header for each week heres where u can style individual days say you want weekends to be a different color or any tailwind that'll apply to th

const monthArr:String[] = [
    'January',
    'February',
    'March',
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
]//array to turn Date return int into month