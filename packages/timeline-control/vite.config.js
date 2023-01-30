import { defineConfig } from 'vite';
import pkg from './package.json';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts', // 设置入口文件
      name: `${pkg.name}`, // 起个名字，安装、引入用
      fileName: (format) => `${pkg.name}.${format}.js` // 打包后的文件名
    },
    sourcemap: true,
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    }
  },
  plugins: [dts()]
})