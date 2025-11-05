import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
	const colorScheme = useColorScheme();

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
				headerShown: false,
				tabBarButton: HapticTab,
				// Compact bar height and remove visual gap between icon and label
				tabBarStyle: { height: 48, paddingVertical: 0 },
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
