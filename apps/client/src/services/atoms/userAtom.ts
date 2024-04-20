import { atom } from "jotai";

type User = {
  id: number | null;
  username: string | null;
};

export const userAtomInitial = {
  id: null,
  username: null,
};

export const userAtom = atom<User>(userAtomInitial);
