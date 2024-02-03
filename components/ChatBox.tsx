// Adapted from https://github.com/langchain-ai/langchain-nextjs-template/tree/main

"use client";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useChat } from "ai/react";
import { useRef, useState, ReactElement } from "react";
import type { FormEvent } from "react";
import type { AgentStep } from "langchain/schema";

import { ChatMessageBubble } from "@/components/ChatMessageBubble";
import { IntermediateStep } from "./IntermediateStep";

export function ChatBox(props: {
  endpoint: string;
  placeholder?: string;
  showIngestForm?: boolean;
}) {
  const messageContainerRef = useRef<HTMLDivElement | null>(null);

  const { endpoint, placeholder, showIngestForm } = props;

  // const [showIntermediateSteps, setShowIntermediateSteps] = useState(false);
  // if (endpoint === "api/chat/agents") {
  //   const showIntermediateSteps = true;
  // } else {
  //   const showIntermediateSteps = false;
  // }

  const [intermediateStepsLoading, setIntermediateStepsLoading] =
    useState(false);

  // const intemediateStepsToggle = showIntermediateStepsToggle && (
  //   <div>
  //     <input
  //       type="checkbox"
  //       id="show_intermediate_steps"
  //       name="show_intermediate_steps"
  //       checked={showIntermediateSteps}
  //       onChange={(e) => setShowIntermediateSteps(e.target.checked)}
  //     ></input>
  //     <label htmlFor="show_intermediate_steps"> Show intermediate steps</label>
  //   </div>
  // );

  const [sourcesForMessages, setSourcesForMessages] = useState<
    Record<string, any>
  >({});

  const {
    messages,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    isLoading: chatEndpointIsLoading,
    setMessages,
  } = useChat({
    api: endpoint,
    onResponse(response) {
      const sourcesHeader = response.headers.get("x-sources");
      const sources = sourcesHeader ? JSON.parse(atob(sourcesHeader)) : [];
      const messageIndexHeader = response.headers.get("x-message-index");
      if (sources.length && messageIndexHeader !== null) {
        setSourcesForMessages({
          ...sourcesForMessages,
          [messageIndexHeader]: sources,
        });
      }
    },
    onError: (e) => {
      toast(e.message);
    },
  });

  async function sendMessage(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (messageContainerRef.current) {
      messageContainerRef.current.classList.add("grow");
    }
    if (!messages.length) {
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
    if (chatEndpointIsLoading ?? intermediateStepsLoading) {
      // TODO break current process
      return;
    }
    if (endpoint !== "api/chat/agents") {
      console.log("don't need to show Intermediate Steps");
      handleSubmit(e);
    } else {
      setIntermediateStepsLoading(true);
      setInput("");
      const messagesWithUserReply = messages.concat({
        id: messages.length.toString(),
        content: input,
        role: "user",
      });
      setMessages(messagesWithUserReply);
      const response = await fetch(endpoint, {
        method: "POST",
        body: JSON.stringify({
          messages: messagesWithUserReply,
          show_intermediate_steps: true,
        }),
      });
      const json = await response.json();
      setIntermediateStepsLoading(false);
      if (response.status === 200) {
        // Represent intermediate steps as system messages for display purposes
        const intermediateStepMessages = (json.intermediate_steps ?? []).map(
          (intermediateStep: AgentStep, i: number) => {
            return {
              id: (messagesWithUserReply.length + i).toString(),
              content: JSON.stringify(intermediateStep),
              role: "system",
            };
          }
        );
        const newMessages = messagesWithUserReply;
        for (const message of intermediateStepMessages) {
          newMessages.push(message);
          setMessages([...newMessages]);
          await new Promise((resolve) =>
            setTimeout(resolve, 1000 + Math.random() * 1000)
          );
        }
        setMessages([
          ...newMessages,
          {
            id: (
              newMessages.length + intermediateStepMessages.length
            ).toString(),
            content: json.output,
            role: "assistant",
          },
        ]);
      } else {
        if (json.error) {
          toast(json.error);
          // throw new Error(json.error);
        } else {
          throw new Error(json);
        }
      }
    }
  }

  return (
    <div
      className={` flex grow flex-col items-center overflow-hidden rounded p-4 md:p-8 ${
        messages.length > 0 ? "border border-gray-500" : ""
      }`}
    >
      <div
        className=" no-scrollbar mb-4 flex w-full flex-col-reverse overflow-auto transition-[flex-grow] ease-in-out"
        ref={messageContainerRef}
      >
        {messages.length > 0
          ? [...messages].reverse().map((m, i) => {
              const sourceKey = (messages.length - 1 - i).toString();
              return m.role === "system" ? (
                <IntermediateStep key={m.id} message={m}></IntermediateStep>
              ) : (
                <ChatMessageBubble
                  key={m.id}
                  message={m}
                  sources={sourcesForMessages[sourceKey]}
                ></ChatMessageBubble>
              );
            })
          : ""}
      </div>

      <form onSubmit={sendMessage} className="flex w-full flex-col">
        {/* <div className="flex">{intemediateStepsToggle}</div> */}
        <div className="mt-4 flex w-full">
          <input
            className="mr-8 grow rounded border border-gray-300 p-4 text-gray-400"
            value={input}
            placeholder={placeholder ?? "Ask me anything..."}
            onChange={handleInputChange}
          />
          <button
            type="submit"
            className="w-28 shrink-0 rounded-lg bg-gray-900 px-8 py-4 text-white dark:bg-white dark:text-gray-500"
          >
            <div
              role="status"
              className={`${
                chatEndpointIsLoading || intermediateStepsLoading
                  ? ""
                  : "hidden"
              } flex justify-center`}
            >
              <svg
                aria-hidden="true"
                className="h-6 w-6 animate-spin fill-gray-900 text-white dark:fill-gray-600 dark:text-white"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
            <span
              className={
                chatEndpointIsLoading || intermediateStepsLoading
                  ? "hidden"
                  : ""
              }
            >
              Send
            </span>
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}