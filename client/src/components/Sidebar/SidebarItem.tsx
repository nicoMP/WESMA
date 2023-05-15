import { Link } from "react-router-dom";
import { IGenericLink } from "../../types";

function SidebarItem({ name, link, view }: IGenericLink) {
  return (
    <Link to={`/${view}/${link}`}>
      <div className="px-2 py-4 border-b flex items-center hover:rounded-md duration-300 cursor-pointer hover:bg-violet-900 text-gray-800 hover:text-white ">
        <span className="text-[15px] ml-4">{name}</span>
      </div>
    </Link>
  );
}

export default SidebarItem;
