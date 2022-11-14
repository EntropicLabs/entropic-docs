export const SITE = {
	title: 'Entropic Labs',
	docTitle: 'Beacon Docs',
	description: 'Entropic Labs provides a decentralized, open-source, and secure Randomness Beacon.',
};

export const OPEN_GRAPH = {
	image: {
		src: '/assets/og-image.svg',
		alt:
			'Entropic Labs logo',
	},
	twitter: 'Entropic_Labs',
};

// This is the type of the frontmatter you put in the docs markdown files.
export type Frontmatter = {
	title: string;
	description: string;
	layout: string;
	image?: { src: string; alt: string };
	dir?: 'ltr' | 'rtl';
};

// See "Algolia" section of the README for more information.
export const ALGOLIA = {
	indexName: 'XXXXXXXXXX',
	appId: 'XXXXXXXXXX',
	apiKey: 'XXXXXXXXXX',
};

export type Sidebar =
	Record<string, { text: string; link: string }[]>;
export const SIDEBAR: Sidebar = {
	'Overview': [
		{ text: 'Introduction', link: 'beacon/docs/' },
		{ text: 'How it Works', link: 'beacon/docs/how-it-works' },
	],
	'Developers': [
		{ text: 'Quickstart', link: 'beacon/docs/quickstart' },
		{ text: 'Integration Guide', link: 'beacon/docs/integration' },
		{ text: 'Deployed Addresses', link: 'beacon/docs/deployed-addresses' },
		{ text: 'EntropyCLI Reference', link: 'beacon/docs/entropycli' },
		{ text: 'API Reference', link: 'https://docs.rs/entropy_beacon_cosmos/latest/entropy_beacon_cosmos/' },
	],
	'Deployment Notes': [
		{ text: 'Terra', link: 'beacon/docs/terra' },
		{ text: 'Kujira', link: 'beacon/docs/kujira' },
	],
	'Worker Hosts': [
		{ text: 'Hosting Workers', link: 'beacon/docs/workers' },
	],
};

export type Addresses = Record<string, { address: string, name: string, lcd: string }>;
export const ADDRESSES: Addresses = {
	'pisco': {
		address: 'terra1a7d4tv5twyh8rmn3jnvyvvzk8kq485dxsvtltt74r0v9earvhfmqseluj8',
		name: 'Terra (Testnet)',
		lcd: 'https://pisco-lcd.terra.dev/cosmwasm/wasm/v1/contract/terra1a7d4tv5twyh8rmn3jnvyvvzk8kq485dxsvtltt74r0v9earvhfmqseluj8/smart/ewogICAgImJlYWNvbl9jb25maWciOnt9Cn0=',
	},
	'phoenix': {
		address: 'terra1qt0uujams3gg4k8a9f0tjyxsdua5gjh86dwfcc66r4zv9xny02ms3qujeh',
		name: 'Terra (Mainnet)',
		lcd: 'https://phoenix-lcd.terra.dev/cosmwasm/wasm/v1/contract/terra1qt0uujams3gg4k8a9f0tjyxsdua5gjh86dwfcc66r4zv9xny02ms3qujeh/smart/ewogICAgImJlYWNvbl9jb25maWciOnt9Cn0=',
	},
	'harpoon': {
		address: 'kujira1xwz7fll64nnh4p9q8dyh9xfvqlwfppz4hqdn2uyq2fcmmqtnf5vsugyk7u',
		name: 'Kujira (Testnet)',
		lcd: 'https://lcd.harpoon.kujira.setten.io/cosmwasm/wasm/v1/contract/kujira1xwz7fll64nnh4p9q8dyh9xfvqlwfppz4hqdn2uyq2fcmmqtnf5vsugyk7u/smart/ewogICAgImJlYWNvbl9jb25maWciOnt9Cn0=',
	},
	'kaiyo': {
		address: 'kujira1x623ehq3gqx9m9t8asyd9cgehf32gy94mhsw8l99cj3l2nvda2fqrjwqy5',
		name: 'Kujira (Mainnet)',
		lcd: 'https://lcd.kaiyo.kujira.setten.io/cosmwasm/wasm/v1/contract/kujira1x623ehq3gqx9m9t8asyd9cgehf32gy94mhsw8l99cj3l2nvda2fqrjwqy5/smart/ewogICAgImJlYWNvbl9jb25maWciOnt9Cn0=',
	},
};