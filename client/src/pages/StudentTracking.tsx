import Table from "../components/Table/Table";
import { TableHeaders } from "../types";
import { useState, useEffect } from "react";
import axios from "axios";
import { ClosedCaptionDisabledRounded } from "@mui/icons-material";
//Headears same thing can be any string or JSX element however it must include proportions, look at tailwind ccs width i use fractions but others can be used as well, these will specify the width of the column for whole table
var headers: TableHeaders[] = [
  {
    proportion: "w-[1]/12",
    content: "Student Number",
  },
  {
    proportion: "w-[1]/12",
    content: "Student Name",
  },
  {
    proportion: "w-[1]/12",
    content: "Student Program",
  },
  {
    proportion: "w-[1]/12",
    content: "Student Year",
  },
  {
    proportion: "w-[1]/12",
    content: "Student User Id",
  }
];

function StudentTracking() {
  const [studentData, setStudentData] = useState<any>([]);
  const getStudents = async () => {
    return await axios
      .get("http://localhost:5000/api/student-info")
      .then((data) => {
        const students = data.data;
        const filteredStudents = students.map((student) => {
          const { studentid, ...rest } = student;
          return rest;
        });

        setStudentData(filteredStudents);
      });
  };
  useEffect(() => {
    getStudents();
  }, []);

  return (
    // returns student tables header and data must match else a row will be empty
    <div className="">
      <Table
        tableHead={headers}
        onClickFunction={() => {}}
        data={studentData}
        showManage={false}
        type={"student"}
      />
    </div>
  );
}

export default StudentTracking;
