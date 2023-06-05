import * as React from 'react';

import AccountPawPressedIcon from '~/assets/ui/icons/account-paw-pressed.png';
import AccountPawIcon from '~/assets/ui/icons/account-paw.png';
import { AccountModal } from '../ui/AccountModal';

export function Menu() {
  const [mouseDownButton, setMouseDownButton] = React.useState<string | null>(null);
  const [showAccountModal, setShowAccountModal] = React.useState(false);

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
          }}
          onMouseLeave={handleMouseUp}
        >
          <img
            src={mouseDownButton === 'account' ? AccountPawPressedIcon : AccountPawIcon}
            className="pointer-events-none h-full"
          />
        </button>
      </div>

      {showAccountModal && (
        <AccountModal session={} />
      )}
    </>
  );
}
