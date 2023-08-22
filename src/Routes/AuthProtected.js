import { CURRENT_USER } from 'business/rule/index';
import React from 'react';
import { Redirect, Route } from 'react-router-dom';

const AuthProtected = (props) => {
  let currentUser = localStorage.getItem(CURRENT_USER);
  currentUser = JSON.parse(currentUser);
  if (!currentUser?.id) {
    return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />;
  }
  return <>{props.children}</>;
};

const AccessRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        return <Component {...props} />;
      }}
    />
  );
};

export { AuthProtected, AccessRoute };
