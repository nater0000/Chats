function sanitizeHTML(str) {
  // This function is from your original file.
  // It's not used on the Markdown content from prompts/responses in the final .md,
  // but kept here if other parts of your system might use it or for future reference.
  return str.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
}

function sanitizeFilename(str) {
  // From your original file
  return str.replace(/[^a-zA-Z0-9-]/g, '-').replace(/-+/g, '-').toLowerCase();
}

function addReference() {
  // From your original file
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'reference';
  input.placeholder = 'https://example.com';
  document.getElementById('referenceInputs').appendChild(input);
}

function addBlock() {
  // From your original file
  const index = document.querySelectorAll('.block').length + 1;
  const block = document.createElement('div');
  block.className = 'block';
  block.innerHTML = `
    <label>🧠 Prompt ${index}</label>
    <textarea class="prompt" rows="4"></textarea>
    <label>💬 Response ${index}</label>
    <textarea class="response" rows="4"></textarea>
  `;
  document.getElementById('promptBlocks').appendChild(block);
}

function toggleFieldset(legend) {
  // From your original file
  const fieldset = legend.closest("fieldset");
  const isExpanded = fieldset.getAttribute("aria-expanded") === "true";
  fieldset.setAttribute("aria-expanded", !isExpanded);
  const icon = legend.querySelector('.icon');
  if (icon) icon.textContent = isExpanded ? '▶️' : '🔽';
}

async function checkFilenameCollision() {
  // From your original file
  const token = document.getElementById('token').value.trim();
  const repo = document.getElementById('repo').value.trim();
  const title = document.getElementById('title').value.trim();
  const pageName = document.getElementById('customPage').value.trim();
  const path = document.getElementById('path').value.trim();

  const warning = document.getElementById('filenameWarning');
  warning.style.display = 'none';

  if (!token || (!title && !pageName)) return;

  const safeName = sanitizeFilename(pageName || title);
  const apiUrl = `https://api.github.com/repos/${repo}/contents/${path}/${safeName}.md`;

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (response.status === 200) {
      warning.style.display = 'block';
    } else if (response.status !== 404) {
      console.warn('Unexpected response when checking file:', response.status);
    }
  } catch (err) {
    console.warn('Silent fetch error while checking filename:', err);
  }
}

function generateMarkdownForSubmission() {
  const title = document.getElementById('title').value.trim();
  const author = document.getElementById('author').value.trim();
  const location = document.getElementById('location').value.trim();
  const terminal = document.getElementById('terminal').value.trim();
  const gptModel = document.getElementById('gpt').value.trim();
  const tags = document.getElementById('tags').value.trim();
  const pageName = document.getElementById('customPage').value.trim();
  const pathValue = document.getElementById('path').value.trim();

  const references = Array.from(document.querySelectorAll('.reference'))
                          .map(input => input.value.trim())
                          .filter(val => val !== '');

  const promptBlocks = Array.from(document.querySelectorAll('.block')).map(block => {
    const promptMarkdown = block.querySelector('.prompt').value; // Raw Markdown
    const responseMarkdown = block.querySelector('.response').value; // Raw Markdown
    return { prompt: promptMarkdown, response: responseMarkdown };
  });

  const today = new Date();
  const date = today.toISOString().split('T')[0];
  const time = today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const safeName = sanitizeFilename(pageName || title);

  let fileContent = `---\n`;
  fileContent += `title: "${title.replace(/"/g, '\\"')}"\n`;
  fileContent += `author: "${author.replace(/"/g, '\\"')}"\n`;
  fileContent += `date: ${date}\n`;
  fileContent += `time: ${time}\n`;
  if (location) fileContent += `location: "${location.replace(/"/g, '\\"')}"\n`;
  if (terminal) fileContent += `terminal: "${terminal.replace(/"/g, '\\"')}"\n`;
  if (gptModel) fileContent += `gpt: "${gptModel.replace(/"/g, '\\"')}"\n`;
  if (tags) fileContent += `tags: [${tags}]\n`;
  fileContent += `layout: gpt-log\n`;

  if (pageName) {
    fileContent += `permalink: /${pathValue}/${safeName}\n`;
  }

  if (references.length > 0) {
    fileContent += `references:\n`;
    references.forEach(ref => {
      fileContent += `  - "${ref.replace(/"/g, '\\"')}"\n`;
    });
  }
  fileContent += `---\n\n`; // End of front matter, blank line after

  if (title) {
    fileContent += `# ${title}\n\n`; // Markdown heading for title
  }

  promptBlocks.forEach(({ prompt, response }) => {
    fileContent += `<p class="terminal-line matrix user">user@local:~$</p>\n`; // Injected HTML
    fileContent += `\n${prompt.trim()}\n\n`; // Raw user Markdown, surrounded by blank lines

    fileContent += `<p class="terminal-line matrix gpt">gpt@remote:~$</p>\n`; // Injected HTML
    fileContent += `\n${response.trim()}\n\n`; // Raw user Markdown, surrounded by blank lines

    fileContent += `\n\n`; // Injected blank line after for separation
  });

  return fileContent;
}

