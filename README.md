# Welcome to Remix!

- 📖 [Remix docs](https://remix.run/docs)

## Development

Run the dev server:

```shellscript
npm run dev
```

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying Node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `npm run build`

- `build/server`
- `build/client`

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever css framework you prefer. See the [Vite docs on css](https://vitejs.dev/guide/features.html#css) for more information.

# memo

add `server` directive
```ts
export default defineConfig({
  plugins: [
    ...,
  ],
  server: {
    host: '127.0.0.1'
  },
});
```


console error occurs 
```
✘ [ERROR] No loader is configured for ".html" files: node_modules/@mapbox/node-pre-gyp/lib/util/nw-pre-gyp/index.html

    node_modules/@mapbox/node-pre-gyp/lib/node-pre-gyp.js:86:21:
      86 │       return require('./' + command)(self, argvx, callback);
         ╵                      ~~~~~~~~~~~~~~

✘ [ERROR] Could not resolve "mock-aws-s3"

    node_modules/@mapbox/node-pre-gyp/lib/util/s3_setup.js:43:28:
      43 │     const AWSMock = require('mock-aws-s3');
         ╵                             ~~~~~~~~~~~~~

  You can mark the path "mock-aws-s3" as external to exclude it from the
  bundle, which will remove this error and leave the unresolved path in the
  bundle. You can also surround this "require" call with a try/catch block to
  handle this failure at run-time instead of bundle-time.

✘ [ERROR] Could not resolve "aws-sdk"

    node_modules/@mapbox/node-pre-gyp/lib/util/s3_setup.js:76:22:
      76 │   const AWS = require('aws-sdk');
         ╵                       ~~~~~~~~~

  You can mark the path "aws-sdk" as external to exclude it from the bundle,
  which will remove this error and leave the unresolved path in the bundle.
  You can also surround this "require" call with a try/catch block to handle
  this failure at run-time instead of bundle-time.

✘ [ERROR] Could not resolve "nock"

    node_modules/@mapbox/node-pre-gyp/lib/util/s3_setup.js:112:23:
      112 │   const nock = require('nock');
          ╵                        ~~~~~~

  You can mark the path "nock" as external to exclude it from the bundle,
  which will remove this error and leave the unresolved path in the bundle.
  You can also surround this "require" call with a try/catch block to handle
  this failure at run-time instead of bundle-time.

9:10:32 PM [vite] (client) error while updating dependencies:
Error: Build failed with 4 errors:
node_modules/@mapbox/node-pre-gyp/lib/node-pre-gyp.js:86:21: ERROR: No loader is configured for ".html" files: node_modules/@mapbox/node-pre-gyp/lib/util/nw-pre-gyp/index.html
node_modules/@mapbox/node-pre-gyp/lib/util/s3_setup.js:43:28: ERROR: Could not resolve "mock-aws-s3"
node_modules/@mapbox/node-pre-gyp/lib/util/s3_setup.js:76:22: ERROR: Could not resolve "aws-sdk"
node_modules/@mapbox/node-pre-gyp/lib/util/s3_setup.js:112:23: ERROR: Could not resolve "nock"
    at failureErrorWithLog (/workspaces/remix-todo/node_modules/vite/node_modules/esbuild/lib/main.js:1477:15)
    at /workspaces/remix-todo/node_modules/vite/node_modules/esbuild/lib/main.js:946:25
    at /workspaces/remix-todo/node_modules/vite/node_modules/esbuild/lib/main.js:1355:9
    at processTicksAndRejections (node:internal/process/task_queues:105:5) (x4)
```

add `optimizeDeps` directive
```vite.config.ts
export default defineConfig({
  plugins: [
    ...,
  ],
  optimizeDeps: { exclude: ['@mapbox/node-pre-gyp'] },
  server: {
    host: '127.0.0.1'
  },
});
```
see: https://zenn.dev/coji/articles/a8508bae1d8fa6
