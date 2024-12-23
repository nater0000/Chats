---
layout: default
---

## Chat Responses

{% for page in site.pages %}

{% if (page.url contains '/gemini/' or page.url contains '/chatsmith/' or page.url contains '/pages/') %}
{% assign suffix = page.name | split:'.' | last %}
{% assign pagename_len = page.name | size | minus: 3 %}
{% if page.name == 'index.html' or page.name == 'index.md' %}

{% else %}
### [{{ page.name | slice: 0, pagename_len | replace: '-', ' ' | capitalize }}]({{ page.url }})
{% endif %}
{% endif %}

{% endfor %}
### [{{ 'Chatsmith' }}]({{ relative_path | append:'/chatsmith/' }})
