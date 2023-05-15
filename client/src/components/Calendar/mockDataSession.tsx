import { ITrainingSession } from "../../types";

export function getRandomSession(n:number){

    var sessions:ITrainingSession[] = [];
    const locations = ['CMLP63','CMLP63A','CMLP 54']
    const instructors = ['jsmith', 'fconner', 'harnold']
    for(var i = 0;i<n;i++){
        var date = getRandomDateInRange(Math.floor(Math.random() * (10)));
        sessions.push({
            sessionid: [...Array(16)].map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
            sessionstarttime: date,
            sessionendtime: addRandomInterval(date),
            sessionlocation: getRandomElement(locations),
            sessioncapacity: Math.floor(Math.random() * 40),
            instructorid: getRandomElement(instructors),
            levelid: Math.floor(Math.random()*5).toString()//[...Array(16)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')
        })
    }
    return sessions
}
function getRandomDateInRange(rng:number) {
    const startTimestamp = Date.now() - rng * 24 * 60 * 60 * 1000; // Convert start date to timestamp
    const endTimestamp = Date.now() + rng * 24 * 60 * 60 * 1000; // Calculate end timestamp based on days
    const randomTimestamp = startTimestamp + Math.random() * (endTimestamp - startTimestamp); // Generate random timestamp within range
  return new Date(randomTimestamp)
  }
function addRandomInterval(date:Date) {
    // Generate a random number between 1 and 3
    const randomHours = Math.floor(Math.random() * 3) + 1;
    // Get the time value of the date
    const timeValue = date.getTime();
    // Add the random number of hours to the time value
    const newTimeValue = timeValue + (randomHours * 60 * 60 * 1000);
    // Create a new date object with the updated time value
    const newDate = new Date(newTimeValue);
    return newDate;
  }
function getRandomElement(array:string[]) {return array[Math.floor(Math.random() * array.length)]}
