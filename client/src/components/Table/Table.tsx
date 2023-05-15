import TableHead from "./TableHead";
import TableBody from "./TableBody";
import { TableHeaders } from "../../types";
interface TableProps {
  tableHead: TableHeaders[];
  data: object[];
  showManage: boolean;
  onClickFunction: (currentRow: object) => void;
  type: string;
}

//Takes two props Object  which is the data  datas {first column has to be unique identifier i could change this if needed }
//as an array of objects and headers the header has the headers itself and the proportions saved as an object array
function Table({
  tableHead,
  data,
  onClickFunction,
  showManage,
  type,
}: TableProps) {
  return (
    //here to change style of table
    <div className="relative overflow-auto shadow-md sm:rounded-lg max-w-7xl mx-auto my">
      <table className="w-full text-sm text-left  text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-200">
          <TableHead titles={tableHead} />
        </thead>
        <TableBody
          type={type}
          data={data}
          onClickFunction={onClickFunction}
          showManage={showManage}
        />
      </table>
    </div>
  );
}

export default Table;
