"use client";

import { Attachment, ToolInvocation } from "ai_dryamvlad";
import { motion } from "framer-motion";
import { LoaderCircle, Sparkles } from "lucide-react";
import { ReactNode } from "react";

import { Markdown } from "./markdown";
import { PreviewAttachment } from "./preview-attachment";
import { TOOL_COMPONENT_MAP } from "../tools";

export const Message = ({
  role,
  content,
  toolInvocations,
  attachments,
}: {
  role: string;
  content: string | ReactNode;
  toolInvocations: Array<ToolInvocation> | undefined;
  attachments?: Array<Attachment>;
}) => {
  return (
    <motion.div
      className="w-full mx-auto max-w-5xl px-4 group/message "
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      data-role={role}
    >
      <div className="flex gap-4 group-data-[role=user]/message:px-5 w-full group-data-[role=user]/message:w-fit group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:py-3.5 rounded-xl group-data-[role=user]/message:bg-muted">
        {role === "assistant" && (
          <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border">
            <Sparkles className="size-4" />
          </div>
        )}
        <div className="flex flex-col gap-2 group-data-[role=user]/message:gap-0 w-full">
          {content !== "" && (
            <div className="flex flex-col gap-4">
              <Markdown>{content as string}</Markdown>
            </div>
          )}
          {content === "" && !toolInvocations && (
            <div className="flex items-center">
              <LoaderCircle className="size-8 text-muted-foreground animate-spin" />
            </div>
          )}

          {toolInvocations && (
            <div className="flex flex-col gap-4">
              {toolInvocations.map((toolInvocation) => {
                const { toolName, toolCallId, state } = toolInvocation;
                const toolComponent = TOOL_COMPONENT_MAP[toolName];

                if (state === "result") {
                  const { result } = toolInvocation;
                  return (
                    <div key={toolCallId}>
                      {toolComponent.final({ result })}
                    </div>
                  );
                } else {
                  return (
                    <div
                      key={toolCallId}
                      className="skeleton text-zinc-200 dark:text-zinc-700"
                    >
                      {toolComponent.loading()}
                    </div>
                  );
                }
              })}
            </div>
          )}

          {attachments && (
            <div className="flex flex-row gap-2">
              {attachments.map((attachment) => (
                <PreviewAttachment
                  key={attachment.url}
                  attachment={attachment}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
