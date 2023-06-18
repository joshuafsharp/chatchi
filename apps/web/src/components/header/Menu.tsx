import * as React from 'react';

import { Auth } from '@supabase/auth-ui-react';
import { Session } from '@supabase/supabase-js';

import { supabase } from '~/App';
import AccountPawPressedIcon from '~/assets/ui/icons/account-paw-pressed.png';
import AccountPawIcon from '~/assets/ui/icons/account-paw.png';

import { AuthDialog } from './AuthDialog';

interface Props {
  session: Session;
}

export function Menu({ session }: Props) {
  const [mouseDownButton, setMouseDownButton] = React.useState<string | null>(null);
  const [authDialogOpen, setAuthDialogOpen] = React.useState(false);

  const handleMouseDown = (buttonName: string) => {
    setMouseDownButton(buttonName);
  };

  const handleMouseUp = () => {
    setMouseDownButton(null);
  };

  return (
    <>
      <div className="fixed left-4 top-4 z-10 flex space-x-4">
        <button
          title="Account"
          className="h-9 focus:outline-none"
          onMouseDown={() => handleMouseDown('account')}
          onMouseUp={() => {
            handleMouseUp();
            setAuthDialogOpen(true);
          }}
          onMouseLeave={handleMouseUp}
        >
          <img
            src={mouseDownButton === 'account' ? AccountPawPressedIcon : AccountPawIcon}
            className="pointer-events-none h-full"
          />
        </button>
      </div>

      <AuthDialog open={authDialogOpen} setOpen={setAuthDialogOpen} />
    </>
  );
}
