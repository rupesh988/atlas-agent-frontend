import React, { useState } from "react";
import { Search } from "lucide-react";
import { Socket } from "socket.io-client";
export default function Searchbar({s,a,b}) {
    const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (searchTerm.trim()) {
        s.emit("prompt",{prompt : searchTerm})
        b(!a)
      } else {
        alert("Please enter a search term!");
      }
    }
  };
  return (
    <div className="flex items-center w-[600px] bg-white border border-gray-300 rounded-full shadow-md p-3">
        <Search size={29} className="text-black ml-2" />
        <input
          type="text"
          placeholder="A T L A S   A G E N T"
          value={searchTerm}
          onChange={handleSearch}
          onKeyDown={handleKeyDown}
          className="flex-1 p-2 text-xl text-gray-800 outline-none bg-transparent font-mono"
        />
      </div>
  )
}
