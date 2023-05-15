import AdminPage from "./AdminPage";
import { TableHeaders, IOptions } from "../../types";
import SearchTable from "../../components/SearchTable/SearchTable";
import Dialog from "../../components/Dialog/Dialog";
import { useEffect, useState } from "react";
import CoreUtilBar from "../../components/CoreUtilBar/CoreUtilBar";

let headers: TableHeaders[] = [
  {
    proportion: "w-[1]/12",
    content: "Skill Name",
  },
  {
    proportion: "w-[1]/12",
    content: "Description",
  },
  {
    proportion: "w-2/12",
    content: "Associated Exercise",
  },
  {
    proportion: "w-2",
    content: "Edit",
  },
  {
    proportion: "w-2",
    content: "Delete",
  },
];

let tData: Object[] = [];

const options: IOptions[] = [
  { optionContent: "Skill Name" },
  { optionContent: "Description" },
  { optionContent: "Associated Exercise" },
];

function Skills() {

  return (
    <div className="">
      <div className="flex">
        <CoreUtilBar/>
      </div>
      <SearchTable
        options={options}
        headers={headers}
        tData={tData}
        type={"Skill"}
      ></SearchTable>
    </div>
  );
}
export default Skills;
