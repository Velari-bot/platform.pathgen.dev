export const ERROR_CODES = [
  { code: 'INVALID_KEY', status: 401, cause: 'Missing or malformed API key.', handle: 'Check your Bearer token in the header.' },
  { code: 'INSUFFICIENT_CREDITS', status: 402, cause: 'Account balance is zero.', handle: 'Top up credits in the dashboard.' },
  { code: 'NO_FILE', status: 400, cause: 'The "replay" field is empty.', handle: 'Include a .replay file in form-data.' },
  { code: 'INVALID_FILE', status: 415, cause: 'The file uploaded is not a .replay file.', handle: 'Upload a valid Fortnite replay binary.' },
  { code: 'UNSUPPORTED_VERSION', status: 422, cause: 'Replay from a very old season.', handle: 'We support Ch4 and onwards.' },
  { code: 'FILE_TOO_LARGE', status: 413, cause: 'File exceeds 50MB limit.', handle: 'Use smaller replays or compress data.' },
  { code: 'PARSE_FAILED', status: 500, cause: 'Internal binary parsing logic error.', handle: 'Report to staff on Discord.' },
  { code: 'RATE_LIMITED', status: 429, cause: 'Burst RPM threshold exceeded.', handle: 'Check Retry-After header and wait.' },
  { code: 'NOT_FOUND', status: 404, cause: 'Match ID or Account ID not found.', handle: 'Verify the ID and try again.' },
  { code: 'INVALID_PARAM', status: 400, cause: 'Missing or invalid query parameter.', handle: 'Check the endpoint documentation.' },
  { code: 'MAX_KEYS_REACHED', status: 403, cause: 'Limit of 5 API keys reached.', handle: 'Revoke an existing key first.' },
  { code: 'EPIC_NOT_CONNECTED', status: 403, cause: 'Phase 2 data requires Epic login.', handle: 'Call /v1/epic/auth-url first.' },
  { code: 'REPLAY_NOT_FOUND', status: 404, cause: 'Replay file not found on Epic CDN.', handle: 'Only server replays can be auto-fetched.' },
  { code: 'MATCH_STILL_LIVE', status: 400, cause: 'Cannot parse a live match.', handle: 'Wait until the match concludes.' }
];

export const FAQ_DATA = [
  { 
    category: "General",
    items: [
      { q: 'Where do I find my .replay files on PC?', a: 'They are located at %LOCALAPPDATA%\\FortniteGame\\Saved\\Demos on Windows. You can also open Fortnite, go to Career, select Replays, and click Open Replay Folder.' },
      { q: 'What Fortnite chapters and seasons are supported?', a: 'Pathgen supports replays from Chapter 4 Season 1 through the current live season. The server automatically fetches fresh AES decryption keys every 6 hours so compatibility updates automatically when Epic releases a new build. If a brand new season just dropped and parsing fails, wait up to 6 hours for the key rotation.' },
      { q: 'What is a server replay and how is it different from a client replay?', a: 'A client replay is recorded locally on your PC. It captures high-detail data for your player but network culling limits data for players far away from you. A server replay is recorded by Epic\'s game servers for competitive and tournament matches — it captures the full state of all 100 players from a neutral perspective with no culling. Server replays produce more complete scoreboard data and are required for full tournament analytics. Both file types use the same binary format and our parser handles both.' },
      { q: 'Can console players use the API?', a: 'Console players cannot access .replay files directly from their hardware. However there are two ways they can still use the API. First, if they play in a tournament that has server replays available, they can connect their Epic account and use POST /v1/replay/download-and-parse with their match ID — no file needed. Second, if a PC player in their lobby saves the replay, that PC player can upload it.' },
      { q: 'What is the maximum file size?', a: '50MB per .replay file. A typical 20-minute match is around 15-20MB so this limit should not affect normal usage.' }
    ]
  },
  {
    category: "Data and Stats",
    items: [
      { q: 'Why are some fields null in my response?', a: 'null means the parser could not find or extract that specific value from the replay binary. This happens for several reasons — the data is not recorded in that chunk type, the chunk was corrupted, the field requires an Epic account connection that has not been made, or the event simply did not occur in that match.' },
      { q: 'What is the difference between null and zero?', a: 'null means the data was not found or could not be extracted. 0 means the data was successfully found and the value was explicitly zero. Never treat null as zero.' },
      { q: 'Why can\'t I get edit accuracy or weakpoint accuracy?', a: 'These metrics are not stored in the Fortnite .replay binary format. Epic does not write this data to the replay stream.' },
      { q: 'How do I get ranked division and crown win data?', a: 'Connect the user\'s Epic account via the OAuth flow. Get the auth URL from GET /v1/epic/auth-url, have the user open it in their browser while logged into Epic, copy the authorization code, and POST it to POST /v1/epic/connect.' },
      { q: 'How do I get a match ID for a tournament game?', a: 'Match IDs appear in the match_info field of any successful parse response. You can also use /v1/replay/match-info to lookup metadata for a specific server-side match ID.' }
    ]
  },
  {
    category: "Billing and Policy",
    items: [
      { q: 'What happens if my parse fails — am I charged?', a: 'No. Credits are only deducted on a successful 200 response. If a parse fails due to an invalid file, unsupported version, server error, or any other reason, your credit balance is not affected. The one exception is if you hit a rate limit or your own network drops mid-request — in that case no parse occurred so no credits are deducted.' },
      { q: 'How do I handle rate limiting in my application?', a: 'When you exceed a rate limit the API returns 429 Too Many Requests with a Retry-After header indicating how many seconds to wait. Implement exponential backoff — wait the Retry-After duration, then retry. For high volume applications use the X-RateLimit-Remaining header in every response to monitor how close you are to the limit before hitting it.' },
      { q: 'Can I use the API commercially?', a: 'Yes. The credit system is designed to scale with commercial applications. There are no restrictions on commercial use. If you are building a high-volume application and need a custom credit arrangement contact us directly.' }
    ]
  },
  {
    category: "Support",
    items: [
      { q: 'How do I report a bug or wrong stat?', a: 'Join the developer Discord or use the feedback button in the platform dashboard. When reporting a wrong stat include the parser_meta.parsed_at timestamp and the specific field that is incorrect along with what the correct value should be and where you verified it (for example the Fortnite post-game screen). Wrong stat reports with this information can usually be investigated and resolved within 24 hours.' }
    ]
  }
];

