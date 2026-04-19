import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Clock } from 'lucide-react'

export const metadata: Metadata = {
   title: 'Reverse Engineering the Fortnite .replay Binary Format — A Complete Guide',
   description: 'The definitive technical guide to parsing Fortnite replay files. AES-256-ECB decryption, Oodle decompression, NetBitstream property extraction, player name deobfuscation, and confirmed stat handles for Chapter 7 Season 2.',
   keywords: [
      'fortnite replay parser API',
      'fortnite replay analysis API',
      'fortnite match data API',
      'fortnite replay file parser',
      'fortnite replay format',
      'fortnite binary replay parser',
      'fortnite replay aes encryption',
      'fortnite replay javascript parser',
      'fortnite replay python',
      'fortnite replay oodle decompression',
      'fortnite FortPlayerStateAthena',
      'fortnite replay chunk format',
      'unreal engine replay format',
   ],
   alternates: {
      canonical: 'https://platform.pathgen.dev/blog/reverse-engineering-fortnite-replay-format'
   }
}

const code = {
   header: `// Full header layout — Chapter 7 Season 2 (FileVersion 7)
// Offsets are approximate — vary by customVersionCount

[0x00..0x04]  Magic           = 0x1CA2E27F  (LE uint32)
[0x04..0x08]  FileVersion     = 7
[0x08..0x0C]  LengthInMs      = match duration in milliseconds
[0x0C..0x10]  NetworkVersion
[0x10..0x14]  Changelist
[0x14..]      FriendlyName    = FString (4-byte length prefix + UTF-16LE)
[..]          bIsLive         = uint8 boolean
[..]          bCompressed     = uint8 boolean
[..]          bEncrypted      = uint8 boolean
[..]          EncryptionKey   = 32 bytes raw AES-256 key
              ↑ This is the KEY. Skip ahead to here.`,

   chunks: `// Chunk header — appears before every chunk in the file
struct ChunkHeader {
  uint32 ChunkType;   // 0=Header 1=ReplayData 2=Checkpoint 3=Event
  int32  SizeInBytes; // size of the chunk data that follows
  int32  LengthInMs;  // timestamp / duration
  uint32 Flags;
}

// After ChunkHeader, the raw chunk bytes follow immediately.
// For type 1 (ReplayData) and type 2 (Checkpoint):
//   - If bEncrypted: decrypt with AES-256-ECB first
//   - If bCompressed: decompress with Oodle after decrypt`,

   decryption: `import crypto from 'crypto';

function decryptChunk(encryptedBytes, keyBuffer) {
  // AES-256-ECB — NO initialization vector
  // Key is the 32-byte raw key from the replay header
  const decipher = crypto.createDecipheriv(
    'aes-256-ecb',
    keyBuffer,
    null   // no IV for ECB mode
  );
  decipher.setAutoPadding(false); // PKCS7 padding is not used
  return Buffer.concat([
    decipher.update(encryptedBytes),
    decipher.final()
  ]);
}

// Key extraction from header:
// After parsing FriendlyName and the three booleans,
// read exactly 32 bytes — that is your AES key.
// No hashing, no derivation. Raw bytes directly.
const keyOffset = findKeyOffset(headerBuffer);
const aesKey = headerBuffer.slice(keyOffset, keyOffset + 32);`,

   oodle: `// Oodle decompression — required after AES decrypt
// Epic uses Oodle internally. The npm package ooz-wasm
// wraps the reference implementation.

import OozWasm from 'ooz-wasm';

const ooz = await OozWasm.create();

function decompressChunk(compressedBytes) {
  // First 4 bytes of the decrypted payload are the
  // uncompressed size as a little-endian uint32
  const uncompressedSize = compressedBytes.readUInt32LE(0);
  const compressedData   = compressedBytes.slice(4);

  const output = new Uint8Array(uncompressedSize);
  const result = ooz.decompress(compressedData, output);

  if (result !== uncompressedSize) {
    throw new Error(\`Oodle: expected \${uncompressedSize} got \${result}\`);
  }
  return Buffer.from(output);
}`,

   properties: `// After decryption and decompression you have a raw
// NetBitStream — Unreal Engine's custom bit-packing format.
// Properties are encoded per channel (actor) with handle IDs.

// Reading an IntPacked value (variable-length encoding):
function readIntPacked(bitStream) {
  let value = 0;
  let shift = 0;
  while (true) {
    const byte = bitStream.readBits(8);
    value |= (byte & 0x3F) << shift;
    shift += 6;
    if (!(byte & 0x80)) break; // continuation bit
  }
  return value;
}

// Each property update on a channel looks like:
// [handle: IntPacked] [value: type-specific encoding]
// Handle 0 = null terminator for that actor's update`,

   handles: `// Confirmed FortPlayerStateAthena handles — Ch7 S2
// Channel is dynamic — identified by finding the channel
// where handle 125 (kills) matches AthenaMatchStats

const PLAYER_HANDLES = {
  1:   'shotsFired',      // IntPacked
  2:   'wood',            // IntPacked
  3:   'buildsPlaced',    // IntPacked
  4:   'stone',           // Bits(11)
  5:   'metal',           // IntPacked
  6:   'shotsHit',        // IntPacked
  16:  'shieldHealed',    // IntPacked
  22:  'healthHealed',    // IntPacked
  100: 'buildsEdited',    // IntPacked
  113: 'damageTaken',     // IntPacked
  114: 'damageDealt',     // IntPacked
  120: 'stormDamage',     // IntPacked
  125: 'kills',           // IntPacked ← use this to find the channel
  126: 'headshots',       // IntPacked
};

// AFortWeapon channel handles — per weapon equipped
const WEAPON_HANDLES = {
  11: 'shots',            // IntPacked
  13: 'hitsToPlayers',    // IntPacked
  15: 'hitsToPlayers2',   // IntPacked (some weapon types)
  21: 'damageToPlayers',  // IntPacked
  26: 'hitsToAI',         // IntPacked ← confirmed handle 26
};

// AFortPlayerPawn handle
// 65: distanceCm — Bits(32) — total distance traveled on foot`,

   positions: `// Position extraction from AFortPlayerPawn
// Positions are stored as int16 pairs, scaled to world coords

function decodePosition(bitStream) {
  // Each coordinate is 16 bits signed
  const rawX = bitStream.readInt16();
  const rawY = bitStream.readInt16();
  const rawZ = bitStream.readInt16();

  // Scale factor: multiply by 2 to get centimeters
  return {
    x: rawX * 2,
    y: rawY * 2,
    z: rawZ * 2,
  };
}

// Speed filter — reject teleports and interpolation artifacts
const MAX_SPEED_CM_PER_S = 8000;

function isValidPosition(prev, curr, deltaMs) {
  const dx = curr.x - prev.x;
  const dy = curr.y - prev.y;
  const dist = Math.sqrt(dx*dx + dy*dy);
  const speed = dist / (deltaMs / 1000);
  return speed < MAX_SPEED_CM_PER_S;
}

// World bounds for Chapter 7 Season 2
const WORLD_MIN = -131072; // cm
const WORLD_MAX =  131072; // cm`,

   names: `// Player name deobfuscation
// Names in the replay are XOR-shifted by character index

function deobfuscateName(obfuscated) {
  return obfuscated
    .split('')
    .map((char, i) => {
      const shift = (3 + i * 3) % 8;
      const code  = char.charCodeAt(0);
      return String.fromCharCode(
        code >= 32 && code < 127
          ? ((code - 32 + shift) % 95) + 32
          : code
      );
    })
    .join('');
}

// Channel detection for local player:
// The local player's channel will have the account ID
// embedded in an FString property early in the stream.
// Cross-reference with AthenaMatchStats to confirm.`,

   storm: `// Storm circle data — decoded from ReplayData chunks
// Phase radii come from the SafeZoneIndicator actor

// Chapter 7 Season 2 — 12 phases confirmed
const STORM_DPS = [1, 1, 1, 2, 2, 3, 4, 5, 5, 7, 7, 8];

// Storm positions are world coordinates (same scale as players)
// Each phase has:
//   - currentRadius: shrinking zone radius in cm
//   - nextRadius:    target radius after shrink completes  
//   - center:        (x, y) world coords of next circle center
//   - shrinkStartMs: timestamp when shrink begins
//   - shrinkEndMs:   timestamp when shrink completes

// Detected by watching the SafeZoneIndicator channel
// for property updates matching float radius values`,
}

