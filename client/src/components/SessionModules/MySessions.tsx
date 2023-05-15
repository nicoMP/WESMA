import axios from "axios";
import { useEffect, useState } from "react";
import { ITrainingSession, TableHeaders } from "../../types";
import { GetDateAsString, GetTime } from "../Calendar/GeneralFunctions";
import Table from "../Table/Table";
import { EditSessionModal, EnrolledStudents } from "./SessionModule";
const UNENROLL_URL = "http://localhost:5000/api/sessions/drop";
const DELETE_URL = "http://localhost:5000/api/sessions";

export const Unenroll = async (
  student: string,
  session: string,
  changeDB: () => void
) => {
  axios
    .delete(UNENROLL_URL, { data: { studentId: student, sessionID: session } })
    .then((m) => {
      window.alert(
        "Student Dropped Session" + `\nServer Response: ` + m.status
      );
      changeDB();
    })
    .catch((e) => window.alert(e.message));
};
const DeleteSession = async (session: string) => {
  axios
    .delete(DELETE_URL, { data: { sessionID: session } })
    .then((m) =>
      window.alert("Deleted Session" + `\nServer Response: ` + m.status)
    )
    .catch((e) => window.alert(e.message));
};
interface MySessions {
  events: ITrainingSession[];
  userID: string;
  visible: boolean;
  dictionary: { name: string; id: string; type: string }[];
  onClose: () => void;
  changeDB: () => void;
}
interface UnregisterButton {
  session: string;
  student: string;
  changeDB: () => void;
}
interface DeleteButton {
  session: string;
  changeDB: () => void;
}
interface EnrolledButton {
  setSession: () => void;
  changeDB: () => void;
  open: () => void;
}
interface EditButton {
  session: ITrainingSession;
  setEvent: (e: ITrainingSession) => void;
  open: () => void;
}
export function MyTeacherSessions({
  events,
  userID,
  dictionary,
  visible,
  onClose,
  changeDB,
}: MySessions) {
  const [modalOpen, setModal] = useState<boolean>(false);
  const [selectedEvent, setEvent] = useState<ITrainingSession>();
  const [viewEnrolled, setEnrollView] = useState<boolean>(false);
  const [selectedSession, setSession] = useState<string>();
  const handleOnClose = (
    e: React.MouseEvent<HTMLUnknownElement, MouseEvent>
  ) => {
    const target = e.target;
    if (target instanceof HTMLDivElement && target.id === "blur2") {
      onClose();
    }
  };
  const MyEvents = events.map((e) => {
    return {
      date: GetDateAsString(e.sessionstarttime),
      start: GetTime(e.sessionstarttime),
      end: GetTime(e.sessionendtime),
      location: e.sessionlocation,
      capacity: e.sessioncapacity,
      level: e.levelid,
      edit: (
        <EditSessionButton
          session={e}
          setEvent={setEvent}
          open={() => setModal(true)}
        />
      ),
      enrolled: (
        <GetEnrolled
          open={() => setEnrollView(true)}
          changeDB={changeDB}
          setSession={() => setSession(e.sessionid)}
        />
      ),
      delete: <DeleteSessionButton session={e.sessionid} changeDB={changeDB} />,
    };
  });
  return (
    <div
      id="blur2"
      onClick={(e) => handleOnClose(e)}
      className={
        " fixed inset-0 flex justify-center w-full items-center bg-black bg-opacity-30 backdrop-blur-sm  " +
        (visible ? " " : " hidden ")
      }
    >
      <div className="bg-white rounded-lg  py-4 px-6 text-center w-1/2  overflow-x-auto mx-auto ">
        <h1 className="relative text-center text-2xl text-purple-900">
          My Sessions
        </h1>
        <Table
          type=""
          tableHead={ISessionHeaders.concat([
            { proportion: "", content: "Edit" },
            { proportion: "", content: "Enrolled" },
            { proportion: "", content: <i className="bi bi-trash3-fill"></i> },
          ])}
          data={MyEvents}
          showManage={false}
          onClickFunction={() => {}}
        />
        {modalOpen ? (
          <EditSessionModal
            onClose={() => {
              setModal(false);
            }}
            event={selectedEvent !== undefined ? selectedEvent : "Error"}
            userID={userID}
            dictionary={dictionary}
            changeDB={changeDB}
          />
        ) : (
          <></>
        )}
        <EnrolledStudents
          onClose={() => setEnrollView(false)}
          visible={viewEnrolled}
          session={selectedSession != null ? selectedSession : ""}
          changeDB={changeDB}
          dictionary={dictionary}
        />
      </div>
    </div>
  );
}
export function MyStudentSessions({
  events,
  userID,
  visible,
  onClose,
  changeDB,
}: MySessions) {
  var MyEvents = events.map((e) => {
    return {
      date: GetDateAsString(e.sessionstarttime),
      start: GetTime(e.sessionstarttime),
      end: GetTime(e.sessionendtime),
      location: e.sessionlocation,
      capacity: e.sessioncapacity,
      instructor: e.instructorid,
      level: e.levelid,
      unenroll: (
        <UnenrollButton
          session={e.sessionid}
          student={userID}
          changeDB={changeDB}
        />
      ),
    };
  });

  const handleOnClose = (
    e: React.MouseEvent<HTMLUnknownElement, MouseEvent>
  ) => {
    const target = e.target;
    if (target instanceof HTMLDivElement && target.id === "blur1") {
      onClose();
    }
  };
  return (
    <div
      id="blur1"
      onClick={(e) => handleOnClose(e)}
      className={
        " fixed inset-0 flex justify-center w-full items-center bg-black bg-opacity-30 backdrop-blur-sm  " +
        (visible ? " " : " hidden ")
      }
    >
      <div className="bg-white rounded-lg  py-4 px-6 text-center w-1/2  overflow-x-auto mx-auto ">
        <h1 className="relative text-center text-2xl text-purple-900">
          Enrolled Sessions
        </h1>

        <Table
          tableHead={SessionHeaders.concat({
            proportion: "w-2",
            content: "Unenroll",
          })}
          data={MyEvents}
          showManage={false}
          onClickFunction={() => {}}
        />
      </div>
    </div>
  );
}

