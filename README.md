# flexim
Social Media Toolkit

## Dockerfile

```
FROM node:12

# Setting working directory. All the path will be relative to WORKDIR
WORKDIR <work directory>

# Installing dependencies
COPY package*.json ./
RUN npm install

# Copying source files
COPY . .

# Building app
RUN npm run build

# Running the app
CMD [ "npm", "start" ]

```

## next.config.js

```
const withCSS = require('@zeit/next-css')
const withFonts = require('next-fonts')
const withImages = require('next-images')
const withPlugins = require("next-compose-plugins")
const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')

const nextConfig = {
  webpack: config => {
    // Fixes npm packages that depend on `fs` module
    config.node = {
      fs: 'empty'
    }

    return config
  },
  serverRuntimeConfig: {
      url: '<domain>',
    },
    publicRuntimeConfig: {
      staticFolder: '/static',
      url: '<domain>',
      title: '<title>,
      description: `<description>`,
      gaTrackingId: '<gaTrackingId>'
    }
}

module.exports = withPlugins([withCSS, withFonts, withImages], nextConfig)
```

## Use


```
npm install
```

```
npm run dev
```

```
docker build -t flexim .
```

```
docker-compose up -d flexim
```
