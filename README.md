# Resume website generator

This code generates my static resume website using [11ty (eleventy)](https://www.11ty.dev) static site generator.

The markup is generated using [Nunjucks](https://mozilla.github.io/nunjucks/) templating engine with my [resume](https://github.com/olegr1/oleg-rybin-site/blob/main/src/_data/resume.json) in **JSON** format as the data source.

**Some of the features are:**

* Date formatting filter _("2014-06" to "June 2014")_
* Time between dates calculation filter _(Outputs "10 years" based on "2014-06" and "2024-06")_
* CSS and JS file minification and inlining
* HTML minification
* Dynamically generated **.docx* version of the resume using [DOCX](https://docx.js.org/) library

The site can be found at [https://olegrybin.com](https://olegrybin.com)

It is hosted on **Cloudflare** and is automatically built and deployed using a Cloudflare *worker* upon committing to the **main** branch of this repo.