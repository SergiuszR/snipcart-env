const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const webpack = require("webpack");

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
    new webpack.DefinePlugin({
      // "process.env.GEO_TOKEN": JSON.stringify(
      //   "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJkVzROZW9TeXk0OHpCOHg4emdZX2t5dFNiWHY3blZ0eFVGVFpzWV9TUFA4In0.eyJleHAiOjIwMjM0MzYxNDQsImlhdCI6MTcwODA3NjE0NCwianRpIjoiNWFlOGU2NGQtMzM5YS00ZDZiLThjMTUtMzJiZTMyNzliZmVlIiwiaXNzIjoiaHR0cHM6Ly9zYW5kYm94LWxvZ2luLmlucG9zdC5wbC9hdXRoL3JlYWxtcy9leHRlcm5hbCIsInN1YiI6ImY6N2ZiZjQxYmEtYTEzZC00MGQzLTk1ZjYtOThhMmIxYmFlNjdiOjFBNlZvZGcwdGFvLVYxa1RXV1dFSzBRdlFGQWlMbGhyYS1HdVJwVkVNSEUiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJzaGlweCIsInNlc3Npb25fc3RhdGUiOiIwNDdiN2ExMC02ZGY3LTQ1OWUtYmY5Ni04N2YzZjFmMThjZjkiLCJzY29wZSI6Im9wZW5pZCBhcGk6YXBpcG9pbnRzIiwic2lkIjoiMDQ3YjdhMTAtNmRmNy00NTllLWJmOTYtODdmM2YxZjE4Y2Y5IiwiYWxsb3dlZF9yZWZlcnJlcnMiOiJzbmlwY2FydC10ZXN0b3d5LndlYmZsb3cuaW8iLCJ1dWlkIjoiZDc2YmRjNWUtMDU0NS00OThhLTg2MjctNjRkOWZlMTA5NjlmIn0.JrAU0bV3kDpuZPIe-UkkJRxDdaVJrNayqtQ4saMeUO9eHY4MnQyqKM-_ori7HYYKE0Z0tw9aMANgBWKCf_RMJQM7eTHSmgSkLGx96qbyxDIY7CPMpmnx0rnJuN6lfi142Bwe45MYshdjvAc3I9eFTLzkSTve_mhjYhsoq787Tjo941-KLpQUM2OFMgihv8u9pJ2QIAx8YPogk5TqhyrcbehsK7N-IHuiKlFUlSY3OQ1ockuteItIlCboHwZde1aODZcJgqfe-aS4KmNz-nHNkn3jPbPtJ0ODVoyb0UZEZpU-8nIJtqXFIGf2OcdwX875TGDIj3VMzKD96JV2_G4P7Q"
      // ), // Replace with your actual token value
      "process.env.API_TOKEN": JSON.stringify(
        "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJkVzROZW9TeXk0OHpCOHg4emdZX2t5dFNiWHY3blZ0eFVGVFpzWV9TUFA4In0.eyJleHAiOjIwMjM0MzQ1NTQsImlhdCI6MTcwODA3NDU1NCwianRpIjoiMDg4YTFkZTEtZmM4MS00ZGIwLWI2YjgtMDU2NTYzMDc0MjYwIiwiaXNzIjoiaHR0cHM6Ly9zYW5kYm94LWxvZ2luLmlucG9zdC5wbC9hdXRoL3JlYWxtcy9leHRlcm5hbCIsInN1YiI6ImY6N2ZiZjQxYmEtYTEzZC00MGQzLTk1ZjYtOThhMmIxYmFlNjdiOjFBNlZvZGcwdGFvLVYxa1RXV1dFSzBRdlFGQWlMbGhyYS1HdVJwVkVNSEUiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJzaGlweCIsInNlc3Npb25fc3RhdGUiOiI0MTMwZThkOS1hYmIxLTQwMzUtODcxYi1iN2Q5M2FhOTI4MTYiLCJzY29wZSI6Im9wZW5pZCBhcGk6YXBpcG9pbnRzIGFwaTpzaGlweCIsInNpZCI6IjQxMzBlOGQ5LWFiYjEtNDAzNS04NzFiLWI3ZDkzYWE5MjgxNiIsImFsbG93ZWRfcmVmZXJyZXJzIjoiIiwidXVpZCI6ImQ3NmJkYzVlLTA1NDUtNDk4YS04NjI3LTY0ZDlmZTEwOTY5ZiIsImVtYWlsIjoic2VyZ2l1c3pyb3p5Y2tpQGljbG91ZC5jb20ifQ.Jb5RITVHPR-M0OXF0ynbDnCrgx-2jc5GaMMAX5tgvNJC_Di-tMdGguTogxEm_WVHTEuT-MdPKHlTtitDBM8N_cjmANkv3oEOlKkVp9_FOkvfT-usBFjH2-HSQLA_rEjc7QjAzlwgCtonoLVGvlZeni48OZ_HHspoeZsBm3PKx7_zx0RUkrPUZW3ojZnJ6Se2VCIFJUVQPnDvjuYBnBp04v3SOPLYGFMG-kZVMWH4V3Nx-iXEU-IfflLALc0DDMOUMGhXN85YAMquj3fEWxS_BvulQKE0YWgxJteHAfCcBqd_CLW8K7hWzzcuMr8QFygO-5zbGKbh3vUTcXQawxaKqQ"
      ), // Replace with your actual token value
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
