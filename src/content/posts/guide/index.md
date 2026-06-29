---
title: Mizuki 简明使用指南
published: 2024-04-01
description: "如何使用这个博客模板。"
image: "./cover.webp"
tags: ["Mizuki", "博客", "自定义"]
category: 指南
draft: true
---



这个博客模板基于 [Astro](https://astro.build/) 构建。本文没有覆盖的内容，可以继续查阅 [Astro 文档](https://docs.astro.build/)。

## 文章 Frontmatter

```yaml
---
title: 我的第一篇博客文章
published: 2023-09-09
description: 这是我的 Astro 博客第一篇文章。
image: ./cover.jpg
tags: [示例, 博客]
category: 前端
draft: false
---
```




| 字段 | 说明 |
| --- | --- |
| `title` | 文章标题。 |
| `published` | 文章发布日期。 |
| `pinned` | 是否将文章置顶。 |
| `priority` | 置顶文章的优先级，数值越小越靠前。 |
| `description` | 文章摘要，会显示在首页和列表页。 |
| `image` | 文章封面路径。可以使用网络图片、`public` 目录图片，或相对当前 Markdown 文件的图片。 |
| `tags` | 文章标签。 |
| `category` | 文章分类。 |
| `licenseName` | 文章许可协议名称。 |
| `author` | 文章作者。 |
| `sourceLink` | 原文链接或参考来源。 |
| `draft` | 是否为草稿，生产环境不会显示草稿文章。 |

## 文章文件放在哪里



文章文件应放在 `src/content/posts/` 目录下。你也可以创建子目录，把文章和封面等资源放在一起，便于管理。

```
src/content/posts/
├── post-1.md
└── post-2/
    ├── cover.webp
    └── index.md
```
