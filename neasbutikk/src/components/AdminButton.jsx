import { TbCircleLetterAFilled } from "react-icons/tb";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminButton() {
  const { currentUser, isAdmin } = useAuth();
  
  // If user is already logged in and is admin, link to admin dashboard
  // Otherwise, link to admin login
  const linkTo = currentUser && isAdmin ? "/adminpanel" : "/admin/login";
  
  return (
    <Link to={linkTo}>
      <button className="admin-button p-2 rounded-full animate-color-cycle transition-all duration-150 hover:scale-90">
        <TbCircleLetterAFilled size={35} className="text-pinegreen" />
      </button>
    </Link>
  );
}

export default AdminButton;