import { Tabs } from 'expo-router';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
	const colorScheme = useColorScheme();
	const insets = useSafeAreaInsets();

	const tabBarBaseHeight = 48;
	const tabBarStyle = {
		height: tabBarBaseHeight + insets.bottom,
		paddingVertical: 0,
		paddingBottom: Math.max(insets.bottom, 0),
		backgroundColor: Colors[colorScheme ?? 'light'].background,
	} as const;

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
				headerShown: false,
				tabBarButton: HapticTab,
				// Compact bar height and extend under system navigation with safe-area padding
				tabBarStyle,
				tabBarItemStyle: { paddingVertical: 0 },
				tabBarLabelStyle: { fontSize: 12, marginTop: -4 },
				tabBarIconStyle: { marginBottom: -4 },
			}}
		>
			{/* Hide Books from the tab bar; keep route available if navigated programmatically */}
			<Tabs.Screen name='books' options={{ href: null }} />
			<Tabs.Screen
				name='index'
				options={{
					title: 'Home',
					tabBarIcon: ({ focused }) => (
						<IconSymbol
							size={22}
							name='house.fill'
							color={focused ? '#4ECDC4' : '#BDEDE9'}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name='explore'
				options={{
					title: 'Explore',
					tabBarIcon: ({ focused }) => (
						<IconSymbol
							size={22}
							name='paperplane.fill'
							color={focused ? '#4ECDC4' : '#BDEDE9'}
						/>
					),
				}}
			/>
		</Tabs>
	);
}
