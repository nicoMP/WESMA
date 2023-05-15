import  AdminPage  from "./Admin/AdminPage";
import { useParams } from 'react-router-dom';
import { useEffect, useState } from "react";
import UtilBar from "../components/UtilBar/UtilBar";
import Sidebar from "../components/Sidebar/Sidebar";
import CoreUtilBar from "../components/CoreUtilBar/CoreUtilBar";
import authService from "../services/auth.service";
import { connect } from 'react-redux';

function Admin({ auth }) {
    return (
        <div className="">
        <div className="flex">
          <CoreUtilBar/>
        </div>
      </div>
    )
}

export default Admin;