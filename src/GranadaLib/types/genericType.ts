// Generic type for extending Phaser events with custom events
export type ExtendType<InputType, CustomType> = {
  [K in keyof InputType | keyof CustomType]: K extends keyof InputType
    ? InputType[K]
    : K extends keyof CustomType
    ? CustomType[K]
    : never;
};
