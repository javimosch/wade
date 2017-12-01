const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const webpack = require('webpack');
const VirtualModulePlugin = require('virtual-module-webpack-plugin');

const DEBUG = process.env.NODE_ENV !== 'production';
console.log('DEBUG?', DEBUG);
// >> Target Structure <<
// > Root App
const APP_FOLDER = path.resolve(__dirname, './');
// > Dist
const DIST_FOLDER = path.resolve(APP_FOLDER, './public');
const DIST_FOLDER_STYLE = path.resolve(DIST_FOLDER, './');
const DIST_FILE_JS_BUNDLE = 'index.processed.js';
const DIST_FILE_CSS_BUNDLE_NAME = 'index.processed.css';
const DIST_FILE_CSS_BUNDLE = `${DIST_FILE_CSS_BUNDLE_NAME}`;
// > Src
const SRC_FOLDER = path.resolve(APP_FOLDER, './src');
const SRC_FILE_JS_APP = path.join(SRC_FOLDER, '/components/app');
module.exports = {
    cache: false,
    watchOptions: {
        aggregateTimeout: 1000,
        poll: true,
    },
    context: __dirname,
    devtool: DEBUG ? 'source-map' : '',
    devServer: {
        contentBase: __dirname + "/dist/",
        compress: true,
        host: process.env.IP,
        port: process.env.PORT || "80",
        publicPath: "/",
        hot: true
    },
    // entry: './src/index.js',
    // > JS Input / Output
    entry: [
        'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
        SRC_FILE_JS_APP
    ],
    plugins: [
        new VirtualModulePlugin({
            moduleName: 'fromMemory/test.json',
            contents: JSON.stringify({ greeting: 'Hello!' })
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            Popper: ['popper.js', 'default'],
        }),
        new ExtractTextPlugin(DIST_FILE_CSS_BUNDLE),
        //new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            title: 'Output Management',
            template: "src/template.html"
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
    ],
    target: "web",
    output: {
        path: DIST_FOLDER,
        publicPath: '/',
        filename: DIST_FILE_JS_BUNDLE,
        sourceMapFilename: '[file].map',
    },
    // > Module Folders (packages and extensions)
    resolve: {
        alias: {
            "lib": path.join(process.cwd(), 'src/lib'),
            vue$: "vue/dist/vue.esm.js",
            "jsoneditor.css": path.join(__dirname, '/node_modules/jsoneditor/dist/jsoneditor.css'),
            "jsoneditor.svg": path.join(__dirname, '/node_modules/jsoneditor/dist/img/jsoneditor-icons.svg'),
        },
        modules: ['node_modules', APP_FOLDER],
        extensions: ['.js', '.json', '.jsx', '.css', '.scss'],
        descriptionFiles: ['package.json'],
    },
    module: {
        rules: [ // > CSS / SCSS
            { test: /\.handlebars$/, loader: "handlebars-loader" },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'vue-style-loader',
                    use: ['css-loader', 'sass-loader']
                }),
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'vue-style-loader',
                    use: ['css-loader', 'sass-loader']
                }),
            },
            {
                test: /\.sass$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    'sass-loader?indentedSyntax'
                ],
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        'js': 'babel-loader',
                        'scss': ExtractTextPlugin.extract({
                            fallback: 'vue-style-loader',
                            use: ['css-loader', 'sass-loader']
                        }),
                        'sass': [
                            'vue-style-loader',
                            'css-loader',
                            'sass-loader?indentedSyntax'
                        ]
                    }
                    // other vue-loader options go here
                }
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader'
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    'file-loader'
                ]
            },
            {
                test: /\.(csv|tsv)$/,
                use: [
                    'csv-loader'
                ]
            },
            {
                test: /\.xml$/,
                use: [
                    'xml-loader'
                ]
            }, {
                test: /\.exec\.js$/,
                use: ['script-loader']
            }, {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                        presets: ['env'],
                        plugins: ['transform-runtime', "transform-async-to-generator"]
                    }
                }
            }
        ]
    }
};

if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = '#source-map';
    // http://vue-loader.vuejs.org/en/workflow/production.html
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        /*
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            compress: {
                warnings: false
            }
        }),*/
        new webpack.LoaderOptionsPlugin({
            minimize: true
        })
        /*,
                new OptimizeCssAssetsPlugin({
                    assetNameRegExp: "*.css",
                    cssProcessor: require('cssnano'),
                    cssProcessorOptions: {
                        discardComments: { removeAll: true },
                    },
                    canPrint: true,
                }),*/
    ])
}
