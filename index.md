---
layout: default
---

## Markdown Pages

{% for page in site.pages %}

{% if page.url contains '/chatsmith/' and page.name != 'index.md' %}
{% assign check = page.name | split:'.' | last %}
{% assign check_len = (page.name | size) | minus: (check | size) %}
### [{{page.name | slice: 0, check_len | replace: '-', ' ' | capitalize}}]({{page.url}})
{% endif %}

{% endfor %}

