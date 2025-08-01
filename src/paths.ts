export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  dashboard: {
    overview: '/dashboard',
    account: '/dashboard/account',
    marketplace: '/dashboard/landandhouse',
    customers: '/dashboard/customers',
    pendingrequests: '/dashboard/pendingrequests',
    settings: '/dashboard/settings',
  },
  marketplace:{landing:'/marketplace/landandhouse'},
  errors: { notFound: '/errors/not-found' },
} as const;
