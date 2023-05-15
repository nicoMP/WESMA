import NavbarItem from "./NavbarItem";
import { studentLinks, instructorLinks } from "./NavbarLinks";
import { Link } from "react-router-dom";
import { IAuthState } from "../../types";
import { connect } from 'react-redux';
import { logoutUser } from '../../actions/auth';

type navProps = {
  auth: IAuthState;
  logoutUser: VoidFunction;
}

function Navbar({ auth: { isAuthenticated, user }, logoutUser }: navProps) {

  return (
    <div className="bg-violet-900 w-full text-white">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <Link to='/login'>
            <div className="text-lg font-bold cursor-pointer">WESMA</div>
          </Link>
          <div className="flex flex-col sm:flex-row w-full sm:w-auto items-center">
            { user && user.isInstructor && instructorLinks.map((link, i) => <NavbarItem key={i} name={link.name} link={link.link} />) }
            { user && !user.isInstructor && studentLinks.map((link, i) => <NavbarItem key={i} name={link.name} link={link.link} />) }
            { isAuthenticated ? <h1 className=" cursor-pointer p-2 hover:bg-violet-800 ml-4" onClick={logoutUser}>
              <i className="bi bi-box-arrow-right mr-2"></i>
              Logout
            </h1> : <Link to='/login'><h1 className=" cursor-pointer p-2 hover:bg-violet-800 ml-4">
              <i className="bi bi-box-arrow-right mr-2"></i>
              Login
            </h1></Link>}
          </div>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { logoutUser })(Navbar);