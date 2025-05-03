

function addBlock() {
  const container = document.getElementById('promptBlocks');
  const count = container.querySelectorAll('.block').length + 1;
  const div = document.createElement('div');
  div.className = 'block';
  div.innerHTML = `
    <label>Prompt ${count}</label>
    <textarea class="prompt" rows="4"></textarea>
    <label>Response ${count}</label>
    <textarea class="response" rows="4"></textarea>
  `;
  container.appendChild(div);
}

function addReference() {
  const container = document.getElementById('referenceInputs');
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'reference';
  input.placeholder = 'https://example.com';
  container.appendChild(input);
}

function slugifyFilename(text) {
  return text.toLowerCase().replace(/[^a-z0-9\-]+/g, '-').replace(/^-+|-+$/g, '') + '.md';
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
  const author = document.getElementById('author').value.trim();
  const location = document.getElementById('location').value.trim();
  const terminal = document.getElementById('terminal').value.trim();
  const gpt = document.getElementById('gpt').value.trim();
  const tags = document.getElementById('tags').value.trim();
  const customPage = document.getElementById('customPage').value.trim();

  const references = Array.from(document.querySelectorAll('.reference'))
    .map(input => input.value.trim())
    .filter(val => val.length > 0)
    .map(url => `  - ${url}`)
    .join('\n');

  const now = new Date();
  const date = now.toISOString().split('T')[0];
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  let logBlocks = '';
  const prompts = document.querySelectorAll('.prompt');
  const responses = document.querySelectorAll('.response');

  for (let i = 0; i < prompts.length; i++) {
    logBlocks += `\n<p class="terminal-line matrix user">user@local:~$</p>\n\n${prompts[i].value}\n\n<p class="terminal-line matrix gpt">gpt@remote:~$</p>\n\n${responses[i].value}\n\n---\n`;
  }

  const filename = customPage ? slugifyFilename(customPage) : `${date}-${title.toLowerCase().replace(/\s+/g, '-')}.md`;

  return {
    filename,
    content: `---\ntitle: ${title}\nauthor: ${author}\ndate: ${date}\ntime: ${time}\nlocation: ${location}\nterminal: ${terminal}\ngpt: ${gpt}\ntags: [${tags}]\nreferences:\n${references || '  -'}\nlayout: gpt-log\n---\n${logBlocks}`
  };
}

function generatePreview() {
  const previewData = generateContent();
  document.getElementById('previewBox').textContent = previewData.content;
  document.getElementById('previewBox').style.display = 'block';
  document.getElementById('confirmSubmit').style.display = 'inline-block';
}

document.getElementById('logForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const token = document.getElementById('token').value.trim();
  const repo = document.getElementById('repo').value.trim();
  const path = document.getElementById('path').value.trim();

  const { filename, content } = generateContent();

  const payload = {
    message: `Add new GPT log: ${filename}`,
    content: btoa(unescape(encodeURIComponent(content)))
  };

  const apiUrl = `https://api.github.com/repos/${repo}/contents/${path}/${filename}`;

  const responseGitHub = await fetch(apiUrl, {
    method: 'PUT',
    headers: {
      'Authorization': `token ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (responseGitHub.ok) {
    alert('✅ Log entry submitted successfully!');
    document.getElementById('logForm').reset();
    document.getElementById('promptBlocks').innerHTML = '<div class="block"><label>Prompt 1</label><textarea class="prompt" rows="4"></textarea><label>Response 1</label><textarea class="response" rows="4"></textarea></div>';
    document.getElementById('referenceInputs').innerHTML = '<input type="text" class="reference" placeholder="https://example.com">';
    document.getElementById('previewBox').style.display = 'none';
    document.getElementById('confirmSubmit').style.display = 'none';
    document.getElementById('filenameWarning').style.display = 'none';
  } else {
    const error = await responseGitHub.json();
    alert('❌ Error: ' + error.message);
  }
});
