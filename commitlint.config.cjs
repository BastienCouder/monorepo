/* eslint-disable prettier/prettier */
module.exports = {
  extends: [],
  rules: {
    'header-min-length': [2, 'always', 10],
    'plugin-name/header-start-capital': [2, 'always'],
    'plugin-name/header-end-period': [2, 'always'],
  },
  plugins: [
    {
      rules: {
        'header-start-capital': ({ raw }) => {
          return [
            /^[A-Z]/.test(raw),
            'Commit message must start with a capital letter',
          ];
        },
        'header-end-period': ({ raw }) => {
          return [/\.$/.test(raw), 'Commit message must end with a period'];
        },
      },
    },
  ],
};
