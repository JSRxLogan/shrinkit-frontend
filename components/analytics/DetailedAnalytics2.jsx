import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ClicksVsDayChartContainer from './ClicksVsDayChartContainer';
import GeoChoroplethMap from './GeoChoroplethMap';
import BrowserBreakdownChart from './BrowserBreakdownChart';
import DeviceOSBreakdownChart from './DeviceOSBreakdownChart';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    FiLink,
    FiExternalLink,
    FiCalendar,
    FiUser,
    FiGlobe,
    FiBarChart2,
    FiMap,
    FiSmartphone,
    FiLoader,
    FiAlertCircle
} from 'react-icons/fi';

const DetailedAnalytics = () => {
    const { id } = useParams();
    const [analyticsData, setAnalyticsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [clicks, setClicks] = useState([]);
    const [newUrl, setNewUrl] = useState({});
    const [showFull, setShowFull] = useState(false);
    const [displayUrl, setDisplayUrl] = useState('');
    const [isLong, setIsLong] = useState(false);
    const [errors, setErrors] = useState({});

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const navigate = useNavigate();

    function handleUrlToggle(newUrl) {
        const tempShowFull = !showFull;
        setShowFull(tempShowFull);
        const MAX_LENGTH = 300;
        const tempIsLong = newUrl.length > MAX_LENGTH ? true : false;
        setIsLong(tempIsLong);
        const tempDisplayUrl = tempShowFull ? newUrl.url : `${newUrl.url.slice(0, MAX_LENGTH)}${tempIsLong ? "..." : ""}`;
        setDisplayUrl(tempDisplayUrl);
    }

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/api/analytics/detailed/${id}`, { withCredentials: true });
            console.log('Response Data:', response.data);
            setAnalyticsData(response.data);

            const { newUrl, clicks } = response.data;

            setNewUrl(newUrl);
            setClicks(clicks);

            const MAX_LENGTH = 300; // chars to show before truncation

            const tempIsLong = newUrl.length > MAX_LENGTH ? true : false;
            setIsLong(tempIsLong);
            const tempDisplayUrl = showFull ? newUrl.url : `${newUrl.url.slice(0, MAX_LENGTH)}${tempIsLong ? "..." : ""}`;
            setDisplayUrl(tempDisplayUrl);

            if (clicks.length) {
                const latestClickDate = clicks.length ? new Date(clicks[clicks.length - 1].time) : new Date();
                const defaultYear = latestClickDate.getFullYear();
                const defaultMonth = latestClickDate.getMonth() + 1; // JS months are 0-based, so add 1
                setSelectedYear(defaultYear);
                setSelectedMonth(defaultMonth);
            }
            setError(null);
        } catch (err) {
            console.error('Error fetching analytics:', err);
            setError('Failed to load analytics data. Please try again later.');
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
                fetchAnalytics();
                setErrors({});
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

        return () => {
            // Cleanup function
        };
    }, [id]);


    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            // --- Decorated Loading Skeleton ---
            <div className="min-h-screen bg-gray-900 p-6">
                <div className="max-w-6xl mx-auto">
                    <div className="animate-pulse bg-gray-700 rounded-lg h-10 w-1/3 mb-8"></div>
                    <div className="bg-gray-800 rounded-xl shadow-md p-6 mb-8">
                        <div className="animate-pulse space-y-4">
                            <div className="h-6 bg-gray-700 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="h-20 bg-gray-700 rounded-lg"></div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="bg-gray-800 rounded-xl shadow-md p-6 h-80">
                                <div className="animate-pulse flex flex-col h-full">
                                    <div className="h-6 bg-gray-700 rounded w-1/4 mb-4"></div>
                                    <div className="flex-1 bg-gray-900 rounded-lg"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            // --- Decorated Error State ---
            <div className="min-h-screen bg-gray-900 p-6 flex items-center justify-center">
                <div className="max-w-md text-center bg-gray-800 p-8 rounded-xl shadow-md">
                    <FiAlertCircle className="mx-auto text-4xl text-red-500 mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Error Loading Analytics</h2>
                    <p className="text-gray-400 mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (!analyticsData) {
        return null;
    }


    return (
        // --- Decorated Main Component ---
        <div className="min-h-screen bg-gray-900 p-6 text-white">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-2">Detailed Analytics</h1>
                <p className="text-gray-400 mb-8">For: <span className="text-indigo-400 font-mono">{newUrl.shortUrl}</span></p>

                {/* --- Summary Card --- */}
                <div className="bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                        <div>
                            <h2 className="text-xl font-semibold text-white mb-1">Original URL</h2>
                            <div className="flex items-center gap-2 flex-wrap">
                                <a
                                    href={newUrl.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-300 hover:text-white hover:underline break-all"
                                >
                                    {displayUrl}
                                </a>
                                <FiExternalLink className="text-gray-400" />
                                {isLong && (
                                    <button
                                        onClick={() => handleUrlToggle(newUrl)}
                                        className="text-sm text-indigo-400 hover:underline focus:outline-none"
                                    >
                                        {showFull ? "Hide" : "View full"}
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="bg-gray-700 text-gray-300 px-4 py-2 rounded-lg text-sm">
                            <span className="font-medium">Length:</span> {newUrl.length} chars
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {/* Short URL */}
                        <div className="bg-gray-900 p-4 rounded-lg">
                            <div className="flex items-center gap-2 text-gray-400 mb-2">
                                <FiLink />
                                <h3 className="font-medium">Short URL</h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <a
                                    href={newUrl.shortUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-400 hover:text-indigo-300 hover:underline font-mono"
                                >
                                    {newUrl.shortUrl}
                                </a>
                                <FiExternalLink className="text-gray-400" />
                            </div>
                        </div>

                        {/* Total Clicks */}
                        <div className="bg-gray-900 p-4 rounded-lg">
                            <div className="flex items-center gap-2 text-gray-400 mb-2">
                                <FiBarChart2 />
                                <h3 className="font-medium">Total Clicks</h3>
                            </div>
                            <p className="text-2xl font-bold text-white">{newUrl.clickCounts}</p>
                        </div>

                        {/* Created Date */}
                        <div className="bg-gray-900 p-4 rounded-lg">
                            <div className="flex items-center gap-2 text-gray-400 mb-2">
                                <FiCalendar />
                                <h3 className="font-medium">Created</h3>
                            </div>
                            <p className="text-gray-400">{formatDate(newUrl.createdAt)}</p>
                        </div>

                        {/* Created By */}
                        <div className="bg-gray-900 p-4 rounded-lg">
                            <div className="flex items-center gap-2 text-gray-400 mb-2">
                                <FiUser />
                                <h3 className="font-medium">Created By</h3>
                            </div>
                            <p className="text-gray-300">{newUrl.user?.username || 'Anonymous'}</p>
                        </div>

                        {/* Country Created */}
                        <div className="bg-gray-900 p-4 rounded-lg">
                            <div className="flex items-center gap-2 text-gray-400 mb-2">
                                <FiGlobe />
                                <h3 className="font-medium">Country Created</h3>
                            </div>
                            <p className="text-gray-300">{newUrl.countryName || 'Unknown'}</p>
                        </div>

                        {/* Last Updated */}
                        <div className="bg-gray-900 p-4 rounded-lg">
                            <div className="flex items-center gap-2 text-gray-400 mb-2">
                                <FiLoader />
                                <h3 className="font-medium">Last Updated</h3>
                            </div>
                            <p className="text-gray-400">{formatDate(new Date().toISOString())}</p>
                        </div>
                    </div>
                </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  {/* Clicks vs Day */}
  <ClicksVsDayChartContainer
    clicks={clicks}
    selectedMonth={selectedMonth}
    selectedYear={selectedYear}
  />

  {/* Geographic Distribution */}
  <div className="bg-gray-800 rounded-xl shadow-lg p-4 flex flex-col">
    <div className="flex items-center gap-2 text-gray-300 mb-3">
      <FiMap />
      <h2 className="text-lg md:text-xl font-semibold">
        Geographic Distribution
      </h2>
    </div>

    <div className="relative w-full flex-1">
      {clicks ? (
        <GeoChoroplethMap
          clicks={clicks}
          size="responsive" // keep it scalable
        />
      ) : (
        <p className="text-gray-400 flex items-center justify-center h-full">
          Loading map…
        </p>
      )}
    </div>
  </div>

  {/* Browser Breakdown */}
  <BrowserBreakdownChart clicks={clicks} />

  {/* Device OS Breakdown */}
  <DeviceOSBreakdownChart clicks={clicks} />
</div>


                {/* --- Raw Data Table --- */}
                <div className="mt-8 bg-gray-800 rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-semibold text-white mb-4">Recent Clicks</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-700">
                            <thead className="bg-gray-900">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Time</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Country</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Browser</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Device</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">OS</th>
                                </tr>
                            </thead>
                            <tbody className="bg-gray-800 divide-y divide-gray-700">
                                {clicks.slice(0, 5).map((click, index) => (
                                    <tr key={index} className="hover:bg-gray-700/50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                            {new Date(click.time).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                            {click.country || 'Unknown'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                            {click.browser || 'Unknown'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                            {click.device || 'Unknown'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                            {click.os || 'Unknown'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {clicks.length > 5 && (
                        <p className="text-sm text-gray-400 mt-4">Showing 5 of {clicks.length} total clicks</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DetailedAnalytics;