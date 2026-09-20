import { readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import ReactivityTransform from '@vue-macros/reactivity-transform/vite'

const root = fileURLToPath(new URL('.', import.meta.url))

// Public URL of the generated entry module; the resolved id is the usual
// null-byte-prefixed virtual one.
const ENTRY_URL = '/@fixture-entry/'
const ENTRY_ID = '\0' + ENTRY_URL

// `/date-pickers`, `/DatePickers` and `/datepickers` all mean DatePickers.vue.
const normalize = (name: string) => name.toLowerCase().replaceAll('-', '')

function fixtureNames () {
	return readdirSync(root).filter(entry => entry.endsWith('.vue')).map(entry => entry.slice(0, -'.vue'.length)).sort()
}

function page (name: string) {
	return `<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title>${name} test fixture</title>
	</head>
	<body>
		<div id="app"></div>
		<script type="module" src="${ENTRY_URL}${name}.js"></script>
	</body>
</html>
`
}

function index (names: string[]) {
	const links = names.map(name => `<li><a href="/${name}">${name}</a></li>`).join('\n\t\t\t')
	return `<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<title>Test fixtures</title>
	</head>
	<body>
		<h1>Test fixtures</h1>
		<ul>
			${links}
		</ul>
	</body>
</html>
`
}

// A fixture is one .vue file. The page around it is generated here, so adding a
// consumer means adding a component — no HTML file and no entry module per page.
// Only the dev server needs this; nothing builds these pages.
function fixturePages (): Plugin {
	return {
		name: 'buntpapier-fixture-pages',
		resolveId (id) {
			if (id.startsWith(ENTRY_URL)) return ENTRY_ID + id.slice(ENTRY_URL.length)
		},
		load (id) {
			if (!id.startsWith(ENTRY_ID)) return
			const name = id.slice(ENTRY_ID.length).replace(/\.js$/, '')
			return [
				"import { mountFixture } from '/mount.ts'",
				`import Fixture from '/${name}.vue'`,
				'mountFixture(Fixture)',
				''
			].join('\n')
		},
		configureServer (server) {
			server.middlewares.use(async (req, res, next) => {
				if (req.method !== 'GET' && req.method !== 'HEAD') return next()
				const url = (req.url ?? '/').split('?')[0]
				const names = fixtureNames()

				const respond = async (body: string, status = 200) => {
					const html = await server.transformIndexHtml(url, body, req.originalUrl)
					res.statusCode = status
					res.setHeader('Content-Type', 'text/html; charset=utf-8')
					res.setHeader('Cache-Control', 'no-cache')
					res.end(html)
				}

				if (url === '/') return respond(index(names))

				// Only bare single-segment paths are pages; everything else (modules,
				// assets, /@vite/…) belongs to Vite.
				const requested = /^\/([A-Za-z0-9-]+)(?:\.html)?$/.exec(url)?.[1]
				if (!requested) return next()

				const name = names.find(candidate => normalize(candidate) === normalize(requested))
				if (name) return respond(page(name))

				return respond(`<!doctype html>
<html lang="en">
	<head><meta charset="utf-8"><title>Unknown fixture</title></head>
	<body>
		<h1>No fixture named “${requested}”</h1>
		<p>Available: ${names.join(', ') || '(none)'}</p>
	</body>
</html>
`, 404)
			})
		}
	}
}

export default defineConfig({
	root,
	plugins: [vue(), ReactivityTransform(), fixturePages()],
	server: {
		port: 5174,
		strictPort: true
	}
})
