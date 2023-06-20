import './App.styles.css';
import { AuthProvider } from './components/AuthProvider';
import { ChatContainer } from './components/chat/ChatContainer';
import { Menu } from './components/header/menu';
import { NeedsMeter } from './components/needs/NeedsMeter';
import { usePhaser } from './game/PhaserGame';

export default function App() {
  const canvasParentId = 'phaser-parent';

  const phaser = usePhaser(canvasParentId);

  if (!phaser) {
    return null;
  }

  return (
    <AuthProvider>
      <div id={canvasParentId}>
        <Menu />
        <NeedsMeter game={phaser} />
        <ChatContainer game={phaser} />
      </div>
    </AuthProvider>
  );
}
