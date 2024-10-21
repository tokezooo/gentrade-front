"use client";

import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { EndpointsContext } from "@/app/agent";
import { useActions } from "@/utils/client";
import { LocalContext } from "@/app/shared";
import { HumanMessageText } from "./message";
import { ArrowUpIcon } from "lucide-react";

export default function Chat() {
  const actions = useActions<typeof EndpointsContext>();

  const [elements, setElements] = useState<JSX.Element[]>([]);
  const [history, setHistory] = useState<[role: string, content: string][]>([]);
  const [input, setInput] = useState("");

  async function onSubmit(input: string) {
    const newElements = [...elements];
    const element = await actions.agent({
      input,
      chat_history: history,
    });

    newElements.push(
      <div className="flex flex-col w-full gap-1 mt-auto" key={history.length}>
        <HumanMessageText content={input} />
        <div className="flex flex-col gap-1 w-full max-w-fit mr-auto">
          {element.ui}
        </div>
      </div>
    );

    // consume the value stream to obtain the final string value
    // after which we can append to our chat history state
    (async () => {
      let lastEvent = await element.lastEvent;
      if (Array.isArray(lastEvent)) {
        if (lastEvent[0].invoke_model && lastEvent[0].invoke_model.result) {
          setHistory((prev) => [
            ...prev,
            ["human", input],
            ["ai", lastEvent[0].invoke_model.result],
          ]);
        } else if (lastEvent[1].invoke_tools) {
          setHistory((prev) => [
            ...prev,
            ["human", input],
            [
              "ai",
              `Tool result: ${JSON.stringify(
                lastEvent[1].invoke_tools.tool_result,
                null
              )}`,
            ],
          ]);
        } else {
          setHistory((prev) => [...prev, ["human", input]]);
        }
      } else if (lastEvent.invoke_model && lastEvent.invoke_model.result) {
        setHistory((prev) => [
          ...prev,
          ["human", input],
          ["ai", lastEvent.invoke_model.result],
        ]);
      }
    })();

    setElements(newElements);
    setInput("");
  }

  return (
    <div className="w-[80vw] h-[80vh] flex flex-col gap-3 justify-between mx-auto border-[1px] border-gray-200 dark:border-gray-800 rounded-lg p-3 shadow-sm bg-gray-50/25 dark:bg-gray-900/25">
      <div className="w-full min-h-[65vh] overflow-y-scroll flex flex-col">
        <LocalContext.Provider value={onSubmit}>
          <div className="flex flex-col w-full gap-1 mt-auto">{elements}</div>
        </LocalContext.Provider>
      </div>
      <div className="w-full flex flex-row">
        <form
          onSubmit={async (e) => {
            e.stopPropagation();
            e.preventDefault();
            await onSubmit(input);
          }}
          className="w-full flex flex-row gap-2"
        >
          <Input
            placeholder="Your prompt here"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="dark:bg-gray-900/50 dark:text-white"
          />
          <Button type="submit">
            <ArrowUpIcon />
          </Button>
        </form>
      </div>
    </div>
  );
}
