const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "production", // Set to 'development' for easier debugging
  entry: "./app.js", // Entry point for your application
  output: {
    filename: "main.js", // Name of the bundled output file
    path: path.resolve(__dirname, "dist"), // Output directory for the bundle
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ["dist/*"],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/, // Target all JavaScript files
        exclude: /node_modules/, // Exclude the node_modules folder
        use: {
          loader: "babel-loader", // Use Babel for transpiling (optional)
          options: {
            presets: ["@babel/preset-env"], // Transpile for modern browsers (optional)
          },
        },
      },
    ],
  },
};
