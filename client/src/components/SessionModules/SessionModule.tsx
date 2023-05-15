import { EventonCalendar } from "../Calendar/dateTypes";
import { TableHeaders } from "../../types";
import TableHead from "../Table/TableHead";
import { ITrainingSession } from "../../types";
import axios from "axios";
import Table from "../Table/Table";
import { memo, useEffect, useState } from "react";
import {
  GetDateAsString,
  GetTime,
  hourToMs,
  IsSameDateAs,
} from "../Calendar/GeneralFunctions";
import { Unenroll } from "./MySessions";

const ADD_URL = "http://localhost:5000/api/sessions";
const ENROLLED_STUDENTS_URL = "http://localhost:5000/api/sessions/enrolled";
const REGISTER_URL = "http://localhost:5000/api/sessions/enroll";
const CHECK_ATTENDANCE_URL =
  "http://localhost:5000/api/sessions/confirm-attendance";

interface EventModal {
  state: number;
  onClose: () => void;
  dayWithEvents: ITrainingSession[];
  ChangesToDB: () => void;
  userID: string;
  dictionary: { id: string; name: string; type: string }[];
}
interface StateManager {
  state: number;
  ChangeDatabase: () => void;
  dayWithEvents: ITrainingSession[];
  userID: string;
  dictionary: { id: string; name: string; type: string }[];
}
interface Events {
  events: object[];
}
interface AddEvent {
  sessionStartTime: Date;
  sessionEndTime: Date;
  sessionLocation: string;
  sessionCapacity: number;
  instructorId: string;
  levelId: string;
}
interface UpdatedDB {
  updateDB: () => void;
  userID: string;
  dictionary: { id: string; name: string; type: string }[];
}
interface RegisterButton {
  sessionID: string;
  userID: string;
  changeDB: () => void;
}
interface EditSession {
  event: ITrainingSession | string;
  userID: string;
  onClose: () => void;
  changeDB: () => void;
  dictionary: { name: string; id: string; type: string }[];
}
interface EditSessionForm {
  event: ITrainingSession;
  userID: string;
  changeDB: () => void;
  dictionary: { name: string; id: string; type: string }[];
}
const addSessions = (
  data: AddEvent,
  level: string,
  updateDB: () => void
) => {
  axios
    .post(ADD_URL, data)
    .then((a) => {
      window.alert(
        a.status == 200
          ? level +
              " Training Session Added on: " +
              `\n` +
              GetDateAsString(data.sessionStartTime)
          : "No Session Added Try Again!"
      );
      updateDB();
    })
    .catch((err) => window.alert(err.response.data));
};
const editSessions = (data: AddEvent, updateDB: () => void) => {
  axios
    .put(ADD_URL, data)
    .then((a) => {
      window.alert(
        a.status == 200
          ? "Training Modified Succesfully"
          : "No Session Added Try Again!"
      );
      updateDB();
    })
    .catch((err) => window.alert("Error Please Check Inputs"));
};
const Register = (session: string, student: string) => {
  axios
    .post(REGISTER_URL, { studentID: student, sessionID: session })
    .then((res) => {
      window.alert(
        res.status == 200 ? "Registered Succesfuly" : "Failed to Register"
      );
    })
    .catch((err) => window.alert(err.response.data));
};
const GetEnrolledStudents = (
  session: string,
  setStudents: (e: any) => void
) => {
  if(session.length > 0) {
    axios
      .get(ENROLLED_STUDENTS_URL, { params: { sessionID: session } })
      .then((res) => {
        setStudents(res.data);
        console.log(res.data);
      })
      .catch((err) => window.alert(err.response.data));
  }
};
const ShuffleAttendance = (
  session: string,
  student: string,
  bool: boolean,
  changeDB: () => void
) => {
  console.log(session);
  axios
    .put(CHECK_ATTENDANCE_URL, {
      data: { sessionID: session, studentID: student, bool: bool },
    })
    .then((res) => {
      changeDB();
      console.log(res.data);
    })
    .catch((err) => window.alert(err.response.data));
};

