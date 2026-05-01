$json = Get-Content -Raw "d:\IIT Indoors 26\iit-indoors-2026\scratch\assets_base64.json" | ConvertFrom-Json
$svg = @"
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="290" height="850" viewBox="0 0 290 850" shape-rendering="crispEdges">
  <defs>
    <pattern id="paper-texture" width="4" height="4" patternUnits="userSpaceOnUse">
      <circle cx="1" cy="1" r="0.5" fill="#000000" opacity="0.02" />
    </pattern>
    <pattern id="paper-lines" width="100%" height="3" patternUnits="userSpaceOnUse">
      <rect width="100%" height="1" fill="#000000" opacity="0.03" />
    </pattern>
    <filter id="black-icon">
      <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" />
    </filter>
  </defs>

  <!-- Background Shadow and Paper -->
  <rect x="8" y="8" width="270" height="830" fill="black" opacity="0.8" />
  <rect x="2" y="2" width="270" height="830" fill="#f4f1ea" stroke="black" stroke-width="2" />
  
  <rect x="2" y="2" width="270" height="830" fill="url(#paper-texture)" pointer-events="none" />
  <rect x="2" y="2" width="270" height="830" fill="url(#paper-lines)" pointer-events="none" />

  <text x="137" y="50" text-anchor="middle" font-family="monospace" font-weight="900" font-size="22" fill="black" style="letter-spacing: 0.2em; text-transform: lowercase;">lineup</text>
  <line x1="15" y1="65" x2="250" y2="65" stroke="black" stroke-width="1" opacity="0.1" />

  <style>
    .game-card { cursor: pointer; transition: transform 0.2s; }
    .game-card:hover { transform: translateY(-2px); }
    .game-card:hover rect { stroke-opacity: 1; }
    .game-card:hover image { opacity: 1; }
  </style>

  <!-- 3 COLUMN GRID -->
  <g transform="translate(15, 100)">
    
    <!-- COLUMN 1 -->
    <g transform="translate(0, 0)">
      <a xlink:href="#valorant" class="game-card">
        <g transform="translate(0, 0)">
          <rect width="70" height="70" fill="white" opacity="0.5" stroke="black" stroke-width="1" stroke-opacity="0.1" />
          <image href="{{VALORANT}}" x="5" y="5" width="60" height="60" filter="url(#black-icon)" opacity="0.6" />
          <text x="35" y="85" text-anchor="middle" font-family="monospace" font-size="9" fill="black" opacity="0.7" style="text-transform: lowercase;">valorant</text>
        </g>
      </a>
      <a xlink:href="#chess" class="game-card">
        <g transform="translate(0, 100)">
          <rect width="70" height="70" fill="white" opacity="0.5" stroke="black" stroke-width="1" stroke-opacity="0.1" />
          <image href="{{CHESS}}" x="5" y="5" width="60" height="60" filter="url(#black-icon)" opacity="0.6" />
          <text x="35" y="85" text-anchor="middle" font-family="monospace" font-size="9" fill="black" opacity="0.7" style="text-transform: lowercase;">chess</text>
        </g>
      </a>
      <a xlink:href="#scrabble" class="game-card">
        <g transform="translate(0, 200)">
          <rect width="70" height="70" fill="white" opacity="0.5" stroke="black" stroke-width="1" stroke-opacity="0.1" />
          <image href="{{SCRABBLE}}" x="5" y="5" width="60" height="60" filter="url(#black-icon)" opacity="0.6" />
          <text x="35" y="85" text-anchor="middle" font-family="monospace" font-size="9" fill="black" opacity="0.7" style="text-transform: lowercase;">scrabble</text>
        </g>
      </a>
      <a xlink:href="#ludo" class="game-card">
        <g transform="translate(0, 300)">
          <rect width="70" height="70" fill="white" opacity="0.5" stroke="black" stroke-width="1" stroke-opacity="0.1" />
          <image href="{{LUDO}}" x="5" y="5" width="60" height="60" filter="url(#black-icon)" opacity="0.6" />
          <text x="35" y="85" text-anchor="middle" font-family="monospace" font-size="9" fill="black" opacity="0.7" style="text-transform: lowercase;">ludo</text>
        </g>
      </a>
      <a xlink:href="#uno" class="game-card">
        <g transform="translate(0, 400)">
          <rect width="70" height="70" fill="white" opacity="0.5" stroke="black" stroke-width="1" stroke-opacity="0.1" />
          <image href="{{UNO}}" x="5" y="5" width="60" height="60" filter="url(#black-icon)" opacity="0.6" />
          <text x="35" y="85" text-anchor="middle" font-family="monospace" font-size="9" fill="black" opacity="0.7" style="text-transform: lowercase;">uno</text>
        </g>
      </a>
      <a xlink:href="#dart" class="game-card">
        <g transform="translate(0, 500)">
          <rect width="70" height="70" fill="white" opacity="0.5" stroke="black" stroke-width="1" stroke-opacity="0.1" />
          <image href="{{DART}}" x="5" y="5" width="60" height="60" filter="url(#black-icon)" opacity="0.6" />
          <text x="35" y="85" text-anchor="middle" font-family="monospace" font-size="9" fill="black" opacity="0.7" style="text-transform: lowercase;">dart</text>
        </g>
      </a>
      <a xlink:href="#rubiks-cube" class="game-card">
        <g transform="translate(0, 600)">
          <rect width="70" height="70" fill="white" opacity="0.5" stroke="black" stroke-width="1" stroke-opacity="0.1" />
          <image href="{{RUBIKS-CUBE}}" x="5" y="5" width="60" height="60" filter="url(#black-icon)" opacity="0.6" />
          <text x="35" y="85" text-anchor="middle" font-family="monospace" font-size="9" fill="black" opacity="0.7" style="text-transform: lowercase;">rubiks cube</text>
        </g>
      </a>
    </g>

    <!-- COLUMN 2 -->
    <g transform="translate(85, 0)">
      <a xlink:href="#cricket" class="game-card">
        <g transform="translate(0, 0)">
          <rect width="70" height="70" fill="white" opacity="0.5" stroke="black" stroke-width="1" stroke-opacity="0.1" />
          <image href="{{CRICKET}}" x="5" y="5" width="60" height="60" filter="url(#black-icon)" opacity="0.6" />
          <text x="35" y="85" text-anchor="middle" font-family="monospace" font-size="9" fill="black" opacity="0.7" style="text-transform: lowercase;">cricket</text>
        </g>
      </a>
      <a xlink:href="#musical-chairs" class="game-card">
        <g transform="translate(0, 100)">
          <rect width="70" height="70" fill="white" opacity="0.5" stroke="black" stroke-width="1" stroke-opacity="0.1" />
          <image href="{{MUSICAL-CHAIRS}}" x="5" y="5" width="60" height="60" filter="url(#black-icon)" opacity="0.6" />
          <text x="35" y="85" text-anchor="middle" font-family="monospace" font-size="9" fill="black" opacity="0.7" style="text-transform: lowercase;">musical chairs</text>
        </g>
      </a>
      <a xlink:href="#typing-speed" class="game-card">
        <g transform="translate(0, 200)">
          <rect width="70" height="70" fill="white" opacity="0.5" stroke="black" stroke-width="1" stroke-opacity="0.1" />
          <image href="{{TYPING-SPEED-CONTEST}}" x="5" y="5" width="60" height="60" filter="url(#black-icon)" opacity="0.6" />
          <text x="35" y="85" text-anchor="middle" font-family="monospace" font-size="9" fill="black" opacity="0.7" style="text-transform: lowercase;">typing speed</text>
        </g>
      </a>
      <a xlink:href="#pucket" class="game-card">
        <g transform="translate(0, 300)">
          <rect width="70" height="70" fill="white" opacity="0.5" stroke="black" stroke-width="1" stroke-opacity="0.1" />
          <image href="{{PUCKET}}" x="5" y="5" width="60" height="60" filter="url(#black-icon)" opacity="0.6" />
          <text x="35" y="85" text-anchor="middle" font-family="monospace" font-size="9" fill="black" opacity="0.7" style="text-transform: lowercase;">pucket</text>
        </g>
      </a>
      <a xlink:href="#dumb-charades" class="game-card">
        <g transform="translate(0, 400)">
          <rect width="70" height="70" fill="white" opacity="0.5" stroke="black" stroke-width="1" stroke-opacity="0.1" />
          <image href="{{DUMB-CHAREDES}}" x="5" y="5" width="60" height="60" filter="url(#black-icon)" opacity="0.6" />
          <text x="35" y="85" text-anchor="middle" font-family="monospace" font-size="9" fill="black" opacity="0.7" style="text-transform: lowercase;">dumb charades</text>
        </g>
      </a>
      <a xlink:href="#cards" class="game-card">
        <g transform="translate(0, 500)">
          <rect width="70" height="70" fill="white" opacity="0.5" stroke="black" stroke-width="1" stroke-opacity="0.1" />
          <image href="{{CARDS-29}}" x="5" y="5" width="60" height="60" filter="url(#black-icon)" opacity="0.6" />
          <text x="35" y="85" text-anchor="middle" font-family="monospace" font-size="9" fill="black" opacity="0.7" style="text-transform: lowercase;">cards</text>
        </g>
      </a>
    </g>

    <!-- COLUMN 3 -->
    <g transform="translate(170, 0)">
      <a xlink:href="#wire-loop" class="game-card">
        <g transform="translate(0, 0)">
          <rect width="70" height="70" fill="white" opacity="0.5" stroke="black" stroke-width="1" stroke-opacity="0.1" />
          <image href="{{WIRE-LOOP}}" x="5" y="5" width="60" height="60" filter="url(#black-icon)" opacity="0.6" />
          <text x="35" y="85" text-anchor="middle" font-family="monospace" font-size="9" fill="black" opacity="0.7" style="text-transform: lowercase;">wire loop</text>
        </g>
      </a>
      <a xlink:href="#carrom" class="game-card">
        <g transform="translate(0, 100)">
          <rect width="70" height="70" fill="white" opacity="0.5" stroke="black" stroke-width="1" stroke-opacity="0.1" />
          <image href="{{CARROM}}" x="5" y="5" width="60" height="60" filter="url(#black-icon)" opacity="0.6" />
          <text x="35" y="85" text-anchor="middle" font-family="monospace" font-size="9" fill="black" opacity="0.7" style="text-transform: lowercase;">carrom</text>
        </g>
      </a>
      <a xlink:href="#table-tennis" class="game-card">
        <g transform="translate(0, 200)">
          <rect width="70" height="70" fill="white" opacity="0.5" stroke="black" stroke-width="1" stroke-opacity="0.1" />
          <image href="{{TABLE-TENNIS}}" x="5" y="5" width="60" height="60" filter="url(#black-icon)" opacity="0.6" />
          <text x="35" y="85" text-anchor="middle" font-family="monospace" font-size="9" fill="black" opacity="0.7" style="text-transform: lowercase;">table tennis</text>
        </g>
      </a>
      <a xlink:href="#clash-royale" class="game-card">
        <g transform="translate(0, 300)">
          <rect width="70" height="70" fill="white" opacity="0.5" stroke="black" stroke-width="1" stroke-opacity="0.1" />
          <image href="{{CLASH-ROYALE}}" x="5" y="5" width="60" height="60" filter="url(#black-icon)" opacity="0.6" />
          <text x="35" y="85" text-anchor="middle" font-family="monospace" font-size="9" fill="black" opacity="0.7" style="text-transform: lowercase;">clash royale</text>
        </g>
      </a>
      <a xlink:href="#efootball" class="game-card">
        <g transform="translate(0, 400)">
          <rect width="70" height="70" fill="white" opacity="0.5" stroke="black" stroke-width="1" stroke-opacity="0.1" />
          <image href="{{PES}}" x="5" y="5" width="60" height="60" filter="url(#black-icon)" opacity="0.6" />
          <text x="35" y="85" text-anchor="middle" font-family="monospace" font-size="9" fill="black" opacity="0.7" style="text-transform: lowercase;">efootball (pes)</text>
        </g>
      </a>
      <a xlink:href="#clash-of-clans" class="game-card">
        <g transform="translate(0, 500)">
          <rect width="70" height="70" fill="white" opacity="0.5" stroke="black" stroke-width="1" stroke-opacity="0.1" />
          <image href="{{CLASH-OF-CLANS}}" x="5" y="5" width="60" height="60" filter="url(#black-icon)" opacity="0.6" />
          <text x="35" y="85" text-anchor="middle" font-family="monospace" font-size="9" fill="black" opacity="0.7" style="text-transform: lowercase;">clash of clans</text>
        </g>
      </a>
    </g>
  </g>
