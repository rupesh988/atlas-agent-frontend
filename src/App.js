import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import Searchbar from "./components/Search";
import Researching from "./components/Researching";

const SOCKET_URL = "http://10.56.18.60:5000";

function App() {
  const [isSearch, setSearch] = useState(true);
  const [researchUpdates, setResearchUpdates] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      transports: ["websocket"],
      upgrade: false,
      forceNew: true,
      
      // Reconnection settings
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      

      pingTimeout: 60000 * 60,
      pingInterval: 15000,
      

      timeout: 60000,
      autoConnect: true,
      query: {
        keepalive: "true",
        clientType: "web"
      }
    });

    newSocket.on("connect", () => {
      console.log(" Connected");
      startKeepalive(newSocket);
    });

    newSocket.on("disconnect", (reason) => {
      console.log(" Disconnected:", reason);
      if (reason === "io server disconnect") {
        newSocket.connect();
      }
    });

    newSocket.on("reconnect", (attempt) => {
      console.log(` Reconnected (attempt ${attempt})`);
    });

    // keepalive acknowledgement
    newSocket.on("keepalive", () => {
      console.debug(" Keepalive acknowledged");
    });


    newSocket.on("r", (data) => {
      setResearchUpdates(prev => [...prev, data]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.off("connect");
      newSocket.off("disconnect");
      newSocket.off("reconnect");
      newSocket.off("keepalive");
      newSocket.off("r");
      newSocket.disconnect();
    };
  }, []);

  const startKeepalive = (socket) => {
    // Combined keepalive strategy
    const keepaliveInterval = setInterval(() => {
      if (socket.connected) {
        socket.emit("keepalive", { 
          timestamp: Date.now(),
          client: "web-ui"
        });
        
        // Fallback: Verify connection state
        if (!socket.connected) {
          socket.connect();
        }
      }
    }, 30000);

    return () => clearInterval(keepaliveInterval);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-gray-100">
      {isSearch ? (
        <Searchbar a={isSearch} b={setSearch} s={socket} />
      ) : (
        <Researching data={researchUpdates} />
      )}
    </div>
  );
}

export default App;