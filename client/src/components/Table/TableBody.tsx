import axios from "axios";
interface RowData {
  showManage: boolean;
  data: object[];
  onClickFunction: (currentRow: object) => void;
  type: string;
}

var ShowManage = false;
function TableBody({ data, onClickFunction, showManage, type }: RowData) {
  ShowManage = showManage !== null ? showManage : true;
  return (
    <>
      <tbody className="">{tableRows(data, onClickFunction, type)}</tbody>
    </>
  );
}
let onDelete = (e: any, row: any, type: string) => {
  //Sending the DELETE request to remove data and reload the page
  window.location.reload();
  let deleteParams;
  switch (type) {
    case "Exercise":
      deleteParams = [{ exerciseID: row.exerciseid }];

      return axios
        .delete("http://localhost:5000/api/exercises", {
          data: deleteParams,
        })
        .then(function (response) {
          console.log(response);
        });

    case "Skill":
      deleteParams = [{ skillID: row.skillid }];
      console.log(deleteParams);
      return axios
        .delete("http://localhost:5000/api/skills", {
          data: deleteParams,
        })
        .then(function (response) {
          console.log(response);
        });

    case "Training Levels":
      deleteParams = [{ levelID: row.levelid }];
      console.log(deleteParams);
      return axios
        .delete("http://localhost:5000/api/levels", {
          data: deleteParams,
        })
        .then(function (response) {
          console.log(response);
        });
  }
};
function tableRows(content: object[], onClickFunction: any, type: string) {
  //this function returns all rows from the data given
  var TableRows: any[] = [];
  content.forEach((obj, i) => {
    TableRows.push(tableRow(obj, onClickFunction, i, type));
  });
  return <>{TableRows}</>;
}
function tableRow(row: object, onClickFunction: any, i: number, type: string) {
  var tableRow: JSX.Element[] = [];

  //Filtering the data to display for exercises, skills and training levels
  for (const [key, value] of Object.entries(row)) {
    if (key !== "exerciseid" && key !== "levelid" && key !== "skillid") {
      tableRow.push(
        // Here to change style of dt cell
        <td scope="col" className="text-center border" key={key}>
          {value}
        </td>
      );
    }
  }
  const rowFunction = ShowManage ? () => {} : onClickFunction;
  return (
    // here to change style of row
    <tr
      onClick={(e) => rowFunction(e)}
      className="divide-x hover:bg-purple-100 odd:bg-slate-100/60"
      key={i}
    >
      {tableRow}
      {ManageButtons(ShowManage, onClickFunction, row, type)}
    </tr>
  );
}
function ManageButtons(
  b: boolean,
  onClickFunction: any,
  row: object,
  type: string
) {
  var mb = <></>;
  if (b) {
    mb = (
      <>
        <td
          scope="col"
          className={
            "flex items-center justify-center text-center " + ShowManage
              ? " "
              : " hidden"
          }
        >
          <button
            onClick={(e) => {
              onClickFunction(row);
            }}
            className="text-center content-center w-full"
          >
            <i className="bi bi-pencil-square" />
          </button>
        </td>
        <td
          scope="col"
          className={
            " flex items-center justify-center text-center" + ShowManage
              ? " "
              : " hidden"
          }
        >
          <button
            className="text-center content-center w-full"
            type="submit"
            onClick={(e) => {
              onDelete(e, row, type);
            }}
          >
            <i className="bi bi-trash3" />
          </button>
        </td>
      </>
    );
  }
  return mb;
}

export default TableBody;
