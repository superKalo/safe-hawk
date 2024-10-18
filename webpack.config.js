import path from 'path'
import { fileURLToPath } from 'url'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import webpack from 'webpack'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default {
    mode: 'production',
    target: 'web',
    entry: {
        background: './src/extension/service-worker.ts',
        popup: './src/index.tsx'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        clean: true
    },
    resolve: {
        extensions: ['.ts', '.js', '.tsx', '.jsx'],
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    },
    module: {
        rules: [
            {
                test: /.(ts|tsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            ['@babel/preset-react', { runtime: 'automatic' }],
                            '@babel/preset-typescript'
                        ]
                    }
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            }
        ]
    },
    devtool: 'inline-source-map',
    devServer: {
        static: './dist',
        hot: true,
        devMiddleware: {
            writeToDisk: true
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
            filename: 'popup.html',
            chunks: ['popup']
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: './public/manifest.json', to: 'manifest.json' },
                {
                    from: './src/assets/icons',
                    to: 'assets'
                }
            ]
        })
    ]
}
