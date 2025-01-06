---
layout: default
---
## Generated Output
### [{{ '- All Sources' }}]({{ '/' }})
### [{{ '+ Chatsmith ' }}]({{ '/chatsmith/' }})
### [{{ '+ Gemini' }}]({{ '/gemini/' }})
### [{{ '+ Other' }}]({{ '/pages/' }})
---
#### All Sources
### - Chatsmith
{% for page in site.pages %}

{% if (page.url contains '/chatsmith/' and page.name != 'index.md') %}
{% assign suffix = page.name | split:'.' | last %}
{% assign pagename_len = page.name | size | minus: 3 %}
#### [{{ page.name | slice: 0, pagename_len | replace: '-', ' ' | capitalize }}]({{ page.url }})
{% endif %}

{% endfor %}
---
### - Gemini
{% for page in site.pages %}

{% if (page.url contains '/gemini/' and page.name != 'index.md') %}
{% assign suffix = page.name | split:'.' | last %}
{% assign pagename_len = page.name | size | minus: 3 %}
#### [{{ page.name | slice: 0, pagename_len | replace: '-', ' ' | capitalize }}]({{ page.url }})
{% endif %}

{% endfor %}
---
### - Other
{% for page in site.pages %}

{% if (page.url contains '/pages/' and page.name != 'index.md') %}
{% assign suffix = page.name | split:'.' | last %}
{% assign pagename_len = page.name | size | minus: 3 %}
#### [{{ page.name | slice: 0, pagename_len | replace: '-', ' ' | capitalize }}]({{ page.url }})
{% endif %}

{% endfor %}