function generatePreview() {
  // From your original file, modified to use generateMarkdownForSubmission
  const markdownToSubmit = generateMarkdownForSubmission();

  document.getElementById('previewBox').textContent = markdownToSubmit; // Show raw .md content
  document.getElementById('previewContainer').style.display = 'block';
  document.getElementById('confirmSubmit').style.display = 'inline-block';

  checkFilenameCollision();
}

function hidePreview() {
  // From your original file
  const box = document.getElementById('previewContainer');
  box.style.display = 'none';
  box.style.top = ''; // Reset position if needed
  box.style.left = ''; // Reset position if needed
  document.getElementById('confirmSubmit').style.display = 'none';
}

function resetPreviewPosition() {
  // From your original file
  const preview = document.getElementById("previewContainer");
  preview.style.top = "100px"; // Or your preferred default
  preview.style.left = "10%";  // Or your preferred default
}

function dragElement(element, handle) {
  // From your original file
  let posX = 0, posY = 0, mouseX = 0, mouseY = 0;
  handle.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e.preventDefault();
    mouseX = e.clientX;
    mouseY = e.clientY;
    document.onmouseup = closeDrag;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e.preventDefault();
    posX = mouseX - e.clientX;
    posY = mouseY - e.clientY;
    mouseX = e.clientX;
    mouseY = e.clientY;
    element.style.top = (element.offsetTop - posY) + "px";
    element.style.left = (element.offsetLeft - posX) + "px";
  }

  function closeDrag() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const box = document.getElementById("previewContainer"); //
  const header = document.querySelector(".preview-header"); //
  if (box && header) {
    dragElement(box, header); //
  }

  document.getElementById('logForm').addEventListener('submit', async (e) => { //
    e.preventDefault();
    const token = document.getElementById('token').value.trim();
    const repo = document.getElementById('repo').value.trim();
    const path = document.getElementById('path').value.trim();
    const title = document.getElementById('title').value.trim();
    const pageName = document.getElementById('customPage').value.trim();
    const fileName = sanitizeFilename(pageName || title);
    const filePath = `${path}/${fileName}.md`;

    // Use the new function to get the Markdown content
    const markdownFileContent = generateMarkdownForSubmission();
    // Encode for GitHub API: string -> UTF-8 bytes -> base64
    const contentEncoded = btoa(unescape(encodeURIComponent(markdownFileContent)));

    const apiUrl = `https://api.github.com/repos/${repo}/contents/${filePath}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        },
        body: JSON.stringify({
          message: `Add new GPT log entry: ${fileName}`,
          content: contentEncoded
          // To update an existing file, you'd also need its SHA hash here.
          // Your checkFilenameCollision helps avoid accidental overwrites but doesn't prevent determined ones.
        })
      });

      if (response.ok) {
        alert("✅ File created successfully!");
        document.getElementById('logForm').reset();
        hidePreview();
      } else {
        const error = await response.json();
        alert("❌ Error: " + (error.message || "Unable to create file. Check console for details."));
        console.error("GitHub API Error:", error);
      }
    } catch (err) {
      alert("❌ Request failed. Check token, repo settings, and console for details.");
      console.error("Fetch/Network Error:", err);
    }
  });

  // Initial check if fields might be pre-populated or for immediate feedback on page load
  // This was in your original file at the end of DOMContentLoaded.
  // checkFilenameCollision(); // Uncomment if you want this to run on page load.
                               // It's already called by generatePreview.
});