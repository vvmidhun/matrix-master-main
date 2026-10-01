import { readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

function preloadHomeBackground(): Plugin {
  let base = '/'
  return {
    name: 'preload-home-background',
    apply: 'build',
    configResolved(config) {
      base = config.base.endsWith('/') ? config.base : `${config.base}/`
    },
    transformIndexHtml(_html, ctx) {
      if (!ctx.bundle) return
      const asset = Object.values(ctx.bundle).find(
        (item) =>
          item.type === 'asset' &&
          item.fileName.replaceAll('\\', '/').includes('bg-home') &&
          item.fileName.endsWith('.webp'),
      )
      if (!asset || asset.type !== 'asset') return
      const fileName = asset.fileName.replaceAll('\\', '/')
      return [
        {
          tag: 'link',
          attrs: {
            rel: 'preload',
            as: 'image',
            href: `${base}${fileName}`,
            type: 'image/webp',
            fetchpriority: 'high',
          },
          injectTo: 'head-prepend',
        },
      ]
    },
  }
}

const HASHED_ASSET = /\.(?:js|css|webp|svg)$/i

function hashedAssetCacheHeaders(): Plugin {
  return {
    name: 'hashed-asset-cache-headers',
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split('?')[0] ?? ''
        if (url.endsWith('/sw.js') || url.endsWith('.html') || url.endsWith('/')) {
          res.setHeader('Cache-Control', 'no-cache')
        } else if (url.includes('/assets/') && HASHED_ASSET.test(url)) {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
        }
        next()
      })
    },
  }
}

function shortHash(input: string): string {
  let h = 2166136261
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return (h >>> 0).toString(36)
}

async function listRelativeFiles(dir: string, root = dir): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true })
  const files: string[] = []
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await listRelativeFiles(full, root)))
    } else {
      files.push(path.relative(root, full).replaceAll('\\', '/'))
    }
  }
  return files
}

function assetCacheWorkerSource(cachePrefix: string, cacheName: string): string {
  return `/* generated — do not edit */
const CACHE = ${JSON.stringify(cacheName)};
const PREFIX = ${JSON.stringify(`${cachePrefix}-`)};

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key.startsWith(PREFIX) && key !== CACHE).map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

function isPage(request, url) {
  return request.mode === 'navigate' || url.pathname.endsWith('.html');
}

function isAsset(url) {
  return url.pathname.includes('/assets/') || /\\.(?:webp|svg|js|css)$/i.test(url.pathname);
}

function canCache(url, response, page) {
  if (!response.ok) return false;
  const type = (response.headers.get('content-type') || '').toLowerCase();
  if (type.includes('text/html')) return page;
  if (page) return true;
  if (/\\.(?:webp|png|jpe?g|gif|svg|avif)$/i.test(url.pathname)) {
    return !type || type.startsWith('image/') || type.includes('octet-stream');
  }
  if (/\\.(?:js|mjs)$/i.test(url.pathname)) {
    return !type || type.includes('javascript') || type.includes('ecmascript') || type.includes('octet-stream');
  }
  if (/\\.css$/.test(url.pathname)) {
    return !type || type.includes('text/css') || type.includes('octet-stream');
  }
  return url.pathname.includes('/assets/');
}

async function networkFirst(request) {
  const cache = await caches.open(CACHE);
  const url = new URL(request.url);
  try {
    const fresh = await fetch(request);
    if (canCache(url, fresh, true)) await cache.put(request, fresh.clone());
    return fresh;
  } catch (err) {
    const cached = await cache.match(request);
    if (cached) return cached;
    const index = await cache.match(new URL('index.html', self.registration.scope));
    if (index) return index;
    throw err;
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;
  const fresh = await fetch(request);
  const url = new URL(request.url);
  if (canCache(url, fresh, false)) await cache.put(request, fresh.clone());
  return fresh;
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.endsWith('/sw.js')) return;

  if (isPage(request, url)) {
    event.respondWith(networkFirst(request));
    return;
  }

  if (isAsset(url)) {
    event.respondWith(cacheFirst(request));
  }
});
`
}

function assetCacheWorker(cachePrefix: string): Plugin {
  return {
    name: 'asset-cache-worker',
    apply: 'build',
    async writeBundle(options) {
      const dir = options.dir
      if (!dir) return

      const all = await listRelativeFiles(dir)
      const files = all.filter(
        (file) => file !== 'sw.js' && /\.(?:html|js|css|webp|svg)$/i.test(file),
      )
      const cacheName = `${cachePrefix}-${shortHash(files.join('|'))}`
      await writeFile(path.join(dir, 'sw.js'), assetCacheWorkerSource(cachePrefix, cacheName))
    },
  }
}

export default defineConfig({
  base: '/ai-textbook/grade10/Matrix-Master/',
  plugins: [react(), tailwindcss(), preloadHomeBackground(), hashedAssetCacheHeaders(), assetCacheWorker('mtm')],
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    sourcemap: false,
    reportCompressedSize: true,
    assetsInlineLimit: 2048,
    chunkSizeWarningLimit: 400,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) {
            return 'react-vendor'
          }
          if (id.includes('node_modules/motion') || id.includes('node_modules/framer-motion')) {
            return 'motion'
          }
        },
      },
    },
  },
})
