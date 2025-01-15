Below is a high-level plan for adding a new “Strategies” list to the sidebar with a link to each strategy’s detail page plus a delete button. This plan follows the existing patterns in your repo (e.g., how chats are listed with “delete” in a dropdown menu). Feel free to refine as needed!

---

## 1. **Clarify Requirements**

1. **Design & Layout**

   - Should the Strategies list appear directly under the Chats list, or should it be in a separate collapsible section, etc.?
   - Should there be a “New strategy” button (like “New chat”)?
   - Confirm UI/UX: Do we want the same or similar style as the NavChats listing?

2. **Routing**

   - Are strategy detail pages currently at `/strategies/[id]`?
   - Confirm if the link should push to something like `/strategies/{id}`, or do you prefer another path?

3. **Behavior**

   - When user clicks a strategy item, do we route them to that strategy’s detail page?
   - For deletion, is it immediate with no confirmation, or do we want to confirm?
   - Should the user automatically be routed away if they are _currently_ viewing the strategy they just deleted?

4. **Data**
   - Do you want a new “Create Strategy” operation (like for “New Chat”)?
   - Are there any special states to show (“No strategies yet”, loading states, errors, skeleton placeholders, etc.)?

---

## 2. **Implementation Plan**

Below is a breakdown of where changes/additions might go, following your existing patterns and hooking into the same systems:

### 2.1 **Data Fetching & Hook**

- **Leverage `useUserStrategies`**
  - Already, `useUserStrategies` provides data (`userStrategyList`) and mutation methods (`mutateDeleteStrategy`, etc.).
  - Confirm the final shape of the strategies in your `StrategyListItem` array.
  - We can mirror the approach from `NavChats` to show the strategies (use the same React Query approach).

### 2.2 **New Component: `NavStrategies`**

1. **Create a new file**: `shared/components/nav-strategies.tsx` (similar pattern to `nav-chats.tsx`).
2. **Fetch & List**
   - Inside `NavStrategies`, call `const { userStrategyList, mutateDeleteStrategy } = useUserStrategies()`.
   - If `userStrategyList` is empty, show “No strategies yet”.
   - Otherwise, map over `userStrategyList`:
     ```pseudo
     {userStrategyList.map((strategy) => (
       <SidebarMenuItem key={strategy.id}>
         <SidebarMenuButton asChild>
           <Link href={`/strategies/${strategy.id}`}>
             <span>{strategy.name}</span>
           </Link>
         </SidebarMenuButton>
         // a dropdown or action for “delete”
       </SidebarMenuItem>
     ))}
     ```
3. **Delete Button**
   - Similar to `NavChats` approach, place a `DropdownMenuTrigger` plus `DropdownMenuContent`.
   - Inside, a “Delete Strategy” item calls `mutateDeleteStrategy(strategy.id)`.
4. **Optional**: “New Strategy” button. If desired, replicate the “New chat” pattern in `SidebarGroupAction`.

### 2.3 **Hook into the Sidebar**

- **`app-sidebar.tsx`**
  - Insert `<NavStrategies />` somewhere near `<NavChats />`.
  - Possibly a separate `SidebarGroup`:
    ```pseudo
    <SidebarContent>
      <NavChats />
      <NavStrategies />
      <NavSecondary />
    </SidebarContent>
    ```
- Confirm final ordering (Chats above Strategies or vice versa).

### 2.4 **Routing & Deletion Behavior**

1. **Linking**
   - Each strategy row links to `/strategies/[id]` (assuming route).
2. **Deletion**
   - Use the “onMutate” logic in `useUserStrategies` to remove the item from the query cache.
   - If the user is viewing the just-deleted strategy, redirect them (like you do with chats).
3. **Edge Cases**
   - If a user tries to delete a strategy currently in use, do you prompt them?

### 2.5 **Styling & Testing**

- **Styling**: Use the same `SidebarMenu`, `SidebarMenuItem`, and `SidebarMenuButton` approach as in NavChats.
- **Check**: Confirm the “active” styling if the user is on a strategy detail page. Possibly compare `pathname` or `router` state to highlight the active strategy.
- **Test**:
  1. Is empty state working properly?
  2. Deletion logic correct?
  3. Navigation to strategy detail page correct?
  4. Proper skeleton or fallback if data is still loading?

---

## 3. **Pseudo-code Illustration**

Below is a short pseudo-code snippet. This is not final code—just a sample outline.

```typescript
// nav-strategies.tsx (New file)
"use client";

import { useUserStrategies } from "@/shared/hooks/use-user-strategies";
import Link from "next/link";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupAction,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
} from "@/shared/components/ui/sidebar";
import { MoreHorizontal, Trash2, FolderPlus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/shared/components/ui/dropdown-menu";

export function NavStrategies() {
  const { userStrategyList, mutateDeleteStrategy } = useUserStrategies();
  // Optional isMobile check from your `useSidebar()` if needed

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Strategies</SidebarGroupLabel>
      <SidebarGroupAction title="New strategy">
        <Link href="/strategies/new">
          <FolderPlus size={18} />
          <span className="sr-only">New strategy</span>
        </Link>
      </SidebarGroupAction>
      <SidebarMenu>
        {userStrategyList.length === 0 && (
          <SidebarMenuItem>
            <SidebarMenuButton disabled>
              <span className="text-muted-foreground">No strategies yet</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
        {userStrategyList.map((item) => (
          <SidebarMenuItem key={item.id}>
            <SidebarMenuButton asChild>
              <Link href={`/strategies/${item.id}`}>
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                <DropdownMenuItem
                  onClick={() => mutateDeleteStrategy(item.id)}
                  className="text-red-500"
                >
                  <Trash2 />
                  <span>Delete strategy</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
```

---

## 4. **Open Questions / Next Steps**

1. **Where exactly in the sidebar** do you want this strategies section? (Above chats, below them, or maybe behind a collapsible section?)
2. **Do you want a “New Strategy”** button or an “import strategy” flow?
3. **Confirmation Modals**: Do you want to confirm on delete or handle it immediately like chats?
4. **Empty/Loading states**: Should we match the skeleton style from chats?
5. **Route**: Is `/strategies/[id]` the correct route for the strategy detail page?

Answering these questions will ensure the final design and user flow matches your requirements. Once clarified, you can finalize the layout, add any extra logic (like modals), and you’ll be set!

---

**Hope this helps!** Feel free to provide any clarifications or adjustments you need so we can refine the plan further.
