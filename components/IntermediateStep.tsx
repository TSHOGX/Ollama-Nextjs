import { useState } from "react";
import type { Message } from "ai/react";
import type { AgentStep } from "langchain/schema";

export function IntermediateStep(props: { message: Message }) {
  const parsedInput: AgentStep = JSON.parse(props.message.content);
  const action = parsedInput.action;
  const observation = parsedInput.observation;
  return (
    <div
      className={`mx-auto mb-8 flex max-w-[80%] cursor-pointer flex-col whitespace-pre-wrap rounded bg-slate-400 px-4 py-2 text-white`}
    >
      <div className={`w-full text-center uppercase`}>
        Action Tool : {action.tool}
      </div>
      <div
        className={`no-scrollbar max-h-[30svh] overflow-scroll transition-[max-height] ease-in-out`}
      >
        <div className={`mt-1 max-w-full rounded bg-slate-500 p-4`}>
          <code>
            Tool Input:
            <br></br>
            {JSON.stringify(action.toolInput)}
          </code>
        </div>
        <div className={`mt-1 max-w-full rounded bg-slate-500 p-4 `}>
          <code>{observation}</code>
        </div>
      </div>
    </div>
  );
}
