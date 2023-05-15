import { useState } from "react";
import { ISidebarLink } from "../../types";

function SidebarDropdown({ name, icon }: ISidebarLink) {
  const [toggle, setToggle] = useState<boolean>(false);

  const toggleDrop = () => setToggle(!toggle);

  return (
    <>
      <div className="p-2 5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-violet-900 text-white" onClick={toggleDrop}>
        <i className={`bi ${icon} text-sm`}></i>
        <div className="flex justify-between w-full items-center">
            <span className="text-[15px] ml-4 text-slate-200" >{name}</span>
            <span className={`text-sm ${toggle && 'rotate-180'}`}>
                <i className="bi bi-chevron-down"></i>
            </span>
        </div>
      </div>

      <div className={`text-left flex flex-col items-center py-4 px-2 text-sm bg-slate-800 ${!toggle && 'hidden'}`}>
        <input type="text" placeholder="Username" className="w-full rounded p-1 mb-2 focus:border-violet-900" />
        <input type="password" placeholder="Password" className="w-full rounded p-1 mb-4 focus:border-violet-900" />
        <button className="bg-violet-900 text-white w-full py-1 rounded">Login</button>
      </div>
    </>
  )
}

export default SidebarDropdown;