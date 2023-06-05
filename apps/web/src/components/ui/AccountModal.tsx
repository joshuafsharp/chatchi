import { createContext, useState } from 'react';

import { Auth } from '@supabase/auth-ui-react';
import { Session } from '@supabase/supabase-js';

// import { ThemeSupa } from '@supabase/auth-ui-shared';

export interface Props {
  session: Session;
}
export function AccountModal({ session }: Props) {
  if (session) {
    return null;
  }

  return (
    <Auth
      supabaseClient={supabase}
      // appearance={{ theme: ThemeSupa }}
    />
  );
}
