import { CoreMessage } from "ai";
import { notFound } from "next/navigation";

import { Chat as PreviewChat } from "@/components/custom/chat";
import { convertToUIMessages } from "@/lib/utils";
import { getChat } from "@/actions/actions_chat";

export default async function Page({ params }: { params: any }) {
  const { id } = params;
  const chatFromDb = await getChat(id);
  console.log("NEW CHAT STARTED");

  if (!chatFromDb) {
    notFound();
  }

  const chat = {
    ...chatFromDb,
    messages: convertToUIMessages(chatFromDb.messages as Array<CoreMessage>),
  };

  return <PreviewChat chat={chat} />;
}
