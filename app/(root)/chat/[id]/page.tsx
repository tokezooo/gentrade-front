import { CoreMessage } from "ai_dryamvlad";
import { redirect } from "next/navigation";

import { Chat } from "@/shared/components/custom/chat";
import { convertToUIMessages } from "@/shared/lib/utils";
import { API } from "@/shared/services/api-client";

export default async function Page(props: { params: Promise<any> }) {
  const params = await props.params;
  const { id } = params;
  const chatFromDb = await API.chats.getChat(id);

  if (!chatFromDb) {
    return redirect("/chat");
  }

  const chat = {
    ...chatFromDb,
    messages: convertToUIMessages(chatFromDb.messages as Array<CoreMessage>),
  };

  return <Chat chat={chat} />;
}
