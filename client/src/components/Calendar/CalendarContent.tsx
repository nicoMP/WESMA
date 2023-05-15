
import {EventonCalendar} from './dateTypes';
import { TableHeaders } from "../../types";
import TableHead from '../Table/TableHead';
import { ITrainingSession } from "../../types";
import axios from 'axios';
import Table from '../Table/Table';
import { memo } from 'react';
import { GetDateAsString, GetTime, hourToMs, IsSameDateAs } from './GeneralFunctions';

const ADD_URL = "http://localhost:5000/api/sessions/";
const REGISTER_URL = "http://localhost:5000/api/sessions/enroll";
//returns label
interface LabelProps {
    unique: {
        eventName: string,
        color: string
    }[]
}


export function CalendarLabel(events:EventonCalendar[]){
    //get all unique events given and sets a color for them
    var uniqueEvent = [...new Set(events.map(e => e.name))];
    var UniqueColor = uniqueEvent.map((e,i)=>{
        return({
            eventName:  e==null ? 'null': e,
            color: colorsAvailable[i%colorsAvailable.length]
        });
    });//gets all days that have events
    var dayWithEvent = [...new Set(events.map(e => new Date(e.date.getFullYear(), e.date.getMonth(), e.date.getDate())))].map(dateString => new Date(dateString));
    //sets a calendar event with the date
    var EventsOnDay:EventonCalendar[] = dayWithEvent.map((day)=>{
       return ({
        date: day,
        name: GetDateAsString(day),
        content: label(events.filter(e=>IsSameDateAs(e.date, day)), {unique: UniqueColor})
        });
        
    });
    return EventsOnDay;
}
function label(content:EventonCalendar[], {unique}:LabelProps){
    var UniqueColor = [...new Set(content.map(e => e.name))];
    var elements:JSX.Element[] = [];
    var color = '';
    UniqueColor.forEach((label,i)=>{
        var foundColor = unique.find(e => e.eventName == label);
        if(foundColor != undefined){
            color = foundColor.color;
        }else{

        }
        elements.push(<div key = {i} className= {"sm:relative overflow-auto flex-row sm:mt-1 sm:w-full sm:right-1/2  sm:rounded-2xl bg-" + color}>
            
            <div className='sm:overflow-clip w-11/12'><p className = ' py-px pl-1 text-xs '>{label} </p></div>
            <div className='absolute top-1 text-xs text-zinc-600 text-black sm:right-px sm:top-1/2 sm:transform sm:-translate-y-1/2 rounded-2xl  sm:w-5 sm:h-5 text-xs font-light sm:h-5/6  text-center bg-white'><p className='absolute sm:left-1/2 sm:top-1/2 sm:transform sm:-translate-y-1/2 sm:-translate-x-1/2'>{content.filter(e => e.name === label).length}</p></div>
           
            
        </div>)
    })
    return(elements)
}
const  dataListLocation:JSX.Element = (<>
    <datalist id = 'locations'>
        <option value="CMLP 54"/>
        <option value="CMLP 63A"/>
        <option value="ACEB 1140"/>
    </datalist>
</>)
//colors used for labels
const colorsAvailable = [
    'green-400', 'red-100', 'blue-200', 'green-100', 'pink-100', 'purple-500', 'red-600', 'gray-500', 'zinc-200'
  ];
//used to set header for input on session table
const SessionHeaders:TableHeaders[] = [
    {
      proportion: '',
      content: 'Date'
    },
    {
      proportion: '',
      content: 'Start'
    },
    {
      proportion: '',
      content: 'End'
    },
    {
      proportion: '',
      content: 'Location'
    },
    {
      proportion: '',
      content: 'Capacity'
    },
    {
      proportion: '',
      content: 'Instructor'
  
    },
    {
      proportion: '',
      content :'Level'
    }
    
  ];
//used for header that display day of week
export const HeaderCal:TableHeaders[] = [
    {
        proportion: " ",
        content: "Sun"
    },
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
    }
];
export const AddHeader:TableHeaders[] = [
    {
        proportion: '',
        content: 'Date'
      },
      {
        proportion: '',
        content: 'Start'
      },
      {
        proportion: '',
        content: 'End'
      },
      {
        proportion: '',
        content: 'Location'
      },
      {
        proportion: '',
        content: 'Capacity'
      },
      {
        proportion: '',
        content :'Level'
      }
];
