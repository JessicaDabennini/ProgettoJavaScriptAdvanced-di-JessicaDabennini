const path = require('path');

 module.exports = {
   entry: './src/index.js',
   output: {
     filename: 'bundle.js',
     path: path.resolve(__dirname, 'dist'),
     clean: true,
     },
   module: {
     rules: [
       {
         test: /\.css$/i,
         use: [
           { loader: 'style-loader', options: { sourceMap: true } },
           { loader: 'css-loader', options: { sourceMap: true } },
         ],
       },
       {
         test: /\.(png|svg|jpg|jpeg|gif)$/i,
         type: 'asset',
         generator: {
           filename: 'assets/images/[name][ext][query]',
         },
       },
       {
         test: /\.(woff|woff2|eot|ttf|otf)$/i,
         type: 'asset',
         generator: {
           filename: 'assets/fonts/[name][ext][query]',
         },
       },
     ],
   },
 };