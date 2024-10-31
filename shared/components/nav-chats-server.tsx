"use server";

import Hydrate from "@/shared/lib/use-query/hydrate";
import { NavChats } from "./nav-chats";
import { getQueryClient } from "@/shared/lib/use-query/get-query-client";
import { dehydrate } from "@tanstack/query-core";

export async function NavChatsServer() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["getUserChats"],
  });
  const dehydratedState = dehydrate(queryClient);

  return (
    <Hydrate state={dehydratedState}>
      <NavChats />
    </Hydrate>
  );
}
