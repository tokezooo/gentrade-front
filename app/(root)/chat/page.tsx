import { Chat } from "@/shared/components/custom/chat";
import { generateUUID } from "@/shared/lib/utils";

export default async function Page() {
  const id = "new";
  const chat = {
    thread_id: id,
    messages: [],
    title: null,
  };

  return <Chat chat={chat} />;
}
