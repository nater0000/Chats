---
layout: default
title: Submit GPT Log Entry
permalink: /s/
---

<section class="content">
  <h1>📝 Submit GPT Log Entry</h1>
  <form id="logForm">
    <input type="hidden" id="repo" value="your-username/your-repo">

    <label>GitHub Token (not saved)<small>Must have repo content write access</small></label>
    <input type="password" id="token" required>

    <label>File Folder Path</label>
    <select id="path" required>
      <option value="_logs">_logs</option>
      <option value="pages" selected>pages</option>
      <option value="drafts">drafts</option>
    </select>

    <label>Entry Title</label>
    <input type="text" id="title" required>

    <label>Custom Page Name (optional)</label>
    <input type="text" id="customPage" oninput="checkFilenameCollision()">
    <div id="filenameWarning">⚠️ File with this name may already exist.</div>

    <label>Author</label>
    <input type="text" id="author" value="Nathan R">

    <label>Location</label>
    <input type="text" id="location" value="California">

    <label>Terminal</label>
    <input type="text" id="terminal" value="RAINBOW">

    <label>GPT Model</label>
    <input type="text" id="gpt" value="gpt-4-turbo">

    <label>Tags (comma separated)</label>
    <input type="text" id="tags" value="exploratory, creative dev, research, debugging">

    <label>Reference URL(s)</label>
    <div id="referenceInputs">
      <input type="text" class="reference" placeholder="https://example.com">
    </div>
    <button type="button" class="mini" onclick="addReference()">➕ Add Another Reference</button>

    <div id="promptBlocks">
      <div class="block">
        <label>Prompt 1</label>
        <textarea class="prompt" rows="4"></textarea>
        <label>Response 1</label>
        <textarea class="response" rows="4"></textarea>
      </div>
    </div>

    <button type="button" class="mini" onclick="addBlock()">➕ Add Prompt/Response</button>
    <button type="button" class="mini" onclick="generatePreview()">👁️ Preview Before Submit</button>
    <button type="submit" id="confirmSubmit" class="mini" style="display:none;">✅ Confirm & Submit</button>
    <button type="button" class="mini" onclick="document.getElementById('logForm').reset()">🗑 Reset Form</button>
  </form>

  <pre id="previewBox" style="display:none;"></pre>
</section>

<link rel="stylesheet" href="/assets/css/form.css">
<script src="/assets/js/submit-form.js"></script>
