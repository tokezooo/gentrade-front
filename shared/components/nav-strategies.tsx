"use client";

import {
  Folder,
  LoaderCircle,
  MoreHorizontal,
  Plus,
  Trash2,
  TrendingUp,
  Workflow,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { useUserStrategies } from "@/shared/hooks/use-user-strategies";
import { cn } from "../lib/utils";
import { useNavStore } from "../store/nav-store";
import type { Strategy as StrategyType } from "@/shared/services/types/strategy";

export function NavStrategies() {
  const { isMobile } = useSidebar();
  const { userStrategyList, mutateDeleteStrategy } = useUserStrategies();
  const { currentNavState, setCurrentNavState } = useNavStore();

  const currentStrategy = currentNavState?.object;
  const isCurrentStrategy = (strategyId: number) =>
    currentNavState?.rootTitle === "Strategies" &&
    (currentStrategy as StrategyType)?.id === strategyId;

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>
        <TrendingUp className="mr-2" />
        <span>Strategies</span>
      </SidebarGroupLabel>

      <SidebarMenu>
        {!userStrategyList || userStrategyList.length === 0 ? (
          <SidebarMenuItem key="empty-state">
            <SidebarMenuButton
              asChild
              disabled
              className="hover:bg-transparent hover:text-muted-foreground text-muted-foreground text-sm"
            >
              <span>No strategies yet</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ) : (
          userStrategyList.map((item) => (
            <SidebarMenuItem key={item.id ?? "loading"}>
              <SidebarMenuButton
                asChild
                disabled={!item.id}
                isActive={isCurrentStrategy(item.id)}
              >
                <Link
                  href={item.id ? `/strategies/${item.id}` : "#"}
                  className={cn(
                    "flex items-center gap-2",
                    !item.id && "opacity-50"
                  )}
                >
                  {!item.id && <LoaderCircle className="size-4 animate-spin" />}
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
              {item.id && (
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
                      onClick={() => mutateDeleteStrategy(item.id)}
                    >
                      <Trash2 />
                      <span>Delete strategy</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </SidebarMenuItem>
          ))
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
