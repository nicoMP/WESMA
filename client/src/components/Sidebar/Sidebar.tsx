import { useState } from "react";
import SidebarItem from "./SidebarItem";
import { ISidebar } from "../../types";

function Sidebar({ sideLinks }: ISidebar) {
  const [show, setShow] = useState(false);

  const ToggleSidebar = () => {
    setShow(!show);
  };

  return (
    <>
      <div className="text-white text-4xl top-0 cursor-pointer w-full bg-slate-800 py-4 border-b lg:hidden flex items-center">
        <i className="bi bi-filter-left px-2" onClick={ToggleSidebar}></i>
        <h1 className="font-bold text-gray-200 text-[15px] ml-3 text-xl">
          WESMA
        </h1>
      </div>
      <div
        className={`sidebar border bg-white min-h-screen lg:left-0 w-[200px] overflow-y-auto text-center flex flex-col ${
          !show && "left-[-225px]"
        }`}
      >
        <div className="py-1 text-white border-b text-sm">|</div>
        {sideLinks.map((item, i) => (
          <SidebarItem
            key={i}
            name={item.name}
            link={item.link}
            view={item.view}
          />
        ))}

        {/* <SidebarDropdown name='Login' icon='bi-box-arrow-in-right' /> */}
      </div>
    </>
  );
}

export default Sidebar;
