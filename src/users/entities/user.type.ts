export const UserProvider = {
  KAKAO: 'KAKAO',
} as const;

export const UserRole = {
  USER: 'USER',
  ADMIN: 'ADMIN',
} as const;

export type UserProviderValueType =
  (typeof UserProvider)[keyof typeof UserProvider];
export type UserRoleValueType = (typeof UserRole)[keyof typeof UserRole];
