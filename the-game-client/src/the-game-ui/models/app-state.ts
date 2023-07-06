import store from '@the-game/ui/state/store';

export type AppState = Readonly<ReturnType<typeof store.getState>>;
