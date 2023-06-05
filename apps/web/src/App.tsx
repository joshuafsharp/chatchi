import { useEffect, useState } from 'react';

import { Session, createClient } from '@supabase/supabase-js';

import './App.styles.css';
import { PauseMenu } from './components/PauseMenu';
import { ChatContainer } from './components/chat/ChatContainer';
import { Menu } from './components/header/menu';
import { NeedsMeter } from './components/needs/NeedsMeter';
import { usePhaser } from './game/PhaserGame';

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_KEY);

export default function App() {
  const canvasParentId = 'phaser-parent';

  const phaser = usePhaser(canvasParentId);

  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!phaser) {
    return null;
  }

  return (
    <div id={canvasParentId}>
      <PauseMenu game={phaser} />
      <Menu session={session} />
      <NeedsMeter game={phaser} />
      <ChatContainer game={phaser} />
    </div>
  );
}
