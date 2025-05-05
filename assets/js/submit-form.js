function sanitizeHTML(str) {
  return str.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
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
  if (icon) {
    icon.textContent = isExpanded ? '▶️' : '🔽';
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

  const fileName = pageName !== ''
    ? pageName.replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase()
    : title.replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase();

  const filePath = `${path}/${fileName}.md`;

  let frontMatter = `---\ntitle: ${title}\nauthor: ${author}\ndate: ${date}\ntime: ${time}\nlocation: ${location}\nterminal: ${terminal}\ngpt: ${gpt}\ntags: [${tags}]\nlayout: gpt-log`;

  if (pageName) {
    frontMatter += `\npermalink: /${path}/${fileName}`;
  }

  if (references.length > 0) {
    frontMatter += `\nreferences:\n`;
    references.forEach(ref => {
      frontMatter += `  - ${ref}\n`;
    });
  }

  frontMatter += '---\n\n';

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
  const previewBox = document.getElementById('previewBox');
  previewBox.innerHTML = finalContent;
  document.getElementById('previewContainer').style.display = 'block';
  document.getElementById('confirmSubmit').style.display = 'inline-block';
  checkFilenameCollision(); // update warning
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
  checkFilenameCollision();
});

function checkFilenameCollision() {
  const pageName = document.getElementById('customPage').value.trim();
  const title = document.getElementById('title').value.trim();
  const path = document.getElementById('path').value.trim();

  const fileName = (pageName !== '' ? pageName : title)
    .replace(/[^a-zA-Z0-9-]/g, '-')
    .toLowerCase();

  const repo = document.getElementById('repo').value.trim();
  const token = document.getElementById('token').value.trim();
  const apiUrl = `https://api.github.com/repos/${repo}/contents/${path}/${fileName}.md`;

  fetch(apiUrl, {
    method: 'GET',
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  })
    .then(response => {
      const warning = document.getElementById('filenameWarning');
      warning.style.display = response.ok ? 'block' : 'none';
    })
    .catch(() => {
      document.getElementById('filenameWarning').style.display = 'none';
    });
}
