import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./autenticacion";

type PrivateRouteProps = {
  children: JSX.Element;
};

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { user } = useAuth();

  if (!user) {
    // Si no está logueado, redirige al login
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
