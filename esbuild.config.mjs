import { build } from 'esbuild'

const isDev = process.argv.includes('--dev')

const config = {
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  format: 'cjs',
  outfile: 'dist/index.js',
  minify: !isDev,
  sourcemap: false,
}

if (isDev) {
  const ctx = await context(config)
  await ctx.watch()
  console.log('Watching for changes...')
} else {
  await build(config)
  console.log('Build complete.')
}
