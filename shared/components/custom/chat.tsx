"use client";

import { Attachment, Message } from "ai";
import { useChat } from "ai/react";
import { useEffect, useState } from "react";

import { Message as PreviewMessage } from "@/shared/components/custom/message";
import { useScrollToBottom } from "@/shared/components/custom/use-scroll-to-bottom";

import { MultimodalInput } from "./multimodal-input";
import { Overview } from "./overview";
import { Chat as ChatType } from "@/shared/services/types/chat";
import { useUserChats } from "@/shared/hooks/use-user-chats";
import { useUserChatStore } from "@/shared/store/chat-store";
import { usePathname } from "next/navigation";

export function Chat({ chat }: { chat: ChatType }) {
  const { mutateUpdateChat, mutateAddChat } = useUserChats();
  const { setCurrentUserChat } = useUserChatStore();
  const [firstLoad, setFirstLoad] = useState(true);
  const pathname = usePathname();

  let isNewChat = false;

  const { messages, handleSubmit, input, setInput, append, isLoading, stop } =
    useChat({
      body: { id: chat.thread_id },
      initialMessages: chat.messages,
      streamProtocol: "data",
    });

  // Update pathname when new chat is started. Save chat on each new full message received.
  useEffect(() => {
    const newPath = `/chat/${chat.thread_id}`;
    isNewChat = pathname !== newPath;

    setCurrentUserChat(chat);

    if (!isLoading && messages.length > 0) {
      if (!firstLoad && !isNewChat) {
        mutateUpdateChat({
          thread_id: chat.thread_id,
          messages: [...messages],
        });
      } else if (isNewChat) {
        window.history.replaceState({}, "", newPath);
        mutateAddChat({
          thread_id: chat.thread_id,
          messages: [...messages],
        });
      }
    }
    setFirstLoad(false);
  }, [isLoading]);

  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  const [attachments, setAttachments] = useState<Array<Attachment>>([]);

  return (
    <>
      <div className="flex flex-1 flex-col justify-between items-center gap-5 w-full overflow-y-auto">
        <div
          ref={messagesContainerRef}
          className="flex flex-col gap-4 w-full items-center"
        >
          {messages.length === 0 && <Overview />}

          {messages.map((message, index) => (
            <PreviewMessage
              index={index}
              key={message.id}
              role={message.role}
              content={message.content}
              attachments={message.experimental_attachments}
              toolInvocations={message.toolInvocations}
            />
          ))}

          <div
            ref={messagesEndRef}
            className="shrink-0 min-w-[24px] min-h-[24px]"
          />
        </div>
      </div>
      <div className="w-full flex items-center justify-center pb-5">
        <form className="flex flex-row gap-2 bg-background items-end w-full">
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
    </>
  );
}
