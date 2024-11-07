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
      messages: coreMessages.slice(-1),
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
