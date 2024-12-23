---
layout: default
---

## Chat Responses
### [{{ 'Chatsmith /' }}]({{ relative_path | append:'/chatsmith/' }})
### [{{ 'Gemini /' }}]({{ relative_path | append:'/gemini/' }})
### [{{ 'Misc /' }}]({{ relative_path | append:'/pages/' }})
---
## Chatsmith
{% for page in site.pages %}

{% if (page.url contains '/chatsmith/') %}
{% assign suffix = page.name | split:'.' | last %}
{% assign pagename_len = page.name | size | minus: 3 %}
{% if page.name != 'index.md' %}
### [{{ page.name | slice: 0, pagename_len | replace: '-', ' ' | capitalize }}]({{ page.url }})
{% endif %}
{% endif %}

{% endfor %}
---
## Gemini
{% for page in site.pages %}

{% if (page.url contains '/gemini/') %}
{% assign suffix = page.name | split:'.' | last %}
{% assign pagename_len = page.name | size | minus: 3 %}
{% if page.name != 'index.md' %}
### [{{ page.name | slice: 0, pagename_len | replace: '-', ' ' | capitalize }}]({{ page.url }})
{% endif %}
{% endif %}

{% endfor %}
---
#### Others
{% for page in site.pages %}

{% if (page.url contains '/pages/') %}
{% assign suffix = page.name | split:'.' | last %}
{% assign pagename_len = page.name | size | minus: 3 %}
{% if page.name != 'index.md' %}
### [{{ page.name | slice: 0, pagename_len | replace: '-', ' ' | capitalize }}]({{ page.url }})
{% endif %}
{% endif %}

{% endfor %}
