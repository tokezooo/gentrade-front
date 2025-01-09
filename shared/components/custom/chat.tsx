"use client";

import { Attachment, Message, ToolInvocation } from "ai_dryamvlad";
import { useChat } from "ai_dryamvlad/react";
import { useEffect, useState } from "react";

import { Message as PreviewMessage } from "@/shared/components/custom/message";
import { useScrollToBottom } from "@/shared/components/custom/use-scroll-to-bottom";

import { MultimodalInput } from "./multimodal-input";
import { Overview } from "./overview";
import { Chat as ChatType } from "@/shared/services/types/chat";
import { useUserChats } from "@/shared/hooks/use-user-chats";
import { useUserChatStore } from "@/shared/store/chat-store";
import { usePathname } from "next/navigation";
import { useChatStateModifierStore } from "@/shared/store/chat-state-modifier-store";
import { StrategyDraftEditForm } from "./strategy-draft-edit-form";
import { StrategyDraft } from "@/shared/lib/validation";

export function Chat({ chat }: { chat: ChatType }) {
  const { mutateUpdateChat, mutateAddChat } = useUserChats();
  const { setCurrentUserChat } = useUserChatStore();
  const { chatModifier, setChatModifier } = useChatStateModifierStore();
  const [firstLoad, setFirstLoad] = useState(true);
  const [attachments, setAttachments] = useState<Array<Attachment>>([]);
  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  const pathname = usePathname();

  let isNewChat = false;

  const { messages, handleSubmit, input, setInput, append, isLoading, stop } =
    useChat({
      body: { id: chat.thread_id },
      initialMessages: chat.messages,
      streamProtocol: "data",
    });

  const handleStrategyDraftUpdate = (updatedStrategyDraft: StrategyDraft) => {
    const lastStrategyDraftMessageIndex = messages.findIndex(
      (message: Message) =>
        message.toolInvocations?.some(
          (tool: ToolInvocation) =>
            tool.toolName === "StrategyDraftOutputTool" &&
            tool.toolCallId === chatModifier.subject?.toolCallId
        )
    );

    if (lastStrategyDraftMessageIndex !== -1) {
      const updatedMessages = [...messages];
      const messageToUpdate = updatedMessages[lastStrategyDraftMessageIndex];

      if (messageToUpdate.toolInvocations) {
        messageToUpdate.toolInvocations = messageToUpdate.toolInvocations.map(
          (tool: ToolInvocation) => {
            if (tool.toolName === "StrategyDraftOutputTool") {
              return {
                ...tool,
                result: JSON.stringify(updatedStrategyDraft),
              };
            }
            return tool;
          }
        );
      }

      mutateUpdateChat({
        thread_id: chat.thread_id,
        messages: updatedMessages,
        title: chat.title,
      });
    }

    setChatModifier({ state: null, subject: null });
  };

  // Update pathname when new chat is started. Save chat on each new full message received.
  useEffect(() => {
    const newPath = `/chat/${chat.thread_id}`;
    isNewChat = pathname !== newPath;

    messagesEndRef.current?.scrollIntoView({
      behavior: "instant",
      block: "end",
    });

    setCurrentUserChat(chat);

    if (!isLoading && messages.length > 0) {
      const chatTitle = chat.title || messages[0].content;

      if (!firstLoad && !isNewChat) {
        mutateUpdateChat({
          thread_id: chat.thread_id,
          messages: [...messages],
          title: chatTitle,
        });
      } else if (isNewChat) {
        window.history.replaceState({}, "", newPath);
        mutateAddChat({
          thread_id: chat.thread_id,
          messages: [...messages],
          title: chatTitle,
        });
      }
    }

    setFirstLoad(false);
  }, [isLoading]);

  return (
    <div className="flex flex-col min-w-0 h-[calc(100svh-theme(spacing.16))] bg-background rounded-xl">
      <div
        ref={messagesContainerRef}
        className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll"
      >
        {messages.length === 0 && <Overview />}

        {messages.map((message) => (
          <PreviewMessage
            key={message.id}
            role={message.role}
            content={message.content}
            attachments={message.experimental_attachments}
            toolInvocations={message.toolInvocations}
          />
        ))}

        {chatModifier.state === "editing" && (
          <StrategyDraftEditForm
            initialData={chatModifier.subject as StrategyDraft}
            onSubmit={handleStrategyDraftUpdate}
          />
        )}

        <div
          ref={messagesEndRef}
          className="shrink-0 min-w-[24px] min-h-[24px]"
        />
      </div>
      <form className="flex relative mx-auto bg-background pb-4 gap-2 w-full max-w-5xl px-4 rounded-xl">
        <MultimodalInput
          input={input}
          setInput={setInput}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          stop={stop}
          attachments={attachments}
          setAttachments={setAttachments}
          messages={messages}
          append={append}
        />
      </form>
    </div>
  );
}
