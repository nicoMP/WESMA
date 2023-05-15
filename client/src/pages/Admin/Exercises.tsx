import AdminPage from "./AdminPage";
import { TableHeaders, IOptions } from "../../types";
import SearchTable from "../../components/SearchTable/SearchTable";
import Dialog from "../../components/Dialog/Dialog";
import CoreUtilBar from "../../components/CoreUtilBar/CoreUtilBar";

import {
  useEffect,
  useState,
  useCallback,
  useRef,
  useLayoutEffect,
} from "react";

let headers: TableHeaders[] = [
  {
    proportion: "w-[1]/12",
    content: "Exercise Name",
  },
  {
    proportion: "w-[1]/12",
    content: "Description",
  },
  {
    proportion: "w-2/12",
    content: "Associated Levels",
  },
  {
    proportion: "w-[1]/12",
    content: "Edit",
  },
  {
    proportion: "w-[1]/12",
    content: "Delete",
  },
];

const options: IOptions[] = [
  { optionContent: "Exercise Name" },
  { optionContent: "Description" },
  { optionContent: "Associated Levels" },
];

function Exercises() {
  const [tData, setData] = useState([]);

  const [testString, setString] = useState("hello");
  const [levelData, setLevelData] = useState([]);

  return (
    <div className="">
      <div className="flex">
        <CoreUtilBar/>
      </div>
      <SearchTable
        options={options}
        headers={headers}
        tData={tData.length > 0 ? [] : []}
        type={"Exercise"}
      ></SearchTable>
    </div>
  );
}

export default Exercises;
