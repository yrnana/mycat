import { atom } from 'recoil';

export const eventIdState = atom<string | undefined>({
  key: 'eventIdState',
  default: undefined,
});
