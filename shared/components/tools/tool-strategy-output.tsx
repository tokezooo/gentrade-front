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
import { getStrategyDescriptions } from "@/shared/lib/validation";
import { ChevronsUpDown, Info, Pencil, Save, TrendingUp } from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import React, { useRef } from "react";

// Extract descriptions
const strategyDescriptions = getStrategyDescriptions();

export const StrategyPropertyItem = ({
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
  const tooltip = strategyDescriptions[propertyKey];

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

export const ToolStrategyOutput = ({
  result,
  toolCallId,
}: {
  result: string;
  toolCallId: string;
}) => {
  const { chatModifier, setChatModifier } = useChatStateModifierStore();
  const parsedResult = JSON.parse(result);
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <Card ref={cardRef}>
        <Collapsible>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 justify-between">
              <div className="flex items-center gap-2 text-xl font-semibold">
                <TrendingUp className="size-4" />
                {parsedResult.name}
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
              {parsedResult.description}
            </CardDescription>
          </CardHeader>
          <CollapsibleContent>
            <CardContent>
              <TooltipProvider delayDuration={0}>
                <div className="space-y-4">
                  {Object.keys(strategyDescriptions)
                    .filter((key) => key !== "name" && key !== "description")
                    .map(
                      (key) =>
                        parsedResult[key] !== undefined && (
                          <StrategyPropertyItem
                            key={key}
                            propertyKey={key}
                            parsedResult={parsedResult}
                          />
                        )
                    )}
                </div>
              </TooltipProvider>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
        <CardFooter className="flex justify-start gap-2">
          <Button variant="outline">
            <Save strokeWidth={1.1} />
            Save
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setChatModifier({
                state: "editing",
                subject: { ...parsedResult, toolCallId },
              });
            }}
          >
            <Pencil strokeWidth={1.1} />
            Edit
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};