</svg>
"@

$svg = $svg -replace "{{VALORANT}}", $json."Valorant.png"
$svg = $svg -replace "{{CHESS}}", $json."Chess.png"
$svg = $svg -replace "{{SCRABBLE}}", $json."Scrabble.png"
$svg = $svg -replace "{{LUDO}}", $json."Ludo.png"
$svg = $svg -replace "{{UNO}}", $json."UNO.png"
$svg = $svg -replace "{{DART}}", $json."Dart.png"
$svg = $svg -replace "{{RUBIKS-CUBE}}", $json."Rubiks-Cube.png"
$svg = $svg -replace "{{CRICKET}}", $json."Short-Pitch Cricket.png"
$svg = $svg -replace "{{MUSICAL-CHAIRS}}", $json."Musical-Chairs.png"
$svg = $svg -replace "{{TYPING-SPEED-CONTEST}}", $json."Typing-Speed-Contest.png"
$svg = $svg -replace "{{PUCKET}}", $json."Pucket.png"
$svg = $svg -replace "{{DUMB-CHAREDES}}", $json."Dumb-Charedes.png"
$svg = $svg -replace "{{CARDS-29}}", $json."Cards-29.png"
$svg = $svg -replace "{{WIRE-LOOP}}", $json."Wire-Loop.png"
$svg = $svg -replace "{{CARROM}}", $json."Carrom.png"
$svg = $svg -replace "{{TABLE-TENNIS}}", $json."Table-Tennis.png"
$svg = $svg -replace "{{CLASH-ROYALE}}", $json."Clash-Royale.png"
$svg = $svg -replace "{{PES}}", $json."pes.png"
$svg = $svg -replace "{{CLASH-OF-CLANS}}", $json."Clash-of-Clans.png"

$svg | Out-File "d:\IIT Indoors 26\iit-indoors-2026\public\assets\event-lineup.svg" -Encoding utf8
