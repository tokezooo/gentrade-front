import { Message, ToolInvocation } from "ai_dryamvlad";
import { StrategyDraft } from "@/shared/services/types/strategy-draft";
import { useUserChats } from "./use-user-chats";
import { useChatStateModifierStore } from "@/shared/store/chat-state-modifier-store";

export const useStrategyDraftUpdate = (
  messages: Message[],
  chatId: number,
  threadId: string,
  chatTitle: string | null
) => {
  const { mutateUpdateChat } = useUserChats();
  const { chatModifier, setChatModifier } = useChatStateModifierStore();

  const handleStrategyDraftUpdate = (updatedStrategyDraft: StrategyDraft) => {
    const toolCallId =
      updatedStrategyDraft.tool_call_id || chatModifier.subject?.tool_call_id;
    const lastStrategyDraftMessageIndex = messages.findIndex(
      (message: Message) =>
        message.toolInvocations?.some(
          (tool: ToolInvocation) =>
            tool.toolName === "StrategyDraftOutputTool" &&
            tool.toolCallId === toolCallId
        )
    );

    if (lastStrategyDraftMessageIndex !== -1) {
      const updatedMessages = [...messages];
      const messageToUpdate = updatedMessages[lastStrategyDraftMessageIndex];

      if (messageToUpdate.toolInvocations) {
        messageToUpdate.toolInvocations = messageToUpdate.toolInvocations.map(
          (tool: ToolInvocation) => {
            if (tool.toolName === "StrategyDraftOutputTool") {
              return {
                ...tool,
                result: JSON.stringify(updatedStrategyDraft),
              };
            }
            return tool;
          }
        );
      }
      mutateUpdateChat({
        id: chatId,
        thread_id: threadId,
        messages: updatedMessages,
        title: chatTitle,
      });
    }

    setChatModifier({ state: null, subject: null });
  };

  return handleStrategyDraftUpdate;
};
