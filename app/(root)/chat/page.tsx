import { Chat } from "@/shared/components/custom/chat";
import { generateUUID } from "@/shared/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { API } from "@/shared/services/api-client";

export default async function Page() {
  const id = generateUUID();
  const { userId } = await auth();

  console.log("[NEW CHAT]");

  const chat = {
    thread_id: id,
    messages: [],
    title: null,
  };

  return <Chat chat={chat} />;
}
