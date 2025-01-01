const glob = require("glob");
const path = require("path");
// const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const IgnoreEmitPlugin = require("ignore-emit-webpack-plugin");
const BrowserSyncPlugin = require("browser-sync-webpack-plugin");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const isProduction = process.env.NODE_ENV === "production";

const proxyUrl = "https://makers/";

function getEntries(pattern, outputName) {
  const files = glob.sync(pattern);
  const entries = {};

  if (files.length > 0) {
    entries[outputName] = files.map((file) => `./${file}`);
  }

  return entries;
}

const common = {
  output: {
    path: path.resolve(__dirname),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.(?:js|mjs|cjs|ts|jsx|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.((?:sa|sc|c)ss)$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: { publicPath: "" },
          },
          "style-loader",
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.(?:eot|svg|ttf|woff|woff2|png|jpg|jpeg|gif|glb|gltf)$/i,
        type: "asset",
      },
    ],
  },
  plugins: [
    // new HtmlWebpackPlugin({
    //   template: path.resolve(__dirname, "index.php"), // Path to your PHP template file
    //   filename: "index.php", // Output filename for the generated PHP file
    //   // title: 'My App', // Title for the HTML document (optional)
    //   // meta: {
    //   //   description: 'My application', // Add meta tags (optional)
    //   //   // Add more meta tags as needed...
    //   // },
    //   inject: false,
    //   // Function to manipulate HTML content before it gets written to the file
    //   // minify: false,
    //   templateContent: ({ htmlWebpackPlugin }) => {
    //     const headerContent = `<?php get_header(); ?>`;
    //     const footerContent = `<?php get_footer(); ?>`;
    //     const bodyContent = `
    //     <!-- root tag for react-app content -->
    //     <div id="root"></div>

    //     <!-- <div id="main-content"> -->
    //       <?php
    //         // if (have_posts()) :
    //         //   while (have_posts()) : the_post();
    //         //     the_content();
    //         //   endwhile;
    //         // endif;
    //       ?>
    //     <!-- </div> -->`; // Get the main content from the original template

    //     return `
    //     ${headerContent}
    //     ${bodyContent}
    //     ${footerContent}
    //     `;
    //   },
    //   // Other configuration options can be added as needed
    // }),
    new MiniCssExtractPlugin({
      filename: (data) => {
        return data.chunk.name === "style" ? "style.css" : "style.min.css";
      },
    }),
    new IgnoreEmitPlugin(["style.js", "style.min.js"]),
  ],
  resolve: {
    extensions: [
      ".js",
      ".jsx",
      ".ts",
      ".tsx",
      ".jpg",
      ".jpeg",
      ".png",
      ".eot",
      ".svg",
      ".gif",
      ".glb",
      ".gltf",
      ".ttf",
      ".woff",
      ".woff2",
    ],
  },
  watchOptions: {
    ignored: /node_modules/,
  },
  experiments: {
    topLevelAwait: true,
  },
  performance: {
    maxAssetSize: 99999999,
    maxEntrypointSize: 99999999,
  },
};

const developmentConfig = {
  ...common,
  mode: "development",
  devtool: "eval-cheap-source-map",
  entry: () => {
    return {
      ...getEntries("src/js/app/*.js", "app"),
      ...getEntries("src/js/vendor/*.js", "vendor"),
      style: "./src/scss/style.scss",
    };
  },
  plugins: [
    ...common.plugins,
    new BrowserSyncPlugin({
      files: "**/*.php",
      proxy: proxyUrl,
      open: false,
      reloadOnRestart: true,
    }),
    new BundleAnalyzerPlugin(),
  ],
  optimization: {
    minimize: false,
    minimizer: [
      new TerserPlugin({
        include: /\.js$/,
        terserOptions: {
          compress: false,
          format: {
            comments: true,
          },
        },
        extractComments: true, // Extract comments into a separate file
      }),
      new CssMinimizerPlugin({
        include: /\.css$/,
        minimizerOptions: {
          preset: [
            "default",
            {
              discardComments: { removeAll: false },
              normalizeWhitespace: false,
            },
          ],
        },
        test: /\.css$/,
      }),
    ],
  },
};

const productionConfig = {
  ...common,
  mode: "production",
  devtool: false,
  entry: () => {
    return {
      ...getEntries("src/js/app/*.js", "app.min"),
      ...getEntries("src/js/vendor/*.js", "vendor.min"),
      "style.min": "./src/scss/style.scss",
    };
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        include: /\.min\.js$/,
        terserOptions: {
          format: {
            comments: false,
          },
          compress: {
            drop_console: true, // Drop console.* statements
            drop_debugger: true,
          },
          // mangle: true,
        },
        extractComments: false, // Do not extract comments into a separate file
      }),
      new CssMinimizerPlugin({
        include: /style\.min\.css$/,
        minimizerOptions: {
          preset: [
            "default",
            {
              discardComments: { removeAll: false },
              normalizeWhitespace: false,
            },
          ],
        },
      }),
    ],
  },
};

module.exports = isProduction ? productionConfig : developmentConfig;
