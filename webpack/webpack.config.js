const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const outputPath = path.resolve(__dirname, '../dist');

module.exports = {
	entry   : path.resolve(__dirname, '../src/music_wave.js'),
	output  : {
		path     : outputPath,
		filename : 'build.js'
	},
	plugins : [
		new MiniCssExtractPlugin(),
		new HtmlWebPackPlugin({
			title    : 'Music wave',
			template : path.resolve(__dirname, 'index.ejs'),
			inject   : 'head'
		})
	],
	module  : {
		rules : [
			{
				test : /\.less$/,
				use  : [
					MiniCssExtractPlugin.loader,
					'css-loader',
					{
						loader  : 'less-loader',
						options : {
							paths : [ path.resolve(__dirname, '../node_modules') ]
						}
					}
				]
			},
			{
				test : /\.mp3$/,
				use  : [
					{
						loader  : 'file-loader',
						options : {
							outputPath : outputPath
						}
					}
				]
			}
		]
	},
	mode    : 'production'
};
