import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Image } from 'expo-image';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
	ActivityIndicator,
	RefreshControl,
	StyleSheet,
	View,
	type NativeScrollEvent,
	type NativeSyntheticEvent,
} from 'react-native';
import { FlatList, Pressable } from 'react-native-gesture-handler';

export type Book = {
	key: string;
	title: string;
	coverId?: number;
	author?: string;
};

type Props = {
	query?: string;
	numColumns?: number;
	onSelect?: (book: Book) => void;
	title?: string;
	subtitle?: string;
	onScroll?: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
	scrollEventThrottle?: number;
	topInset?: number;
};

const DEFAULT_QUERY = 'children';

export default function BookGrid({
	query = DEFAULT_QUERY,
	numColumns = 3,
	onSelect,
	title = 'Books',
	subtitle = 'Browse popular book covers',
	onScroll,
	scrollEventThrottle = 16,
	topInset = 0,
}: Props) {
	const colorScheme = useColorScheme();
	const [books, setBooks] = useState<Book[]>([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const bg = Colors[colorScheme ?? 'light'].background;

	const fetchBooks = useCallback(async () => {
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
	}, [query]);

	useEffect(() => {
		setLoading(true);
		fetchBooks();
	}, [fetchBooks]);

	const onRefresh = useCallback(async () => {
		setRefreshing(true);
		await fetchBooks();
		setRefreshing(false);
	}, [fetchBooks]);

	const renderItem = useCallback(
		({ item }: { item: Book }) => {
			const uri = item.coverId
				? `https://covers.openlibrary.org/b/id/${item.coverId}-M.jpg`
				: undefined;
			return (
				<Pressable style={styles.card} onPress={() => onSelect?.(item)}>
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
		},
		[onSelect]
	);

	const grid = useMemo(
		() => (
			<FlatList
				style={{ flex: 1 }}
				data={books}
				keyExtractor={(item) => item.key}
				numColumns={numColumns}
				renderItem={renderItem}
				contentContainerStyle={[
					styles.listContent,
					topInset ? { paddingTop: topInset } : null,
				]}
				columnWrapperStyle={styles.row}
				onScroll={onScroll}
				scrollEventThrottle={scrollEventThrottle}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}
			/>
		),
		[
			books,
			numColumns,
			onRefresh,
			onScroll,
			refreshing,
			renderItem,
			scrollEventThrottle,
			topInset,
		]
	);

	return (
		<View style={{ flex: 1 }}>
			{loading ? (
				<View style={[styles.loading, { backgroundColor: bg }]}>
					<ActivityIndicator />
				</View>
			) : error ? (
				<ThemedText style={{ color: 'crimson' }}>{error}</ThemedText>
			) : (
				grid
			)}
		</View>
	);
}

const styles = StyleSheet.create({
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
