import { Image } from 'expo-image';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
	ActivityIndicator,
	RefreshControl,
	StyleSheet,
	View,
} from 'react-native';
import { FlatList, Pressable } from 'react-native-gesture-handler';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type Book = {
	key: string;
	title: string;
	coverId?: number;
	author?: string;
};

const DEFAULT_QUERY = 'children';

export default function BooksScreen() {
	const colorScheme = useColorScheme();
	const [books, setBooks] = useState<Book[]>([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const bg = Colors[colorScheme ?? 'light'].background;

	const fetchBooks = useCallback(async (query: string = DEFAULT_QUERY) => {
		try {
			setError(null);
			const res = await fetch(
				`https://openlibrary.org/search.json?q=${encodeURIComponent(
					query
				)}&limit=60`
			);
			if (!res.ok) throw new Error(`Network error: ${res.status}`);
			const data = await res.json();
			const mapped: Book[] = (data?.docs ?? [])
				.map((d: any, idx: number) => ({
					key: String(d.key ?? d.cover_edition_key ?? `${idx}`),
					title: d.title ?? 'Untitled',
					coverId: d.cover_i,
					author: Array.isArray(d.author_name)
						? d.author_name[0]
						: d.author_name,
				}))
				.filter((b: Book) => !!b.coverId);
			setBooks(mapped);
		} catch (e: any) {
			setError(e?.message ?? 'Failed to load books');
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchBooks();
	}, [fetchBooks]);

	const onRefresh = useCallback(async () => {
		setRefreshing(true);
		await fetchBooks();
		setRefreshing(false);
	}, [fetchBooks]);

	const renderItem = useCallback(({ item }: { item: Book }) => {
		const uri = item.coverId
			? `https://covers.openlibrary.org/b/id/${item.coverId}-M.jpg`
			: undefined;
		return (
			<Pressable style={styles.card} onPress={() => {}}>
				{uri ? (
					<Image
						source={{ uri }}
						style={styles.cover}
						contentFit='cover'
						transition={200}
					/>
				) : (
					<View style={[styles.cover, styles.placeholder]} />
				)}
			</Pressable>
		);
	}, []);

	const list = useMemo(
		() => (
			<FlatList
				data={books}
				keyExtractor={(item) => item.key}
				numColumns={3}
				renderItem={renderItem}
				contentContainerStyle={styles.listContent}
				columnWrapperStyle={styles.row}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}
			/>
		),
		[books, onRefresh, refreshing, renderItem]
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
			{loading ? (
				<View style={[styles.loading, { backgroundColor: bg }]}>
					<ActivityIndicator />
				</View>
			) : error ? (
				<ThemedText style={{ color: 'crimson' }}>{error}</ThemedText>
			) : (
				list
			)}
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
