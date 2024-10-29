import Hydrate from "@/shared/lib/use-query/hydrate";
import { NavChats } from "./nav-chats";
import { API } from "../services/api-client";
import { getQueryClient } from "@/shared/lib/use-query/get-query-client";
import { dehydrate } from "@tanstack/query-core";

export async function NavChatsServer() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["userChatList"],
    // queryFn: () => API.chats.getUserChats(),
  });
  const dehydratedState = dehydrate(queryClient);
  return (
    <Hydrate state={dehydratedState}>
      <NavChats />
    </Hydrate>
  );
}
