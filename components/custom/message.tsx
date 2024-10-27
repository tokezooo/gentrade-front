"use client";

import { Attachment, ToolInvocation } from "ai";
import { motion } from "framer-motion";
import { ReactNode } from "react";

import { BotIcon, UserIcon } from "./icons";
import { Markdown } from "./markdown";
import { PreviewAttachment } from "./preview-attachment";
import { Weather } from "./weather";
import { cn } from "@/lib/utils";
import ToolCalculator from "../tools/tool-calculator";
import { SparklesIcon } from "lucide-react";

const HumanMessage = ({
  index,
  content,
}: {
  index: number;
  content: string | ReactNode;
}) => {
  return (
    <motion.div
      className={cn(
        "flex flex-row-reverse gap-4 px-4 w-full md:px-0 first-of-type:pt-1"
      )}
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="flex flex-col gap-2 w-full items-end">
        {content && (
          <div className="text-zinc-800 dark:text-zinc-300 flex flex-col gap-4 rounded-lg bg-zinc-100 dark:bg-zinc-800 p-4">
            <Markdown>{content as string}</Markdown>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const AssistantMessage = ({
  index,
  content,
  toolInvocations,
  attachments,
}: {
  index: number;
  content: string | ReactNode;
  toolInvocations: Array<ToolInvocation> | undefined;
  attachments?: Array<Attachment>;
}) => {
  return (
    <motion.div
      className="flex gap-4 px-6 w-full md:px-0 first-of-type:pt-1 "
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="size-[24px] flex flex-col justify-center items-center shrink-0 text-zinc-400">
        <SparklesIcon strokeWidth={1} />
      </div>

      <div className="flex flex-col gap-2 w-full">
        {content && (
          <div className="text-zinc-800 dark:text-zinc-300 flex flex-col gap-4">
            <Markdown>{content as string}</Markdown>
          </div>
        )}

        {toolInvocations && (
          <div className="flex flex-col gap-4">
            {toolInvocations.map((toolInvocation) => {
              const { toolName, toolCallId, state } = toolInvocation;

              if (state === "result") {
                const { result } = toolInvocation;
                return (
                  <div key={toolCallId}>
                    {toolName === "Calculator" ? (
                      <ToolCalculator result={result as string} />
                    ) : null}
                  </div>
                );
              } else {
                return (
                  <div
                    key={toolCallId}
                    className="skeleton text-zinc-200 dark:text-zinc-700"
                  >
                    {toolName === "Calculator" ? (
                      <ToolCalculator result={"loading..."} />
                    ) : null}
                  </div>
                );
              }
            })}
          </div>
        )}

        {attachments && (
          <div className="flex flex-row gap-2">
            {attachments.map((attachment) => (
              <PreviewAttachment key={attachment.url} attachment={attachment} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export const Message = ({
  index,
  role,
  content,
  toolInvocations,
  attachments,
}: {
  index: number;
  role: string;
  content: string | ReactNode;
  toolInvocations: Array<ToolInvocation> | undefined;
  attachments?: Array<Attachment>;
}) => {
  return role === "assistant" ? (
    <AssistantMessage
      index={index}
      content={content}
      toolInvocations={toolInvocations}
      attachments={attachments}
    />
  ) : (
    <HumanMessage index={index} content={content} />
  );
};
