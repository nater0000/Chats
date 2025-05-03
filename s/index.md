
---
layout: default
title: Submit GPT Log Entry
permalink: /s/
---

<section class="content">
  <h1>📝 New GPT Log Entry</h1>
  <form id="logForm">
    <input type="text" id="repo" value="nater0000/Chats" readonly hidden>

    <details open>
      <summary>🔐 GitHub Connection</summary>
      <fieldset>
        <label>🔑 GitHub Token (not saved)<small> Must have repo content write access</small></label>
        <input type="password" id="token" required>

        <label>📁 File Folder Path</label>
        <select id="path" required>
          <option value="pages" selected>pages</option>
          <option value="_gpts">_gpts</option>
          <option value="_logs">_logs</option>
        </select>
      </fieldset>
    </details>

    <details open>
      <summary>📝 Entry Metadata</summary>
      <fieldset>
        <label>🧾 Entry Title</label>
        <input type="text" id="title" class="metadata-field" required>

        <label>📝 Custom Page Name (optional)</label>
        <input type="text" id="customPage" class="metadata-field" oninput="checkFilenameCollision()">
        <div id="filenameWarning">⚠️ File with this name may already exist.</div>

        <label>👤 Author</label>
        <input type="text" id="author" class="metadata-field" value="Nathan R">

        <label>📍 Location</label>
        <input type="text" id="location" class="metadata-field" value="">

        <label>🖥 Terminal</label>
        <input type="text" id="terminal" class="metadata-field" value="">

        <label>🤖 GPT Model</label>
        <input type="text" id="gpt" class="metadata-field" value="">

        <label>🏷 Tags (comma separated)</label>
        <input type="text" id="tags" class="metadata-field" value="gpt">
      </fieldset>
    </details>

    <fieldset>
      <legend>📎 References</legend>
      <label>🔗 Reference URL(s)</label>
      <div id="referenceInputs">
        <input type="text" class="reference" placeholder="https://example.com">
      </div>
      <button type="button" class="mini" onclick="addReference()">➕ Add Another Reference</button>
    </fieldset>

    <fieldset>
      <legend>⌨️ Prompt/Response Blocks</legend>
      <div id="promptBlocks">
        <div class="block">
          <label>🧠 Prompt 1</label>
          <textarea class="prompt" rows="4"></textarea>
          <label>💬 Response 1</label>
          <textarea class="response" rows="4"></textarea>
        </div>
      </div>

      <button type="button" class="mini" onclick="addBlock()">➕ Add Prompt/Response</button>
    </fieldset>

    <button type="button" class="mini" onclick="generatePreview()">👁️ Preview Before Submit</button>
    <button type="submit" id="confirmSubmit" class="mini" style="display:none;">✅ Confirm & Submit</button>
    <button type="button" class="mini" onclick="document.getElementById('logForm').reset()">🗑 Reset Form</button>
  </form>

  <pre id="previewBox" style="display:none; position: absolute; top: 8rem; right: 2rem; width: 35%; max-width: 400px; background-color: #000; color: #b5e853; padding: 1em; border: 1px solid #444; border-radius: 6px; font-size: 0.85em; overflow-x: auto;"></pre>
</section>

<link rel="stylesheet" href="{{ '/assets/css/form.css' | relative_url }}">
<script src="{{ '/assets/js/submit-form.js' | relative_url }}"></script>
