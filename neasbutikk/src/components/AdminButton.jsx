import { TbCircleLetterAFilled } from "react-icons/tb";

function AdminButton() {
  return (
    <button className="admin-button p-2 rounded-full animate-color-cycle transition-all duration-150 hover:scale-90">
        <TbCircleLetterAFilled size={35} className="text-pinegreen" />
    </button>
  );
}

export default AdminButton;