export const SCHEMA_REFERENCE = [
  { 
    section: 'match_overview',
    items: [
      { field: 'match_id', type: 'string', desc: 'Unique internal match hash.', example: '4b3...' },
      { field: 'map_name', type: 'string', desc: 'Internal name of the Island (Asteria, Helios, etc).', example: 'Helios_POI' },
      { field: 'mode', type: 'string', desc: 'Playlist ID for the match.', example: 'Playlist_DefaultSolo' },
      { field: 'placement', type: 'int', desc: 'Final rank in the match.', example: 12 },
      { field: 'duration', type: 'float', desc: 'Match length in seconds.', example: 1240.5 },
      { field: 'region', type: 'string', desc: 'Datacenter region (NAE, EU, etc).', example: 'EU' }
    ]
  },
  { 
    section: 'combat_summary',
    items: [
      { field: 'kills', type: 'int', desc: 'Total confirmed eliminations.', example: 8 },
      { field: 'accuracy', type: 'float', desc: 'Overall shot success (0.0 - 1.0).', example: 0.34 },
      { field: 'damage_done', type: 'int', desc: 'Total damage dealt to players.', example: 1450 },
      { field: 'headshots', type: 'int', desc: 'Total critical hits.', example: 24 },
      { field: 'deaths', type: 'int', desc: 'Final death count (usually 0 or 1).', example: 1 }
    ]
  },
  {
    section: 'movement',
    items: [
      { field: 'total_distance', type: 'float', desc: 'Distance traveled in centimeters.', example: 845000 },
      { field: 'poi_visits', type: 'array', desc: 'List of named locations visited.', example: '["Tilted", "Retail"]' },
      { field: 'vehicle_time', type: 'float', desc: 'Seconds spent inside vehicles.', example: 45.2 }
    ]
  },
  {
    section: 'epic_data',
    items: [
      { field: 'crown_wins', type: 'int', desc: 'Lifetime victory crown count (OAuth required).', example: 42 },
      { field: 'rank', type: 'string', desc: 'Current season rank string.', example: 'Diamond 2' },
      { field: 'account_level', type: 'int', desc: 'Global Epic level.', example: 1450 }
    ]
  }
];

export const CREDIT_PACKS = [
  { name: 'Developer Starter', price: '$10.00', credits: 1000 },
  { name: 'Scale-Up', price: '$45.00', credits: 5000 },
  { name: 'High Frequency', price: '$150.00', credits: 20000 }
];

export const RATE_LIMITS = [
  { tier: 'No API Key', limit: '30 per min', scope: 'Global / IP' },
  { tier: 'Free (with Key)', limit: '60 per min', scope: 'API Key' },
  { tier: 'Replay Endpoints', limit: '20 per min', scope: 'API Key' },
  { tier: 'AI Coaching', limit: '5 per hr', scope: 'API Key' }
];
