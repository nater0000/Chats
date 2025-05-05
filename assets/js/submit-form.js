function sanitizeHTML(str) {
  return str.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
}

function slugifyFilename(text) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') + '.md';
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

function addReference() {
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'reference';
  input.placeholder = 'https://example.com';
  document.getElementById('referenceInputs').appendChild(input);
}

async function checkFilenameCollision() {
  const repo = document.getElementById('repo').value.trim();
  const path = document.getElementById('path').value.trim();
  const input = document.getElementById('customPage').value.trim();
  const warn = document.getElementById('filenameWarning');
  if (!input) return warn.style.display = 'none';

  const filename = slugifyFilename(input);
  const url = `https://api.github.com/repos/${repo}/contents/${path}/${filename}`;
  try {
    const res = await fetch(url);
    warn.style.display = res.status === 200 ? 'block' : 'none';
  } catch {
    warn.style.display = 'none';
  }
}

function generateContent() {
  const title = document.getElementById('title').value.trim();
  const customPage = document.getElementById('customPage').value.trim();
  const author = document.getElementById('author').value.trim();
  const location = document.getElementById('location').value.trim();
  const terminal = document.getElementById('terminal').value.trim();
  const gpt = document.getElementById('gpt').value.trim();
  const tags = document.getElementById('tags').value.trim();
  const path = document.getElementById('path').value.trim();

  const references = Array.from(document.querySelectorAll('.reference'))
    .map(input => input.value.trim())
    .filter(val => val)
    .map(url => `  - ${url}`)
    .join('\n');

  const now = new Date();
  const date = now.toISOString().split('T')[0];
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const filename = customPage
    ? slugifyFilename(customPage)
    : slugifyFilename(title || `log-${date}`);

  const blocks = Array.from(document.querySelectorAll('.block')).map((block, i) => {
    const prompt = block.querySelector('.prompt').value.trim();
    const response = block.querySelector('.response').value.trim();
    return `
<p class="terminal-line matrix user">user@local:~$</p>
<p>${sanitizeHTML(prompt).replace(/\n/g, "<br>")}</p>

<p class="terminal-line matrix gpt">gpt@remote:~$</p>
<p>${sanitizeHTML(response).replace(/\n/g, "<br>")}</p>

<hr>`;
  }).join('\n\n');

  const frontMatter = `---\ntitle: ${title}\nauthor: ${author}\ndate: ${date}\ntime: ${time}\nlocation: ${location}\nterminal: ${terminal}\ngpt: ${gpt}\ntags: [${tags}]\nlayout: gpt-log` +
    (customPage ? `\npermalink: /${path}/${filename.replace(/\.md$/, '')}` : '') +
    (references ? `\nreferences:\n${references}` : '') +
    `\n---\n\n`;

  return { filename, content: frontMatter + blocks };
}

function generatePreview() {
  const { content } = generateContent();
  const previewBox = document.getElementById('previewBox');
  previewBox.innerHTML = `<pre><code>${content}</code></pre>`;
  previewBox.style.display = 'block';
  document.getElementById('confirmSubmit').style.display = 'inline-block';
}

document.getElementById('logForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const token = document.getElementById('token').value.trim();
  const repo = document.getElementById('repo').value.trim();
  const path = document.getElementById('path').value.trim();

  const { filename, content } = generateContent();
  const url = `https://api.github.com/repos/${repo}/contents/${path}/${filename}`;

  const payload = {
    message: `Add new GPT log: ${filename}`,
    content: btoa(unescape(encodeURIComponent(content)))
  };

  try {
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      alert('✅ Log entry submitted successfully!');
      document.getElementById('logForm').reset();
      document.getElementById('promptBlocks').innerHTML =
        '<div class="block"><label>🧠 Prompt 1</label><textarea class="prompt" rows="4"></textarea><label>💬 Response 1</label><textarea class="response" rows="4"></textarea></div>';
      document.getElementById('referenceInputs').innerHTML =
        '<input type="text" class="reference" placeholder="https://example.com">';
      document.getElementById('previewBox').style.display = 'none';
      document.getElementById('confirmSubmit').style.display = 'none';
      document.getElementById('filenameWarning').style.display = 'none';
    } else {
      const error = await res.json();
      alert(`❌ Error: ${error.message}`);
    }
  } catch (err) {
    alert('❌ Error submitting entry. Check console for details.');
    console.error(err);
  }
});
