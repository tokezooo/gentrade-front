import React, { useRef } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/shared/components/ui/card";
import {
  ChevronsUpDown,
  CircleHelp,
  Info,
  Pencil,
  Save,
  TrendingUp,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/shared/components/ui/collapsible";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useChatStateModifierStore } from "@/shared/store/chat-state-modifier-store";

export const StrategyPropertyItem = ({
  title,
  value,
  tooltip,
}: {
  title: string;
  value: string;
  tooltip: string;
}) => {
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

export const ToolStrategyOutput = ({ result }: { result: string }) => {
  const { chatModifier, setChatModifier } = useChatStateModifierStore();
  const parsedResult = JSON.parse(result);
  const cardRef = useRef<HTMLDivElement>(null);

  return (
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
            <TooltipProvider>
              <div className="space-y-4">
                {parsedResult.indicators && (
                  <StrategyPropertyItem
                    title="Indicators"
                    value={parsedResult.indicators}
                    tooltip="Indicators are the technical indicators used in the strategy."
                  />
                )}

                {parsedResult.entry_signals && (
                  <StrategyPropertyItem
                    title="Entry Signals"
                    value={parsedResult.entry_signals}
                    tooltip="Entry signals are the signals that trigger the entry into a trade."
                  />
                )}
                {parsedResult.exit_signals && (
                  <StrategyPropertyItem
                    title="Exit Signals"
                    value={parsedResult.exit_signals}
                    tooltip="Exit signals are the signals that trigger the exit from a trade."
                  />
                )}
                {parsedResult.minimal_roi && (
                  <StrategyPropertyItem
                    title="Minimal ROI"
                    value={parsedResult.minimal_roi}
                    tooltip="Minimal ROI is the minimum return on investment that the strategy aims to achieve."
                  />
                )}
                {parsedResult.stoploss && (
                  <StrategyPropertyItem
                    title="Stoploss"
                    value={parsedResult.stoploss}
                    tooltip="Stoploss is the maximum loss that the strategy can tolerate."
                  />
                )}
                {parsedResult.timeframe && (
                  <StrategyPropertyItem
                    title="Timeframe"
                    value={parsedResult.timeframe}
                    tooltip="Timeframe is the time period over which the strategy is evaluated."
                  />
                )}
                {parsedResult.can_short !== undefined && (
                  <StrategyPropertyItem
                    title="Can Short"
                    value={parsedResult.can_short ? "Yes" : "No"}
                    tooltip="Can Short is whether the strategy can short the asset."
                  />
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
          disabled={chatModifier.subject === parsedResult.name}
          onClick={() => {
            cardRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
            setChatModifier({
              state: "editing",
              subject: parsedResult.name,
            });
          }}
        >
          <Pencil strokeWidth={1.1} />
          Edit
        </Button>
      </CardFooter>
    </Card>
  );
};