export default function ReplayGuidePost() {
   return (
      <div style={{
         minHeight: '100vh',
         background: '#FAF9F6',
         display: 'flex',
         flexDirection: 'column',
         color: '#111111',
         fontFamily: 'Inter, system-ui, sans-serif'
      }}>
         {/* Header */}
         <header style={{
            height: '80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 40px',
         }}>
            <Link href="/blog" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
               <Image src="/logo.png" alt="Pathgen Logo" width={44} height={44} style={{ objectFit: 'contain' }} />
               <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#111111' }}>Pathgen Blog</span>
            </Link>
            <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
               <Link href="/docs" style={{ fontSize: '0.9rem', color: '#6B6A68', textDecoration: 'none', fontWeight: 500 }}>Docs</Link>
               <Link href="/pricing" style={{ fontSize: '0.9rem', color: '#6B6A68', textDecoration: 'none', fontWeight: 500 }}>Pricing</Link>
               <Link href="/signup" style={{ fontSize: '0.9rem', color: '#fff', textDecoration: 'none', fontWeight: 600, background: '#111', padding: '8px 18px', borderRadius: '8px' }}>Get Started</Link>
            </div>
         </header>

         <article style={{ flex: 1, padding: '80px 40px', maxWidth: '860px', margin: '0 auto', width: '100%' }}>

            {/* Meta row */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '28px', alignItems: 'center' }}>
               <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#D97757', textTransform: 'uppercase', letterSpacing: '0.05em', background: 'rgba(217,119,87,0.08)', padding: '4px 12px', borderRadius: '100px' }}>
                  Deep Dive
               </span>
               <span style={{ fontSize: '0.85rem', color: '#6B6A68', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={14} /> 25 min read
               </span>
               <span style={{ fontSize: '0.85rem', color: '#6B6A68' }}>Chapter 7 Season 2 · FileVersion 7</span>
            </div>

            {/* Title */}
            <h1 style={{ fontSize: '3rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '28px', lineHeight: 1.1 }}>
               Reverse Engineering the Fortnite .replay Binary Format
            </h1>
            <p style={{ fontSize: '1.2rem', color: '#4B5563', lineHeight: 1.7, marginBottom: '64px' }}>
               This is the guide we wish existed when we started. Everything we learned after months of binary analysis, trial and error, and 33 confirmed assertion checks against real match data. If you want to parse Fortnite replay files from scratch, start here.
            </p>

            {/* TOC */}
            <div style={{ background: '#F0EDE8', borderRadius: '16px', padding: '32px', marginBottom: '64px' }}>
               <p style={{ fontWeight: 700, marginBottom: '16px', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contents</p>
               {[
                  ['#header', '1. The File Header — Magic, Version, and AES Key'],
                  ['#chunks', '2. Chunk Structure — Types, Flags, and Layout'],
                  ['#decryption', '3. AES-256-ECB Decryption — The Exact Algorithm'],
                  ['#oodle', '4. Oodle Decompression — After the Decrypt'],
                  ['#bitstream', '5. NetBitStream — Reading Property Updates'],
                  ['#handles', '6. Confirmed Stat Handles — Chapter 7 Season 2'],
                  ['#positions', '7. Position Extraction and Speed Filtering'],
                  ['#names', '8. Player Name Deobfuscation'],
                  ['#storm', '9. Storm Circle Decoding'],
                  ['#channels', '10. Channel Detection — Finding the Right Actor'],
               ].map(([href, label]) => (
                  <a key={href as string} href={href as string} style={{ display: 'block', color: '#D97757', textDecoration: 'none', fontSize: '0.95rem', padding: '4px 0', lineHeight: 1.6 }}>
                     {label as string}
                  </a>
               ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', fontSize: '1.05rem', color: '#333', lineHeight: 1.75 }}>

               <p>
                  Fortnite replay files contain a complete serialized record of every network packet your game client received during a match. They are not video files. They are a time-ordered binary stream of the entire multiplayer game state, encrypted and compressed, using Unreal Engine&apos;s proprietary networking layer. Parsing them correctly gives you every stat, every position, every weapon interaction, and every elimination — directly from the source, without relying on Epic&apos;s public APIs.
               </p>

               {/* Section 1 */}
               <div id="header">
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111', marginBottom: '20px' }}>1. The File Header</h2>
                  <p style={{ marginBottom: '20px' }}>
                     The header is the most critical section to get right. It contains the magic identifier, version information, and — most importantly — the raw 32-byte AES-256 key used to decrypt the rest of the file. Get the header wrong and nothing else works.
                  </p>
                  <p style={{ marginBottom: '20px' }}>
                     The magic value changed between chapter versions. For Chapter 7 Season 2 (FileVersion 7), the magic is <code style={{ background: '#f0ede8', padding: '2px 6px', borderRadius: '4px' }}>0x1CA2E27F</code> read as a little-endian uint32. If you see <code style={{ background: '#f0ede8', padding: '2px 6px', borderRadius: '4px' }}>0x29, 0x1B, 0x12, 0x1D</code> that is an older chapter format.
                  </p>
                  <p style={{ marginBottom: '20px' }}>
                     The header contains a <code style={{ background: '#f0ede8', padding: '2px 6px', borderRadius: '4px' }}>customVersionCount</code> field. For each custom version, skip exactly 20 bytes. The number of custom versions varies per build so you cannot hardcode an offset to the AES key — you must parse through the custom version list to find it.
                  </p>
                  <Pre>{code.header}</Pre>
                  <p style={{ marginTop: '20px' }}>
                     After the FriendlyName FString (which is a 4-byte little-endian length prefix followed by UTF-16LE encoded characters), you will find three single-byte booleans: <code style={{ background: '#f0ede8', padding: '2px 6px', borderRadius: '4px' }}>bIsLive</code>, <code style={{ background: '#f0ede8', padding: '2px 6px', borderRadius: '4px' }}>bCompressed</code>, and <code style={{ background: '#f0ede8', padding: '2px 6px', borderRadius: '4px' }}>bEncrypted</code>. Immediately following those is the 32-byte AES key. Do not skip this. This key is unique per match.
                  </p>
               </div>

               {/* Section 2 */}
               <div id="chunks">
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111', marginBottom: '20px' }}>2. Chunk Structure</h2>
                  <p style={{ marginBottom: '20px' }}>
                     After the header, the rest of the file is a sequence of chunks. Each chunk has a fixed 16-byte header followed by its payload. The chunk types you care about are type 1 (ReplayData) and type 3 (Event). Type 2 (Checkpoint) contains full world state snapshots used for fast-seeking and is useful for jump-starting position tracking mid-match.
                  </p>
                  <Pre>{code.chunks}</Pre>
                  <p style={{ marginTop: '20px' }}>
                     In our testing against Chapter 7 Season 2 replays, a typical 20-minute match produces 65 decryptable chunks. The chunk size varies from a few hundred bytes for sparse frames up to several megabytes for high-action sequences with many player updates.
                  </p>
               </div>

               {/* Section 3 */}
               <div id="decryption">
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111', marginBottom: '20px' }}>3. AES-256-ECB Decryption</h2>
                  <p style={{ marginBottom: '20px' }}>
                     This is where most parsers get it wrong. Fortnite replay data chunks use AES-256-ECB mode — Electronic Codebook — with no initialization vector. There is no IV, no salt, no key derivation. The raw 32-byte key from the header goes directly into the cipher.
                  </p>
                  <p style={{ marginBottom: '20px' }}>
                     PKCS7 padding is also not applied. Set <code style={{ background: '#f0ede8', padding: '2px 6px', borderRadius: '4px' }}>setAutoPadding(false)</code> in Node.js or the equivalent in your language. If you leave auto-padding enabled you will get garbage at the end of every decrypted chunk.
                  </p>
                  <Pre>{code.decryption}</Pre>
                  <p style={{ marginTop: '20px' }}>
                     ECB mode is considered cryptographically weak for general use because identical plaintext blocks produce identical ciphertext blocks. Epic uses it here for performance reasons — AES-ECB is the fastest symmetric mode and they are decrypting this in real-time during spectating. For our purposes it is ideal because it means chunks can be decrypted independently and in parallel.
                  </p>
               </div>

               {/* Section 4 */}
               <div id="oodle">
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111', marginBottom: '20px' }}>4. Oodle Decompression</h2>
                  <p style={{ marginBottom: '20px' }}>
                     After decryption, if <code style={{ background: '#f0ede8', padding: '2px 6px', borderRadius: '4px' }}>bCompressed</code> is true in the header, the decrypted payload is Oodle-compressed. Oodle is Epic&apos;s proprietary compression library used across all Unreal Engine titles. The first 4 bytes of the decrypted payload are the uncompressed size as a little-endian uint32.
                  </p>
                  <Pre>{code.oodle}</Pre>
                  <p style={{ marginTop: '20px' }}>
                     The <code style={{ background: '#f0ede8', padding: '2px 6px', borderRadius: '4px' }}>ooz-wasm</code> package on npm provides a WebAssembly port of the Oodle reference decompressor. Install it with <code style={{ background: '#f0ede8', padding: '2px 6px', borderRadius: '4px' }}>npm install ooz-wasm</code>. Decompression is fast — a 2MB compressed chunk typically decompresses in under 50ms. The bulk of parse time is in the bitstream walking phase that follows.
                  </p>
               </div>

               {/* Section 5 */}
               <div id="bitstream">
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111', marginBottom: '20px' }}>5. NetBitStream — Reading Property Updates</h2>
                  <p style={{ marginBottom: '20px' }}>
                     Once you have the decompressed bytes, you are looking at Unreal Engine&apos;s NetBitStream format. This is not byte-aligned. Properties are packed at the bit level to minimize network bandwidth. You need a proper bitstream reader that can read arbitrary numbers of bits and advance the cursor at sub-byte granularity.
                  </p>
                  <p style={{ marginBottom: '20px' }}>
                     The key encoding to understand is IntPacked — Unreal&apos;s variable-length integer encoding. It uses 6 bits of data and 2 control bits per byte: one bit for sign and one for continuation. Most stat values — kills, damage, materials — are stored as IntPacked.
                  </p>
                  <Pre>{code.properties}</Pre>
                  <p style={{ marginTop: '20px' }}>
                     Some properties use fixed-width bit fields instead. Stone gathered, for example, uses <code style={{ background: '#f0ede8', padding: '2px 6px', borderRadius: '4px' }}>Bits(11)</code> — exactly 11 bits, supporting values up to 2047. Distance traveled uses <code style={{ background: '#f0ede8', padding: '2px 6px', borderRadius: '4px' }}>Bits(32)</code>. The encoding type is determined by the handle ID and confirmed by cross-referencing against known values from real matches.
                  </p>
               </div>

               {/* Section 6 */}
               <div id="handles">
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111', marginBottom: '20px' }}>6. Confirmed Stat Handles — Chapter 7 Season 2</h2>
                  <p style={{ marginBottom: '20px' }}>
                     This is the section that took the longest to produce. Handle IDs are not documented anywhere by Epic. Every handle below was confirmed by parsing real match replays and cross-referencing extracted values against known ground truth — the stats shown in the Fortnite post-game screen.
                  </p>
                  <p style={{ marginBottom: '20px' }}>
                     The player stat channel (<code style={{ background: '#f0ede8', padding: '2px 6px', borderRadius: '4px' }}>FortPlayerStateAthena</code>) is dynamic — its channel number changes per match. You cannot hardcode a channel index. Instead, find it by scanning all channels for the one where handle 125 matches the kill count shown in the post-game screen for the local player.
                  </p>
                  <Pre>{code.handles}</Pre>
                  <p style={{ marginTop: '20px' }}>
                     Important caveat: handle 4 (stone) uses <code style={{ background: '#f0ede8', padding: '2px 6px', borderRadius: '4px' }}>Bits(11)</code> while handles 2 (wood) and 5 (metal) use IntPacked despite being the same data type logically. This inconsistency is internal to Epic&apos;s serialization and must be handled case-by-case.
                  </p>
                  <p>
                     The weapon channel (<code style={{ background: '#f0ede8', padding: '2px 6px', borderRadius: '4px' }}>AFortWeapon</code>) follows a similar pattern — each weapon the player holds gets its own channel. Handle 26 for hits-to-AI was confirmed by comparing the Chaos Reloader Shotgun (which hit one AI bot) against the Combat AR (which did not) in the same match.
                  </p>
               </div>

               {/* Section 7 */}
               <div id="positions">
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111', marginBottom: '20px' }}>7. Position Extraction and Speed Filtering</h2>
                  <p style={{ marginBottom: '20px' }}>
                     Player positions come from the <code style={{ background: '#f0ede8', padding: '2px 6px', borderRadius: '4px' }}>AFortPlayerPawn</code> actor channel as location property updates. Each position update is three signed 16-bit integers — X, Y, Z. Multiply each by 2 to get centimeters in Fortnite world space.
                  </p>
                  <p style={{ marginBottom: '20px' }}>
                     Raw position data contains artifacts. Interpolation, teleportation for respawns, and network corrections can produce jumps that are not real movement. Apply a speed filter: any position update that implies a speed above 8000 cm/s (80 m/s — well above the maximum skydive speed) should be discarded.
                  </p>
                  <Pre>{code.positions}</Pre>
                  <p style={{ marginTop: '20px' }}>
                     In a typical 20-minute match we extract 174,487 raw position readings across all 92 players. After speed filtering and sampling to one position per 2.5 seconds, this reduces to approximately 450 points for the local player track — enough resolution for smooth path visualization without being wasteful.
                  </p>
                  <p>
                     The Fortnite island sits within world bounds of ±131,072 cm (±1.31 km). Any position outside these bounds is the player skydiving before landing. Track positions within bounds separately from skydive positions to calculate foot distance and air distance independently.
                  </p>
               </div>

               {/* Section 8 */}
               <div id="names">
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111', marginBottom: '20px' }}>8. Player Name Deobfuscation</h2>
                  <p style={{ marginBottom: '20px' }}>
                     Player display names in the replay are not stored plaintext. They are obfuscated with a simple character shift. Each character is shifted by <code style={{ background: '#f0ede8', padding: '2px 6px', borderRadius: '4px' }}>(3 + i * 3) % 8</code> positions where i is the character index, operating on the printable ASCII range (32–126).
                  </p>
                  <Pre>{code.names}</Pre>
                  <p style={{ marginTop: '20px' }}>
                     This is not encryption — it is obfuscation to prevent casual inspection of the binary file. The algorithm is consistent across all Chapter 7 Season 2 replays we tested. Names of 92 players in a full lobby are decoded correctly using this shift formula.
                  </p>
               </div>

               {/* Section 9 */}
               <div id="storm">
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111', marginBottom: '20px' }}>9. Storm Circle Decoding</h2>
                  <p style={{ marginBottom: '20px' }}>
                     Storm data comes from the <code style={{ background: '#f0ede8', padding: '2px 6px', borderRadius: '4px' }}>SafeZoneIndicator</code> actor. Watch for property updates on this actor&apos;s channel — specifically float values representing the current and next circle radii, and a vector value for the next circle center position.
                  </p>
                  <Pre>{code.storm}</Pre>
                  <p style={{ marginTop: '20px' }}>
                     Chapter 7 Season 2 has 12 storm phases with DPS values increasing from 1 at phase 1 to 8 at phase 12. The starting safe zone radius is approximately 105,723 cm (about 1.06 km radius). By the final circle this shrinks to a few hundred centimeters — effectively a single building.
                  </p>
               </div>

               {/* Section 10 */}
               <div id="channels">
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111', marginBottom: '20px' }}>10. Channel Detection — Finding the Right Actor</h2>
                  <p>
                     The single hardest part of replay parsing is channel identification. Unreal Engine assigns channel numbers dynamically per match — there is no fixed mapping of channel 5 = local player. You must infer actor types from context.
                  </p>
                  <p style={{ marginTop: '16px' }}>
                     The approach that works reliably: collect all stat values on all channels. Cross-reference against known ground truth — the post-game screen shows kills, damage, and materials for the local player. Find the channel where the extracted values match. From that anchor channel you can identify nearby channels by actor class name strings that appear early in each channel&apos;s stream.
                  </p>
                  <p style={{ marginTop: '16px' }}>
                     For weapon channels specifically: each weapon the player equips gets a new channel. Track all channels that have handle 21 (damageToPlayers) updates. Correlate with equip/unequip events to assign weapon names to channels. The weapon name comes from an FString property on the weapon channel early in its lifecycle.
                  </p>
               </div>

               {/* Benchmark */}
               <div style={{ background: '#111', borderRadius: '20px', padding: '40px', color: '#fff', marginTop: '16px' }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '16px' }}>Validated Results — Game2.replay</h3>
                  <p style={{ opacity: 0.7, marginBottom: '24px', fontSize: '0.95rem' }}>
                     After implementing all of the above, our parser produces the following against a real Chapter 7 Season 2 Victory Royale replay — all 33 assertions passing:
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.9rem' }}>
                     {[
                        ['Result', 'Victory Royale'],
                        ['Placement', '1st / 98 players'],
                        ['Human players', '28 (70 AI bots)'],
                        ['Kills', '4 player + 2 AI'],
                        ['Damage dealt', '1,108'],
                        ['Damage taken', '398'],
                        ['Accuracy', '21.3%'],
                        ['Headshots', '4 (12.5%)'],
                        ['Builds placed', '327'],
                        ['Builds edited', '74'],
                        ['Materials gathered', '5,165 total'],
                        ['Distance on foot', '4.6 km'],
                        ['Time in storm', '66,000ms'],
                        ['Parse time', '842ms'],
                        ['Positions extracted', '174,487'],
                        ['Players decoded', '92 / 92'],
                     ].map(([label, value]) => (
                        <div key={label} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>
                           <span style={{ opacity: 0.6 }}>{label}</span>
                           <span style={{ fontWeight: 600, color: '#4ade80' }}>{value}</span>
                        </div>
                     ))}
                  </div>
               </div>

               {/* CTA */}
               <div style={{ background: '#F5F5F3', padding: '48px', borderRadius: '24px', border: '1px solid #E5E5E5', textAlign: 'center', marginTop: '16px' }}>
                  <h3 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '16px' }}>Skip the 6 months of reverse engineering</h3>
                  <p style={{ color: '#6B6A68', marginBottom: '32px', maxWidth: '500px', margin: '0 auto 32px', lineHeight: 1.6 }}>
                     The Pathgen API does all of this in 842ms. Upload a .replay file, get structured JSON back with 33 confirmed fields, per-weapon stats, full scoreboard, positions, storm data, and AI coaching. $0.02 per parse.
                  </p>
                  <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                     <Link href="/signup">
                        <button style={{ padding: '16px 32px', background: '#111111', color: '#fff', borderRadius: '12px', border: 'none', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>
                           Get 100 Free Credits
                        </button>
                     </Link>
                     <Link href="/docs">
                        <button style={{ padding: '16px 32px', background: 'transparent', color: '#111', borderRadius: '12px', border: '2px solid #111', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>
                           Read the Docs
                        </button>
                     </Link>
                  </div>
               </div>

            </div>

            {/* Footer CTA */}
            <div style={{ marginTop: '80px', padding: '48px', background: '#111111', borderRadius: '24px', color: '#fff', textAlign: 'center' }}>
               <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '12px' }}>Build on Pathgen</h2>
               <p style={{ opacity: 0.6, marginBottom: '28px', maxWidth: '480px', margin: '0 auto 28px', lineHeight: 1.6 }}>
                  The Fortnite data infrastructure Osirion wishes it had. 33 confirmed fields. 842ms parse time. AI coaching. FNCS session analysis. $0.02 per replay.
               </p>
               <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                  <Link href="/docs" style={{ color: '#fff', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 700, background: 'rgba(255,255,255,0.1)', padding: '12px 24px', borderRadius: '10px' }}>Documentation</Link>
                  <Link href="/pricing" style={{ color: '#fff', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 700, background: 'rgba(255,255,255,0.1)', padding: '12px 24px', borderRadius: '10px' }}>Pricing</Link>
               </div>
            </div>

         </article>

         <footer style={{ padding: '60px 40px', borderTop: '1px solid #E5E5E5', textAlign: 'center' }}>
            <div style={{ fontSize: '0.8rem', color: '#6B6A68' }}>
               © 2026 Pathgen. Built by developers who actually parsed the binary.
            </div>
         </footer>
      </div>
   )
}

function Pre({ children }: { children: string }) {
   return (
      <pre style={{
         background: '#111111',
         padding: '32px',
         borderRadius: '16px',
         color: '#4ade80',
         fontFamily: '"JetBrains Mono", "Fira Code", monospace',
         fontSize: '0.85rem',
         overflowX: 'auto',
         lineHeight: 1.7,
         margin: '24px 0',
         whiteSpace: 'pre',
      }}>
         {children}
      </pre>
   )
}