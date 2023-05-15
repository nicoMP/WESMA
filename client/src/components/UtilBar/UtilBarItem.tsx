import React from "react";
import { Link } from "react-router-dom";
import { IGenericLink } from "../../types";

function UtilBarItem({ name, link, view }: IGenericLink) {
  return (
    <Link to={`/${view}/${link}`}>
      <div className="text-gray-200 mr-4 hover: underline text-sm">{name}</div>
    </Link>
  );
}

export default UtilBarItem;
