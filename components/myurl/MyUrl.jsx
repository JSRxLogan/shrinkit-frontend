import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FiCopy,
  FiTrash2,
  FiBarChart2,
  FiTrendingUp,
  FiCalendar,
  FiGlobe,
  FiArrowUp,
  FiArrowDown,
  FiLink2,
  FiClock,
  FiFrown
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const MyUrls = () => {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [copiedId, setCopiedId] = useState(null);
  const [errors, setErrors] = useState({});

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const navigate = useNavigate();

  const fetchUserUrls = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/get/my-urls`, {
        withCredentials: true
      });
      console.log("response", response.data);
      setUrls(response.data.urls || []);
      setErrors({});
    } catch (error) {
      console.error('Error fetching URLs:', error);
      setErrors({ api: error.response?.data?.message || 'An error occurred while fetching URLs.' });
    } finally {
      setLoading(false);
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
        setErrors({});
        fetchUserUrls()
        console.log("User is authenticated");
      }
    } catch (err) {
      if (err.response) {
        console.log(err.response.data.message);
        navigate(err.response.data.redirectTo || "/login");
      }
    }
  }

  useEffect(() => {
    verifyUser();
  }, []);

  const handleSort = (field) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const sortedUrls = [...urls].sort((a, b) => {
    if (sortField === 'clicks') {
      return sortOrder === 'asc' ? a.clickCounts - b.clickCounts : b.clickCounts - a.clickCounts;
    } else if (sortField === 'originalUrl') {
      return sortOrder === 'asc'
        ? a.length - b.length
        : b.length - a.length;
    } else {
      return sortOrder === 'asc'
        ? new Date(a.createdAt) - new Date(b.createdAt)
        : new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const deleteUrl = async (id) => {
    if (window.confirm('Are you sure you want to delete this URL?')) {
      try {
        await axios.delete(`/api/urls/${id}`);
        setUrls(urls.filter(url => url.id !== id));
      } catch (error) {
        console.error('Error deleting URL:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateUrl = (url, maxLength = 40) => {
    return url.length > maxLength
      ? `${url.substring(0, maxLength)}...`
      : url;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            {/* Skeleton for sorting controls */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="h-10 bg-gray-800 rounded-lg w-1/4"></div>
              <div className="h-10 bg-gray-800 rounded-lg w-1/4"></div>
              <div className="h-10 bg-gray-800 rounded-lg w-1/4"></div>
            </div>

            {/* Skeleton for URL cards */}
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-800 rounded-xl p-6">
                <div className="space-y-4">
                  <div className="h-6 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-700 rounded w-full"></div>
                  <div className="flex justify-between">
                    <div className="h-4 bg-gray-700 rounded w-1/3"></div>
                    <div className="flex gap-2">
                      <div className="h-8 bg-gray-700 rounded w-20"></div>
                      <div className="h-8 bg-gray-700 rounded w-20"></div>
                      <div className="h-8 bg-gray-700 rounded w-20"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
    </div>)
  }

  if (urls.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 p-6 flex items-center justify-center">
        <div className="max-w-md text-center">
          <FiFrown className="mx-auto text-5xl text-gray-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-300 mb-2">No links created yet</h2>
          <p className="text-gray-400">Let's get started by shortening your first URL!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Shortened URLs</h1>

        {/* Sorting Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <span className="text-gray-400">Sort by:</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSort('clicks')}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg ${sortField === 'clicks' ? 'bg-indigo-900/50 text-indigo-300' : 'bg-gray-800 hover:bg-gray-700'}`}
              aria-label="Sort by clicks"
            >
              <FiTrendingUp />
              Clicks
              {sortField === 'clicks' && (
                sortOrder === 'asc' ? <FiArrowUp size={14} /> : <FiArrowDown size={14} />
              )}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSort('originalUrl')}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg ${sortField === 'originalUrl' ? 'bg-indigo-900/50 text-indigo-300' : 'bg-gray-800 hover:bg-gray-700'}`}
              aria-label="Sort by URL length"
            >
              <FiLink2 />
              Length
              {sortField === 'originalUrl' && (
                sortOrder === 'asc' ? <FiArrowUp size={14} /> : <FiArrowDown size={14} />
              )}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSort('createdAt')}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg ${sortField === 'createdAt' ? 'bg-indigo-900/50 text-indigo-300' : 'bg-gray-800 hover:bg-gray-700'}`}
              aria-label="Sort by creation date"
            >
              <FiClock />
              Date Created
              {sortField === 'createdAt' && (
                sortOrder === 'asc' ? <FiArrowUp size={14} /> : <FiArrowDown size={14} />
              )}
            </button>
          </div>
        </div>

        {/* URL List */}
        <div className="space-y-6">
          {sortedUrls.map((url) => (
            <div key={url._id} className="bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* URL Info */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-indigo-400">{url.shortId}</h3>
                    <button
                      onClick={() => copyToClipboard(url.shortId, `id-${url._id}`)}
                      className="text-gray-400 hover:text-white p-1 rounded hover:bg-gray-700 relative"
                      aria-label="Copy short ID"
                    >
                      <FiCopy />
                      {copiedId === `id-${url._id}` && (
                        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-700 text-xs text-white px-2 py-1 rounded">
                          Copied!
                        </span>
                      )}
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href={`${url.shortUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-bold md:text-lg text-white hover:text-indigo-300 hover:underline"
                    >
                      {url.shortUrl}
                    </a>
                    <button
                      onClick={() => copyToClipboard(url.shortUrl, `short-${url._id}`)}
                      className="text-gray-400 hover:text-white p-1 rounded hover:bg-gray-700 relative"
                      aria-label="Copy short URL"
                    >
                      <FiCopy />
                      {copiedId === `short-${url._id}` && (
                        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-700 text-xs text-white px-2 py-1 rounded">
                          Copied!
                        </span>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-400 break-all">
                      {truncateUrl(url.url)}
                    </p>
                    <button
                      onClick={() => copyToClipboard(url.url, `original-${url._id}`)}
                      className="text-gray-400 hover:text-white p-1 rounded hover:bg-gray-700 relative"
                      aria-label="Copy original URL"
                    >
                      <FiCopy />
                      {copiedId === `original-${url._id}` && (
                        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-700 text-xs text-white px-2 py-1 rounded">
                          Copied!
                        </span>
                      )}
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <FiCalendar />
                      <span>{formatDate(url.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiGlobe />
                      <span>{url.countryName || 'Unknown'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiTrendingUp />
                      <span>{url.clickCounts || 0} clicks</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col items-end  sm:flex-row md:flex-col gap-2">
                  <button
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    aria-label="Quick analytics"
                    onClick={() => navigate(`/analytics/quick/${url.shortId}`)}
                  >
                    <FiBarChart2 size={16} />
                    <span className="sm:inline">Quick</span>
                  </button>
                  <button
                    className="flex items-center gap-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-4 py-2 rounded-lg transition-colors"
                    aria-label="Detailed analytics"
                    onClick={() => navigate(`/analytics/detailed/${url.shortId}`)}
                  >
                    <FiTrendingUp size={16} />
                    <span className=" sm:inline">Detailed</span>
                  </button>
                  <button
                    onClick={() => deleteUrl(url.id)}
                    className="flex items-center gap-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 px-4 py-2 rounded-lg transition-colors"
                    aria-label="Delete URL"
                  >
                    <FiTrash2 size={16} />
                    <span className=" sm:inline">Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyUrls;