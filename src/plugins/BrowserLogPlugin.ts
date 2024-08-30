import { PluginInstanceType } from "../type";

export const BrowserLogPlugin: PluginInstanceType = {
  channel: "",
  signal: "*",
  setup: (message: string) => {},
};
