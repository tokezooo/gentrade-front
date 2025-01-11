import { ToolStrategyDraftOutput } from "./tool-strategy-draft-output";

type ToolComponent = {
  loading: (props?: any) => React.ReactNode;
  final: (props?: any) => React.ReactNode;
};

type ToolComponentMap = {
  [tool: string]: ToolComponent;
};

export const TOOL_COMPONENT_MAP: ToolComponentMap = {
  StrategyDraftOutputTool: {
    loading: (props?: any) => <div>Loading...</div>,
    final: (props?: any) => <ToolStrategyDraftOutput {...props} />,
  },
};
