import { useEffect, useState } from "react";
import { TableHeaders } from "../../types";
import UtilBar from "../../components/UtilBar/UtilBar";
import { IDefaultPage, IGenericLink } from "../../types";
import Exercises from "../Admin/Exercises";
const defaultUtilLinks = [
  { name: "Exercises", link: "exercises", view: "admin" },
  { name: "Skills", link: "skills", view: "admin" },
  { name: "Modules", link: "modules", view: "admin" },
  { name: "Resources", link: "resources", view: "admin" },
  { name: "Training Levels", link: "training-levels", view: "admin" },
];

function AdminPage({ children, name }: IDefaultPage) {
  const [utilLinks, setUtilLinks] = useState<IGenericLink[]>([]);
  useEffect(() => {
    setUtilLinks(defaultUtilLinks);
  }, []);

  return (
    <div className="">
      <div>{children}</div>
    </div>
  );
}

export default AdminPage;
