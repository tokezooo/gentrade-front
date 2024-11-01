"use client";

import { Attachment, Message } from "ai_dryamvlad";
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
      const chatTitle = chat.title || messages[0].content;
      // setRenderMessages([...messages]);
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

    // if (isLoading && messages.length > 0) {
    //   setRenderMessages([
    //     ...messages,
    //     { id: "loading", role: "assistant", content: "" },
    //   ]);
    // }

    setFirstLoad(false);
  }, [isLoading]);

  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  const [attachments, setAttachments] = useState<Array<Attachment>>([]);

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

        <div
          ref={messagesEndRef}
          className="shrink-0 min-w-[24px] min-h-[24px]"
        />
      </div>
      <form className="flex mx-auto bg-background pb-4 gap-2 w-full max-w-5xl px-4 rounded-xl">
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
