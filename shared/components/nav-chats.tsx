"use client";

import {
  Folder,
  Loader2,
  MessageCircle,
  MessagesSquare,
  MoreHorizontal,
  Plus,
  Share,
  Trash2,
  type LucideIcon,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/shared/components/ui/sidebar";
import Link from "next/link";
import { useNavStore } from "@/shared/store/nav-store";
import { useUserChats } from "@/shared/hooks/use-user-chats";
import { ChatListItem } from "@/shared/services/types/chat";

export function NavChats() {
  const { currentNavState } = useNavStore();
  const { isMobile } = useSidebar();
  const { userChatList, mutateDeleteChat } = useUserChats();

  const currentChat = currentNavState?.object;
  const isCurrentChat = (threadId: string) =>
    currentNavState?.rootTitle === "Chats" &&
    (currentChat as ChatListItem)?.thread_id === threadId;

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>
        <MessagesSquare className="mr-2" />
        <span>Chats</span>
      </SidebarGroupLabel>
      <SidebarGroupAction title="New chat">
        <Link href="/chat" replace>
          <Plus width={18} height={18} />
          <span className="sr-only">New chat</span>
        </Link>
      </SidebarGroupAction>
      <SidebarMenu>
        {userChatList?.length === 0 && (
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              disabled
              className="hover:bg-transparent hover:text-muted-foreground text-muted-foreground text-sm"
            >
              <span>No chats yet</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
        {userChatList.map((item) => (
          <SidebarMenuItem key={item.thread_id}>
            <SidebarMenuButton asChild isActive={isCurrentChat(item.thread_id)}>
              <Link href={`/chat/${item.thread_id}`}>
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem
                  className="cursor-pointer text-red-500 dark:text-red-400"
                  onClick={() => mutateDeleteChat(item.thread_id)}
                >
                  <Trash2 />
                  <span>Delete chat</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
