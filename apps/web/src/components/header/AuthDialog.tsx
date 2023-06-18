import * as React from 'react';

import { Auth } from '@supabase/auth-ui-react';

import { supabase } from '~/App';

import { Dialog, DialogContent, DialogHeader } from '../ui/dialog';

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function AuthDialog({ open, setOpen }: Props) {
  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>
          <div className="text-xl">Log in or Register</div>
        </DialogHeader>

        <Auth
          supabaseClient={supabase}
          // appearance={{ theme: ThemeSupa }}
          magicLink
          providers={[]}
        />
      </DialogContent>
    </Dialog>
  );
}
