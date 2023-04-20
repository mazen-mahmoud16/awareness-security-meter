export * from "./one-time-password";
export * from "./user";
export * from "./admin";

export * from "./tenant/tenant-program";
export * from "./tenant/tenant-module";
export * from "./tenant";

export * from "./module/assessment";
export * from "./module/presentation";
export * from "./module/video";
export * from "./module";

export * from "./module/session/";

export * from "./program/session";
export * from "./program";

export type SafeDoc<T> = T & { id: string };
