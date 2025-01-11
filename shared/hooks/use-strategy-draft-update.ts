import { Message, ToolInvocation } from "ai_dryamvlad";
import { StrategyDraft } from "@/shared/services/types/strategy-draft";
import { useUserChats } from "./use-user-chats";
import { useChatStateModifierStore } from "@/shared/store/chat-state-modifier-store";

export const useStrategyDraftUpdate = (
  messages: Message[],
  chatId: string,
  chatTitle: string | null
) => {
  const { mutateUpdateChat } = useUserChats();
  const { chatModifier, setChatModifier } = useChatStateModifierStore();

  const handleStrategyDraftUpdate = (updatedStrategyDraft: StrategyDraft) => {
    console.log(updatedStrategyDraft);
    const toolCallId =
      updatedStrategyDraft.toolCallId || chatModifier.subject?.toolCallId;
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
        thread_id: chatId,
        messages: updatedMessages,
        title: chatTitle,
      });
    }

    setChatModifier({ state: null, subject: null });
  };

  return handleStrategyDraftUpdate;
};
