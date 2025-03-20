import * as path from 'path';

const config = {
  mode: 'development', // 'mode' 옵션 추가
  entry: './src/views/index.hbs', // 'entry' 경로 수정
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'build.js',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/, // 'node_modules' 폴더 제외
        use: 'ts-loader',
      },
      {
        test: /\.hbs$/,
        use: 'handlebars-loader',
      },
      {
        test: /\.ya?ml$/, // 'yaml' 파일 처리
        use: 'yaml-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js', '.hbs', '.yaml', '.yml'],
  },
};

module.exports = config;
