import { Chat } from "@/components/custom/chat";
import { generateUUID } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { addUser } from "@/actions/actions_user";

export default async function Page() {
  const id = generateUUID();
  const { userId } = await auth();

  // TODO: fix this later with clerk webhooks
  if (userId) {
    await addUser();
  }

  const chat = {
    thread_id: id,
    messages: [],
  };

  return <Chat chat={chat} />;
}
