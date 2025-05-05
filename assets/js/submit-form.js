function sanitizeHTML(str) {
  return str.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
}

function sanitizeFilename(str) {
  return str.replace(/[^a-zA-Z0-9-]/g, '-').replace(/-+/g, '-').toLowerCase();
}

function addReference() {
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'reference';
  input.placeholder = 'https://example.com';
  document.getElementById('referenceInputs').appendChild(input);
}

function addBlock() {
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
  const fieldset = legend.closest("fieldset");
  const isExpanded = fieldset.getAttribute("aria-expanded") === "true";
  fieldset.setAttribute("aria-expanded", !isExpanded);
  const icon = legend.querySelector('.icon');
  if (icon) icon.textContent = isExpanded ? '▶️' : '🔽';
}

function checkFilenameCollision() {
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
    // Do nothing for 404 — that means the file doesn't exist, which is expected
  } catch (err) {
    console.warn('Silent fetch error while checking filename:', err);
  }
}

function generatePreview() {
  const title = document.getElementById('title').value.trim();
  const pageName = document.getElementById('customPage').value.trim();
  const author = document.getElementById('author').value.trim();
  const location = document.getElementById('location').value.trim();
  const terminal = document.getElementById('terminal').value.trim();
  const gpt = document.getElementById('gpt').value.trim();
  const tags = document.getElementById('tags').value.trim();
  const path = document.getElementById('path').value.trim();
  const references = Array.from(document.querySelectorAll('.reference'))
                          .map(input => input.value.trim())
                          .filter(val => val !== '');

  const prompts = Array.from(document.querySelectorAll('.block')).map(block => {
    const prompt = block.querySelector('.prompt').value.trim();
    const response = block.querySelector('.response').value.trim();
    return { prompt, response };
  });

  const today = new Date();
  const date = today.toISOString().split('T')[0];
  const time = today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const safeName = sanitizeFilename(pageName || title);
  const filePath = `${path}/${safeName}.md`;

  let frontMatter = `---\ntitle: ${title}\nauthor: ${author}\ndate: ${date}\ntime: ${time}\nlocation: ${location}\nterminal: ${terminal}\ngpt: ${gpt}\ntags: [${tags}]\nlayout: gpt-log`;

  if (pageName) {
    frontMatter += `\npermalink: /${path}/${safeName}`;
  }

  if (references.length > 0) {
    frontMatter += `\nreferences:\n`;
    references.forEach(ref => {
      frontMatter += `  - ${ref}\n`;
    });
  }

  frontMatter += '\n---\n\n';

  const blocks = prompts.map(({ prompt, response }) => {
    return (
      `<p class="terminal-line matrix user">user@local:~$</p>\n` +
      `<p>${sanitizeHTML(prompt).replace(/\n/g, "<br>")}</p>\n\n` +
      `<p class="terminal-line matrix gpt">gpt@remote:~$</p>\n` +
      `<p>${sanitizeHTML(response).replace(/\n/g, "<br>")}</p>\n\n` +
      `<hr>`
    );
  }).join('\n\n');

  const finalContent = frontMatter + blocks;
  document.getElementById('previewBox').innerHTML = finalContent;
  document.getElementById('previewContainer').style.display = 'block';
  document.getElementById('confirmSubmit').style.display = 'inline-block';

  checkFilenameCollision();
}

function hidePreview() {
  const box = document.getElementById('previewContainer');
  box.style.display = 'none';
  box.style.top = '';
  box.style.left = '';
  document.getElementById('confirmSubmit').style.display = 'none';
}

function resetPreviewPosition() {
  const preview = document.getElementById("previewContainer");
  preview.style.top = "100px";
  preview.style.left = "10%";
}

function dragElement(element, handle) {
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
  const box = document.getElementById("previewContainer");
  const header = document.querySelector(".preview-header");
  if (box && header) {
    dragElement(box, header);
  }

  document.getElementById('logForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = document.getElementById('token').value.trim();
    const repo = document.getElementById('repo').value.trim();
    const path = document.getElementById('path').value.trim();
    const title = document.getElementById('title').value.trim();
    const pageName = document.getElementById('customPage').value.trim();
    const fileName = sanitizeFilename(pageName || title);
    const filePath = `${path}/${fileName}.md`;
    const content = btoa(unescape(encodeURIComponent(document.getElementById('previewBox').innerHTML)));

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
          content: content
        })
      });

      if (response.ok) {
        alert("✅ File created successfully!");
        document.getElementById('logForm').reset();
        hidePreview();
      } else {
        const error = await response.json();
        alert("❌ Error: " + (error.message || "Unable to create file."));
      }
    } catch (err) {
      alert("❌ Request failed. Check token and repo settings.");
    }
  });

  checkFilenameCollision();
});
