// Adapted from https://github.com/langchain-ai/langchain-nextjs-template/tree/main

import type { Message } from "ai/react";
import { MDRenderer } from "./MDRenderer";

export function ChatMessageBubble(props: { message: Message; sources: any[] }) {
  const colorClassName =
    props.message.role === "user"
      ? "bg-sky-400 dark:bg-sky-600 text-white"
      : "bg-slate-50 text-black dark:text-gray-500";
  const alignmentClassName =
    props.message.role === "user" ? "ml-auto" : "mr-auto";
  return (
    <div
      className={`${alignmentClassName} ${colorClassName} mb-8 flex max-w-[80%] rounded px-4 py-2`}
    >
      <div className="flex flex-col whitespace-pre-wrap">
        <MDRenderer>{props.message.content}</MDRenderer>
        {props.sources && props.sources.length ? (
          <>
            <code className="mr-auto mt-4 rounded bg-slate-600 px-2 py-1">
              <h2>🔍 Sources:</h2>
            </code>
            <code className="mr-2 mt-1 rounded bg-slate-600 px-2 py-1 text-xs">
              {props.sources?.map((source, i) => (
                <div className="mt-2" key={"source:" + i}>
                  {i + 1}. &quot;{source.pageContent}&quot;
                  {source.metadata?.loc?.lines !== undefined ? (
                    <div>
                      <br />
                      Lines {source.metadata?.loc?.lines?.from} to{" "}
                      {source.metadata?.loc?.lines?.to}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              ))}
            </code>
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