const EventModal = ({
  state,
  onClose,
  dayWithEvents,
  ChangesToDB,
  userID,
  dictionary,
}: EventModal) => {
  const handleOnClose = (
    e: React.MouseEvent<HTMLUnknownElement, MouseEvent>
  ) => {
    const target = e.target;
    if (target instanceof HTMLDivElement && target.id === "blur") {
      onClose();
    }
  };
  return (
    <div
      id="blur"
      onClick={(e) => handleOnClose(e)}
      className={
        " fixed inset-0 flex justify-center items-center bg-black bg-opacity-30 backdrop-blur-sm " +
        (state ? "" : " hidden ")
      }
    >
      <div className="bg-white rounded-lg  py-2 px-6 text-center  overflow-x-auto mx-auto">
        <ModalStateManager
          state={state}
          dayWithEvents={dayWithEvents}
          userID={userID}
          ChangeDatabase={ChangesToDB}
          dictionary={dictionary}
        />
      </div>
    </div>
  );
};
function ModalStateManager({
  state,
  dayWithEvents,
  ChangeDatabase,
  userID,
  dictionary,
}: StateManager) {
  var s = state;
  var events: any[] = [];
  if (dayWithEvents.length !== 0 && state === 2) {
    dayWithEvents.map((e, i) => {
      events.push({
        date: GetDateAsString(e.sessionstarttime),
        start: GetTime(e.sessionstarttime),
        end: GetTime(e.sessionendtime),
        location: e.sessionlocation,
        capacity: e.sessioncapacity,
        instructor: e.instructorid,
        level: e.levelid,
        register: (
          <>
            <RegisterButton
              sessionID={e.sessionid}
              userID={userID}
              changeDB={ChangeDatabase}
            />
          </>
        ),
      });
    });
  }
  if (dayWithEvents.length !== 0 && state === 3) {
    dayWithEvents.map((e, i) => {
      events.push({
        date: GetDateAsString(e.sessionstarttime),
        start: GetTime(e.sessionstarttime),
        end: GetTime(e.sessionendtime),
        location: e.sessionlocation,
        capacity: e.sessioncapacity,
        instructor: e.instructorid,
        level: e.levelid,
      });
    });
  }

  switch (s) {
    case 1:
      return (
        <AddEventForm
          updateDB={ChangeDatabase}
          userID={userID}
          dictionary={dictionary}
        />
      );
    case 2:
      return <ViewStudentEvents events={events} />;
    case 3:
      return <ViewTeacherEvents events={events} />;
    default:
      return <>default state</>;
  }
}

function AddEventForm({ updateDB, userID, dictionary }: UpdatedDB) {
  const handleSubmit = (e: any) => {
    const formData = new FormData(e.currentTarget);
    const entries = Array.from(formData.entries());
    const values = Object.fromEntries(entries);
    AddEvent(values, userID, dictionary, updateDB);
  };

  return (
    <>
      <p className="text-purple-900 text-lg mb-2">Add Session</p>
      <form id="addEventForm" onSubmit={handleSubmit}>
        <table className="">
          <thead className=" text-xs text-gray-700 uppercase bg-gray-200">
            <TableHead titles={AddHeader} />
          </thead>
          <tbody className="items-center ">
            <AddEventFormRow
              dictionary={dictionary}
              updateDB={() => {}}
              userID={""}
            />
          </tbody>
        </table>
        <button
          form="addEventForm"
          type="submit"
          className="relative my-1 bg-purple-900 py-1 px-2 w-12 text-white text-m font-bold rounded-2xl z-100"
        >
          add
        </button>
      </form>
    </>
  );
}

