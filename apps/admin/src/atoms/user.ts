import { atom } from "jotai";

export interface IAdmin {
  id: string;
  email: string;
}

export const userAtom = atom<{ loading: boolean; user?: IAdmin }>({
  loading: true,
});
