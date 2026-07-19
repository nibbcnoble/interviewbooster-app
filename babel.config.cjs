// Babel config used only by Jest (via babel-jest) to transform the project's
// ESM + JSX + TS source into something the Jest/CommonJS runtime can execute.
// Vite handles its own transforms for dev/build and does not read this file.
module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    ['@babel/preset-react', { runtime: 'automatic' }],
    ['@babel/preset-typescript', { allowDeclareFields: true }],
  ],
};
