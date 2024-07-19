import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { FaAngleRight } from "react-icons/fa";
import axios from "axios";

function App() {
  const [ipAddress, setIpAddress] = useState("");
  const [ipInfo, setIpInfo] = useState(null);
  const [searchIP, setSearchIP] = useState("");

  // API details for IP geolocation
  const API_KEY = import.meta.env.VITE_IPIFY_API_KEY;
  const API_URL = "https://geo.ipify.org/api/v2/country,city?";

  // Effect to fetch the user's IP address on component mount
  useEffect(() => {
    const fetchIpAddress = async () => {
      try {
        const response = await axios.get("https://api.ipify.org?format=json");
        setIpAddress(response.data.ip);
      } catch (error) {
        console.error("Error fetching the IP address:", error);
      }
    };

    fetchIpAddress();
  }, []);

  // Effect to fetch information about the IP address whenever it changes
  useEffect(() => {
    const fetchIpInfo = async () => {
      try {
        if (ipAddress) {
          const response = await axios.get(
            `${API_URL}apiKey=${API_KEY}&ipAddress=${ipAddress}`
          );
          setIpInfo(response.data);
        }
      } catch (error) {
        console.error("Error fetching the IP address information:", error);
      }
    };

    fetchIpInfo();
  }, [ipAddress]);

  // Function to handle search input and fetch data
  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `${API_URL}apiKey=${API_KEY}&ipAddress=${searchIP}`
      );
      setIpInfo(response.data);
      setIpAddress(searchIP);
    } catch (error) {
      console.error("Error fetching the IP address information:", error);
    }
    console.log("search");
  };

  return (
    <div id="map" className="h-screen">
      <div className="bg-[url('/src/assets/images/pattern-bg-mobile.png')] bg-no-repeat bg-cover h-2/5 flex flex-col items-center  ">
        <h1 className="text-white text-2xl mt-6 mb-8 font-bold leading-6">
          IP Address Tracker
        </h1>
        <div className="flex w-4/5 mb-9 md:w-3/6 cursor-pointer">
          <input
            type="search"
            name="search"
            id="search"
            value={searchIP}
            onChange={(e) => setSearchIP(e.target.value)}
            className="text-lg p-2.5 px-4 md:px-6 w-11/12 rounded-l-2xl outline-none"
            placeholder="Search for any IP address or domain"
          />
          <div
            className="bg-veryDarkGray w-2/12 flex items-center justify-center rounded-r-2xl"
            onClick={handleSearch}
          >
            <FaAngleRight className="text-2xl my-2 text-white" />
          </div>
        </div>
      </div>
      {ipInfo && ipInfo.location && (
        <div className="bg-white absolute top-1/4 left-0 right-0 md:top-1/3 w-4/5 my-0 mx-auto rounded-2xl p-5 z-50 text-center md:flex items-center justify-center ">
          <div className="mb-4 md:mx-3">
            <label htmlFor="ipAddress" className="text-xs text-darkGray">
              IP ADDRESS
            </label>
            <p className=" text-veryDarkGray">
              <strong>{ipInfo.ip}</strong>
            </p>
          </div>
          <div className="mb-4 md:mx-3">
            <label htmlFor="location" className="text-xs text-darkGray ">
              LOCATION
            </label>
            <p className=" text-veryDarkGray">
              <strong>
                {ipInfo.location.city || "-"}, {ipInfo.location.region || "-"}{" "}
                {ipInfo.location.postalCode}
              </strong>
            </p>
          </div>
          <div className="mb-4 md:mx-3">
            <label htmlFor="timeZone" className="text-xs text-darkGray">
              TIMEZONE
            </label>
            <p className="text-veryDarkGray">
              <strong>{ipInfo.location.timezone || "Null"}</strong>
            </p>
          </div>
          <div className="mb-4 md:mx-3">
            <label htmlFor="isp" className="text-xs text-darkGray">
              ISP
            </label>
            <p className=" text-veryDarkGray">
              <strong>{ipInfo.isp || "Null"}</strong>
            </p>
          </div>
        </div>
      )}
      <MapContainer
        className="h-3/5 z-10"
        center={
          ipInfo ? [ipInfo.location.lat, ipInfo.location.lng] : [51.505, -0.09]
        }
        zoom={13}
        key={
          ipInfo ? `${ipInfo.location.lat}-${ipInfo.location.lng}` : "default"
        }
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {ipInfo && (
          <Marker
            position={[ipInfo.location.lat, ipInfo.location.lng]}
          ></Marker>
        )}
      </MapContainer>
    </div>
  );
}

export default App;
