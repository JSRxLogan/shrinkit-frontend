import { redirect, useParams } from 'react-router-dom';
import { FiCopy, FiExternalLink, FiCalendar, FiGlobe, FiBarChart2, FiFileText } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const QuickAnalytics = () => {
  const { id } = useParams();
  const [urlData, setUrlData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState({});

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const navigate = useNavigate();

  const fetchUrlData = async () => {
    setLoading(true);
    try {
      // Replace with actual API call
      const response = await axios.get(`${API_BASE_URL}/api/analytics/quick/${id}`, { withCredentials: true });

      if (response.data.success) {
        const qrCode = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${API_BASE_URL}/api/${id}`
        const data = response.data.newUrl;
        data.qrCode = qrCode; // Add QR code to the data
        setUrlData(data);
        setErrors({})
        setLoading(false);
      }

    } catch (error) {
      console.error('Error fetching URL data:', error);
      setLoading(false);
      setErrors({ api: error.response?.data?.message || "An error occurred while fetching URL data" });
      navigate("/home")
    }
  };

  const verifyUser = async () => {
    try {

      const res = await axios.get(`${API_BASE_URL}/api/auth/verify`, {
        withCredentials: true
      })

      if (!res || !res.data.success) {
        console.log("response empty or not successful");
        setErrors({ api: "Response empty or not successful at Home(),react,line-80" });
      }

      else {
        setErrors({})
        fetchUrlData();
        console.log("User is authenticated");
      }
    } catch (err) {
      if (err.response) {
        console.log(err.response.data.message);
        setErrors({ api: err.response.data.message || "An error occurred while verifying user" });
        setLoading(false);
        navigate(err.response.data.redirectTo || "/login");
      }
    }
  }

  useEffect(() => {
    // Simulate API fetch
    verifyUser();
  }, [id]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(urlData.shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-700 rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2 mx-auto"></div>
            <div className="space-y-3 pt-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-6 bg-gray-700 rounded w-full"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!urlData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full text-center">
          <p className="text-xl text-gray-300">URL not found</p>
        </div>
      </div>
    );
  }

  if (errors.api) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-center mt-2">
            {errors.api}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="bg-gray-800 rounded-2xl p-6 sm:p-8 w-full max-w-md lg:max-w-lg">
        <h2 className="text-2xl font-bold text-indigo-400 mb-6 text-center">
          Your Shortened URL
        </h2>

        {/* URL Display */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-gray-400">🧩</span>
            <h3 className="text-lg font-medium text-gray-300">Short ID</h3>
          </div>
          <p className="text-xl text-indigo-300 font-mono bg-gray-700 p-3 rounded-lg break-all">
            {urlData.shortId}
          </p>
        </div>

        {/* Short URL Box */}
        <div className="mb-8">
          <div className="flex items-center justify-between bg-gray-700 p-3 rounded-lg">
            <a
              href={`https://shrinkit-backend-p41n.onrender.com/api/${urlData.shortId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 text-lg break-all flex items-center gap-2"
            >
              {urlData.shortUrl} <FiExternalLink className="inline" />
            </a>
            <button
              onClick={copyToClipboard}
              className="text-gray-300 hover:text-white p-2 rounded hover:bg-gray-600 transition-colors"
              title="Copy to clipboard"
            >
              <FiCopy />
              {copied && <span className="absolute ml-2 text-xs text-green-400">Copied!</span>}
            </button>
          </div>
        </div>

        {/* QR Code */}
        <div className="mb-8 flex flex-col items-center">
          <img
            src={urlData.qrCode}
            alt="QR Code"
            className="w-40 h-40 bg-white p-2 rounded-lg mb-3"
          />
          <p className="text-gray-400 text-sm">Scan to visit</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gray-400">🕰️</span>
              <h4 className="text-gray-300">Created</h4>
            </div>
            <p className="text-lg text-amber-200">
              {new Date(urlData.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FiBarChart2 className="text-gray-400" />
              <h4 className="text-gray-300">Total Clicks</h4>
            </div>
            <p className="text-lg text-green-400">{urlData.clickCounts}</p>
          </div>

          <div className="bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FiGlobe className="text-gray-400" />
              <h4 className="text-gray-300">Country</h4>
            </div>
            <p className="text-lg text-cyan-300">{urlData.countryName}</p>
          </div>

          <div className="bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gray-400">🔗</span>
              <h4 className="text-gray-300">Original</h4>
            </div>
            <a
              href={urlData.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-indigo-300 transition-colors text-sm break-all"
            >
              {urlData.url.substring(0, 30)}...
            </a>
          </div>
        </div>

        <div className="text-center text-gray-500 text-sm mt-6">
          Share this link with others!
        </div>
      </div>
    </div>
  );
};

export default QuickAnalytics;