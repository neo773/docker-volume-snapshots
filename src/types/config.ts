export type Config = {
  CONTAINER: string;
  VOLUME: string;
};

export type ConfigFile = {
  configs: Record<string, Config>;
  defaultConfig?: string;
};
