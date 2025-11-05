import { Image } from 'expo-image';
import React, { useCallback, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { FlatList, Pressable } from 'react-native-gesture-handler';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
// import { Colors } from '@/constants/theme';
// import { useColorScheme } from '@/hooks/use-color-scheme';
import { bookItems } from '@/assets/books/metadata';
import { useRouter } from 'expo-router';

type Book = { key: string; title: string; cover: number };

// Local-only: no remote fetching

export default function BooksScreen() {
	// const colorScheme = useColorScheme();
	const router = useRouter();

	// const bg = Colors[colorScheme ?? 'light'].background;

	const renderItem = useCallback(
		({ item }: { item: Book }) => {
			return (
				<Pressable
					style={styles.card}
					onPress={() =>
						router.push({ pathname: '/book/[id]', params: { id: item.key } })
					}
				>
					<Image
						source={item.cover as any}
						style={styles.cover}
						contentFit='cover'
						transition={200}
					/>
				</Pressable>
			);
		},
		[router]
	);

	const list = useMemo(
		() => (
			<FlatList
				data={bookItems as unknown as Book[]}
				keyExtractor={(item) => item.key}
				numColumns={3}
				renderItem={renderItem}
				contentContainerStyle={styles.listContent}
				columnWrapperStyle={styles.row}
			/>
		),
		[renderItem]
	);

	return (
		<ParallaxScrollView
			headerBackgroundColor={{ light: '#EFEFEF', dark: '#222' }}
			headerImage={
				<IconSymbol
					size={200}
					color='#808080'
					name='book.fill'
					style={styles.headerImage}
				/>
			}
		>
			<ThemedView style={styles.titleContainer}>
				<ThemedText type='title'>Books</ThemedText>
				<ThemedText style={{ opacity: 0.6 }}>
					Browse popular book covers
				</ThemedText>
			</ThemedView>
			{list}
		</ParallaxScrollView>
	);
}

const styles = StyleSheet.create({
	headerImage: {
		color: '#808080',
		bottom: -80,
		left: -20,
		position: 'absolute',
	},
	titleContainer: {
		gap: 4,
		marginBottom: 8,
	},
	loading: {
		paddingVertical: 32,
		borderRadius: 12,
		alignItems: 'center',
		justifyContent: 'center',
	},
	listContent: {
		paddingTop: 8,
		paddingBottom: 24,
	},
	row: {
		gap: 8,
	},
	card: {
		flex: 1,
		aspectRatio: 0.66,
		borderRadius: 10,
		overflow: 'hidden',
		backgroundColor: '#e5e5e5',
	},
	cover: {
		flex: 1,
		width: '100%',
		height: '100%',
	},
	placeholder: {
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#e5e5e5',
	},
});
