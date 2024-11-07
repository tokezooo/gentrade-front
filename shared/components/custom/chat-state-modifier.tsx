import { Pencil } from "lucide-react";
import { X } from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";
import { motion } from "framer-motion";
import { useChatStateModifierStore } from "@/shared/store/chat-state-modifier-store";

export const ChatStateModifier = () => {
  const { chatModifier, setChatModifier } = useChatStateModifierStore();

  return (
    <motion.div
      className="absolute -top-11 "
      initial={{ y: 15, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 15, opacity: 0 }}
    >
      <Alert className="w-auto pb-8 pt-3">
        <AlertDescription className="flex items-center gap-2 text-muted-foreground">
          <Pencil size={16} strokeWidth={1.1} />
          {chatModifier.subject}
          <X
            className="cursor-pointer"
            size={16}
            strokeWidth={1.1}
            onClick={() => setChatModifier({ state: null, subject: null })}
          />
        </AlertDescription>
      </Alert>
    </motion.div>
  );
};
