let term = null;
let cliServerURL = "http://localhost:3000";

document.getElementById("toggleTerminalBtn").addEventListener("click", () => {
  toggleTerminal();
});

function toggleTerminal() {
  const terminalContainer = document.getElementById("terminalContainer");
  if (terminalContainer.style.display === "none") {
    terminalContainer.style.display = "block";
    if (!term) {
      term = new Terminal();

      term.open(document.getElementById("terminal"));

      term.prompt = () => {
        term.write("\r\n$ ");
      };

      setupTerminal(term);
    } else {
      term.focus();
    }
  } else {
    terminalContainer.style.display = "none";
  }
}

function setupTerminal(terminal) {
  // Ensure the terminal has focus after it's opened
  term.writeln("");

  term.focus();
  // Write the initial prompt character
  term.write("$ ");

  terminal.onKey((e) => {
    const printable =
      !e.domEvent.altKey &&
      !e.domEvent.altGraphKey &&
      !e.domEvent.ctrlKey &&
      !e.domEvent.metaKey;

    if (e.domEvent.keyCode === 13) {
      // Enter key
      const command = terminal.buffer.active
        .getLine(terminal.buffer.active.baseY + terminal.buffer.active.cursorY)
        .translateToString();
      if (command.trim() !== "") {
        if (command.trim() === "clear") {
          terminal.clear();
          terminal.prompt();
        } else {
          executeCommand(command.trim());
        }
      }
      terminal.prompt();
    } else if (e.domEvent.keyCode === 8) {
      // Backspace key
      if (terminal.buffer.active.cursorX > 0) {
        terminal.write("\b \b"); // Move cursor left, delete character, move cursor left
      }
    } else if (e.domEvent.keyCode === 46) {
      // Delete key
      if (terminal.buffer.active.cursorX < terminal.cols - 1) {
        terminal.write("\x1b[P"); // Delete character at cursor position
      }
    } else if (printable) {
      terminal.write(e.key);
    }
  });
}

function executeCommand(command) {
  // Remove the "$" character from the command
  command = command.replace(/^\$/, "");
  fetch(`${cliServerURL}/execute-command`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ command }),
  })
    .then((response) => response.text())
    .then((output) => {
      output = output.replace(/\s+/g, "");
      output = output.replace(/\\n/g, "\n");
      term.writeln(output.trim());
      term.prompt();
    })
    .catch((error) => console.error("Error executing command:", error));
}

// Prevent default paste behavior within the terminal
term.attachCustomKeyEventHandler((e) => {
  if (e.ctrlKey && e.key === "v") {
    navigator.clipboard.readText().then((text) => {
      term.write(text[0]);
    });
    return false; // Prevent default paste behavior
  } else if (e.ctrlKey && e.key === "c") {
    const selection = term.getSelection();
    if (selection) {
      navigator.clipboard.writeText(selection);
    }
    return false; // Prevent default copy behavior
  }
  return true;
});
