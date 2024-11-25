import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Strategy, strategySchema } from "@/shared/lib/validation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import CustomFormField, { FormFieldType } from "./custom-form-field";
import { useChatStateModifierStore } from "@/shared/store/chat-state-modifier-store";
import { Form } from "../ui/form";

interface StrategyEditFormProps {
  initialData: Strategy;
  onSubmit: (data: Strategy) => void;
}

export function StrategyEditForm({
  initialData,
  onSubmit,
}: StrategyEditFormProps) {
  const { chatModifier, setChatModifier } = useChatStateModifierStore();

  const form = useForm<Strategy>({
    resolver: zodResolver(strategySchema),
    defaultValues: initialData,
  });

  const handleSubmit = (data: Strategy) => {
    onSubmit(data);
    setChatModifier({ state: "idle", subject: null });
  };

  return (
    <Dialog
      open={chatModifier.state === "editing"}
      onOpenChange={() => setChatModifier({ state: null, subject: null })}
    >
      <DialogContent className="max-w-screen-xl overflow-y-auto max-h-dvh">
        <DialogHeader>
          <DialogTitle>Edit Strategy: {initialData.name}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <CustomFormField
              control={form.control}
              name="name"
              label="Strategy Name"
              placeholder="Enter strategy name"
              fieldType={FormFieldType.INPUT}
            />
            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                control={form.control}
                name="description"
                label="Description"
                placeholder="Enter strategy description"
                fieldType={FormFieldType.TEXTAREA}
              />
            </div>

            <CustomFormField
              control={form.control}
              name="indicators"
              label="Indicators"
              placeholder="Enter indicators"
              fieldType={FormFieldType.INPUT}
            />
            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                control={form.control}
                name="entry_signals"
                label="Entry Signals"
                placeholder="Enter entry signals"
                fieldType={FormFieldType.TEXTAREA}
              />

              <CustomFormField
                control={form.control}
                name="exit_signals"
                label="Exit Signals"
                placeholder="Enter exit signals"
                fieldType={FormFieldType.TEXTAREA}
              />
            </div>
            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                control={form.control}
                name="minimal_roi"
                label="Minimal ROI"
                placeholder="Enter minimal ROI"
                fieldType={FormFieldType.INPUT}
              />

              <CustomFormField
                control={form.control}
                name="stoploss"
                label="Stoploss"
                placeholder="Enter stoploss"
                fieldType={FormFieldType.INPUT}
              />

              <CustomFormField
                control={form.control}
                name="timeframe"
                label="Timeframe"
                placeholder="Enter timeframe"
                fieldType={FormFieldType.INPUT}
              />
            </div>

            <CustomFormField
              control={form.control}
              name="can_short"
              label="Can Short"
              fieldType={FormFieldType.CHECKBOX}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setChatModifier({ state: "idle", subject: null })
                }
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
