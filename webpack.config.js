module.exports = {
    mode: "production",
    entry: "./src/assets/js/main.js",
    output: {
      filename: "bundle.js"
    },
    module: {
       rules: [
         {
           test: /\.js$/,
           use: [
             {
               loader: "babel-loader",
               options: {
                 presets: [
                   "@babel/preset-env",
                 ],
               },
             },
           ],
         },
       ],
     },
     target: ["web", "es5"],
   }