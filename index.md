---
layout: default
---

## Markdown Pages

{% for page in site.pages %}

{% if page.url contains '/chatsmith/' and page.name != 'index.md' %}
### [{{page.name}}]({{page.url}})
{% endif %}

{% endfor %}

