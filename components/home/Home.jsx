import axios from "axios"
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Home() {

  const [data, setData] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navigate = useNavigate();

  const fetchData = async () => {
      try {

        const response = await axios.get('/api/auth/verify', {
          withCredentials: true
        });

        if (response.data.success) {
          setIsAuthenticated(true);
        }

        try {
          const tempData = await axios.get("/api/home", {
            withCredentials: true
          })

          console.log("Data fetched successfully:", tempData);
          setData(tempData.data.data);

        } catch (error) {
          console.error("Error fetching home data:", error);
        }

      } catch (error) {
        // navigate("/login");
        if (error.response) {
          const { message, redirectTo } = error.response.data;

          console.log(message);       // Logs: "Invalid token, loc->verifyUserToken"
          console.log(redirectTo);    // Logs: "/login"

          // Optional: Show error to user
          setErrors({ api: message });

          // Optional: Redirect if needed
          if (redirectTo) {
            navigate(redirectTo);
          }
        } else {
          console.error("Something else went wrong", error);
        }
      }

      finally{
        setLoading(false);
      }
    }

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

   if (!isAuthenticated) {
    return null; // optionally render nothing or a placeholder
  }

  return (
    <div>
      <div className='bg-amber-600'>Home</div>
      {data && data.length > 0 ? (
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">Serial No</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Branch</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.serialNo}>
                <td className="border px-4 py-2">{item.serialNo}</td>
                <td className="border px-4 py-2">{item.name}</td>
                <td className="border px-4 py-2">{item.branch}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No data available</p>
      )}
    </div>
  )
}

export default Home