function DeleteSessionButton({ session, changeDB }: DeleteButton) {
  function deleteSessionAction(e: React.MouseEvent) {
    DeleteSession(session);
    changeDB();
    window.location.reload();
  }
  return (
    <>
      <i
        className="bi bi-dash-square-dotted w-2"
        onClick={(e) => {
          deleteSessionAction(e);
        }}
      ></i>
    </>
  );
}
function UnenrollButton({ session, student, changeDB }: UnregisterButton) {
  function UnregisterStudent(e: React.MouseEvent) {
    e.preventDefault();
    Unenroll(student, session, changeDB);
  }
  return (
    <>
      <i
        className="bi bi-dash-square-dotted w-2"
        onClick={(e) => {
          UnregisterStudent(e);
        }}
      ></i>
    </>
  );
}
function EditSessionButton({ session, setEvent, open }: EditButton) {
  function EditSessionAction(e: React.MouseEvent) {
    e.preventDefault();
    setEvent(session);
    open();
  }
  return (
    <>
      <i
        className="bi bi-pencil-square"
        onClick={(e) => {
          EditSessionAction(e);
        }}
      ></i>
    </>
  );
}
function GetEnrolled({ changeDB, open, setSession }: EnrolledButton) {
  function EditSessionAction(e: React.MouseEvent) {
    e.preventDefault();
    setSession();
    open();
  }
  return (
    <>
      <i
        className="bi bi-people"
        onClick={(e) => {
          EditSessionAction(e);
        }}
      ></i>
    </>
  );
}
const SessionHeaders: TableHeaders[] = [
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
    content: "Instructor",
  },
  {
    proportion: "",
    content: "Level",
  },
];
const ISessionHeaders: TableHeaders[] = [
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
