import { Link } from "react-router-dom";
import { IGenericLink } from "../../types";

function NavbarItem({ name, link }: IGenericLink) {
  return (
    <Link to={link}>
      <h1 className="px-4 py-2 hover:bg-violet-800 text-white" >{name}</h1>
    </Link>
  )
}

export default NavbarItem;