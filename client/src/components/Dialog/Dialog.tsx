import { useEffect, useState } from "react";
import { ISkill } from "../../types";
import axios from "axios";
interface dialogProps {
  visible: boolean;
  handleOnClose: () => void;
  type: string;
  action: string;
  tData: Array<any>;
  currentData: any;
  levelOptions: Array<any>;
  exerciseData: Array<any>;
  skillOptions: Array<any>;
}

interface contentProps {
  name?: string;
  description?: string;
  associatedExercises?: string;
  associatedSkills?: string;
  associatedLevel?: string;
  associatedExercisesID?: string;
  associatedSkillsID?: string;
  associatedLevelID?: string;
}

function Dialog({
  visible,
  handleOnClose,
  type,
  action,
  tData,
  levelOptions,
  currentData,
  exerciseData,
  skillOptions,
}: dialogProps) {
  const [dialogContent, setDialogContent] = useState<contentProps | null>(null);
  const [linkedTrainingLevelExercise, setLinkedTrainingLevelExercise] =
    useState<any | null>([]);
  const [linkedExerciseSkill, setLinkedExerciseSkill] = useState<any | null>(
    []
  );
  const [allLinkExerciseLevels, setAllLinkExericseLevels] = useState<
    any | null
  >([]);

  let autofill = false;

  let originalName: any;
  if (!visible) return null;

  action === "Update" ? (autofill = true) : (autofill = false);

  const retrieveLinkedLevelExercise = async (id: any) => {
    if (type === "Exercise")
      return await axios
        .get(`http://localhost:5000/api/exercises/link/${id}`)
        .then((data) => {
          setLinkedTrainingLevelExercise(data.data);
        });
    if (type === "Training Levels")
      return await axios
        .get(`http://localhost:5000/api/levels/link/${id}`)
        .then((data) => {
          setLinkedTrainingLevelExercise(data.data);
        });
  };

  const retrievedAllLinkExerciseLevel = async () => {
    return await axios
      .get(`http://localhost:5000/api/exercises/link`)
      .then((data) => {
        setAllLinkExericseLevels(data.data);
      });
  };

  const retrieveLinkedExerciseSkill = async (id: any) => {
    return await axios
      .get(`http://localhost:5000/api/skills/link/${id}`)
      .then((data) => {
        setLinkedExerciseSkill(data.data);
      });
  };

  const levelIDLookUp = (content: any) => {
    for (let level of levelOptions)
      if (level.levelname === content) return level.levelid;
  };

  const exerciseIDLookUp = (content: any) => {
    for (let exercise of exerciseData)
      if (exercise.exercisename === content) {
        return exercise.exerciseid;
      }
  };
  const skillIDLookUp = (content: any) => {
    for (let skill of skillOptions)
      if (skill.skillname === content) {
        return skill.skillid;
      }
  };

  const addContent = (e: any) => {
    /** @todo:
     *     Implement error check when the field is empty
     *     Send POST request to the server
     *
     */

    // post request:
    if (action === "Add") {
      if (type === "Exercise")
        axios
          .post("http://localhost:5000/api/exercises", [
            {
              exerciseName: dialogContent?.name,
              exerciseDescription: dialogContent?.description,
            },
          ])
          .then(function (response) {
            console.log(response);
          });

      if (type === "Skill") {
        axios
          .post("http://localhost:5000/api/skills", [
            {
              skillName: dialogContent?.name,
              skillDescription: dialogContent?.description,
            },
          ])
          .then(function (response) {
            console.log(response);
          });
      }

      if (type === "Training Levels") {
        axios
          .post("http://localhost:5000/api/levels", [
            {
              levelName: dialogContent?.name,
              levelDescription: dialogContent?.description,
            },
          ])
          .then(function (response) {
            console.log(response);
          });
      }
    }
    if (action === "Link") {
      if (type === "Exercise" || type === "Training Levels") {
        axios
          .post("http://localhost:5000/api/exercises/link", [
            {
              exerciseID: dialogContent?.associatedExercisesID,
              levelID: dialogContent?.associatedLevelID,
            },
          ])
          .then(function (response) {
            console.log(response);
          });
      } else if (type === "Skill") {
        axios
          .post("http://localhost:5000/api/skills/link", [
            {
              exerciseID: dialogContent?.associatedExercisesID,
              skillID: dialogContent?.associatedSkillsID,
            },
          ])
          .then(function (response) {
            console.log(response);
          });
      }
    }
    if (action === "Update") {
      if (type === "Exercise")
        axios
          .put("http://localhost:5000/api/exercises", [
            {
              exerciseID: exerciseIDLookUp(originalName),
              exerciseName: dialogContent?.name,
              exerciseDescription: dialogContent?.description,
            },
          ])
          .then(function (response) {
            console.log(response);
          });

      if (type === "Skill") {
        axios
          .put("http://localhost:5000/api/skills", [
            {
              skillID: skillIDLookUp(originalName),
              skillName: dialogContent?.name,
              skillDescription: dialogContent?.description,
            },
          ])
          .then(function (response) {
            console.log(response);
          });
      }
      if (type === "Training Levels") {
        axios
          .put("http://localhost:5000/api/levels", [
            {
              levelID: levelIDLookUp(originalName),
              levelName: dialogContent?.name,
              levelDescription: dialogContent?.description,
            },
          ])
          .then(function (response) {
            console.log(response);
          });
      }
    }
    if (action === "Unlink") {
      if (type === "Exercise" || type === "Training Levels") {
        const unlinkParams = [
          {
            exerciseID: dialogContent?.associatedExercisesID,
            levelID: dialogContent?.associatedLevelID,
          },
        ];
        axios
          .delete("http://localhost:5000/api/exercises/unlink", {
            data: unlinkParams,
          })
          .then(function (response) {
            console.log(response);
          });
      }

      if (type === "Skill") {
        const unlinkParams = [
          {
            skillID: dialogContent?.associatedSkillsID,
            exerciseID: dialogContent?.associatedExercisesID,
          },
        ];

        axios
          .delete("http://localhost:5000/api/skills/unlink", {
            data: unlinkParams,
          })
          .then(function (response) {
            console.log(response);
          });
      }
    }
  };
  const selectSkillOption = (e: any) => {
    setDialogContent({
      ...dialogContent,
      associatedSkills: e.target.value,
      associatedSkillsID: skillIDLookUp(e.target.value),
    });

    if (type === "Skill") {
      if (action === "Unlink" || "Link") {
        if (skillIDLookUp(e.target.value) !== undefined)
          retrieveLinkedExerciseSkill(skillIDLookUp(e.target.value));
      }
    }
  };

  const selectLevelOption = (e: any) => {
    setDialogContent({
      ...dialogContent,
      associatedLevel: e.target.value,
      associatedLevelID: levelIDLookUp(e.target.value),
    });

    if (type === "Training Levels") {
      if (action === "Link" || action === "Unlink") {
        if (levelIDLookUp(e.target.value) !== undefined) {
          retrievedAllLinkExerciseLevel();
          retrieveLinkedLevelExercise(levelIDLookUp(e.target.value));
        }
      }
    }
  };

  const selectExerciseOption = (e: any) => {
    setDialogContent({
      ...dialogContent,
      associatedExercises: e.target.value,
      associatedExercisesID: exerciseIDLookUp(e.target.value),
    });

    if (action === "Unlink") {
      if (type === "Exercise" && exerciseIDLookUp(e.target.value) !== undefined)
        retrieveLinkedLevelExercise(exerciseIDLookUp(e.target.value));
    }
  };

  const determineValue = (action: any, type: any, name: any) => {
    if (action === "Update") {
      if (type === "Exercise") {
        if (name) {
          originalName = currentData.exercisename;
          return currentData.exercisename;
        } else {
          return currentData.exercisedescription;
        }
      }
      if (type === "Skill")
        if (name) {
          originalName = currentData.skillname;
          return currentData.skillname;
        } else return currentData.skilldescription;

      if (type === "Training Levels")
        if (name) {
          originalName = currentData.levelname;
          return currentData.levelname;
        } else return currentData.leveldescription;
    } else return null;
  };

  let updateInputField =
    action === "Update" ? (
      <>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            {type} Name:
          </label>
          <input
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            placeholder="Name"
            type="text"
            defaultValue={determineValue(action, type, true)}
            onChange={(e) => {
              if (type === "Exercise") {
                currentData.exercisename = e.target.value;
              }
              if (type === "Skill") {
                currentData.skillname = e.target.value;
              }
              if (type === "Training Levels") {
                currentData.levelname = e.target.value;
              }
              setDialogContent({
                ...dialogContent,
                name: e.target.value,
                description: determineValue(action, type, false),
              });
            }}
            required
          ></input>
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            {type} Description:
          </label>
          <input
            placeholder="Description"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            onChange={(e) => {
              if (type === "Exercise") {
                currentData.exercisedescription = e.target.value;
              }
              if (type === "Skill") {
                currentData.skilldescription = e.target.value;
              }
              if (type === "Training Levels") {
                currentData.leveldescription = e.target.value;
              }
              setDialogContent({
                ...dialogContent,
                description: e.target.value,
                name: determineValue(action, type, true),
              });
            }}
            defaultValue={determineValue(action, type, false)}
            type="text"
            required
          ></input>
        </div>
      </>
    ) : null;

  let addInputField =
    action === "Add" ? (
      <>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            {type} Name:
          </label>
          <input
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            placeholder="Name"
            type="text"
            defaultValue={determineValue(action, type, true)}
            onChange={(e) => {
              setDialogContent({
                ...dialogContent,
                name: e.target.value,
              });
            }}
            required
          ></input>
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            {type} Description:
          </label>
          <input
            placeholder="Description"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            onChange={(e) => {
              setDialogContent({
                ...dialogContent,
                description: e.target.value,
              });
            }}
            defaultValue={determineValue(action, type, false)}
            type="text"
            required
          ></input>
        </div>
      </>
    ) : null;

  let formField = null;

  if (type === "Exercise") {
    if (action === "Link") {
      formField = (
        <>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Exercises:
            </label>
            <select
              placeholder="Levels"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              onClick={(e) => {
                selectExerciseOption(e);
              }}
              required
            >
              <option disabled selected>
                {" "}
                -- Select an exercise --{" "}
              </option>
              {exerciseData.map((option: any) => {
                if (!option.levelid)
                  return <option>{option.exercisename}</option>;
              })}
            </select>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Associate Levels:
            </label>
            <select
              placeholder="Levels"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              onClick={(e) => {
                selectLevelOption(e);
              }}
              required
            >
              <option disabled selected>
                {" "}
                -- Select a training level --{" "}
              </option>
              {levelOptions.map((option: any) => (
                <option>{option.levelname}</option>
              ))}
            </select>
          </div>
        </>
      );
    } else if (action === "Unlink") {
      formField = (
        <>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Exercises:
            </label>
            <select
              placeholder="Levels"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              onClick={(e) => {
                selectExerciseOption(e);
              }}
              required
            >
              <option disabled selected>
                {" "}
                -- Select an exercise --{" "}
              </option>
              {exerciseData.map((option: any) => {
                if (option.levelname !== "")
                  return <option>{option.exercisename}</option>;
              })}
            </select>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Associate Levels:
            </label>
            <select
              placeholder="Levels"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              onClick={(e) => {
                selectLevelOption(e);
              }}
              required
            >
              <option disabled selected>
                {" "}
                -- Select a training level --{" "}
              </option>
              {linkedTrainingLevelExercise.map((option: any) => (
                <option>{option.levelname}</option>
              ))}
            </select>
          </div>
        </>
      );
    }
  }

  if (type === "Skill" && action === "Link") {
    console.log("Link: ", linkedExerciseSkill);
    console.log(exerciseData);

    let exerciseOptions = exerciseData
      .filter(
        (exercise) =>
          !linkedExerciseSkill.some(
            (linked: any) => linked.exercisename === exercise.exercisename
          )
      )
      .map((item) => item.exercisename);

    console.log("options: ", exerciseOptions);
    formField = (
      <>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Skills:
          </label>
          <select
            placeholder="Levels"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            onClick={(e) => {
              selectSkillOption(e);
            }}
            required
          >
            <option disabled selected>
              {" "}
              -- Select an exercise --{" "}
            </option>
            {skillOptions.map((option: any) => (
              <option>{option.skillname}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Exercises:
          </label>
          <select
            placeholder="Levels"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            onClick={(e) => {
              selectExerciseOption(e);
            }}
            required
          >
            <option disabled selected>
              {" "}
              -- Select an exercise --{" "}
            </option>
            {exerciseOptions.map((option: any) => {
              return <option>{option}</option>;
            })}
          </select>
        </div>
      </>
    );
  }

  if (type === "Skill" && action === "Unlink") {
    formField = (
      <>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Skills:
          </label>
          <select
            placeholder="Levels"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            onClick={(e) => {
              selectSkillOption(e);
            }}
            required
          >
            <option disabled selected>
              {" "}
              -- Select a skill --{" "}
            </option>
            {skillOptions.map((option: any) => {
              if (option.exercisename !== "")
                return <option>{option.skillname}</option>;
            })}
          </select>
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Exercises:
          </label>
          <select
            placeholder="Levels"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            onClick={(e) => {
              selectExerciseOption(e);
            }}
            required
          >
            <option disabled selected>
              {" "}
              -- Select an exercise --{" "}
            </option>
            {linkedExerciseSkill.map((option: any) => {
              return <option>{option.exercisename}</option>;
            })}
          </select>
        </div>
      </>
    );
  }

  if (type === "Training Levels") {
    if (action === "Link") {
      // Filtering exercises that isn't linked to display
      let exercises = exerciseData
        .filter(
          (exercise) =>
            !linkedTrainingLevelExercise.some(
              (linked: any) => linked.exercisename === exercise.exercisename
            )
        )
        .map((item) => item.exercisename)
        .filter(
          (exerciseName) =>
            !allLinkExerciseLevels.some(
              (exercise: any) => exercise.exercisename === exerciseName
            )
        );

      formField = (
        <>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Training Level:
            </label>
            <select
              placeholder="Levels"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              onClick={(e) => {
                selectLevelOption(e);
              }}
              defaultValue={"-- Select an exercise --"}
              required
            >
              <option disabled selected>
                {" "}
                -- Select an exercise --{" "}
              </option>

              {levelOptions.map((option: any) => {
                return <option>{option.levelname}</option>;
              })}
            </select>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Exercises:
            </label>
            <select
              placeholder="Levels"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              onClick={(e) => {
                selectExerciseOption(e);
              }}
              required
            >
              <option disabled selected>
                {" "}
                -- Select an exercise --{" "}
              </option>
              {exercises.map((option) => (
                <option>{option}</option>
              ))}
            </select>
          </div>
        </>
      );
    }

    if (action === "Unlink") {
      formField = (
        <>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Training Level:
            </label>
            <select
              placeholder="Levels"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              onClick={(e) => {
                selectLevelOption(e);
              }}
              defaultValue={"-- Select an exercise --"}
              required
            >
              <option disabled selected>
                {" "}
                -- Select an exercise --{" "}
              </option>

              {levelOptions.map((option: any) => {
                return <option>{option.levelname}</option>;
              })}
            </select>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Exercises:
            </label>
            <select
              placeholder="Levels"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              onClick={(e) => {
                selectExerciseOption(e);
              }}
              required
            >
              <option disabled selected>
                {" "}
                -- Select an exercise --{" "}
              </option>
              {linkedTrainingLevelExercise.map((option: any) => {
                return <option>{option.exercisename}</option>;
              })}
            </select>
          </div>
        </>
      );
    }
  }
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-med flex justify-center items-center">
      <div className="bg-zinc-300 p-2 rounded">
        <p>
          {action} {type}{" "}
        </p>
        <div>
          {addInputField}
          {updateInputField}
          <form className="space-y-6">
            <>{formField}</>
            <button
              className="bg-violet-900 px-4 py-2 text-white rounded-md"
              type="submit"
              onClick={(e) => addContent(e)}
            >
              {action} {type}
            </button>
            <button
              className="bg-violet-900 px-4 py-2 text-white rounded-md"
              onClick={(e) => {
                setDialogContent(null);
                setLinkedTrainingLevelExercise([]);
                setLinkedExerciseSkill([]);
                handleOnClose();
              }}
            >
              Close
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Dialog;
