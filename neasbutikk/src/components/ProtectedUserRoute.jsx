import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedUserRoute({ children }) {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-mossgreen"></div>
      </div>
    );
  }
  
  // Redirect to login if user isn't logged in
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  return children;
}

export default ProtectedUserRoute;