"use client";

import {
  Folder,
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
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { ChatListItem } from "@/lib/types";
import Link from "next/link";
import { useChatStore } from "@/lib/store/chat-store";
import { useEffect } from "react";
import { getUserChats } from "@/actions/actions_chat";

export function NavChats() {
  const { isMobile } = useSidebar();
  const chatList = useChatStore((state) => state.chatList);
  const currentChat = useChatStore((state) => state.currentChat);
  const setChatList = useChatStore((state) => state.setChatList);

  useEffect(() => {
    const updateChatList = async () => {
      const chatList = await getUserChats();
      setChatList(chatList);
    };
    console.log("Updating chat list");
    updateChatList();
  }, []);

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>
        <MessagesSquare className="mr-2" />
        <span>Chats</span>
      </SidebarGroupLabel>
      <SidebarGroupAction title="New chat">
        <Link href="/chat">
          <Plus width={18} height={18} />
          <span className="sr-only">New chat</span>
        </Link>
      </SidebarGroupAction>
      <SidebarMenu>
        {chatList.length === 0 && (
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
        {chatList.map((item) => (
          <SidebarMenuItem key={item.thread_id}>
            <SidebarMenuButton
              asChild
              isActive={currentChat?.thread_id === item.thread_id}
            >
              <Link href={`/chat/${item.thread_id}`}>
                {/* <item.icon /> */}
                <span>{item.thread_id}</span>
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
                <DropdownMenuItem className="cursor-pointer text-red-500 dark:text-red-400">
                  <Trash2 />
                  <span>Delete chat</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        {/* <SidebarMenuItem>
          <SidebarMenuButton>
            <MoreHorizontal />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem> */}
      </SidebarMenu>
    </SidebarGroup>
  );
}
