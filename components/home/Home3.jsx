import { useState } from 'react';
import { FiLink, FiBarChart2, FiShield } from 'react-icons/fi';

export default function HomePage() {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn] = useState(false); // Replace with actual auth state

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setShortUrl('shrinkit.com/xyz123');
      setIsLoading(false);
    }, 1000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
    // You would add toast notification here
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            ShrinkIt
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Shorten your links, amplify your reach
          </p>
        </div>

        {/* URL Input Section */}
        <div className="max-w-3xl mx-auto mb-16">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste your long URL here..."
                className="flex-grow p-4 border border-gray-300 rounded-xl shadow-md focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                required
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-600 text-white font-medium py-4 px-6 rounded-xl shadow-md hover:scale-105 transition-transform duration-200 disabled:opacity-70"
              >
                {isLoading ? 'Generating...' : 'Generate Short Link'}
              </button>
            </div>
            
            {!isLoggedIn && (
              <p className="text-sm text-gray-500 flex items-center justify-center gap-1">
                💡 <span>Tip: Login to track your link's performance</span>
              </p>
            )}
          </form>

          {shortUrl && (
            <div className="mt-6 p-4 bg-indigo-50 rounded-xl animate-fade-in">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <a 
                  href={`https://${shortUrl}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-indigo-600 font-medium break-all hover:underline"
                >
                  {shortUrl}
                </a>
                <button
                  onClick={copyToClipboard}
                  className="bg-white text-indigo-600 font-medium py-2 px-4 rounded-lg shadow-sm hover:bg-indigo-50 transition-colors"
                >
                  Copy
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature Card 1 */}
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <FiLink className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Shorten Long URLs Instantly</h3>
            <p className="text-gray-600">
              Paste your lengthy URLs and get a clean, shareable link in seconds.
            </p>
          </div>

          {/* Feature Card 2 */}
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <FiBarChart2 className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Analytics Dashboard</h3>
            <p className="text-gray-600">
              See how your links perform. Get insights with charts and tables.
            </p>
          </div>

          {/* Feature Card 3 */}
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <FiShield className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Private Link Vault</h3>
            <p className="text-gray-600">
              Your links are yours. We only show your URLs in your dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}