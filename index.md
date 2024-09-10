---
layout: default
---

## Markdown Pages

{% for page in site.pages %}

{% if page.url contains '/chatsmith/' and page.name != 'index.md' %}
{% assign check = page.name | split:'.' | last %}
{% assign check_len = (page.name | size) | minus: (check | size) %}
### [{{page.name | truncate: check_len | replace: '-', ' '}}]({{page.url}})
{% endif %}

{% endfor %}

