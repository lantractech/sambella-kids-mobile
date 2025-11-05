import { Image } from 'expo-image';
import React, { useCallback, useMemo } from 'react';
import {
	StyleSheet,
	useWindowDimensions,
	View,
	type NativeScrollEvent,
	type NativeSyntheticEvent,
} from 'react-native';
import { FlatList, Pressable } from 'react-native-gesture-handler';

export type BookItem = {
	key: string;
	title: string;
	coverId?: number; // when using remote Open Library
	cover?: number; // when using local require() asset
};

type Props = {
	numColumns?: number;
	onSelect?: (book: BookItem) => void;
	title?: string;
	subtitle?: string;
	onScroll?: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
	scrollEventThrottle?: number;
	topInset?: number;
	items: BookItem[]; // local data (uses cover)
};

export default function BookGrid({
	numColumns = 3,
	onSelect,
	title = 'Books',
	subtitle = 'Browse popular book covers',
	onScroll,
	scrollEventThrottle = 16,
	topInset = 0,
	items,
}: Props) {
	const { width } = useWindowDimensions();
	const GUTTER = 12; // space between columns
	const cardWidth = Math.floor(
		(width - (numColumns - 1) * GUTTER) / numColumns
	);
	// Items are guaranteed to exist; no remote fetching fallback

	const renderItem = useCallback(
		({ item }: { item: BookItem }) => {
			const source = item.cover
				? item.cover
				: item.coverId
				? { uri: `https://covers.openlibrary.org/b/id/${item.coverId}-M.jpg` }
				: undefined;
			return (
				<Pressable
					style={[styles.card, { width: cardWidth }]}
					onPress={() => onSelect?.(item)}
				>
					{source ? (
						<Image
							source={source as any}
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
		[cardWidth, onSelect]
	);

	const grid = useMemo(
		() => (
			<FlatList
				style={{ flex: 1 }}
				key={numColumns}
				data={items}
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
			/>
		),
		[items, numColumns, onScroll, renderItem, scrollEventThrottle, topInset]
	);

	return <View style={{ flex: 1 }}>{grid}</View>;
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
		gap: 12,
		justifyContent: 'flex-start',
	},
	card: {
		// width computed per item to avoid stretching when last row has fewer items
		aspectRatio: 0.66,
		borderRadius: 10,
		overflow: 'hidden',
		backgroundColor: '#e5e5e5',
		marginBottom: 12,
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
