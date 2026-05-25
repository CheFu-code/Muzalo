export interface Song {
  id: string;
  title: string;
  duration: string;
  album: string;
  year: number;
}

export interface Artist {
  id: string;
  name: string;
  genre: string;
  image: string;
  songs: Song[];
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  image: string;
  songIds: string[];
}

export const musicLibrary: Artist[] = [
  {
    id: "1",
    name: "The Midnight",
    genre: "Synthwave",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    songs: [
      { id: "1", title: "Sunset", duration: "4:32", album: "Endless Summer", year: 2016 },
      { id: "2", title: "Vampires", duration: "3:58", album: "Endless Summer", year: 2016 },
      { id: "3", title: "Los Angeles", duration: "4:15", album: "Endless Summer", year: 2016 },
      { id: "4", title: "Shadows", duration: "4:45", album: "Nocturnal", year: 2017 },
      { id: "5", title: "River of Darkness", duration: "5:12", album: "Kids", year: 2018 },
    ],
  },
  {
    id: "2",
    name: "ODESZA",
    genre: "Electronic",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop",
    songs: [
      { id: "6", title: "A Moment Apart", duration: "5:23", album: "A Moment Apart", year: 2017 },
      { id: "7", title: "Line of Sight", duration: "4:47", album: "A Moment Apart", year: 2017 },
      { id: "8", title: "Late Night", duration: "3:52", album: "A Moment Apart", year: 2017 },
      { id: "9", title: "Say My Name", duration: "4:22", album: "In Return", year: 2014 },
      { id: "10", title: "Sun Models", duration: "5:01", album: "In Return", year: 2014 },
    ],
  },
  {
    id: "3",
    name: "Khruangbin",
    genre: "Psychedelic Rock",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop",
    songs: [
      { id: "11", title: "Time (You and I)", duration: "4:18", album: "Mordechai", year: 2020 },
      { id: "12", title: "So We Won't Forget", duration: "3:42", album: "Mordechai", year: 2020 },
      { id: "13", title: "People Everywhere", duration: "4:35", album: "Con Todo El Mundo", year: 2018 },
      { id: "14", title: "María También", duration: "4:52", album: "Con Todo El Mundo", year: 2018 },
      { id: "15", title: "White Gloves", duration: "3:28", album: "The Universe Smiles Upon You", year: 2015 },
    ],
  },
  {
    id: "4",
    name: "Tame Impala",
    genre: "Psychedelic Pop",
    image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop",
    songs: [
      { id: "16", title: "The Less I Know The Better", duration: "3:36", album: "Currents", year: 2015 },
      { id: "17", title: "Let It Happen", duration: "7:47", album: "Currents", year: 2015 },
      { id: "18", title: "Borderline", duration: "3:58", album: "The Slow Rush", year: 2020 },
      { id: "19", title: "Lost in Yesterday", duration: "3:20", album: "The Slow Rush", year: 2020 },
      { id: "20", title: "Feels Like We Only Go Backwards", duration: "3:12", album: "Lonerism", year: 2012 },
    ],
  },
  {
    id: "5",
    name: "Glass Animals",
    genre: "Indie Pop",
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop",
    songs: [
      { id: "21", title: "Heat Waves", duration: "3:58", album: "Dreamland", year: 2020 },
      { id: "22", title: "Your Love (Déjà Vu)", duration: "3:12", album: "Dreamland", year: 2020 },
      { id: "23", title: "Tokyo Drifting", duration: "3:16", album: "Dreamland", year: 2020 },
      { id: "24", title: "Gooey", duration: "4:14", album: "ZABA", year: 2014 },
      { id: "25", title: "Life Itself", duration: "4:41", album: "How to Be a Human Being", year: 2016 },
    ],
  },
  {
    id: "6",
    name: "Bon Iver",
    genre: "Indie Folk",
    image: "https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?w=400&h=400&fit=crop",
    songs: [
      { id: "26", title: "Holocene", duration: "5:36", album: "Bon Iver, Bon Iver", year: 2011 },
      { id: "27", title: "Skinny Love", duration: "3:58", album: "For Emma, Forever Ago", year: 2007 },
      { id: "28", title: "Hey, Ma", duration: "3:36", album: "i,i", year: 2019 },
      { id: "29", title: "715 - CRΣΣKS", duration: "3:02", album: "22, A Million", year: 2016 },
      { id: "30", title: "Perth", duration: "3:21", album: "Bon Iver, Bon Iver", year: 2011 },
    ],
  },
  {
    id: "7",
    name: "Fleetwood Mac",
    genre: "Rock",
    image: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=400&h=400&fit=crop",
    songs: [
      { id: "31", title: "Dreams", duration: "4:14", album: "Rumours", year: 1977 },
      { id: "32", title: "Go Your Own Way", duration: "3:38", album: "Rumours", year: 1977 },
      { id: "33", title: "The Chain", duration: "4:30", album: "Rumours", year: 1977 },
      { id: "34", title: "Landslide", duration: "3:19", album: "Fleetwood Mac", year: 1975 },
      { id: "35", title: "Rhiannon", duration: "4:11", album: "Fleetwood Mac", year: 1975 },
    ],
  },
  {
    id: "8",
    name: "Daft Punk",
    genre: "Electronic",
    image: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&h=400&fit=crop",
    songs: [
      { id: "36", title: "Get Lucky", duration: "6:09", album: "Random Access Memories", year: 2013 },
      { id: "37", title: "One More Time", duration: "5:20", album: "Discovery", year: 2001 },
      { id: "38", title: "Harder Better Faster Stronger", duration: "3:44", album: "Discovery", year: 2001 },
      { id: "39", title: "Instant Crush", duration: "5:37", album: "Random Access Memories", year: 2013 },
      { id: "40", title: "Digital Love", duration: "4:58", album: "Discovery", year: 2001 },
    ],
  },
  {
    id: "9",
    name: "Arctic Monkeys",
    genre: "Indie Rock",
    image: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=400&h=400&fit=crop",
    songs: [
      { id: "41", title: "Do I Wanna Know?", duration: "4:32", album: "AM", year: 2013 },
      { id: "42", title: "R U Mine?", duration: "3:21", album: "AM", year: 2013 },
      { id: "43", title: "505", duration: "4:13", album: "Favourite Worst Nightmare", year: 2007 },
      { id: "44", title: "Why'd You Only Call Me When You're High?", duration: "2:41", album: "AM", year: 2013 },
      { id: "45", title: "Arabella", duration: "3:27", album: "AM", year: 2013 },
    ],
  },
  {
    id: "10",
    name: "Billie Eilish",
    genre: "Pop",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=400&fit=crop",
    songs: [
      { id: "46", title: "bad guy", duration: "3:14", album: "WHEN WE ALL FALL ASLEEP, WHERE DO WE GO?", year: 2019 },
      { id: "47", title: "everything i wanted", duration: "4:05", album: "everything i wanted", year: 2019 },
      { id: "48", title: "Happier Than Ever", duration: "4:58", album: "Happier Than Ever", year: 2021 },
      { id: "49", title: "ocean eyes", duration: "3:20", album: "dont smile at me", year: 2017 },
      { id: "50", title: "when the party's over", duration: "3:16", album: "WHEN WE ALL FALL ASLEEP, WHERE DO WE GO?", year: 2019 },
    ],
  },
  {
    id: "11",
    name: "The Weeknd",
    genre: "R&B",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    songs: [
      { id: "51", title: "Blinding Lights", duration: "3:20", album: "After Hours", year: 2020 },
      { id: "52", title: "Starboy", duration: "3:50", album: "Starboy", year: 2016 },
      { id: "53", title: "Save Your Tears", duration: "3:35", album: "After Hours", year: 2020 },
      { id: "54", title: "The Hills", duration: "4:02", album: "Beauty Behind the Madness", year: 2015 },
      { id: "55", title: "Can't Feel My Face", duration: "3:35", album: "Beauty Behind the Madness", year: 2015 },
    ],
  },
  {
    id: "12",
    name: "Radiohead",
    genre: "Alternative Rock",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop",
    songs: [
      { id: "56", title: "Creep", duration: "3:59", album: "Pablo Honey", year: 1993 },
      { id: "57", title: "Karma Police", duration: "4:21", album: "OK Computer", year: 1997 },
      { id: "58", title: "No Surprises", duration: "3:48", album: "OK Computer", year: 1997 },
      { id: "59", title: "Paranoid Android", duration: "6:23", album: "OK Computer", year: 1997 },
      { id: "60", title: "Fake Plastic Trees", duration: "4:50", album: "The Bends", year: 1995 },
    ],
  },
  {
    id: "13",
    name: "Taylor Swift",
    genre: "Pop",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=400&fit=crop",
    songs: [
      { id: "61", title: "Anti-Hero", duration: "3:20", album: "Midnights", year: 2022 },
      { id: "62", title: "Shake It Off", duration: "3:39", album: "1989", year: 2014 },
      { id: "63", title: "Blank Space", duration: "3:51", album: "1989", year: 2014 },
      { id: "64", title: "Cruel Summer", duration: "2:58", album: "Lover", year: 2019 },
      { id: "65", title: "Wildest Dreams", duration: "3:40", album: "1989", year: 2014 },
    ],
  },
  {
    id: "14",
    name: "Kendrick Lamar",
    genre: "Hip Hop",
    image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop",
    songs: [
      { id: "66", title: "HUMBLE.", duration: "2:57", album: "DAMN.", year: 2017 },
      { id: "67", title: "DNA.", duration: "3:05", album: "DAMN.", year: 2017 },
      { id: "68", title: "Alright", duration: "3:39", album: "To Pimp a Butterfly", year: 2015 },
      { id: "69", title: "Swimming Pools (Drank)", duration: "5:13", album: "good kid, m.A.A.d city", year: 2012 },
      { id: "70", title: "m.A.A.d city", duration: "5:50", album: "good kid, m.A.A.d city", year: 2012 },
    ],
  },
  {
    id: "15",
    name: "Frank Ocean",
    genre: "R&B",
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop",
    songs: [
      { id: "71", title: "Thinkin Bout You", duration: "3:21", album: "Channel Orange", year: 2012 },
      { id: "72", title: "Pyramids", duration: "9:53", album: "Channel Orange", year: 2012 },
      { id: "73", title: "Nights", duration: "5:07", album: "Blonde", year: 2016 },
      { id: "74", title: "Pink + White", duration: "3:04", album: "Blonde", year: 2016 },
      { id: "75", title: "Self Control", duration: "4:09", album: "Blonde", year: 2016 },
    ],
  },
  {
    id: "16",
    name: "Coldplay",
    genre: "Alternative Rock",
    image: "https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?w=400&h=400&fit=crop",
    songs: [
      { id: "76", title: "Yellow", duration: "4:29", album: "Parachutes", year: 2000 },
      { id: "77", title: "Fix You", duration: "4:54", album: "X&Y", year: 2005 },
      { id: "78", title: "Viva La Vida", duration: "4:01", album: "Viva la Vida", year: 2008 },
      { id: "79", title: "The Scientist", duration: "5:09", album: "A Rush of Blood to the Head", year: 2002 },
      { id: "80", title: "Clocks", duration: "5:07", album: "A Rush of Blood to the Head", year: 2002 },
    ],
  },
  {
    id: "17",
    name: "Mac DeMarco",
    genre: "Indie Rock",
    image: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=400&h=400&fit=crop",
    songs: [
      { id: "81", title: "Chamber of Reflection", duration: "3:51", album: "Salad Days", year: 2014 },
      { id: "82", title: "My Kind of Woman", duration: "3:07", album: "2", year: 2012 },
      { id: "83", title: "Freaking Out the Neighborhood", duration: "3:35", album: "2", year: 2012 },
      { id: "84", title: "On the Level", duration: "3:47", album: "This Old Dog", year: 2017 },
      { id: "85", title: "Moonlight on the River", duration: "3:18", album: "Here Comes the Cowboy", year: 2019 },
    ],
  },
  {
    id: "18",
    name: "M83",
    genre: "Synthwave",
    image: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&h=400&fit=crop",
    songs: [
      { id: "86", title: "Midnight City", duration: "4:04", album: "Hurry Up, We're Dreaming", year: 2011 },
      { id: "87", title: "Wait", duration: "5:47", album: "Hurry Up, We're Dreaming", year: 2011 },
      { id: "88", title: "Outro", duration: "4:02", album: "Hurry Up, We're Dreaming", year: 2011 },
      { id: "89", title: "Reunion", duration: "3:52", album: "Hurry Up, We're Dreaming", year: 2011 },
      { id: "90", title: "Steve McQueen", duration: "4:34", album: "Hurry Up, We're Dreaming", year: 2011 },
    ],
  },
];

