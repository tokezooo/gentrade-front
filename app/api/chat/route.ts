import { convertToCoreMessages, Message, streamText } from "ai_dryamvlad";
import { RemoteRunnable } from "langchain/runnables/remote";
import { LangChainAdapterCustom } from "ai_dryamvlad";
import { auth } from "@clerk/nextjs/server";

// import { customModel } from "@/ai";
// import { deleteChatById, getChatById, saveChat } from "@/db/queries";

export async function POST(request: Request) {
  const { id, messages }: { id: string; messages: Array<Message> } =
    await request.json();

  const { getToken } = await auth();
  const token = await getToken();

  const coreMessages = convertToCoreMessages(messages);

  const remoteChain = new RemoteRunnable({
    url: process.env.AGENT_URL || "http://localhost:8000/chat",
    options: {
      timeout: 600000,
      headers: {
        Authorization: `Bearer ${token}`,
        ThreadId: id,
      },
    },
  });

  const stream = remoteChain.streamEvents(
    {
      input: coreMessages.slice(-1),
    },
    {
      version: "v2",
      configurable: {
        thread_id: id || "",
        checkpoint_ns: "",
        checkpoint_id: "",
      },
    }
  );

  return LangChainAdapterCustom.toDataStreamResponse(stream);
}

export async function DELETE(request: Request) {
  // const { searchParams } = new URL(request.url);
  // const id = searchParams.get("id");
  // if (!id) {
  //   return new Response("Not Found", { status: 404 });
  // }
  // const session = await auth();
  // if (!session || !session.user) {
  //   return new Response("Unauthorized", { status: 401 });
  // }
  // try {
  //   const chat = await getChatById({ id });
  //   if (chat.userId !== session.user.id) {
  //     return new Response("Unauthorized", { status: 401 });
  //   }
  //   await deleteChatById({ id });
  //   return new Response("Chat deleted", { status: 200 });
  // } catch (error) {
  //   return new Response("An error occurred while processing your request", {
  //     status: 500,
  //   });
  // }
}