function AddEventFormRow({ dictionary }: UpdatedDB) {
  const handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {};
  return (
    <>
      <tr className="divide divide-x border border-t-0">
        <td className="">
          <input
            required
            onChange={handleInputChange}
            type="Date"
            className="w-30 text-center border-none placeholder:text-gray-900/20"
            name="date"
          />
        </td>
        <td className="">
          <input
            required
            onChange={handleInputChange}
            type="time"
            className=" text-center border-none placeholder:text-gray-900/20"
            name="start"
          />
        </td>
        <td className="">
          <input
            required
            onChange={handleInputChange}
            type="time"
            className=" text-center border-none placeholder:text-gray-900/20"
            name="end"
          />
        </td>
        <td className="">
          <input
            required
            onChange={handleInputChange}
            type="text"
            placeholder="location"
            className="w-28 text-center border-none placeholder:text-gray-900/20"
            name="location"
            list="locations"
          />
          {dataListLocation}
        </td>
        <td className="">
          <input
            required
            onChange={handleInputChange}
            type="number"
            step="5"
            min="0"
            placeholder="..."
            className="w-20 text-center border-none placeholder:text-gray-900/20"
            name="capacity"
          />
        </td>
        <td className="">
          <input
            required
            onChange={handleInputChange}
            type="text"
            placeholder="level..."
            className="w-20 text-center border-none placeholder:text-gray-900/20"
            name="level"
            list="levels"
          />
          <datalist id="levels">
            {
              <>
                {dictionary
                  .filter((d) => d.type == "level")
                  .map((l, i) => {
                    return <option key={i} value={l.name}></option>;
                  })}
              </>
            }
          </datalist>
        </td>
      </tr>
    </>
  );
}
function AddEvent(
  data: { [key: string]: any },
  userID: string,
  dictionary: { id: string; name: string; type: string }[],
  changeDB: () => void
) {
  const start = new Date(data.date).getTime() + hourToMs(data.start);
  const end = new Date(data.date).getTime() + hourToMs(data.end);
  const loc = data.location;
  const cap = isNaN(data.capacity) ? 1 : data.capacity;

  const level = dictionary.filter(
    (d) => data.level.toLowerCase() === d.name.toLowerCase()
  )[0].id;

  const event: AddEvent = {
    sessionStartTime: new Date(start),
    sessionEndTime: new Date(end),
    sessionLocation: loc,
    sessionCapacity: cap.toString(),
    instructorId: userID,
    levelId: level.toString(),
  };
  addSessions(event, data.level, changeDB);
}

