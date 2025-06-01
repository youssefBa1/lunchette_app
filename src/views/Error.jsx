import { useNavigate } from "react-router-dom";
import { FaHome, FaExclamationTriangle } from "react-icons/fa";

const Error = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Error Icon */}
        <div className="mb-6 flex justify-center">
          <div className="bg-red-100 p-4 rounded-full">
            <FaExclamationTriangle className="text-6xl text-red-500" />
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Oups! Une erreur est survenue
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>

        {/* Error Code */}
        <div className="mb-8">
          <span className="text-8xl font-bold text-gray-200">404</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Retour
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-rose-300 text-white rounded-lg hover:bg-rose-400 transition-colors flex items-center justify-center gap-2"
          >
            <FaHome className="w-5 h-5" />
            Retour à l'accueil
          </button>
        </div>

        {/* Additional Help */}
      </div>
    </div>
  );
};

export default Error;