export const playlists: Playlist[] = [
  {
    id: "1",
    name: "Chill Vibes",
    description: "Relax and unwind with these smooth tracks",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop",
    songIds: ["11", "26", "74", "81", "87"],
  },
  {
    id: "2",
    name: "Workout Mix",
    description: "High energy songs to power your workout",
    image: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&h=400&fit=crop",
    songIds: ["36", "41", "46", "51", "66"],
  },
  {
    id: "3",
    name: "Indie Essentials",
    description: "The best of indie rock and alternative",
    image: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=400&h=400&fit=crop",
    songIds: ["16", "21", "41", "56", "82"],
  },
  {
    id: "4",
    name: "Electronic Dreams",
    description: "Journey through electronic soundscapes",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    songIds: ["1", "6", "36", "86", "37"],
  },
];

export function getArtistByName(name: string): Artist | undefined {
  const urlName = formatRouteValue(name);
  return musicLibrary.find(artist => formatArtistUrl(artist.name) === urlName);
}

export function getSongByName(artistName: string, songName: string): { artist: Artist; song: Song } | undefined {
  const artist = getArtistByName(artistName);
  if (!artist) return undefined;

  const urlSongName = formatRouteValue(songName);
  const song = artist.songs.find(s => formatSongUrl(s.title) === urlSongName);

  if (!song) return undefined;
  return { artist, song };
}

