var path = require('path');

module.exports = {
  entry: './src/index.js',
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'xreport-embed.js',
    library: 'xreportEmbed',
    libraryTarget: 'umd',
    globalObject: 'this'
  }
};
