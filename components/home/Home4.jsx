import axios from 'axios';
import { useState, useEffect } from 'react';
import { FiLink, FiBarChart2, FiShield } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
    const [url, setUrl] = useState('');
    const [shortUrl, setShortUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Replace with actual auth state
    const [errors, setErrors] = useState({});

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};
        if (!url) {
            newErrors.url = 'URL is required';
        };

        setErrors(newErrors)

        if (Object.keys(newErrors).length === 0) {

            setIsLoading(true);
            // Simulate API call
            // setTimeout(() => {
            //   setShortUrl('shrinkit.com/xyz123');
            //   setIsLoading(false);
            // }, 1000);
            // }

            try {
                const response = await axios.post(`${API_BASE_URL}/api/home`, {
                    url
                }, { withCredentials: true });

                if (!response || !response.data.success) {
                    console.log("response empty or not successful");
                    setErrors({ api: "Response empty or not successful at Home(),react,line-44" });
                }

                else {
                    setIsLoading(false);
                    setShortUrl(response.data.shortUrl);
                    setUrl('');
                    setErrors({});
                    navigate(`/analytics/quick/${response.data.shortId}`); // Redirect to the new short URL page
                    console.log("Short URL created successfully:", response.data.shortUrl);
                }

            } catch (err) {
                if (err.response) {
                    console.log("error ",err.response.data.message);
                    setErrors({ api: err.response.data.message || "An error occurred at Home() ,react, line-51" });
                    setIsLoading(false);
                }
            }
        }
    }


    const copyToClipboard = () => {
        navigator.clipboard.writeText(shortUrl);
        // You would add toast notification here
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
                setIsLoggedIn(true);
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
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-indigo-500 sm:text-5xl sm:tracking-tight lg:text-6xl">
                        ShrinkIt
                    </h1>
                    <p className="mt-5 max-w-xl mx-auto text-xl text-gray-400">
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
                                className="flex-grow p-4 bg-gray-800 border border-gray-700 rounded-xl shadow-md text-white text-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400"
                                required
                            />
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-4 px-6 rounded-xl shadow-md hover:scale-105 transition-all duration-200 disabled:opacity-70 text-lg"
                            >
                                {isLoading ? 'Generating...' : 'Generate Short Link'}
                            </button>
                        </div>

                        {errors.api && (
                            <div className="text-red-500 text-center mt-2">
                                {errors.api}
                            </div>)
                        }

                        {errors.url && (
                            <div className="text-red-500 text-center mt-2">
                                {errors.url}
                            </div>)}

                        {isLoggedIn && (
                            <p className="text-sm text-gray-400 flex items-center justify-center gap-1">
                                💡 <span>Your Handy URL service</span>
                            </p>
                        )}

                    </form>

                    {shortUrl && (
                        <div className="mt-6 p-4 bg-gray-800 rounded-xl animate-fade-in">
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <a
                                    href={`https://${shortUrl}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-400 font-medium break-all hover:underline text-lg"
                                >
                                    {shortUrl}
                                </a>
                                <button
                                    onClick={copyToClipboard}
                                    className="bg-gray-700 text-white font-medium py-2 px-4 rounded-lg shadow-sm hover:bg-gray-600 transition-colors text-lg"
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
                    <div className="bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
                        <div className="bg-indigo-900/30 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                            <FiLink className="w-6 h-6 text-indigo-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Shorten Long URLs Instantly</h3>
                        <p className="text-gray-400 text-lg">
                            Paste your lengthy URLs and get a clean, shareable link in seconds.
                        </p>
                    </div>

                    {/* Feature Card 2 */}
                    <div className="bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
                        <div className="bg-indigo-900/30 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                            <FiBarChart2 className="w-6 h-6 text-indigo-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Analytics Dashboard</h3>
                        <p className="text-gray-400 text-lg">
                            See how your links perform. Get insights with charts and tables.
                        </p>
                    </div>

                    {/* Feature Card 3 */}
                    <div className="bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
                        <div className="bg-indigo-900/30 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                            <FiShield className="w-6 h-6 text-indigo-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Private Link Vault</h3>
                        <p className="text-gray-400 text-lg">
                            Your links are yours. We only show your URLs in your dashboard.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}