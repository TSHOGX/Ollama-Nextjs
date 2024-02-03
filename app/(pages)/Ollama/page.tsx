"use client";

import { ChatBox } from "@/components/ChatBox";
import { SetStateAction, useState } from "react";

const chatOptions = [
  { value: "Simple", label: "Simple Chat", endpoint: "api/chat" },
  { value: "Agent", label: "Chat With Agent", endpoint: "api/chat/agents" },
];

export default function Ollama() {
  const [selectedChat, setSelectedChat] = useState(chatOptions[1]);

  const handleChatSelect = (value: string) => {
    const selected = chatOptions.find((option) => option.value === value);
    if (selected) {
      setSelectedChat(selected);
    }
  };

  return (
    <div className=" min-h-screen bg-white text-black dark:bg-black dark:text-white">
      <div className=" container mx-auto">
        <div className=" flex min-h-[10svh] flex-col items-center justify-between py-[5svh]">
          <div className=" text-2xl">Chat With Ollama</div>
          <div className="mt-4">
            <select
              className="block w-full rounded-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none"
              value={selectedChat.value}
              onChange={(e) => handleChatSelect(e.target.value)}
            >
              {chatOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className=" grid min-h-[80svh] grid-cols-4 gap-8">
          <div className=" ">
            <div>filesbox</div>
          </div>
          <div className=" col-span-3 flex max-h-[80svh] flex-col gap-8">
            <ChatBox
              endpoint={selectedChat.endpoint}
              placeholder={`This is ${selectedChat.label}. What can I tell you about?`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
