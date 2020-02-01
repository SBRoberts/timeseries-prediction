const { NodePlopAPI } = require("plop");

module.exports = plop => {
  // /** @type {import('plop').NodePlopAPI} */

  plop.setGenerator("component", {
    description: "Create a component",
    // User input prompts provided as arguments to the template
    prompts: [
      {
        // Raw text input
        type: "input",
        // Variable name for this input
        name: "componentName",
        // Prompt to display on command line
        message: "🤖 Component Name:"
      }
    ],
    actions: [
      {
        type: "add",
        path:
          "src/components/{{pascalCase componentName}}/{{pascalCase componentName}}.js",
        templateFile: "templates/Component.js.hbs"
      },
      {
        type: "add",
        path:
          "src/components/{{pascalCase componentName}}/{{pascalCase componentName}}Styles.js",
        templateFile: "templates/ComponentStyles.js.hbs"
      },
      {
        type: "add",
        path: "src/components/{{pascalCase componentName}}/index.js",
        templateFile: "templates/ComponentIndex.js.hbs"
      }
    ]
  });
};
