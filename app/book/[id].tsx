import { bookMeta, covers } from '@/assets/books/metadata';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
	Pressable,
	ScrollView,
	StyleSheet,
	useWindowDimensions,
	View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function BookDetailScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const colorScheme = useColorScheme();
	const colors = Colors[colorScheme ?? 'light'];
	const { width, height } = useWindowDimensions();
	const isLandscape = width > height;
	const isPhone = Math.min(width, height) < 600;

	const meta = id ? (bookMeta as any)[id] : undefined;

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
									{meta?.title ?? 'Book'}
								</ThemedText>
							</View>
						</View>
					),
				}}
			/>
			<ScrollView
				contentContainerStyle={{
					padding: 16,
					paddingBottom: 24 + insets.bottom,
				}}
			>
				{isLandscape ? (
					<View style={styles.landscapeRow}>
						{/** Cover column */}
						{id && (covers as any)[id]
							? (() => {
									// Constrain cover height to visible screen in landscape
									const headerHeight = 36; // custom header height in this screen
									const topPad = 16; // ScrollView top padding
									const bottomPad = 24 + insets.bottom; // ScrollView bottom padding
									const availableH = Math.max(
										0,
										height - insets.top - headerHeight - topPad - bottomPad
									);
									const aspect = 3 / 4; // width/height
									const prefW = Math.min(420, width * 0.42);
									const prefH = prefW / aspect; // h = w / (w/h)
									const sizeStyle =
										prefH <= availableH || availableH <= 0
											? { width: prefW }
											: { height: availableH, width: aspect * availableH };

									return (
										<Image
											source={(covers as any)[id]}
											style={[styles.cover, sizeStyle]}
											contentFit='cover'
											transition={200}
										/>
									);
							  })()
							: null}

						<View
							style={[
								styles.landscapeTextCol,
								width >= 900 ? { paddingLeft: 16 } : null,
							]}
						>
							<ThemedText type='title' style={styles.title}>
								{meta?.title ?? 'Untitled'}
							</ThemedText>
							{/* ageRange hidden as requested */}
							{meta?.author ? (
								<ThemedText type='default' style={styles.meta}>
									Author: {meta.author}
								</ThemedText>
							) : null}

							<View style={{ height: 12 }} />
							<ThemedText type='default'>
								{meta?.summary ?? meta?.description ?? ''}
							</ThemedText>

							{Array.isArray(meta?.pages) ? (
								<ThemedText type='default' style={styles.pagesInfo}>
									{meta.pages.length} pages
								</ThemedText>
							) : null}

							{/* Action buttons below page text in landscape */}
							<View
								style={[
									styles.actionsRow,
									{ alignSelf: 'flex-start', marginTop: 28 },
								]}
							>
								<Pressable
									style={[
										styles.actionButton,
										{
											backgroundColor: '#ffffff',
											borderWidth: 2,
											borderColor: '#ff2056',
										},
									]}
									onPress={() => router.push(`/read/${id}?autoplay=1` as any)}
									hitSlop={8}
									accessibilityRole='button'
									accessibilityLabel='Play'
								>
									<Ionicons name='play' size={22} color={'#ff2056'} />
								</Pressable>
								<Pressable
									style={[styles.actionButton, { backgroundColor: '#ff2056' }]}
									onPress={() => router.push(`/read/${id}` as any)}
									hitSlop={8}
									accessibilityRole='button'
									accessibilityLabel='Read'
								>
									<Ionicons name='book' size={22} color={'#ffffff'} />
								</Pressable>
							</View>
						</View>
					</View>
				) : (
					<>
						{id && (covers as any)[id] ? (
							<Image
								source={(covers as any)[id]}
								style={[
									styles.cover,
									isPhone
										? { width: Math.min(320, width * 0.8), alignSelf: 'center' }
										: null,
								]}
								contentFit='cover'
								transition={200}
							/>
						) : null}

						<View style={{ height: 12 }} />

						{/* Action buttons below cover */}
						<View style={styles.actionsRow}>
							<Pressable
								style={[
									styles.actionButton,
									{
										backgroundColor: '#ffffff',
										borderWidth: 2,
										borderColor: '#ff2056',
									},
								]}
								onPress={() => router.push(`/read/${id}?autoplay=1` as any)}
								hitSlop={8}
								accessibilityRole='button'
								accessibilityLabel='Play'
							>
								<Ionicons name='play' size={22} color={'#ff2056'} />
							</Pressable>
							<Pressable
								style={[styles.actionButton, { backgroundColor: '#ff2056' }]}
								onPress={() => router.push(`/read/${id}` as any)}
								hitSlop={8}
								accessibilityRole='button'
								accessibilityLabel='Read'
							>
								<Ionicons name='book' size={22} color={'#ffffff'} />
							</Pressable>
						</View>

						<ThemedText type='title' style={styles.title}>
							{meta?.title ?? 'Untitled'}
						</ThemedText>
						{/* ageRange hidden as requested */}
						{meta?.author ? (
							<ThemedText type='default' style={styles.meta}>
								Author: {meta.author}
							</ThemedText>
						) : null}

						<View style={{ height: 12 }} />
						<ThemedText type='default'>
							{meta?.summary ?? meta?.description ?? ''}
						</ThemedText>

						{Array.isArray(meta?.pages) ? (
							<ThemedText type='default' style={styles.pagesInfo}>
								{meta.pages.length} pages
							</ThemedText>
						) : null}
					</>
				)}
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	cover: {
		width: '100%',
		aspectRatio: 3 / 4,
		borderRadius: 12,
		overflow: 'hidden',
	},
	actionsRow: {
		flexDirection: 'row',
		alignSelf: 'center',
		gap: 12,
		marginBottom: 28,
	},
	actionButton: {
		width: 112,
		height: 56,
		borderRadius: 12,
		alignItems: 'center',
		justifyContent: 'center',
	},
	landscapeRow: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		gap: 32,
	},
	landscapeTextCol: {
		flex: 1,
		paddingLeft: 12,
	},
	title: {
		marginTop: 8,
	},
	meta: {
		opacity: 0.7,
		marginTop: 2,
	},
	pagesInfo: {
		marginTop: 12,
		opacity: 0.7,
	},
});
