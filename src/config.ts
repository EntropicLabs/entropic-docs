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
	'Worker Hosts': [
		{ text: 'Hosting Workers', link: 'beacon/docs/workers' },
	],
};
