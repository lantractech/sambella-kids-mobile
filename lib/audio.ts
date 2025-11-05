// Expo Audio wrapper (SDK 54+): normalize API across minor variations of expo-audio
// Goal: export an `Audio` object with a reliable `Sound.createAsync(...)` and `setAudioModeAsync(...)`.

import * as ExpoAudio from 'expo-audio';

type Facade = {
	AudioNS: any;
	Sound: any;
	setAudioModeAsync?: (...args: any[]) => Promise<any>;
	source: 'expo-audio' | 'expo-av' | 'unknown';
};

function buildFacadeFromModule(
	mod: any,
	source: Facade['source']
): Facade | null {
	if (!mod) return null;
	const anyMod: any = mod as any;
	const AudioNS = anyMod.Audio ?? anyMod.default ?? anyMod;
	let Sound: any =
		AudioNS?.Sound ?? anyMod.Sound ?? anyMod.default?.Sound ?? null;

	// If only `create` exists, alias it to `createAsync`.
	if (Sound && !Sound.createAsync && typeof Sound.create === 'function') {
		Sound = {
			...Sound,
			createAsync: (...args: any[]) => Sound.create(...args),
		};
	}

	// If it's a constructor without static create/createAsync, synthesize createAsync via instance.loadAsync
	if (
		Sound &&
		typeof Sound === 'function' &&
		!Sound.createAsync &&
		!Sound.create
	) {
		const Ctor = Sound;
		Sound = {
			...Ctor,
			async createAsync(source: any, initialStatus?: any) {
				const instance: any = new Ctor();
				if (instance.loadAsync) {
					await instance.loadAsync(source, initialStatus);
				}
				return { sound: instance } as { sound: any };
			},
		};
	}

	const setAudioModeAsync =
		AudioNS?.setAudioModeAsync ??
		anyMod.setAudioModeAsync ??
		anyMod.Audio?.setAudioModeAsync;

	if (!Sound) return null;

	return { AudioNS, Sound, setAudioModeAsync, source };
}

// Try expo-audio first
let facade: Facade | null = buildFacadeFromModule(ExpoAudio, 'expo-audio');

// If not viable on native, try expo-av as a fallback (common in Expo Go)
if (!facade || !facade.Sound?.createAsync) {
	try {
		// Use dynamic require to avoid bundling when not installed / not needed
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		const ExpoAV = require('expo-av');
		const avFacade = buildFacadeFromModule(ExpoAV, 'expo-av');
		if (avFacade && avFacade.Sound?.createAsync) {
			facade = avFacade;
		}
	} catch {
		// ignore if expo-av isn't installed
	}
}

// If still nothing usable (e.g., web), expose a minimal stub; web path is handled in screen via HTMLAudioElement.
if (!facade) {
	facade = {
		AudioNS: {},
		Sound: {},
		setAudioModeAsync: undefined,
		source: 'unknown',
	};
}

export const Audio = {
	...facade.AudioNS,
	setAudioModeAsync: facade.setAudioModeAsync,
	Sound: facade.Sound,
	// Useful for debugging which backend is active
	__source: facade.source,
};
