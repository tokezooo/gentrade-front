"use client";

import { useNavStore } from "@/shared/store/nav-store";
import type { Strategy as StrategyType } from "@/shared/services/types/strategy";
import { format, subDays } from "date-fns";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { DatePickerWithRange } from "../ui/date-picker";
import { createBacktest } from "@/shared/services/backtests";
import { DateRange } from "react-day-picker";

export function Strategy({ strategy }: { strategy: StrategyType }) {
  const { setCurrentNavState } = useNavStore();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });

  const runBacktest = async () => {
    if (!dateRange) return;
    const dateRangeString = `${format(dateRange.from!, "yyyyMMdd")}-${format(
      dateRange.to!,
      "yyyyMMdd"
    )}`;
    const backtestId = await createBacktest(strategy.id, dateRangeString);
  };

  useEffect(() => {
    setCurrentNavState({
      rootTitle: "Strategies",
      title: strategy.name,
      object: strategy,
    });
  }, [strategy]);

  return (
    <>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <h1 className="text-2xl font-bold">{strategy.name}</h1>
        <p>{strategy.draft.description}</p>
        <DatePickerWithRange
          initialDateRange={dateRange}
          onDateChange={setDateRange}
        />
        <Button
          onClick={() => {
            runBacktest();
          }}
        >
          Run Backtest
        </Button>
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="aspect-video rounded-xl bg-muted/50" />
          <div className="aspect-video rounded-xl bg-muted/50" />
          <div className="aspect-video rounded-xl bg-muted/50" />
        </div>
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
      </div>
    </>
  );
}
