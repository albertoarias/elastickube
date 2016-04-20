/*
Copyright 2016 ElasticBox All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

/* eslint no-process-env:0 */
import CopyWebpackPlugin from 'copy-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import WebpackShellPlugin from 'webpack-shell-plugin';
import autoprefixer from 'autoprefixer';
import path from 'path';
import webpack from 'webpack';

const webpackConfig = {

    entry: {
        elastickube: [
            'src/_static/js/index.js',
            'src/less/documentation.less',
            'normalize.css/normalize.css',
            'roboto-fontface/css/roboto-fontface.css',
            'angular-material/angular-material.css'
        ]
    },

    resolve: {
        root: [
            path.resolve(path.join(__dirname, 'k8s_theme')),
            path.resolve(__dirname)
        ]
    },

    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /\/(node_modules)\/|.\/k8s_theme\/src\/_static\/js\/modernizr.min.js|.\/k8s_theme\/src\/_static\/js\/theme.js$/,
                loader: 'babel'
            },
            { test: /\.css/, loader: ExtractTextPlugin.extract('style', 'css', { publicPath: '../../' }) },
            { test: /\.less/, loader: ExtractTextPlugin.extract('style', 'css!postcss!less', { publicPath: '../../' }) },
            {
                test: /\.(eot|woff2?|ttf|svg)$/i,
                include: /\/(fonts|angular-ui-grid)\//,
                loader: 'file?name=_static/fonts/[name]-[hash].[ext]'
            },
            {
                test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.woff$|\.ttf$/,
                exclude: /\/(fonts)\//,
                loader: 'file?name=_static/images/[name].[ext]'
            },
            {
                test: /\.py$|\.conf$/,
                loader: 'file?name=[name].[ext]'
            },
            {
                test: /\.js/,
                include: /.\/k8s_theme\/src\/_static\/js\/modernizr.min.js|.\/k8s_theme\/src\/_static\/js\/theme.js$/,
                loader: 'file?name=_static/js/[name].[ext]'
            },
            {
                test: /\.html$/,
                exclude: /.\/k8s_theme\/src\/layout.html/,
                loader: 'file?name=[name].[ext]'
            }

        ]
    },

    postcss: () => ({
        defaults: [
            autoprefixer({
                browsers: ['last 2 versions', 'ie >= 10']
            })]
    }),

    plugins: [
        new webpack.OldWatchingPlugin(),
        new HtmlWebpackPlugin({ template: './k8s_theme/src/layout.html', inject: 'head', filename: 'layout.html' }),
        new ExtractTextPlugin('_static/css/[name].css'),
        new CopyWebpackPlugin([
            { from: 'k8s_theme/src/searchbox.html' }
        ]),
        new WebpackShellPlugin({ onBuildEnd: ['sphinx-build -b dirhtml ./src ../src/build/documentation']})
    ],

    output: {
        path: path.join(__dirname, process.env.BUILD_FOLDER || './k8s_theme/build'),
        publicPath: '',
        filename: '_static/js/[name].js'
    },

    stats: {
        children: false
    },

    eslint: {
        failOnWarning: false
    }
};

export default webpackConfig;
