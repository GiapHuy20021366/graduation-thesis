export const RequestStatus = {
  INITIAL: 0,
  INCHING: 1,
  SUCCESS: 2,
  ERROR: -2,
  REJECT: 3,
} as const;

export type RequestStatus = (typeof RequestStatus)[keyof typeof RequestStatus];
