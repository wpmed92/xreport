var path = require('path');

module.exports = {
  entry: './src/index.js',
  mode: 'development', 
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'xreport-embed.js',
    library: 'xreportEmbed',
    libraryTarget: 'umd',
    globalObject: 'this'
  }
};
