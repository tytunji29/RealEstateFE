import * as React from 'react';
import type { Metadata } from 'next';

import { readFileSync } from 'fs';

const config = JSON.parse(readFileSync(new URL('./config.json', import.meta.url), 'utf-8'));

import { GuestGuard } from '@/components/auth/guest-guard';
import { Layout } from '@/components/auth/layout';
import { ResetPasswordForm } from '@/components/auth/reset-password-form';

export const metadata = { title: `Reset password | Auth | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <Layout>
      <GuestGuard>
        <ResetPasswordForm />
      </GuestGuard>
    </Layout>
  );
}
