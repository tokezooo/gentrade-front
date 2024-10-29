import { CoreMessage } from "ai";
import { notFound } from "next/navigation";

import { Chat } from "@/shared/components/custom/chat";
import { convertToUIMessages } from "@/shared/lib/utils";
import { API } from "@/shared/services/api-client";

export default async function Page({ params }: { params: any }) {
  const { id } = params;
  const chatFromDb = await API.chats.getChat(id);

  if (!chatFromDb) {
    notFound();
  }

  const chat = {
    ...chatFromDb,
    messages: convertToUIMessages(chatFromDb.messages as Array<CoreMessage>),
  };

  return <Chat chat={chat} />;
}
