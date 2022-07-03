/** @type {import('next').NextConfig} */
const { i18n } = require("./next-i18next.config");
const withGraphql = require("next-plugin-graphql");

module.exports = withGraphql({
    i18n,
    reactStrictMode: true,
});
