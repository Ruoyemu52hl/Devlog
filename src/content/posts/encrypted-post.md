---
title: 加密文章示例
published: 2024-01-15
description: 这是一篇用于测试页面加密功能的文章
encrypted: true
pinned: true
password: "123456"
passwordHint: "123456"
hideHomeContent: true
alias: "encrypted-example"
tags: ["测试", "加密"]
category: "示例"
---

这个博客模板基于 [Astro](https://astro.build/) 构建。未在本文说明的内容，可以参考 [Astro 文档](https://docs.astro.build/)。

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
| `description` | 文章摘要，会显示在首页和列表页。 |
| `image` | 文章封面路径。 |
| `tags` | 文章标签。 |
| `category` | 文章分类。 |
| `alias` | 文章别名，设置后可通过 `/posts/{alias}/` 访问。 |
| `licenseName` | 文章许可协议名称。 |
| `author` | 文章作者。 |
| `sourceLink` | 原文链接或参考来源。 |
| `draft` | 是否为草稿。 |
| `encrypted` | 是否启用密码保护。 |
| `password` | 解锁文章的密码。 |
| `passwordHint` | 密码提示，会显示在密码输入框下方。 |
| `hideHomeContent` | 是否隐藏首页、元标签、订阅源和分享预览中的公开摘要。 |

## 文章文件放在哪里



文章文件应放在 `src/content/posts/` 目录下。你也可以创建子目录来组织文章和资源。

```
src/content/posts/
├── post-1.md
└── post-2/
    ├── cover.png
    └── index.md
```

## 文章别名

你可以在 Frontmatter 中添加 `alias` 字段，为文章设置一个更友好的访问路径：

```yaml
---
title: 我的特别文章
published: 2024-01-15
alias: "my-special-article"
tags: ["示例"]
category: "技术"
---
```

设置别名后：
- 文章可以通过自定义 URL 访问，例如 `/posts/my-special-article/`
- 默认的 `/posts/{slug}/` 地址仍然可用
- RSS/Atom 订阅源会使用自定义别名
- 内部链接会自动使用自定义别名

**注意事项：**
- 别名不需要包含 `/posts/` 前缀，系统会自动添加
- 避免使用特殊字符和空格
- 推荐使用小写字母和连字符
- 确保不同文章的别名不重复
- 不要在开头或结尾添加斜杠


## 工作原理

```mermaid
graph LR
    A[用户密码] --> B[直接 AES 解密]
    B --> C{校验前缀}
    C -- 找到 "MIZUKI-VERIFY:" --> D[成功：渲染内容]
    C -- 随机内容或垃圾数据 --> E[失败：密码错误]
```

## 页面加密

你可以在 Frontmatter 中设置 `encrypted: true` 并提供 `password`，为任意文章启用密码保护：

```yaml
---
title: 我的私密文章
published: 2024-01-15
encrypted: true
password: "my-secret-password"
passwordHint: "提示：密码是某个容易记住的短语"
hideHomeContent: true
---
```

### 字段

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `encrypted` | 是 | 设置为 `true` 后启用密码保护。 |
| `password` | 是 | 用于解锁文章的密码。 |
| `passwordHint` | 否 | 显示在密码输入框下方的提示。 |
| `hideHomeContent` | 否 | 将公开摘要隐藏为 `该文章已加密`。设置密码时默认启用，设为 `false` 可显示正常摘要。 |

### 解锁框效果

解锁框会显示：
- 使用主题色的锁图标
- 密码保护标题
- 请求输入密码的说明
- 密码提示（如果提供了 `passwordHint`）
- 密码输入框和解锁按钮

输入正确密码后，内容会被解密并显示。密码会保存在当前会话中，同一会话内再次访问无需重复输入。
