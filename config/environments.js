const environments = {
  demo: {
    baseURL: process.env.BASE_URL,
  },

  qa: {
    baseURL: process.env.QA_BASE_URL || process.env.BASE_URL,
  },
};

module.exports = environments;