"use client";

import { Attachment, Message } from "ai";
import { useChat } from "ai/react";
import { useEffect, useState } from "react";

import { Message as PreviewMessage } from "@/components/custom/message";
import { useScrollToBottom } from "@/components/custom/use-scroll-to-bottom";

import { MultimodalInput } from "./multimodal-input";
import { Overview } from "./overview";
import { getUserChats, saveChat } from "@/actions/actions_chat";
import { Chat as ChatType } from "@/lib/types";
import { useChatStore } from "@/lib/store/chat-store";
import { usePathname } from "next/navigation";

export function Chat({ chat }: { chat: ChatType }) {
  const [firstLoad, setFirstLoad] = useState(true);
  const setCurrentChat = useChatStore((state) => state.setCurrentChat);
  const setChatList = useChatStore((state) => state.setChatList);
  const [newChatStarted, setNewChatStarted] = useState(false);

  const { messages, handleSubmit, input, setInput, append, isLoading, stop } =
    useChat({
      body: { id: chat.thread_id },
      initialMessages: chat.messages,
      streamProtocol: "data",
    });

  // Update pathname when new chat is started. Save chat on each new full message received.
  useEffect(() => {
    if (!isLoading && messages.length > 0 && !firstLoad) {
      const newPath = `/chat/${chat.thread_id}`;
      const pathname = window.location.pathname;

      if (pathname !== newPath) {
        window.history.replaceState({}, "", newPath);
        setNewChatStarted(true);
      }
      saveChat({ thread_id: chat.thread_id, messages: [...messages] });
    }
  }, [isLoading]);

  // Update chat list when new chat is started.
  useEffect(() => {
    const updateChatList = async () => {
      const chatList = await getUserChats();
      setChatList(chatList);
    };
    if (newChatStarted) {
      updateChatList();
      setNewChatStarted(false);
    }
  }, [newChatStarted]);

  // Set first load to false and current chat.
  useEffect(() => {
    setFirstLoad(false);
    setCurrentChat(chat);
  }, []);

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
