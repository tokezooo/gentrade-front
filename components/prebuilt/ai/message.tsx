"use client";

import { AIMessageText } from "@/components/prebuilt/message";
import type { StreamableValue } from "ai/rsc";
import { useStreamableValue } from "ai/rsc";

export function AIMessage(props: { value: StreamableValue<string> }) {
  const [data] = useStreamableValue(props.value);

  if (!data) {
    return null;
  }
  return <AIMessageText content={data} />;
}
