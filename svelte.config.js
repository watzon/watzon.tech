import autoPreprocess from 'svelte-preprocess'

const mode = process.env.NODE_ENV
const dev = mode === 'development'

export default {
  dev,
  preprocess: autoPreprocess({
    scss: {
      paths: ['node_modules']
    },
    postcss: {
      plugins: [
        require('autoprefixer')()
      ]
    }
  })
}
