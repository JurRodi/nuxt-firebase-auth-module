export type FirebaseUser = {
  uid: string;
  email: string | undefined;
  emailVerified: boolean;
  displayName: string | undefined;
  isAnonymous: boolean;
  phoneURL: string | undefined;
  phoneNumber: string | undefined;
  tenantId: string | undefined;
  providerData: {
    uid: string;
    email: string;
    displayName: string | null;
    providerId: string;
    phoneNumber: string | null;
    photoURL: string | null;
  }[];
  stsTokenManager: {
    refreshToken: string | null;
    accessToken: string | null;
    expirationTime: number | null;
  };
  createdAt: number | null;
  lastLoginAt: number | null;
  apiKey: string;
  appName: string;
};
