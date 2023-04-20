import { atom } from "jotai";

export interface IUser {
  id: string;
  email: string;
  name: string;
  provider: string;
  preferredLanguage: "en" | "ar";
  department: string;
  tenant: string;
}

export const userAtom = atom<{ loading: boolean; user?: IUser }>({
  loading: true,
});
