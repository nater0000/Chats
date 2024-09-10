---
layout: default
---

## Markdown Pages

{% for page in site.pages %}

{% if page.url contains '/chatsmith/' and page.name != 'index.md' %}
{% assign check = page.name | split:'.' | last %}
{% assign check_len = check | size %}
### [{{page.name | replace: '-', ' ' | minus: check_len}}]({{page.url}})
{% endif %}

{% endfor %}

