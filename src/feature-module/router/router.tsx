import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate, Navigate } from "react-router";
import { authRoutes, publicRoutes, PrivateRoutes } from "./router.link";
import Feature from "../feature";
import AuthFeature from "../authFeature";
import Login from "../auth/login/login";
import { all_routes } from "./all_routes";
import api from "../../core/data/api"; // Make sure you have your API configured
import { useSelector } from 'react-redux';
const ALLRoutes: React.FC = () => {
  const userId = localStorage.getItem("Role");
  const [permissions, setPermissions] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useSelector((state: any) => state.user);
  let token = localStorage.getItem("token")
    useEffect(()=>{
      if(!token ){
        token = localStorage.getItem("token")
      }
    },[token]);

 

  const ProtectedRoute = ({ children, requiredPermission }: { children: JSX.Element, requiredPermission?: string }) => {
    // if (!token) {
    //   return <Navigate to={all_routes.login} replace />;
    // }
    if(userId =="2"){
     return children;
    }
    else{
  //  if (loading) {
  //     return <div>Loading...</div>; // Or a proper loading component
  //   }

    // if (requiredPermission) {
    //   const hasPermission = permissions[requiredPermission]?.allowAll || 
    //    permissions[requiredPermission]?.view;
      
    //   if (!hasPermission) {
    //     return <Navigate to={all_routes.adminDashboard} replace />;
    //   }
    // }

    return children;
    }
   
  };

  // Filter private routes based on permissions
  const getFilteredPrivateRoutes = () => {
    return publicRoutes.filter(route => {
      if (!route.permission) return true;
      return permissions[route.permission]?.allowAll || 
             permissions[route.permission]?.view;
    });
  };

  return (
    <>
      <Routes>
        <Route path={all_routes.login} element={<Login />} />
          <Route element={<ProtectedRoute><Feature /></ProtectedRoute>}>
          {publicRoutes.map((route, idx) => (
            <Route 
              path={route.path} 
              element={
                <ProtectedRoute requiredPermission={route.permission}>
                  {route.element}
                </ProtectedRoute>
              } 
              key={idx} 
            />
          ))}
        </Route>
        
        {getFilteredPrivateRoutes().map((route, idx) => (
          <Route 
            path={route.path} 
            element={
              <ProtectedRoute requiredPermission={route.permission}>
                {route.element}
              </ProtectedRoute>
            } 
            key={idx} 
          />
        ))}
        
        {/* Auth routes - for authentication flows */}
        <Route element={<AuthFeature />}>
          {authRoutes.map((route, idx) => (
            <Route path={route.path} element={route.element} key={idx} />
          ))}
        </Route>
         <Route element={<AuthFeature />}>
          {PrivateRoutes.map((route, idx) => (
            <Route path={route.path} element={route.element} key={idx} />
          ))}
        </Route>
        <Route
          path="/*"
          element={
            token  ? (
              <Navigate to={all_routes.adminDashboard} replace />
            ) : (
              <Navigate to={all_routes.login} replace />
            )
          }
        /> 
        <Route 
          path="/Admin/*" 
          element={
            token && userId == "2" ? (
              <Navigate to={all_routes.adminDashboard} replace />
            ) : (
              <Navigate to={all_routes.schoolLogin} replace />
            )
          } 
        />
         <Route 
          path="/Teacher/*" 
          element={
            token && userId == "3" ? (
              <Navigate to={all_routes.TeacherDashboard} replace />
            ) : (
              <Navigate to={all_routes.teacherLogin} replace />
            )
          } 
        />
      </Routes>
    </>
  );
};

export default ALLRoutes;