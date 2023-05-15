import React from "react";
import { connect } from 'react-redux';
import { IAuthState } from "../types";
import { Navigate, Outlet } from 'react-router-dom';


type privateProps = {
  auth: IAuthState,
  type: string
}

const PrivateRoute = ({ auth: { isAuthenticated, user, loading }, type }: privateProps) => {
  const authCheck = isAuthenticated && !loading;
  let authType;

  if(type === 'all') {
    authType = authCheck;
  }

  if(type === 'not') {
    authType = !authCheck;
  }

  if(type === 'student') {
    authType = authCheck && !user.isInstructor;
  }

  if(type === 'instructor') {
    authType = authCheck && user.isInstructor;
  }

  return authType ? <Outlet /> : <Navigate to="/" />;
}

const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(mapStateToProps)(PrivateRoute);