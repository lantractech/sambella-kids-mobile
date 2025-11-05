// Strict Expo Audio wrapper (SDK 54+): use only 'expo-audio'.
// Exports an `Audio` object compatible with the app code: Audio.Sound.createAsync(...)

import * as ExpoAudio from 'expo-audio';

// Some versions may expose `Audio.Sound`, others expose `Sound` at top-level,
// and some export `Audio` as a default export. Normalize to a consistent shape.
const anyAudio: any = ExpoAudio as any;
const base = anyAudio.Audio ?? anyAudio.default ?? anyAudio;

// Ensure `Sound` exists under `Audio` while preserving other properties.
export const Audio = {
	...base,
	Sound: base.Sound ?? anyAudio.Sound ?? anyAudio.default?.Sound,
};
