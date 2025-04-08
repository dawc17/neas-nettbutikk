import { FaUser } from "react-icons/fa";

function ProfilePictureUploader({ userData }) {
  // Simple user avatar display with no upload functionality
  return (
    <div className="mb-8 flex flex-col items-center">
      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-secondary mb-3 bg-gray-100 flex items-center justify-center">
        <FaUser className="text-primary text-5xl opacity-50" />
      </div>
    </div>
  );
}

export default ProfilePictureUploader;