export function formatArtistUrl(artistName: string): string {
  return formatRouteValue(artistName);
}

export function formatSongUrl(songName: string): string {
  return formatRouteValue(songName);
}

function formatRouteValue(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getAllGenres(): string[] {
  const genres = new Set(musicLibrary.map(artist => artist.genre));
  return Array.from(genres).sort();
}

export function getArtistsByGenre(genre: string): Artist[] {
  return musicLibrary.filter(artist => artist.genre === genre);
}

export function searchMusic(query: string): {
  artists: Artist[];
  songs: Array<{ artist: Artist; song: Song }>;
} {
  const lowerQuery = query.toLowerCase();

  const artists = musicLibrary.filter(artist =>
    artist.name.toLowerCase().includes(lowerQuery) ||
    artist.genre.toLowerCase().includes(lowerQuery)
  );

  const songs: Array<{ artist: Artist; song: Song }> = [];
  musicLibrary.forEach(artist => {
    artist.songs.forEach(song => {
      if (
        song.title.toLowerCase().includes(lowerQuery) ||
        song.album.toLowerCase().includes(lowerQuery)
      ) {
        songs.push({ artist, song });
      }
    });
  });

  return { artists, songs };
}

export function getSongById(songId: string): { artist: Artist; song: Song } | undefined {
  for (const artist of musicLibrary) {
    const song = artist.songs.find(s => s.id === songId);
    if (song) {
      return { artist, song };
    }
  }
  return undefined;
}

export function getPlaylistSongs(playlist: Playlist): Array<{ artist: Artist; song: Song }> {
  return playlist.songIds
    .map(id => getSongById(id))
    .filter((item): item is { artist: Artist; song: Song } => item !== undefined);
}
