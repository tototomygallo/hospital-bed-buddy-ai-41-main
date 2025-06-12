import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center px-4">
      <div className="bg-white shadow-2xl rounded-2xl p-10 text-center max-w-md animate-fade-in-down">
        <h1 className="text-6xl font-extrabold text-blue-500 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Página no encontrada</h2>
        <p className="text-gray-600 mb-6">
          Lo sentimos, la ruta <code className="bg-gray-200 px-1 rounded">{location.pathname}</code> no existe.
        </p>
        <a
          href="/"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200"
        >
          Volver al inicio
        </a>
      </div>
    </div>
  );
};

export default NotFound;
