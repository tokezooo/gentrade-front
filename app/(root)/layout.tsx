import { AppSidebar } from "@/shared/components/app-sidebar";
import { Separator } from "@/shared/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/shared/components/ui/sidebar";
import { auth, currentUser } from "@clerk/nextjs/server";
import { Metadata } from "next";
import { ReactNode } from "react";
import { API } from "@/shared/services/api-client";
import Breadcrumbs from "@/shared/components/custom/breadcrumbs";

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
    await API.users.createUser();
  }

  return (
    <SidebarProvider>
      <AppSidebar user={userData} />
      <SidebarInset>
        <header className="flex h-16 bg-background md:h-12 items-center px-2 md:px-2 z-10 rounded-xl w-full">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumbs />
          </div>
        </header>
        {props.children}
      </SidebarInset>
    </SidebarProvider>
  );
}
