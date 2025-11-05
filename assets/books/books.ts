export type Book = {
	id: string;
	title: string;
	price?: number; // cents
	cover: string; // public path
	ageRange: string;
	description: string;
};

export const books: Book[] = [
	{
		id: 'the-sleepy-cloud',
		title: 'The Sleepy Cloud',
		cover: '/books/the-sleepy-cloud/cover.jpg',
		ageRange: '3-6',
		description:
			'A gentle bedtime story about a little cloud who learns to shine at night. Soothing rhythms and soft illustrations.',
	},
	{
		id: 'rosie-and-the-rocket',
		title: 'Rosie and the Rocket',
		cover: '/books/rosie-and-the-rocket/cover.jpg',
		ageRange: '5-9',
		description:
			'Rosie wants to touch the stars. An adventurous tale with colorful art and a message about curiosity.',
	},
	{
		id: 'tails-of-kindness',
		title: 'Tails of Kindness',
		cover: '/books/tails-of-kindness/cover.jpg',
		ageRange: '3-7',
		description:
			'Join a lovable group of animal friends—bunnies, bears, squirrels, and birds—as they explore the magic of empathy, sharing, and cooperation.',
	},
	{
		id: 'maple-and-the-moon',
		title: 'Maple & the Moon',
		cover: '/books/maple-and-the-moon/cover.jpg',
		ageRange: '4-8',
		description:
			'A cozy story about a little fox named Maple who befriends the moon and learns about bravery in small steps.',
	},
	{
		id: 'harry-the-hummingbird',
		title: 'Harry the Hummingbird',
		cover: '/books/harry-the-hummingbird/cover.jpg',
		ageRange: '3-6',
		description:
			'Join Harry as he zips through the garden, learning about colors, flowers, and the joy of helping friends.',
	},
	{
		id: 'piper-in-the-park',
		title: 'Piper in the Park',
		cover: '/books/piper-in-the-park/cover.jpg',
		ageRange: '2-5',
		description:
			'A playful romp following Piper and friends exploring the park, discovering picnic-time surprises.',
	},
	{
		id: 'the-little-lighthouse',
		title: 'The Little Lighthouse',
		cover: '/books/the-little-lighthouse/cover.jpg',
		ageRange: '4-8',
		description:
			'A heartwarming tale of a small lighthouse who learns its light matters — perfect for readers learning courage and community.',
	},
	{
		id: 'noras-notebook',
		title: "Nora's Notebook",
		cover: '/books/noras-notebook/cover.jpg',
		ageRange: '6-10',
		description:
			'Nora keeps a little notebook of discoveries. A gentle early-reader chapter book about curiosity, notes, and making small discoveries every day.',
	},
	{
		id: 'garden-of-whispering-trees',
		title: 'The Garden of Whispering Trees',
		cover: '/books/garden-of-whispering-trees/cover.jpg',
		ageRange: '5-9',
		description:
			'A lyrical story about a secret garden where trees share stories; encourages imagination and listening to nature.',
	},
	{
		id: 'milo-and-the-moonbeam',
		title: 'Milo and the Moonbeam',
		cover: '/books/milo-and-the-moonbeam/cover.jpg',
		ageRange: '3-6',
		description:
			'A curious mouse named Milo follows a moonbeam on a gentle nighttime adventure about wonder and friendship.',
	},
	{
		id: 'the-biscuit-boat',
		title: 'The Biscuit Boat',
		cover: '/books/the-biscuit-boat/cover.jpg',
		ageRange: '4-8',
		description:
			'A tactile seaside tale about a toy boat made of biscuit that sails on cookie-crumb waves — playful rhyme and bright art.',
	},
	{
		id: 'lunas-little-library',
		title: "Luna's Little Library",
		cover: '/books/lunas-little-library/cover.jpg',
		ageRange: '2-6',
		description:
			'Tiny Luna shares her shelf of picture books with forest friends — a gentle read-aloud about sharing and stories.',
	},
	{
		id: 'captain-cupcake',
		title: 'Captain Cupcake',
		cover: '/books/captain-cupcake/cover.jpg',
		ageRange: '5-9',
		description:
			'A spritely adventure where a bakery mascot learns leadership while saving the neighborhood bake sale.',
	},
	{
		id: 'whispers-in-the-willow',
		title: 'Whispers in the Willow',
		cover: '/books/whispers-in-the-willow/cover.jpg',
		ageRange: '4-8',
		description:
			'A soft, lyrical story about a child who listens to the willow tree and learns to calm their worries.',
	},
	{
		id: 'the-tiny-tailor',
		title: 'The Tiny Tailor',
		cover: '/books/the-tiny-tailor/cover.jpg',
		ageRange: '6-10',
		description:
			'A brave small-statured tailor sews big ideas — problem solving, creativity, and community are stitched through this tale.',
	},
	{
		id: 'ollie-and-the-origami',
		title: 'Ollie and the Origami',
		cover: '/books/ollie-and-the-origami/cover.jpg',
		ageRange: '3-6',
		description:
			'A playful story about Ollie who folds paper into tiny friends and discovers patience and creativity.',
	},
	{
		id: 'skylar-and-the-squirrel',
		title: 'Skylar and the Squirrel',
		cover: '/books/skylar-and-the-squirrel/cover.jpg',
		ageRange: '2-5',
		description:
			'A humorous morning adventure when Skylar meets a bold squirrel who wants the last pancake.',
	},
	{
		id: 'the-midnight-picnic',
		title: 'The Midnight Picnic',
		cover: '/books/the-midnight-picnic/cover.jpg',
		ageRange: '4-6',
		description:
			'Friends tiptoe out for a secret picnic under the stars and learn about courage and sharing.',
	},
	{
		id: 'pepper-and-the-parade',
		title: 'Pepper and the Parade',
		cover: '/books/pepper-and-the-parade/cover.jpg',
		ageRange: '3-6',
		description:
			'Pepper wants to join the town parade but must learn to practice — a fun story about persistence.',
	},
	{
		id: 'mina-and-the-missing-star',
		title: 'Mina and the Missing Star',
		cover: '/books/mina-and-the-missing-star/cover.jpg',
		ageRange: '5-9',
		description:
			'Mina launches a gentle quest to find a fallen star and learns about perseverance and small acts of kindness.',
	},
	{
		id: 'ben-and-the-bicycle',
		title: 'Ben and the Bicycle',
		cover: '/books/ben-and-the-bicycle/cover.jpg',
		ageRange: '4-7',
		description:
			'A beginner bike story: Ben practices, tumbles, and gets back up — reassuring for first-time riders.',
	},
	{
		id: 'the-seed-that-sang',
		title: 'The Seed That Sang',
		cover: '/books/the-seed-that-sang/cover.jpg',
		ageRange: '3-7',
		description:
			'A lyrical picture book where a seed hums and grows into a tree, teaching patience and growth.',
	},
	{
		id: 'grandma-glees-kitchen',
		title: "Grandma Glee's Kitchen",
		cover: '/books/grandma-glees-kitchen/cover.jpg',
		ageRange: '2-6',
		description:
			'A warm, sensory story about baking with Grandma Glee — smells, sounds, and memories shared across generations.',
	},
	{
		id: 'zoe-and-the-zigzag',
		title: 'Zoe and the Zigzag',
		cover: '/books/zoe-and-the-zigzag/cover.jpg',
		ageRange: '3-6',
		description:
			'Zoe draws a zigzag that comes to life and takes her on a creative day of doodles and play.',
	},
	{
		id: 'the-river-of-rainbows',
		title: 'The River of Rainbows',
		cover: '/books/the-river-of-rainbows/cover.jpg',
		ageRange: '5-9',
		description:
			'A vibrant adventure where children follow a river of rainbows and learn about different cultures and colors.',
	},
	{
		id: 'pickle-park-picnic',
		title: 'Pickle Park Picnic',
		cover: '/books/pickle-park-picnic/cover.jpg',
		ageRange: '3-6',
		description:
			'A silly story about a picnic where only pickles are invited — full of giggles, unexpected guests, and a very polite seagull.',
	},
	{
		id: 'professor-pancakes-pants',
		title: "Professor Pancake's Pants",
		cover: '/books/professor-pancakes-pants/cover.jpg',
		ageRange: '4-8',
		description:
			'Professor Pancake discovers his pants are actually a map to breakfast — a laugh-out-loud tale about accidental inventions.',
	},
	{
		id: 'the-great-snore-off',
		title: 'The Great Snore-Off',
		cover: '/books/the-great-snore-off/cover.jpg',
		ageRange: '5-9',
		description:
			'A neighborhood contest to see who has the loudest snore turns into a musical parade — ridiculous, warm, and perfect for read-alouds.',
	},
	{
		id: 'the-cloud-circus',
		title: 'The Cloud Circus',
		cover: '/books/the-cloud-circus/cover.jpg',
		ageRange: '3-6',
		description:
			'A whimsical romp where clouds become performers — a story about imagination and teamwork.',
	},
	{
		id: 'sammys-shoes',
		title: "Sammy's Shoes",
		cover: '/books/sammys-shoes/cover.jpg',
		ageRange: '2-5',
		description:
			'Sammy’s magical red sneakers let him leap over gates and skip across puddles, but when they start shrinking, he fears his adventures are over. With his sister’s help and a dash of imagination, Sammy discovers the real magic comes from his own brave heart.',
	},
	{
		id: 'blueberry-moon',
		title: 'Blueberry Moon',
		cover: '/books/blueberry-moon/cover.jpg',
		ageRange: '2-5',
		description:
			'An early-reader about friends gathering berries by moonlight and discovering small acts of courage.',
	},
	{
		id: 'the-quiet-kite',
		title: 'The Quiet Kite',
		cover: '/books/the-quiet-kite/cover.jpg',
		ageRange: '4-8',
		description:
			'A picture book about listening to the world and finding your own voice.',
	},
	{
		id: 'marigolds-map',
		title: "Marigold's Map",
		cover: '/books/marigolds-map/cover.jpg',
		ageRange: '5-9',
		description:
			'A curious child follows a handmade map and learns that exploration starts in your own backyard.',
	},
	{
		id: 'finns-firefly',
		title: "Finn's Firefly",
		cover: '/books/finns-firefly/cover.jpg',
		ageRange: '3-7',
		description:
			'A short bedtime story about a child who befriends a gentle firefly and learns about patience.',
	},
	{
		id: 'mayor-marshmallows-meeting',
		title: "Mayor Marshmallow's Meeting",
		cover: '/books/mayor-marshmallows-meeting/cover.jpg',
		ageRange: '3-6',
		description:
			'A silly town meeting led by Mayor Marshmallow where everyone accidentally brings dessert instead of reports — lots of laughs and wobbly speeches.',
	},
	{
		id: 'when-socks-sing',
		title: 'When Socks Sing',
		cover: '/books/when-socks-sing/cover.jpg',
		ageRange: '2-5',
		description:
			'A bedtime romp where a pair of mismatched socks discover they have the perfect duet — silly rhymes and cozy endings.',
	},
	{
		id: 'captain-custard-cloud',
		title: 'Captain Custard and the Cloud Monster',
		cover: '/books/captain-custard-cloud/cover.jpg',
		ageRange: '4-8',
		description:
			'Captain Custard sails a puddle-ship to calm a squishy cloud monster — a goofy adventure about kindness and unexpected friendships.',
	},
	{
		id: 'finding-rain',
		title: 'Finding Rain',
		cover: '/books/finding-rain/cover.jpg',
		ageRange: '3-6',
		description:
			'A soft picture book about a child who follows rain puddles through the neighborhood and finds small wonders after the storm.',
	},
	{
		id: 'the-paper-boat',
		title: 'The Paper Boat',
		cover: '/books/the-paper-boat/cover.jpg',
		ageRange: '2-5',
		description:
			'A short, playful tale about making paper boats and the imaginative journeys they take downstream.',
	},
	{
		id: 'the-buttoned-barn',
		title: 'The Buttoned Barn',
		cover: '/books/the-buttoned-barn/cover.jpg',
		ageRange: '3-6',
		description:
			'A barn where every animal has a button to press — a playful tale of curiosity, surprise doors, and friendly mayhem.',
	},
	{
		id: 'the-piano-pickle',
		title: 'The Piano Pickle',
		cover: '/books/the-piano-pickle/cover.jpg',
		ageRange: '4-8',
		description:
			'When a pickle learns to play the piano, the town discovers music tastes different to everyone — a silly story about trying new things.',
	},
	{
		id: 'lucys-lantern-labyrinth',
		title: "Lucy's Lantern Labyrinth",
		cover: '/books/lucys-lantern-labyrinth/cover.jpg',
		ageRange: '5-9',
		description:
			'Lucy explores a maze of glowing lanterns and finds playful riddles and friends waiting at every turn.',
	},
	{
		id: 'lizzie-and-the-moonbread',
		title: 'Lizzie and the Moonbread',
		cover: '/books/lizzie-and-the-moonbread/cover.jpg',
		ageRange: '3-6',
		description:
			'Lizzie bakes a tiny moonbread that grows and sprouts friends — a warm, whimsical tale about sharing.',
	},
	{
		id: 'the-teacup-parade',
		title: 'The Teacup Parade',
		cover: '/books/the-teacup-parade/cover.jpg',
		ageRange: '2-6',
		description:
			'A gentle picture book where teacups march around the kitchen and everyone learns a silly new dance.',
	},
	{
		id: 'waffles-in-winter',
		title: 'Waffles in Winter',
		cover: '/books/waffles-in-winter/cover.jpg',
		ageRange: '3-7',
		description:
			'A cozy story about friends who build a waffle-warm den and share syrupy smiles on chilly mornings.',
	},
	{
		id: 'the-sock-who-wanted-a-hat',
		title: 'The Sock Who Wanted a Hat',
		cover: '/books/the-sock-who-wanted-a-hat/cover.jpg',
		ageRange: '2-5',
		description:
			'A silly tale of a curious sock who dreams of wearing a hat and learns about being proud of who you are.',
	},
	{
		id: 'penny-and-the-painted-door',
		title: 'Penny and the Painted Door',
		cover: '/books/penny-and-the-painted-door/cover.jpg',
		ageRange: '4-8',
		description:
			'Penny paints a door that opens to small, friendly adventures — a creative story about curiosity and color.',
	},
	{
		id: 'under-the-old-bridge',
		title: 'Under the Old Bridge',
		cover: '/books/under-the-old-bridge/cover.jpg',
		ageRange: '4-8',
		description:
			'A gentle, creative story about children who discover tiny homes under a bridge and learn to care for small creatures.',
	},
	{
		id: 'a-secret-in-the-attic',
		title: 'A Secret in the Attic',
		cover: '/books/a-secret-in-the-attic/cover.jpg',
		ageRange: '5-9',
		description:
			'A playful mystery where friends find a dusty trunk and piece together a family story using clues and imagination.',
	},
	{
		id: 'the-starlit-backpack',
		title: 'The Starlit Backpack',
		cover: '/books/the-starlit-backpack/cover.jpg',
		ageRange: '4-8',
		description:
			'A cozy, imaginative tale about a backpack that glows with tiny stars and takes its owner on gentle, nighttime adventures.',
	},
];

export default books;
