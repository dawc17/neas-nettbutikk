import { FaSpinner } from "react-icons/fa";

const Loading = () => (
  <div className="flex items-center justify-center min-h-screen bg-base-100">
    <div className="text-center">
      <div className="flex items-center justify-center">
        <FaSpinner className="animate-spin text-5xl text-primary" />
      </div>
      <p className="mt-4 text-primary font-mabrylight text-lg">Laster inn...</p>
    </div>
  </div>
);

export default Loading;
