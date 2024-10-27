import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { auth, currentUser } from "@clerk/nextjs/server";
import { addUser } from "@/actions/actions_user";
import { Metadata } from "next";
import { ReactNode } from "react";
import { getUserChats } from "@/actions/actions_chat";
import Breadcrumbs from "@/components/custom/breadcrumbs";

export const metadata: Metadata = {
  title: "GenTrade",
  description: "Instantly generate cryptotrading bots",
};

export default async function RootLayout(props: { children: ReactNode }) {
  const { userId } = await auth();
  const user = await currentUser();
  const userData = {
    name: `${user?.firstName} ${user?.lastName}`,
    email: user?.emailAddresses[0].emailAddress,
    avatar: user?.imageUrl,
  };

  if (userId) {
    await addUser();
  }

  return (
    <SidebarProvider>
      <AppSidebar user={userData} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumbs />
          </div>
        </header>
        <div className="flex flex-1 flex-col justify-center items-center px-8">
          {props.children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
