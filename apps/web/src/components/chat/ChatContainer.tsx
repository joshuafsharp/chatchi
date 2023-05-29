import * as React from 'react';

import { UserInput } from './UserInput';

export function ChatContainer() {
  return (
    <div className="fixed bottom-4 right-4 z-10 max-h-32 w-72">
      <UserInput />
    </div>
  );
}
