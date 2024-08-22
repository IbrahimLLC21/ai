module.exports = {
    i18n: {
        defaultLocale: 'en',
        locales: ['en', 'fr', 'de', 'zh', 'ar', 'nl', 'vi', 'hu', 'bs','es'], // Added 'vi' for Vietnamese, 'hu' for Hungarian, and 'bs' for Bosnian
    },
    reloadOnPrerender: process.env.NODE_ENV === 'development',
};
