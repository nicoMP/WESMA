
  //returns unique elements in array
  export function IsSameDateAs(date_0:Date, date_1:Date) {
    return (
        date_0.getFullYear() === date_1.getFullYear() &&
        date_0.getMonth() === date_1.getMonth() &&
        date_0.getDate() === date_1.getDate()
    );
  }//returns if date is equal
export function GetTime(date:Date){
  const hour = (date.getHours()).toString().padStart(2, '0');
  const min = date.getMinutes().toString().padStart(2, '0');
  return `${hour}:${min}`
}
  export function GetDateAsString(date:Date){
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}
export function hourToMs(time:string){
  const [hours, minutes] = time.split(':').map(str => parseInt(str));
  const milliseconds = (hours * 60 * 60 + minutes * 60) * 1000;
  return(milliseconds)
}
export function GetDay(date:Date){
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}
export function getInitials(name:string) {
  const nameArray = name.split(' ');
  const firstName = nameArray[0];
  const lastName = nameArray[nameArray.length - 1];
  const firstInitial = firstName.charAt(0).toUpperCase();
  let middleInitial = '';
  if (nameArray.length > 2) {
    middleInitial = nameArray[1].charAt(0).toUpperCase() + '. ';
  }
  const firstThreeLetters = lastName.slice(0,3).toUpperCase();
  return `${firstInitial}. ${middleInitial}${firstThreeLetters}`;
}