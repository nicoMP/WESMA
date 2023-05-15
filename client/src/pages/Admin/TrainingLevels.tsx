import AdminPage from "./AdminPage";
import { TableHeaders, IOptions } from "../../types";
import SearchTable from "../../components/SearchTable/SearchTable";
import Dialog from "../../components/Dialog/Dialog";
import { useEffect, useState } from "react";
import CoreUtilBar from "../../components/CoreUtilBar/CoreUtilBar";

let headers: TableHeaders[] = [
  {
    proportion: "w-[1]/12",
    content: "Level Name",
  },
  {
    proportion: "w-[1]/12",
    content: "Level Description",
  },
  {
    proportion: "w-2/12",
    content: "Associated Exercise",
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

var tData: Object[] = [];

const options: IOptions[] = [
  { optionContent: "Level Name" },
  { optionContent: "Level Description" },
];
function TrainingLevels() {

  return (
    <div className="">
      <div className="flex">
        <CoreUtilBar/>
      </div>
      <SearchTable
        options={options}
        headers={headers}
        tData={tData}
        type={"Training Levels"}
      ></SearchTable>
    </div>
  );
}
export default TrainingLevels;
