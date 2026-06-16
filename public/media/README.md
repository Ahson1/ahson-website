# /media — interests gallery + cosmos turn assets

Files referenced by `app/media.config.ts`. Drop the real exports here; the
components upgrade automatically (until then a deep-water placeholder / the CSS
starfield carry the layout, so nothing looks broken).

## Gallery (square, ~1:1)
Each clip wants a compressed MP4 and a matching poster JPG (first frame):

| file                | role            |
| ------------------- | --------------- |
| `cuttle.mp4`        | clip            |
| `cuttle-poster.jpg` | poster / still  |
| `turtle.mp4`        | clip            |
| `turtle-poster.jpg` | poster / still  |

Optional `*.webm` siblings are picked up automatically if present (add the path
in the manifest entry).

Currently DISABLED in the manifest (flip `enabled: true` to show, no code change):
`whalebreach.jpg`, `operahouse.jpg`.

## Cosmos turn (full-bleed)
| file           | role                          |
| -------------- | ----------------------------- |
| `milkyway.jpg` | hero photo over the starfield |

### Encoding hints
- Clips: `H.264 yuv420p`, no audio, ~1080x1080, short loop, aim < ~2 MB each.
  Posters: same frame exported as JPG (~70-80 quality).
- `milkyway.jpg`: large landscape, quality ~80; it sits under a dark scrim so it
  can be fairly compressed.
