import { useEffect, useState } from "react";
import UtilBar from "../../components/UtilBar/UtilBar";
import { IDefaultPage, IGenericLink } from "../../types";

function ModulePage({ children, name }: IDefaultPage) {

  return (
    <div className="">
      <div className="flex">
        <div className="flex-1">
          <UtilBar student={true} />
          <div className="ml-2">
            <h1 className="text-3xl my-4">{name}</h1>
            <p>Select a module above</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModulePage;