function ViewStudentEvents({ events }: Events) {
  var header = SessionHeaders.concat({ proportion: "w-4", content: "Enroll" });
  if (events.length === 0) return <>No Events Today!</>;
  return (
    <div className="overflow-auto">
      <p className="text-purple-900 text-lg mb-2">Sessions</p>

      <Table
        tableHead={header}
        data={events}
        onClickFunction={() => {}}
        showManage={false}
      />
    </div>
  );
}
function ViewTeacherEvents({ events }: Events) {
  if (events.length === 0) return <>No Events Today!</>;
  return (
    <div className="overflow-auto">
      <p className="text-purple-900 text-lg mb-2">Sessions</p>

      <Table
        tableHead={SessionHeaders}
        data={events}
        onClickFunction={() => {}}
        showManage={false}
      />
    </div>
  );
}
function RegisterButton({ sessionID, userID, changeDB }: RegisterButton) {
  function OnRegister() {
    Register(sessionID, userID);
    changeDB();
  }
  return (
    <button onClick={() => OnRegister()}>
      <i
        id={sessionID + "session^user" + userID}
        className="bi bi-check-square hover:text-gray-400"
      />
    </button>
  );
}
export function EditSessionModal({
  event,
  onClose,
  changeDB,
  dictionary,
  userID,
}: EditSession) {
  var form = <></>;
  const handleOnClose = (
    e: React.MouseEvent<HTMLUnknownElement, MouseEvent>
  ) => {
    const target = e.target;
    if (target instanceof HTMLDivElement && target.id === "blur3") {
      onClose();
    }
  };
  if (typeof event === typeof "string") {
    return <></>;
  }
  if (typeof event === "object") {
    var tempEvent: ITrainingSession = {
      sessionid: event.sessionid,
      sessionstarttime: event.sessionstarttime,
      sessionendtime: event.sessionendtime,
      sessionlocation: event.sessionlocation,
      instructorid: userID,
      levelid: event.levelid,
      sessioncapacity: event.sessioncapacity,
    };
    form = (
      <EditSessionForm
        dictionary={dictionary}
        changeDB={changeDB}
        event={tempEvent}
        userID={userID}
      />
    );
  }

  return (
    <div
      id="blur3"
      onClick={(e) => handleOnClose(e)}
      className={
        " fixed inset-0 flex w-full justify-center items-center bg-black bg-opacity-30 "
      }
    >
      <div className=" rounded-2xl  py-2 px-6 bg-white mx-auto text-center  overflow-x-auto">
        <h1 className="relative text-2xl text-purple-900 text-center mt-1">
          Edit Form
        </h1>
        {form}
      </div>
    </div>
  );
}
function EditSessionForm({
  event,
  changeDB,
  userID,
  dictionary,
}: EditSessionForm) {
  const handleInputChange = (type: string) => {};
  const handleSubmit = (e: any) => {
    e.preventDefault();
    var start: string =
      (event.sessionstarttime.getHours() + "").padStart(2, "0") +
      ":" +
      (event.sessionstarttime.getMinutes() + "").padStart(2, "0") +
      ":" +
      (event.sessionstarttime.getSeconds() + "").padStart(2, "0");
    var end: string =
      (event.sessionendtime.getHours() + "").padStart(2, "0") +
      ":" +
      (event.sessionendtime.getMinutes() + "").padStart(2, "0") +
      ":" +
      (event.sessionendtime.getSeconds() + "").padStart(2, "0");
    const formData = new FormData(e.currentTarget);
    const entries = Array.from(formData.entries());
    const values = Object.fromEntries(entries);
    var data = {
      id: event.sessionid,
      date:
        values.date !== ""
          ? values.date
          : GetDateAsString(event.sessionstarttime),
      start: values.start !== "" ? values.start : start,
      end: values.end !== "" ? values.start : end,
      location:
        values.location !== "" ? values.location : event.sessionlocation,
      capacity:
        values.capacity !== "" ? values.capacity : event.sessioncapacity,
      level: values.level !== "" ? values.level : event.levelid,
    };
    EditEvent(data, userID, dictionary, changeDB);
  };

  return (
    <form id="editEventForm" onSubmit={handleSubmit}>
      <table id="EditModal">
        <thead className=" text-xs text-gray-700 uppercase bg-gray-200">
          <TableHead titles={AddHeader} />
        </thead>

        <tbody>
          <tr className="divide divide-x border border-t-0">
            <td className="">
              <input
                onChange={() => handleInputChange("date")}
                type="date"
                className="w-30 text-center border-none placeholder:text-gray-900/40 pla"
                name="date"
              />
            </td>
            <td className="">
              <input
                onChange={() => handleInputChange("start")}
                type="time"
                className="w-26 text-center border-none placeholder:text-gray-900/40"
                name="start"
              />
            </td>
            <td className="">
              <input
                onChange={() => handleInputChange("end")}
                type="time"
                className="w-26 text-center border-none placeholder:text-gray-900/40"
                name="end"
              />
            </td>
            <td className="">
              <input
                onChange={() => handleInputChange("location")}
                type="text"
                className="w-28 text-center border-none placeholder:text-gray-900/40"
                name="location"
                list="locations"
                placeholder={event.sessionlocation}
              />
              {dataListLocation}
            </td>
            <td className="">
              <input
                onChange={() => handleInputChange("capacity")}
                type="number"
                step="5"
                min="0"
                className="w-20 text-center border-none placeholder:text-gray-900/40"
                name="capacity"
                placeholder={event.sessioncapacity + ""}
              />
            </td>
            <td className="">
              <input
                onChange={() => handleInputChange("level")}
                type="text"
                className="w-32 text-center border-none placeholder:text-gray-900/40"
                name="level"
                list="levels"
                placeholder={event.levelid}
              />
              <datalist id="levels">
                {
                  <>
                    {dictionary
                      ?.filter((d) => d.type == "level")
                      .map((l, i) => {
                        return <option key={i} value={l.name}></option>;
                      })}
                  </>
                }
              </datalist>
            </td>
          </tr>
        </tbody>
      </table>
      <p className="text-xs text-gray-900/40 ">
        *values not inputed will stay the same*
      </p>
      <button
        form="editEventForm"
        type="submit"
        className="relative my-px bg-purple-900 py-1 px-2 w-24 text-white text-m font-bold rounded-2xl z-100"
      >
        Change
      </button>
    </form>
  );
}
function EditEvent(
  data: { [key: string]: any },
  userID: string,
  dictionary: { id: string; name: string; type: string }[],
  changeDB: () => void
) {
  const start = new Date(data.date).getTime() + hourToMs(data.start);
  const end = new Date(data.date).getTime() + hourToMs(data.end);
  const loc = data.location;
  const cap = isNaN(data.capacity) ? 1 : data.capacity;

  const level = dictionary.filter(
    (d) => data.level.toLowerCase() === d.name.toLowerCase()
  )[0]?.id;

  const event: any = {
    sessionID: data.id,
    sessionStartTime: new Date(start),
    sessionEndTime: new Date(end),
    sessionLocation: loc,
    sessionCapacity: cap.toString(),
    instructorID: userID,
    levelID: level?.toString(),
  };
  editSessions(event, changeDB);
}
interface EnrolledStudent {
  session: string;
  visible: boolean;
  onClose: () => void;
  changeDB: () => void;
  dictionary: { name: string; id: string; type: string }[];
}
export function EnrolledStudents({
  session,
  onClose,
  visible,
  changeDB,
  dictionary,
}: EnrolledStudent) {
  const [studentsEnrolled, setEnrolled] = useState<
    {
      studentid: string;
      sessionid: string;
      attendance: boolean;
      studentname: string;
    }[]
  >([]);
  const handleOnClose = (
    e: React.MouseEvent<HTMLUnknownElement, MouseEvent>
  ) => {
    const target = e.target;
    if (target instanceof HTMLDivElement && target.id === "blur3") {
      onClose();
    }
  };
  useEffect(() => {
    GetEnrolledStudents(session, setEnrolled);
  }, [session, changeDB]);
  return (
    <div
      id="blur3"
      onClick={(e) => handleOnClose(e)}
      className={
        " fixed inset-0 flex justify-center w-screen h-screen items-center bg-black bg-opacity-30 backdrop-blur-sm  " +
        (visible ? " " : " hidden ")
      }
    >
      <div className="bg-white rounded-lg  py-4 px-6 text-center w-1/2  overflow-x-auto mx-auto ">
        <h1 className="relative text-center text-2xl text-purple-900">
          Enrolled Student
        </h1>
        <EnrollStudentsTable students={studentsEnrolled} changeDB={changeDB} />
      </div>
    </div>
  );
}
interface EnrolledStudentTable {
  students: {
    studentid: string;
    sessionid: string;
    attendance: boolean;
    studentname: string;
  }[];
  changeDB: () => void;
}
function EnrollStudentsTable({ students, changeDB }: EnrolledStudentTable) {
  console.log(students);
  var studentsMapped: object[] = students.map((e) => {
    return {
      student: e.studentname,
      remove: UnenrollButton(e.studentid, e.sessionid, changeDB),
    };
  });
  var element: JSX.Element = <>No Enrolled Students!</>;
  if (students.length > 0) {
    element = (
      <>
        <Table
          tableHead={StudentEnrolled}
          data={studentsMapped}
          showManage={false}
          onClickFunction={() => {}}
        />
      </>
    );
  }
  return element;
}
function UnenrollButton(
  student: string,
  session: string,
  changeDB: () => void
) {
  function handleClick() {
    Unenroll(student, session, changeDB);
  }
  return (
    <i className="bi bi-person-dash-fill" onClick={() => handleClick()}></i>
  );
}
function AttendanceButton(
  student: string,
  session: string,
  attendance: boolean,
  changeDB: () => void
) {
  function handleClick() {
    ShuffleAttendance(session, student, !attendance, changeDB);
  }
  if (attendance) {
    <i
      className="bi bi-check-circle-fill text-green"
      onClick={() => handleClick()}
    />;
  }
  return <i className="bi bi-check-circle" onClick={() => handleClick()} />;
}
const dataListLocation: JSX.Element = (
  <>
    <datalist id="locations">
      <option value="CMLP 54" />
      <option value="CMLP 63A" />
      <option value="ACEB 1140" />
    </datalist>
  </>
);
//used to set header for input on session table
const SessionHeaders: TableHeaders[] = [
  {
    proportion: "w-28",
    content: "Date",
  },
  {
    proportion: "",
    content: "Start",
  },
  {
    proportion: "",
    content: "End",
  },
  {
    proportion: "",
    content: "Location",
  },
  {
    proportion: "",
    content: "Capacity",
  },
  {
    proportion: "",
    content: "Instructor",
  },
  {
    proportion: "w-32",
    content: "Level",
  },
];
//used for header that display day of week
export const HeaderCal: TableHeaders[] = [
  {
    proportion: " ",
    content: "Sun",
  },
  {
    proportion: " ",
    content: "Mon",
  },
  {
    proportion: " ",
    content: "Tue",
  },
  {
    proportion: " ",
    content: "Wed",
  },
  {
    proportion: " ",
    content: "Thu",
  },
  {
    proportion: " ",
    content: "Fri",
  },
  {
    proportion: " ",
    content: "Sat",
  },
];
export const StudentEnrolled: TableHeaders[] = [
  {
    proportion: " ",
    content: "Student",
  },
  {
    proportion: " ",
    content: "Remove",
  },
];
export const AddHeader: TableHeaders[] = [
  {
    proportion: "",
    content: "Date",
  },
  {
    proportion: "",
    content: "Start",
  },
  {
    proportion: "",
    content: "End",
  },
  {
    proportion: "",
    content: "Location",
  },
  {
    proportion: "",
    content: "Capacity",
  },
  {
    proportion: "",
    content: "Level",
  },
];
export const MemoizedModal = memo(EventModal);
