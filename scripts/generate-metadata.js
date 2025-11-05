/* eslint-env node */
// Auto-generates assets/books/metadata.ts by scanning subfolders.
// Usage: npm run generate-metadata

const fs = require('fs');
const path = require('path');

const BOOKS_DIR = path.resolve(process.cwd(), 'assets', 'books');
const OUTPUT = path.resolve(BOOKS_DIR, 'metadata.ts');

const COVER_NAMES = ['cover.jpg', 'cover.png', 'cover.jpeg', 'cover.webp'];
const PAGE_EXTS = ['.png', '.jpg', '.jpeg', '.webp'];
const AUDIO_EXTS = ['.mp3', '.m4a', '.aac', '.wav'];

function getSubdirs(dir) {
	return fs
		.readdirSync(dir, { withFileTypes: true })
		.filter((d) => d.isDirectory())
		.map((d) => d.name);
}

function hasFile() {
	const p = path.join.apply(path, arguments);
	return fs.existsSync(p);
}

function pickCover(dir) {
	for (const name of COVER_NAMES) {
		const full = path.join(dir, name);
		if (fs.existsSync(full)) return name;
	}
	return null;
}

function listPages(dir) {
	if (!fs.existsSync(dir)) return [];
	const all = fs
		.readdirSync(dir, { withFileTypes: true })
		.filter((d) => d.isFile())
		.map((d) => d.name)
		.filter(
			(name) =>
				name.toLowerCase().startsWith('page-') &&
				PAGE_EXTS.includes(path.extname(name).toLowerCase())
		);
	// Sort by numeric part if present, else lexicographically
	const toKey = (name) => {
		const m = name.match(/page-(\d+)/i);
		return m ? parseInt(m[1], 10) : Number.POSITIVE_INFINITY;
	};
	all.sort((a, b) => {
		const ak = toKey(a);
		const bk = toKey(b);
		if (ak !== bk) return ak - bk;
		return a.localeCompare(b);
	});
	return all;
}

function listAudio(dir) {
	if (!fs.existsSync(dir)) return [];
	const all = fs
		.readdirSync(dir, { withFileTypes: true })
		.filter((d) => d.isFile())
		.map((d) => d.name)
		.filter(
			(name) =>
				name.toLowerCase().startsWith('audio-') &&
				AUDIO_EXTS.includes(path.extname(name).toLowerCase())
		);
	const toKey = (name) => {
		const m = name.match(/audio-(\d+)/i);
		return m ? parseInt(m[1], 10) : Number.POSITIVE_INFINITY;
	};
	all.sort((a, b) => {
		const ak = toKey(a);
		const bk = toKey(b);
		if (ak !== bk) return ak - bk;
		return a.localeCompare(b);
	});
	return all;
}

function generate() {
	const ids = getSubdirs(BOOKS_DIR)
		// ignore non-book folders if any
		.filter((name) => !name.startsWith('.') && name !== 'images');

	// Only include folders that have book.json and a cover image
	const entries = ids
		.map((id) => {
			const folder = path.join(BOOKS_DIR, id);
			const coverFile = pickCover(folder);
			const ok = hasFile(folder, 'book.json') && coverFile;
			if (!ok) return null;
			const pages = listPages(folder);
			const audio = listAudio(folder);
			return { id, coverFile, pages, audio };
		})
		.filter(Boolean);

	// Alphabetical by id for stability
	entries.sort((a, b) => a.id.localeCompare(b.id));

	const header = `// AUTO-GENERATED FILE - DO NOT EDIT
// Run: npm run generate-metadata
// Generated ${new Date().toISOString()}

export type BookJson = any;
export type BookRegistryItem = { id: string; meta: BookJson; cover: number; pages: number[]; audio: number[] };

export const registry: BookRegistryItem[] = [
`;

	const rows = entries
		.map(({ id, coverFile, pages, audio }) => {
			const pagesArray = pages.map((p) => `require('./${id}/${p}')`).join(', ');
			const audioArray = audio.map((p) => `require('./${id}/${p}')`).join(', ');
			return `  { id: '${id}', meta: require('./${id}/book.json'), cover: require('./${id}/${coverFile}'), pages: [${pagesArray}], audio: [${audioArray}] }`;
		})
		.join(',\n');

	const footer = `];

export const bookIds: string[] = registry.map((r) => r.id);
export const bookMeta: Record<string, BookJson> = Object.fromEntries(
  registry.map((r) => [r.id, r.meta])
);
export default bookMeta;
export const covers: Record<string, number> = Object.fromEntries(
  registry.map((r) => [r.id, r.cover])
);
export const pages: Record<string, number[]> = Object.fromEntries(
	registry.map((r) => [r.id, r.pages])
);
export const audio: Record<string, number[]> = Object.fromEntries(
	registry.map((r) => [r.id, r.audio])
);
export type BookListItem = { key: string; title: string; cover: number };
export const bookItems: BookListItem[] = registry.map((r) => ({
  key: r.id,
  title: (r.meta as any)?.title ?? r.id,
  cover: r.cover,
}));
`;

	const content = header + rows + '\n' + footer;
	fs.writeFileSync(OUTPUT, content, 'utf8');
	console.log(`Wrote ${OUTPUT} with ${entries.length} books.`);
}

generate();
