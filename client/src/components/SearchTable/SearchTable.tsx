import { IOptions, TableHeaders } from "../../types";
import { useEffect, useState } from "react";
import Dialog from "../../components/Dialog/Dialog";
import Table from "../Table/Table";
import axios from "axios";
interface OptionProps {
  options: IOptions[];
  headers: TableHeaders[];
  tData: Array<any>;
  type: string;
}

function SearchDropdown({ options, headers, tData, type }: OptionProps) {
  const [searchValue, setSearchValue] = useState<any | null>("");
  const [selectedOption, setSelectedOption] = useState<any | null>(
    options[0].optionContent
  );
  const [dialogAction, setDialogAction] = useState<any | null>("Add");
  const [filteredResults, setFilteredResults] = useState<any | null>(tData);
  const [linkTrainingExercise, setLinkTrainingExercise] = useState<any | null>(
    []
  );
  const [currentEditRow, setCurrentEditData] = useState<any | null>(null);
  const [exerciseData, setExerciseData] = useState<any | null>(null);
  const [skillData, setSkillData] = useState<any | null>(null);
  const [levelOptions, setLevelOptions] = useState<any | null>([]);
  const [linkExercisesSkill, setLinkExerciseSkills] = useState<any | null>([]);

  const selectOption = (e: any) => {
    e.preventDefault();
    setSelectedOption(e.target.value);
  };

  //appending the edit buttons to the tData or filteredResults for displaying edit buttons in the rows

  const [isOpen, setDialogState] = useState<any | boolean>(false);

  const handleOnClose = () => setDialogState(false);

  const handleOnOpen = (currentRow: object) => {
    setDialogState(true);
    setDialogAction("Update");
    setCurrentEditData(currentRow);
  };
  const search = (event: any) => {
    event.preventDefault();
    if (searchValue !== "") {
      let filteredData;

      switch (selectedOption) {
        case "Exercise Name":
          filteredData = filteredResults.filter((data: any) =>
            data.exercisename.includes(searchValue) ? true : false
          );
          break;

        case "Description":
          if (type === "Exercise")
            filteredData = filteredResults.filter((data: any) =>
              data.exercisedescription.includes(searchValue) ? true : false
            );
          if (type === "Skill")
            filteredData = filteredResults.filter((data: any) =>
              data.skilldescription.includes(searchValue) ? true : false
            );
          break;

        case "Corresponding Skills":
          filteredData = filteredResults.filter((data: any) =>
            data.CorrespondingSkills.includes(searchValue) ? true : false
          );
          break;

        case "Associated Levels":
          filteredData = filteredResults.filter((data: any) =>
            data.levelname.includes(searchValue) ? true : false
          );
          break;

        case "Skill Name":
          filteredData = filteredResults.filter((data: any) =>
            data.skillname.includes(searchValue) ? true : false
          );
          break;

        case "Associated Exercise":
          filteredData = filteredResults.filter((data: any) =>
            data.exercisename.includes(searchValue) ? true : false
          );
          break;

        case "Level Name":
          filteredData = filteredResults.filter((data: any) =>
            data.levelname.includes(searchValue) ? true : false
          );
          break;

        case "Level Description":
          filteredData = filteredResults.filter((data: any) =>
            data.leveldescription.includes(searchValue) ? true : false
          );
          break;

        default:
          break;
      }

      setFilteredResults(filteredData);
      setSearchValue("");
    } else {
      if (type === "Exercise") setFilteredResults(exerciseData);
      else if (type === "Skill") setFilteredResults(skillData);
    }
  };
  const getAllLevels = async () => {
    return await axios.get("http://localhost:5000/api/levels").then((data) => {
      setLevelOptions(data.data);
    });
  };

  const getExercises = async () => {
    return await axios
      .get("http://localhost:5000/api/exercises")
      .then((data) => {
        setFilteredResults(data.data);
        setExerciseData(data.data);
      });
  };

  const getAllExercises = async () => {
    return await axios
      .get("http://localhost:5000/api/exercises")
      .then((data) => {
        setExerciseData(data.data);
      });
  };

  const getTrainingLevels = async () => {
    return await axios.get("http://localhost:5000/api/levels").then((data) => {
      setFilteredResults(data.data);
    });
  };

  const getSkills = async () => {
    return await axios.get("http://localhost:5000/api/skills").then((data) => {
      setFilteredResults(data.data);
      setSkillData(data.data);
    });
  };

  const getLinkedExerciseTraining = async () => {
    return await axios
      .get("http://localhost:5000/api/exercises/link")
      .then((data) => {
        setLinkTrainingExercise(data.data);
      });
  };

  const getLinkedExerciseSkills = async () => {
    return await axios
      .get("http://localhost:5000/api/skills/link")
      .then((data) => {
        setLinkExerciseSkills(data.data);
      });
  };

  useEffect(() => {
    if (type === "Exercise") {
      getExercises();
      getLinkedExerciseTraining();
      getAllLevels();
    }

    if (type === "Skill") {
      getSkills();
      getLinkedExerciseSkills();
      getAllExercises();
    }
    if (type === "Training Levels") {
      getTrainingLevels();
      getLinkedExerciseTraining();
      getAllLevels();
      getAllExercises();
    }
    // setFilteredResults(tData);
  }, []);

  const filteringResult = (data: any[]) => {
    if (type === "Exercise") {
      for (let e of filteredResults) e.levelname = "";

      for (let t of linkTrainingExercise) {
        for (let e of filteredResults) {
          if (e.exerciseid === t.exerciseid) {
            e.levelname = t.levelname;
            e.levelid = t.levelid;
          }
        }
      }
    } else if (type === "Skill") {
      for (let e of filteredResults) e.exercisename = "";

      for (let exercise of linkExercisesSkill) {
        for (let skill of filteredResults) {
          if (skill.skillid === exercise.skillid) {
            skill.exercisename =
              skill.exercisename === ""
                ? exercise.exercisename
                : (skill.exercisename += ", " + exercise.exercisename);

            skill.exerciseid = exercise.exerciseid;
          }
        }
      }
    } else if (type === "Training Levels") {
      for (let t of filteredResults) t.exercisename = "";

      for (let t of linkTrainingExercise) {
        for (let training of filteredResults) {
          if (training.levelid === t.levelid) {
            training.exercisename =
              training.exercisename === ""
                ? t.exercisename
                : (training.exercisename += ", " + t.exercisename);

            training.exerciseid = t.exerciseid;
          }
        }
      }
    }
    return filteredResults;
  };

  const onChange = (e: any) => {
    e.preventDefault();
    setSearchValue(e.target.value);
  };
  return (
    <div>
      <form>
        <div className="flex">
          <div>
            <select
              className="w-62 p-2.0 text-gray-500 bg-white border rounded-md shadow-sm outline-none appearance-none focus:border-indigo-600"
              onClick={(e) => selectOption(e)}
            >
              {options.map((option) => (
                <option>{option.optionContent}</option>
              ))}
            </select>
          </div>
          <div className="relative w-full">
            <input
              type="text"
              id="search-dropdown"
              className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-r-lg border-l-gray-50 border-l-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-l-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
              placeholder="Search the from the table below"
              value={searchValue}
              required
              onChange={(e) => onChange(e)}
            />
            <button
              type="submit"
              onClick={(e) => search(e)}
              className="absolute top-0 right-0 p-2.5 text-sm font-medium text-white bg-blue-700 rounded-r-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              <svg
                aria-hidden="true"
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
              <span className="sr-only">Search</span>
            </button>
          </div>
        </div>
      </form>
      <div>
        <button
          className="bg-violet-900 px-4 py-2 text-white rounded-md"
          onClick={(e) => {
            setDialogState(true);
            setDialogAction("Add");
          }}
        >
          Add New {type}
        </button>

        <button
          className="bg-violet-900 px-4 py-2 text-white rounded-md"
          onClick={(e) => {
            setDialogState(true);
            setDialogAction("Link");
          }}
        >
          Link
        </button>
        <button
          className="bg-violet-900 px-4 py-2 text-white rounded-md"
          onClick={(e) => {
            setDialogState(true);
            setDialogAction("Unlink");
          }}
        >
          Unlink
        </button>
      </div>
      <Table
        tableHead={headers}
        data={filteringResult(filteredResults)}
        onClickFunction={handleOnOpen}
        showManage

        type={type}

      />
      <Dialog
        visible={isOpen}
        handleOnClose={handleOnClose}
        type={type}
        action={dialogAction}
        tData={[]}
        levelOptions={levelOptions}
        skillOptions={skillData}
        currentData={currentEditRow}
        exerciseData={exerciseData}
      ></Dialog>
    </div>
  );
}

export default SearchDropdown;
