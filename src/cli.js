#!/usr/bin/env node

(async () => {
  const api = require('.')

  try {
    await api()
  } catch (error) {
    if (error.name !== 'ChildProcessError') {
      throw error
    }
    process.exit(1)
  }
})()
