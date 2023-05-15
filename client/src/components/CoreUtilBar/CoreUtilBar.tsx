import { IGenericLink } from "../../types";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function CoreUtilBar() {

    const defaultUtilLinks = [
        { name: "Exercises", link: "exercises", view: "admin" },
        { name: "Skills", link: "skills", view: "admin" },
        { name: "Modules", link: "modules", view: "admin" },
        { name: "Resources", link: "resources", view: "admin" },
        { name: "Training Levels", link: "training-levels", view: "admin" },
    ];

    return (
        <div className="bg-gray-900 border-b border-gray-900 w-full py-1 px-2">
            <div className="flex">
                {defaultUtilLinks.map((link, i) => (
                    <Link key={i} to={`/${link.view}/${link.link}`}>
                        <div className="text-gray-200 mr-4 hover: underline text-sm">{link.name}</div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default CoreUtilBar;

