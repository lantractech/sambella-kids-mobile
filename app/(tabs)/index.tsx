import BookGrid from '@/components/ui/book-grid';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Image } from 'expo-image';
import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
	const insets = useSafeAreaInsets();
	const colorScheme = useColorScheme();
	const BAR_HEIGHT = 56;
	const topInset = insets.top + BAR_HEIGHT;

	const scrollY = React.useRef(new Animated.Value(0)).current;
	const opacity = scrollY.interpolate({
		inputRange: [0, 120],
		outputRange: [1, 0],
		extrapolate: 'clamp',
	});

	const onScroll = Animated.event(
		[{ nativeEvent: { contentOffset: { y: scrollY } } }],
		{ useNativeDriver: true }
	);

	return (
		<View style={{ flex: 1 }}>
			<BookGrid
				onScroll={onScroll}
				scrollEventThrottle={16}
				topInset={topInset}
			/>
			<Animated.View
				pointerEvents='none'
				style={[
					styles.topBar,
					{
						height: topInset,
						paddingTop: insets.top,
						backgroundColor: Colors[colorScheme ?? 'light'].background,
						opacity,
					},
				]}
			>
				<Image
					source={require('@/assets/images/icon.png')}
					style={styles.logo}
					contentFit='contain'
				/>
			</Animated.View>
		</View>
	);
}

const styles = StyleSheet.create({
	topBar: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		alignItems: 'center',
		justifyContent: 'center',
	},
	logo: {
		width: 28,
		height: 28,
		borderRadius: 6,
	},
});
