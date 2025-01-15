import { Chat } from "@/shared/components/custom/chat";

export default async function Page() {
  const id = "new";
  const chat = {
    thread_id: id,
    messages: [],
    title: null,
  };

  return <Chat chat={chat} />;
}
