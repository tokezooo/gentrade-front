"use client";

import React from "react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "../ui/breadcrumb";
import { useUserChatStore } from "@/shared/store/chat-store";

const Breadcrumbs = () => {
  const currentChat = useUserChatStore((state) => state.currentUserChat);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">Chats</BreadcrumbItem>
        <BreadcrumbSeparator className="hidden md:block" />
        <BreadcrumbItem>
          <BreadcrumbPage>
            {currentChat && currentChat.messages.length > 0
              ? `${currentChat.thread_id}`
              : "New chat"}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default Breadcrumbs;
