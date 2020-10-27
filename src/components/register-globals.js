// Globally register all base components for convenience, because they
// will be used very frequently. Components are registered using the
// PascalCased version of their file name.

import Vue from 'vue'
import { toPascalCase } from '@utils/stringUtils'

// https://webpack.js.org/guides/dependency-management/#require-context
const requireComponent = require.context(
  // Look for files in the current directory
  '.',
  // Do look in subdirectories
  true,
  // Only include "BaseName" prefixed .vue files
  /Base[A-Z]\w+\.(vue|js)$/
)

// For each matching file name...
requireComponent.keys().forEach((fileName) => {
  // Get the component config
  const componentConfig = requireComponent(fileName)
  // Get PascalCase name the component name
  const componentName = toPascalCase(
    // Gets the file name regardless of folder depth
    fileName
      .split('/')
      .pop()
      // Remove the file extension from the end
      .replace(/\.\w+$/, '')
  )

  // Globally register the component
  Vue.component(componentName, componentConfig.default || componentConfig)
})
