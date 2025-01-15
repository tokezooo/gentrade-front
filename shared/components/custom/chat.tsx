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
import { StrategyDraft } from "@/shared/services/types/strategy-draft";
import { useStrategyDraftUpdate } from "@/shared/hooks/use-strategy-draft-update";
import { StrategyDraftProvider } from "@/shared/contexts/strategy-draft-context";
import { generateUUID } from "@/shared/lib/utils";
import { toast } from "sonner";

export function Chat({ chat }: { chat: ChatType }) {
  const { mutateUpdateChat, mutateAddChat } = useUserChats();
  const { setCurrentUserChat } = useUserChatStore();
  const { chatModifier } = useChatStateModifierStore();
  const [firstLoad, setFirstLoad] = useState(true);
  const [attachments, setAttachments] = useState<Array<Attachment>>([]);
  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  const pathname = usePathname();

  let isNewChat = false;

  const {
    messages,
    handleSubmit,
    input,
    setInput,
    append,
    isLoading,
    stop,
    setMessages,
  } = useChat({
    body: { id: chat.thread_id },
    initialMessages: chat.messages,
    streamProtocol: "data",
    onError(error) {
      toast.error(error.message);
    },
  });

  const handleStrategyDraftUpdate = useStrategyDraftUpdate(
    messages,
    chat.id ?? 0,
    chat.thread_id,
    chat.title
  );

  useEffect(() => {
    if (chat.thread_id === "new") {
      setMessages([]);
      setInput("");
      setAttachments([]);
      setFirstLoad(true);
      setCurrentUserChat(chat);
    }
  }, [chat.thread_id]);

  // Update pathname when new chat is started. Save chat on each new full message received.
  useEffect(() => {
    isNewChat = chat.thread_id === "new";

    messagesEndRef.current?.scrollIntoView({
      behavior: "instant",
      block: "end",
    });

    setCurrentUserChat(chat);

    if (!isLoading && messages.length > 0) {
      const chatTitle = chat.title || messages[0].content;

      if (!firstLoad && !isNewChat) {
        mutateUpdateChat({
          id: chat.id,
          thread_id: chat.thread_id,
          messages: [...messages],
          title: chatTitle,
        });
      } else if (isNewChat) {
        chat.thread_id = generateUUID();
        window.history.replaceState({}, "", `/chat/${chat.thread_id}`);
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
    <StrategyDraftProvider
      handleStrategyDraftUpdate={handleStrategyDraftUpdate}
    >
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
    </StrategyDraftProvider>
  );
}
