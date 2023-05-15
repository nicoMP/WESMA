import { TableHeaders } from "../../types";
interface Title{
    titles : TableHeaders[]
}//an array of type headers which is just objects with content and proportion which is appended to the style
function TableHead({titles} : Title) {
  return (//here to change style of header row
      <tr>
          {tableTitles(titles)}
      </tr>
  )
}
function tableTitles(t:TableHeaders[]){
    var x:JSX.Element[] = [];
    var count = 0;
    t.forEach(element => {
        x.push(//here to change style of header goes through headers and returns hr array
        <th scope="col" key = {'header-' + count++} className={"px-6 py-3 text-center " + element.proportion}>
            {element.content}
        </th>
        )
    });
    return x;
}
export default TableHead;
