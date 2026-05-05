# n8n-nodes-pixelapi

Official n8n community node for [PixelAPI](https://pixelapi.dev) — AI image generation, background removal, upscaling, face restoration, object removal, image editing, and photo relighting via REST API.

## Installation

In your n8n instance:

1. **Settings** → **Community Nodes**
2. Click **Install**
3. Enter package name: `n8n-nodes-pixelapi`
4. Restart n8n

Or self-hosted:

```bash
cd ~/.n8n
npm install n8n-nodes-pixelapi
```

## Setup

1. Sign up at [pixelapi.dev/app](https://pixelapi.dev/app) — free, 100 credits, no card.
2. Copy your API key from the dashboard.
3. In n8n, add new credential: **PixelAPI API** → paste API key → Save.

## Operations

| Operation | Cost | Notes |
|---|---|---|
| Generate Image | $0.001 | Text-to-image |
| Remove Background | $0.010 | Transparent PNG output |
| Upscale Image | $0.060 | 2× or 4× |
| Face Restore | $0.005 | Sharpen old/blurry faces |
| Remove Object | $0.025 | Prompt-driven inpaint |
| Edit Image | $0.020 | Prompt-driven edit |
| Relight | $0.018 | Studio / golden-hour / etc. |

## Example workflow

```
Webhook (image upload) → PixelAPI (Remove Background) → S3 (upload transparent PNG)
```

Drop the PixelAPI node, pick "Remove Background", set Image URL = `{{$json.image_url}}`, done.

## Pricing

| Plan | Cost | Credits |
|---|---|---|
| Free | $0 | 500 (no card) |
| Starter | $10/mo | 10,000 |
| Pro | $50/mo | 60,000 |
| Scale | $200/mo | 300,000 |

INR billing with GST invoice via Razorpay; international USD via Stripe / PayPal.

## Documentation

- API docs: [pixelapi.dev/docs](https://pixelapi.dev/docs)
- Pricing: [pixelapi.dev/pricing](https://pixelapi.dev/pricing)
- All SDKs: [github.com/prakash-in21](https://github.com/prakash-in21) (Python, JS, Go, PHP, Ruby, Rust)

## Support

- Email: support@pixelapi.dev
- Issues: [github.com/prakash-in21/n8n-nodes-pixelapi/issues](https://github.com/prakash-in21/n8n-nodes-pixelapi/issues)

## License

MIT
