export default {
  files: ['src/**/*.test.ts'],
  extensions: {
    ts: 'module',
  },
  nonSemVerExperiments: {
    configurableModuleFormat: true,
  },
  nodeArguments: ['--loader=ts-node/esm'],
};
