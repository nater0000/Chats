---
layout: default
title: Submit GPT Log Entry
permalink: /s/
---

<section class="content">
  <h1>📝 New GPT Log Entry</h1>
  <form id="logForm">
    <input type="text" id="repo" value="nater0000/Chats" readonly hidden>

    <fieldset>
      <legend>🔐 GitHub Connection</legend>
      <label>GitHub Token (not saved)<small>Must have repo content write access</small></label>
      <input type="password" id="token" required>

      <label>File Folder Path</label>
      <select id="path" required>
        <option value="pages" selected>pages</option>
        <option value="_gpts">_gpts</option>
        <option value="_logs">_logs</option>
      </select>
    </fieldset>

    <fieldset>
      <legend>📝 Entry Metadata</legend>
      <label>Entry Title</label>
      <input type="text" id="title" required>

      <label>Custom Page Name (optional)</label>
      <input type="text" id="customPage" oninput="checkFilenameCollision()">
      <div id="filenameWarning">⚠️ File with this name may already exist.</div>

      <label>Author</label>
      <input type="text" id="author" value="Nathan R">

      <label>Location</label>
      <input type="text" id="location" value="">

      <label>Terminal</label>
      <input type="text" id="terminal" value="">

      <label>GPT Model</label>
      <input type="text" id="gpt" value="">

      <label>Tags (comma separated)</label>
      <input type="text" id="tags" value="gpt">
    </fieldset>

    <fieldset>
      <legend>📎 References</legend>
      <label>Reference URL(s)</label>
      <div id="referenceInputs">
        <input type="text" class="reference" placeholder="https://example.com">
      </div>
      <button type="button" class="mini" onclick="addReference()">➕ Add Another Reference</button>
    </fieldset>

    <fieldset>
      <legend>⌨️ Prompt/Response Blocks</legend>
      <div id="promptBlocks">
        <div class="block">
          <label>Prompt 1</label>
          <textarea class="prompt" rows="4"></textarea>
          <label>Response 1</label>
          <textarea class="response" rows="4"></textarea>
        </div>
      </div>

      <button type="button" class="mini" onclick="addBlock()">➕ Add Prompt/Response</button>
    </fieldset>

    <button type="button" class="mini" onclick="generatePreview()">👁️ Preview Before Submit</button>
    <button type="submit" id="confirmSubmit" class="mini" style="display:none;">✅ Confirm & Submit</button>
    <button type="button" class="mini" onclick="document.getElementById('logForm').reset()">🗑 Reset Form</button>
  </form>

  <pre id="previewBox" style="display:none;"></pre>
</section>

<link rel="stylesheet" href="{{ '/assets/css/form.css' | relative_url }}">
<script src="{{ '/assets/js/submit-form.js' | relative_url }}"></script>
