import { useState } from 'react';
import { FiLink, FiBarChart2, FiActivity } from 'react-icons/fi';

export default function Home() {
  const [url, setUrl] = useState('');

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      {/* Main Container */}
      <div className="max-w-2xl mx-auto bg-gray-800 rounded-xl p-6 shadow-lg">
        {/* Heading */}
        <h1 className="text-2xl font-bold text-indigo-500 mb-6">
          Shrink your links in seconds
        </h1>
        
        {/* URL Input Section */}
        <div className="space-y-4">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter your long URL here..."
            className="w-full p-4 rounded-lg bg-gray-700 text-white text-lg placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg text-lg font-medium transition-colors duration-200 w-full md:w-auto">
            Generate
          </button>
          
          <p className="text-sm text-gray-400 mt-2">
            Your handy URL
          </p>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="max-w-6xl mx-auto mt-10">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Card 1 */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-md flex-1">
            <div className="flex items-center gap-3 mb-4">
              <FiLink className="text-indigo-500 text-2xl" />
              <h2 className="text-xl font-bold text-white">Shorten URLs</h2>
            </div>
            <p className="text-lg text-gray-300">
              Create short, memorable links instantly for easy sharing.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-md flex-1">
            <div className="flex items-center gap-3 mb-4">
              <FiBarChart2 className="text-indigo-500 text-2xl" />
              <h2 className="text-xl font-bold text-white">Track Clicks</h2>
            </div>
            <p className="text-lg text-gray-300">
              Monitor how many people click your links and when.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-md flex-1">
            <div className="flex items-center gap-3 mb-4">
              <FiActivity className="text-indigo-500 text-2xl" />
              <h2 className="text-xl font-bold text-white">Smart Analytics</h2>
            </div>
            <p className="text-lg text-gray-300">
              Get insights about your audience and link performance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}