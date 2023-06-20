import * as React from 'react';

import { Auth } from '@supabase/auth-ui-react';

import { AuthContext, supabase } from '../AuthProvider';
import { PauseDialog } from '../PauseDialog';
import { Dialog, DialogContent, DialogHeader } from '../ui/dialog';

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function AuthDialog({ open, setOpen }: Props) {
  const auth = React.useContext(AuthContext);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader className="text-xl">
          {auth?.user ? `Welcome ${auth.user.email}!` : `Log in or Register`}
        </DialogHeader>

        {auth?.user ? (
          <></>
        ) : (
          <Auth
            supabaseClient={supabase}
            // appearance={{ theme: ThemeSupa }}
            magicLink
            providers={[]}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
