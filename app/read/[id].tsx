import {
	audio as audioMap,
	bookMeta,
	pages as pagesMap,
} from '@/assets/books/metadata';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Audio } from '@/lib/audio';
import { Ionicons } from '@expo/vector-icons';
import { Asset } from 'expo-asset';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useRef, useState } from 'react';
import {
	FlatList,
	Platform,
	Pressable,
	StyleSheet,
	useWindowDimensions,
	View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ReadBookScreen() {
	const { id, autoplay } = useLocalSearchParams<{
		id: string;
		autoplay?: string;
	}>();
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const colorScheme = useColorScheme();
	const colors = Colors[colorScheme ?? 'light'];
	const { width, height } = useWindowDimensions();

	const allPages: number[] = useMemo(
		() => (id ? (pagesMap as any)[id] ?? [] : []),
		[id]
	);
	const allAudio: number[] = useMemo(
		() => (id ? (audioMap as any)[id] ?? [] : []),
		[id]
	);
	const meta = id ? (bookMeta as any)[id] : undefined;
	const [index, setIndex] = useState(0);
	const listRef = useRef<FlatList<number>>(null);
	const soundRef = useRef<any>(null);
	const autoPlayNextRef = useRef(false);
	const initialAutoplayDoneRef = useRef(false);
	const autoplayEnabledRef = useRef(false);
	const playingIndexRef = useRef<number | null>(null);
	const autoPlayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const pendingAutoIndexRef = useRef<number | null>(null);
	const AUTO_DELAY_MS = 2000;

	// Debug: log audio API shape once
	React.useEffect(() => {
		try {
			console.log('[audio] Audio keys', Object.keys(Audio ?? {}));
			// @ts-ignore
			console.log(
				'[audio] Audio.Sound keys',
				Object.keys((Audio as any)?.Sound ?? {})
			);
			// @ts-ignore
			console.log(
				'[audio] has createAsync',
				typeof (Audio as any)?.Sound?.createAsync
			);
		} catch {}
	}, []);

	// Configure audio so it plays reliably (e.g., iOS silent switch)
	React.useEffect(() => {
		(async () => {
			try {
				await Audio.setAudioModeAsync?.({
					playsInSilentModeIOS: true,
					allowsRecordingIOS: false,
					staysActiveInBackground: false,
					shouldDuckAndroid: true,
				});
			} catch {}
		})();
	}, []);

	// Find the next page index that has audio available starting from `start` (exclusive or inclusive based on caller)
	const findNextIndexWithAudio = React.useCallback(
		(start: number) => {
			for (let j = Math.max(0, start); j < allPages.length; j++) {
				if (allAudio?.[j]) return j;
			}
			return -1;
		},
		[allAudio, allPages.length]
	);
	const [isPlaying, setIsPlaying] = useState(false);

	const onMomentumScrollEnd = (e: any) => {
		const x = e?.nativeEvent?.contentOffset?.x ?? 0;
		const i = Math.round(x / width);
		if (Number.isFinite(i) && i !== index) setIndex(i);
	};

	// Also track during scroll to catch cases where momentum/end events don't fire reliably
	const onScroll = React.useCallback(
		(e: any) => {
			// During autoplay programmatic scroll, avoid mid-animation index churn
			if (autoPlayNextRef.current) return;
			const x = e?.nativeEvent?.contentOffset?.x ?? 0;
			const i = Math.round(x / width);
			if (Number.isFinite(i) && i !== index) {
				setIndex(i);
			}
		},
		[width, index]
	);

	const canPrev = index > 0;
	const canNext = index < Math.max(0, allPages.length - 1);

	const scrollToIndex = React.useCallback(
		(i: number) => {
			const clamped = Math.max(
				0,
				Math.min(i, Math.max(0, allPages.length - 1))
			);
			listRef.current?.scrollToOffset({
				offset: clamped * width,
				animated: true,
			});
			setIndex(clamped);
		},
		[allPages.length, width]
	);
	const goPrev = () => canPrev && scrollToIndex(index - 1);
	const goNext = () => canNext && scrollToIndex(index + 1);

	// Create sound across varying API shapes (expo-audio versions)
	const createSoundNormalized = React.useCallback(async (source: any) => {
		// Preferred path: createAsync
		// @ts-ignore
		if (Audio?.Sound?.createAsync) {
			// @ts-ignore
			return await Audio.Sound.createAsync(source, { shouldPlay: true });
		}
		// Fallback path: construct and load
		try {
			// @ts-ignore
			if (Audio?.Sound) {
				// @ts-ignore
				const instance = new (Audio as any).Sound();
				await instance.loadAsync?.(source, { shouldPlay: true });
				return { sound: instance } as { sound: any };
			}
		} catch (e) {
			console.warn('[audio] fallback loadAsync failed', e);
		}
		throw new Error('No compatible audio API found');
	}, []);

	const playForIndex = React.useCallback(
		async (i: number) => {
			try {
				const moduleId = allAudio?.[i];
				if (!moduleId) return;
				console.log('[audio] playForIndex', i, { hasSource: !!moduleId });
				if (soundRef.current) {
					await soundRef.current.unloadAsync();
					soundRef.current = null;
				}
				let source: any = moduleId;
				try {
					const asset = Asset.fromModule(moduleId);
					await asset.downloadAsync();
					if (asset.localUri) {
						source = { uri: asset.localUri } as any;
					}
				} catch (e) {
					console.warn(
						'[audio] asset resolution failed (continuing with module id)',
						e
					);
				}
				// Web fallback using HTMLAudioElement when expo-audio isn't available
				if (Platform.OS === 'web') {
					const uri =
						source && typeof source === 'object' && 'uri' in source
							? (source as any).uri
							: undefined;
					if (!uri) {
						console.warn('[audio] web: missing uri for audio source');
						return;
					}
					const el = new (globalThis as any).Audio(uri);
					(el as any).preload = 'auto';
					const webSound = {
						_el: el,
						unloadAsync: async () => {
							try {
								el.pause();
								el.currentTime = 0;
								el.src = '';
							} catch {}
						},
						playAsync: async () => {
							try {
								await el.play();
							} catch (e) {
								console.warn('[audio] web play failed', e);
							}
						},
						setOnPlaybackStatusUpdate: (cb: (s: any) => void) => {
							el.onended = () => cb({ didJustFinish: true });
						},
					};
					soundRef.current = webSound;
					setIsPlaying(true);
					playingIndexRef.current = i;
					await webSound.playAsync();
					webSound.setOnPlaybackStatusUpdate((status: any) => {
						if (status && status.didJustFinish) {
							webSound.unloadAsync().catch(() => {});
							if (soundRef.current === webSound) soundRef.current = null;
							setIsPlaying(false);
							// Decide next step based on autoplay setting
							const finishedIndex = playingIndexRef.current ?? i;
							playingIndexRef.current = null;
							if (autoplayEnabledRef.current) {
								const directNext = finishedIndex + 1;
								let target = -1;
								if (directNext < allPages.length) {
									target = allAudio?.[directNext]
										? directNext
										: findNextIndexWithAudio(directNext + 1);
								}
								if (target !== -1) {
									autoPlayNextRef.current = true;
									pendingAutoIndexRef.current = target;
									scrollToIndex(target);
								} else {
									autoPlayNextRef.current = false;
									pendingAutoIndexRef.current = null;
								}
							}
						}
					});
					return;
				}

				const { sound } = await createSoundNormalized(source);
				soundRef.current = sound;
				setIsPlaying(true);
				playingIndexRef.current = i;
				console.log('[audio] sound created');
				// Some platforms/packages ignore shouldPlay in initial status; ensure playback starts
				try {
					await sound.playAsync?.();
				} catch (e) {
					console.warn('[audio] playAsync error', e);
				}
				sound.setOnPlaybackStatusUpdate((status: any) => {
					// console.log('[audio] status', status);
					if (status && status.didJustFinish) {
						sound.unloadAsync().catch(() => {});
						if (soundRef.current === sound) soundRef.current = null;
						setIsPlaying(false);
						// Decide next step based on autoplay setting
						const finishedIndex = playingIndexRef.current ?? i;
						playingIndexRef.current = null;
						if (autoplayEnabledRef.current) {
							const directNext = finishedIndex + 1;
							let target = -1;
							if (directNext < allPages.length) {
								target = allAudio?.[directNext]
									? directNext
									: findNextIndexWithAudio(directNext + 1);
							}
							if (target !== -1) {
								autoPlayNextRef.current = true;
								pendingAutoIndexRef.current = target;
								// Navigate to target page; index effect will schedule delayed play
								scrollToIndex(target);
							} else {
								// No next audio; stop chaining
								autoPlayNextRef.current = false;
								pendingAutoIndexRef.current = null;
							}
						}
					}
				});
			} catch (e) {
				console.warn('[audio] create/play failed', e);
			}
		},
		[
			allAudio,
			allPages.length,
			scrollToIndex,
			findNextIndexWithAudio,
			createSoundNormalized,
		]
	);

	React.useEffect(() => {
		return () => {
			if (autoPlayTimerRef.current) {
				clearTimeout(autoPlayTimerRef.current);
				autoPlayTimerRef.current = null;
			}
			if (soundRef.current) {
				soundRef.current.unloadAsync().catch(() => {});
				soundRef.current = null;
			}
		};
	}, []);

	// Stop audio when page changes; manage pending autoplay
	React.useEffect(() => {
		// Clear any pending autoplay timer when index changes
		if (autoPlayTimerRef.current) {
			clearTimeout(autoPlayTimerRef.current);
			autoPlayTimerRef.current = null;
		}

		if (soundRef.current) {
			soundRef.current.unloadAsync().catch(() => {});
			soundRef.current = null;
		}
		setIsPlaying(false);
		playingIndexRef.current = null;

		// If we have a pending auto page and we're on it, schedule delayed playback
		if (autoPlayNextRef.current && pendingAutoIndexRef.current !== null) {
			if (pendingAutoIndexRef.current === index && allAudio?.[index]) {
				autoPlayTimerRef.current = setTimeout(() => {
					if (
						autoPlayNextRef.current &&
						pendingAutoIndexRef.current === index
					) {
						autoPlayNextRef.current = false;
						pendingAutoIndexRef.current = null;
						playForIndex(index);
					}
				}, AUTO_DELAY_MS);
			} else if (pendingAutoIndexRef.current !== index) {
				// User navigated elsewhere; cancel the chain
				autoPlayNextRef.current = false;
				pendingAutoIndexRef.current = null;
			}
		}
	}, [index, allAudio, playForIndex, findNextIndexWithAudio, scrollToIndex]);

	// If opened with autoplay param, start playing current page on mount
	React.useEffect(() => {
		if (autoplay && !initialAutoplayDoneRef.current) {
			initialAutoplayDoneRef.current = true;
			autoplayEnabledRef.current = true;
			if (allAudio?.[index]) {
				playForIndex(index);
			}
		}
	}, [autoplay, allAudio, index, playForIndex]);

	return (
		<View style={{ flex: 1, backgroundColor: colors.background }}>
			<Stack.Screen
				options={{
					header: () => (
						<View
							style={{
								backgroundColor: colors.background,
								paddingTop: insets.top,
							}}
						>
							<View
								style={{
									height: 36,
									flexDirection: 'row',
									alignItems: 'center',
									paddingHorizontal: 10,
									borderBottomWidth: StyleSheet.hairlineWidth,
									borderBottomColor: 'rgba(0,0,0,0.12)',
								}}
							>
								<Pressable
									onPress={() => router.back()}
									style={{ padding: 4, marginRight: 6 }}
									hitSlop={10}
								>
									<Ionicons
										name='chevron-back'
										size={20}
										color={colors.tint ?? colors.text}
									/>
								</Pressable>
								<ThemedText
									type='defaultSemiBold'
									numberOfLines={1}
									style={{ flex: 1 }}
								>
									{meta?.title ?? 'Read'}
								</ThemedText>
								{allPages.length > 0 ? (
									<ThemedText type='default' style={{ opacity: 0.7 }}>
										{index + 1}/{allPages.length}
									</ThemedText>
								) : null}
							</View>
						</View>
					),
				}}
			/>

			{allPages.length === 0 ? (
				<View
					style={{
						flex: 1,
						alignItems: 'center',
						justifyContent: 'center',
						padding: 24,
					}}
				>
					<ThemedText type='default'>
						No pages available for this book yet.
					</ThemedText>
				</View>
			) : (
				<View style={{ flex: 1 }}>
					<FlatList
						ref={listRef}
						data={allPages}
						keyExtractor={(_, i) => String(i)}
						horizontal
						pagingEnabled
						showsHorizontalScrollIndicator={false}
						onMomentumScrollEnd={onMomentumScrollEnd}
						onScrollEndDrag={onMomentumScrollEnd}
						onScroll={onScroll}
						scrollEventThrottle={16}
						renderItem={({ item }) => (
							<View
								style={{
									width,
									height: height - insets.top - insets.bottom - 36,
								}}
							>
								<Image
									source={item}
									style={styles.page}
									contentFit='contain'
									transition={150}
									recyclingKey={String(item)}
								/>
							</View>
						)}
					/>

					{/* On-screen next/prev controls */}
					<View style={styles.controlsOverlay} pointerEvents='box-none'>
						<View style={styles.sideZone}>
							<Pressable
								onPress={goPrev}
								disabled={!canPrev}
								accessibilityRole='button'
								accessibilityLabel='Previous page'
								style={[
									styles.controlButton,
									!canPrev && styles.controlDisabled,
								]}
								hitSlop={8}
							>
								<Ionicons
									name='chevron-back'
									size={24}
									color={canPrev ? colors.text : 'rgba(0,0,0,0.25)'}
								/>
							</Pressable>
						</View>
						<View style={styles.sideZone}>
							<Pressable
								onPress={goNext}
								disabled={!canNext}
								accessibilityRole='button'
								accessibilityLabel='Next page'
								style={[
									styles.controlButton,
									!canNext && styles.controlDisabled,
								]}
								hitSlop={8}
							>
								<Ionicons
									name='chevron-forward'
									size={24}
									color={canNext ? colors.text : 'rgba(0,0,0,0.25)'}
								/>
							</Pressable>
						</View>
					</View>

					{/* Bottom-center audio button */}
					<View
						style={[styles.audioOverlay, { bottom: 12 + insets.bottom }]}
						pointerEvents='box-none'
					>
						<Pressable
							onPress={() => playForIndex(index)}
							accessibilityRole='button'
							accessibilityLabel='Audio'
							style={[
								styles.audioButton,
								allAudio?.[index]
									? isPlaying
										? { backgroundColor: 'rgba(255, 32, 86, 0.4)' }
										: {
												backgroundColor: 'rgba(255,255,255,0.4)',
												borderWidth: StyleSheet.hairlineWidth,
												borderColor: 'rgba(0,0,0,0.12)',
										  }
									: styles.controlDisabled,
							]}
							disabled={!allAudio?.[index]}
							hitSlop={8}
						>
							<Ionicons
								name='volume-high'
								size={24}
								color={
									allAudio?.[index]
										? isPlaying
											? '#ffffff'
											: '#ff2056'
										: 'rgba(255, 32, 86, 0.5)'
								}
							/>
						</Pressable>
					</View>
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	page: {
		width: '100%',
		height: '100%',
		backgroundColor: 'transparent',
	},
	controlsOverlay: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 8,
	},
	sideZone: {
		width: 80,
		alignItems: 'center',
		justifyContent: 'center',
	},
	controlButton: {
		width: 44,
		height: 44,
		borderRadius: 22,
		backgroundColor: 'rgba(255,255,255,0.4)',
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: StyleSheet.hairlineWidth,
		borderColor: 'rgba(0,0,0,0.12)',
	},
	controlDisabled: {
		backgroundColor: 'rgba(255,255,255,0.2)',
	},
	audioOverlay: {
		position: 'absolute',
		left: 0,
		right: 0,
		alignItems: 'center',
	},
	audioButton: {
		width: 56,
		height: 56,
		borderRadius: 28,
		backgroundColor: 'rgba(255, 32, 86, 0.6)',
		alignItems: 'center',
		justifyContent: 'center',
		shadowColor: '#000',
		shadowOpacity: 0.15,
		shadowRadius: 6,
		shadowOffset: { width: 0, height: 2 },
		elevation: 3,
	},
});
