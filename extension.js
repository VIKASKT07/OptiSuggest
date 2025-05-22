const vscode = require("vscode");
const axios = require("axios");

// Replace with your Gemini API endpoint
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyBxdL-55wm6b_lWZyTJZhavAm1eg67VQmc";

/**
 * Calls the Gemini API to fetch optimization suggestions for the given code.
 * @param {string} code - The code to analyze.
 * @returns {Promise<string>} Optimization suggestions.
 */
async function fetchOptimizationSuggestions(code) {
  try {
    const response = await axios.post(
      GEMINI_API_URL,
      {
        "contents": [
          {
            "parts": [
              {
                "text": `Suggest specific optimizations for the following code in terms of readability, performance, and space usage:
${code}

IMPORTANT: Reply only with optimization suggestions in bullet points. No introduction or conclusion.`
              }
            ]
          }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data["candidates"][0]["content"]["parts"][0]["text"];
  } catch (error) {
    console.error("Error fetching optimization suggestions:", error);
    throw new Error("Failed to fetch optimizations. Check your API or network.");
  }
}

/**
 * Activates the extension and registers the optimization command.
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  const optimizeCommand = vscode.commands.registerCommand(
    "code-analyse-code.helloWorld",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("No active editor found.");
        return;
      }

      const code = editor.document.getText();
      vscode.window.showInformationMessage("Fetching code optimization suggestions...");

      try {
        const suggestions = await fetchOptimizationSuggestions(code);

        // Show a confirmation message
        vscode.window.showInformationMessage("Optimization suggestions fetched. See Output panel.");

        // Print in Output Panel
        const outputChannel = vscode.window.createOutputChannel("Code Optimization Suggestions");
        outputChannel.clear();
        outputChannel.appendLine("💡 Code Optimization Suggestions:\n");
        outputChannel.appendLine(suggestions);
        outputChannel.show();
      } catch (error) {
        vscode.window.showErrorMessage(error.message);
      }
    }
  );

  context.subscriptions.push(optimizeCommand);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
