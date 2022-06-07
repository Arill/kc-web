module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/kc-web/' : '/kc-web/',
  transpileDependencies: ['vuetify', 'gkcoi'],
  pages: {
    index: {
      entry: 'src/main.ts',
      title: 'Air Power Simulator v2',
    },
  },
};
