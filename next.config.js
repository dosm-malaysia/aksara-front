/** @type {import('next').NextConfig} */
const withPlugins = require("next-compose-plugins");

const { i18n } = require("./next-i18next.config");
// const withGraphql = require("next-plugin-graphql");
const withPWA = require("next-pwa")({
  dest: "public",
});

module.exports = withPlugins(
  [
    [
      withPWA,
      {
        pwa: {
          dest: "public",
          register: true,
          skipWaiting: true,
        },
      },
    ],
    // [withGraphql],
  ],
  {
    i18n,
    reactStrictMode: false, // Bug requires strict-mode false: https://github.com/plouc/nivo/issues/2009
    poweredByHeader: false,
  }
);

// module.exports = withPWA({
//   // next.js config
// })
// module.exports = withGraphql({
//   i18n,
//   reactStrictMode: false, // Bug requires strict-mode false: https://github.com/plouc/nivo/issues/2009
//   poweredByHeader: false, // Remove powered by header
// });
