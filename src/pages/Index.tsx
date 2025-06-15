
import { useNavigate } from "react-router-dom";
import { Folder, Images } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center max-w-2xl px-6">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-6">
            <Folder size={32} className="text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-gray-900">File Explorer</h1>
          <p className="text-xl text-gray-600 mb-8">
            Browse your files and view images in a beautiful, organized gallery
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-1 max-w-md mx-auto">
          <button
            onClick={() => navigate("/explorer")}
            className="group flex items-center justify-center px-8 py-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300"
          >
            <Images size={24} className="mr-3 text-blue-600 group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <div className="font-semibold text-gray-900">Open File Explorer</div>
              <div className="text-sm text-gray-600">Browse folders and view image gallery</div>
            </div>
          </button>
        </div>

        <div className="mt-12 text-sm text-gray-500">
          <p>Features: Tree navigation • Adjustable grid layout • Pagination • Responsive design</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
