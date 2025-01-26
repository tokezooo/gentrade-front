import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/shared/components/ui/card";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/shared/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useChatStateModifierStore } from "@/shared/store/chat-state-modifier-store";
import { useUserStrategies } from "@/shared/hooks/use-user-strategies";
import {
  getStrategyDraftDescriptions,
  StrategyDraft,
} from "@/shared/services/types/strategy-draft";
import {
  ChevronsUpDown,
  Eye,
  Info,
  Pencil,
  Save,
  TrendingUp,
} from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import React, { useEffect, useRef } from "react";
import { useStrategyDraft } from "@/shared/contexts/strategy-draft-context";
import Link from "next/link";

// Extract descriptions
const strategyDraftDescriptions = getStrategyDraftDescriptions();

export const StrategyDraftPropertyItem = ({
  propertyKey,
  parsedResult,
}: {
  propertyKey: string;
  parsedResult: Record<string, any>;
}) => {
  const title = propertyKey
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
  const value =
    propertyKey === "can_short"
      ? parsedResult[propertyKey]
        ? "Yes"
        : "No"
      : parsedResult[propertyKey];
  const tooltip = strategyDraftDescriptions[propertyKey];

  return (
    <div>
      <p className="font-semibold flex items-center gap-1">
        {title}
        <Tooltip>
          <TooltipTrigger>
            <Info
              strokeWidth={1.75}
              size={10}
              className="text-muted-foreground"
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </p>
      <span className="text-muted-foreground">{value}</span>
    </div>
  );
};

export const ToolStrategyDraftOutput = ({
  result,
  toolCallId,
}: {
  result: string;
  toolCallId: string;
}) => {
  const { setChatModifier } = useChatStateModifierStore();
  const {
    mutateCreateStrategyFromDraft,
    isPendingCreateStrategyFromDraft,
    userStrategyList,
  } = useUserStrategies();
  const { handleStrategyDraftUpdate } = useStrategyDraft();

  const strategyDraft: StrategyDraft = JSON.parse(result);
  const cardRef = useRef<HTMLDivElement>(null);

  const strategyExists =
    strategyDraft.strategy_id &&
    userStrategyList.some(
      (strategy) => strategy.id === strategyDraft.strategy_id
    );

  useEffect(() => {
    strategyDraft.tool_call_id = toolCallId;
  }, [strategyDraft]);

  const handleSave = async () => {
    try {
      const strategy_id = await mutateCreateStrategyFromDraft(strategyDraft);
      strategyDraft.strategy_id = strategy_id;
      handleStrategyDraftUpdate(strategyDraft);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Card ref={cardRef}>
        <Collapsible>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 justify-between">
              <div className="flex items-center gap-2 text-xl font-semibold">
                <TrendingUp className="size-4" />
                {strategyDraft.name}
              </div>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="icon">
                  <ChevronsUpDown strokeWidth={3} size={32} />
                  <span className="sr-only">Toggle</span>
                </Button>
              </CollapsibleTrigger>
            </CardTitle>
            <Separator orientation="horizontal" />
            <CardDescription className="pt-5">
              {strategyDraft.description}
            </CardDescription>
          </CardHeader>
          <CollapsibleContent>
            <CardContent>
              <TooltipProvider delayDuration={0}>
                <div className="space-y-4">
                  {Object.keys(strategyDraftDescriptions)
                    .filter((key) => key !== "name" && key !== "description")
                    .map(
                      (key) =>
                        strategyDraft[key as keyof StrategyDraft] !==
                          undefined && (
                          <StrategyDraftPropertyItem
                            key={key}
                            propertyKey={key}
                            parsedResult={strategyDraft}
                          />
                        )
                    )}
                </div>
              </TooltipProvider>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
        <CardFooter className="flex justify-start gap-2">
          {strategyExists ? (
            <Link href={`/strategies/${strategyDraft.strategy_id}`}>
              <Button variant="outline">
                <Eye strokeWidth={1.1} />
                View
              </Button>
            </Link>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={handleSave}
                disabled={isPendingCreateStrategyFromDraft}
              >
                <Save strokeWidth={1.1} />
                {isPendingCreateStrategyFromDraft ? "Saving..." : "Save"}
              </Button>
              <Button
                variant="outline"
                disabled={isPendingCreateStrategyFromDraft}
                onClick={() => {
                  setChatModifier({
                    state: "editing",
                    subject: { ...strategyDraft, tool_call_id: toolCallId },
                  });
                }}
              >
                <Pencil strokeWidth={1.1} />
                Edit
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </>
  );
};
