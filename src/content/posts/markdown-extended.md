---
title: Markdown 扩展功能
published: 2024-05-01
updated: 2024-11-29
description: '了解 Mizuki 支持的 Markdown 扩展功能'
image: ''
tags: [演示, 示例, Markdown, Mizuki]
category: '示例'
draft: true 
---

## GitHub 仓库卡片
你可以添加链接到 GitHub 仓库的动态卡片。页面加载时，仓库信息会从 GitHub API 获取。

::github{repo="LyraVoid/Mizuki"}

使用 `::github{repo="LyraVoid/Mizuki"}` 可以创建 GitHub 仓库卡片。

```markdown
::github{repo="LyraVoid/Mizuki"}
```

## 提示块

支持以下提示块类型：`note` `tip` `important` `warning` `caution`

:::note
即使快速浏览，也值得注意的信息。
:::

:::tip
帮助读者更顺利完成操作的补充信息。
:::

:::important
完成任务所必需的关键信息。
:::

:::warning
存在潜在风险，需要读者立即注意的内容。
:::

:::caution
某个操作可能带来的负面后果。
:::

### 基础语法

```markdown
:::note
Highlights information that users should take into account, even when skimming.
:::

:::tip
Optional information to help a user be more successful.
:::
```

### 自定义标题

提示块的标题可以自定义。

:::note[自定义标题]
这是一个带自定义标题的提示块。
:::

```markdown
:::note[自定义标题]
这是一个带自定义标题的提示块。
:::
```

### GitHub 语法

> [!TIP]
> 同样支持 [GitHub 语法](https://github.com/orgs/community/discussions/16925)。

```
> [!NOTE]
> The GitHub syntax is also supported.

> [!TIP]
> The GitHub syntax is also supported.
```

### 折叠剧透

你可以为文本添加剧透折叠效果，内容中同样支持 **Markdown** 语法。

这段内容 :spoiler[会被隐藏 **直到点击**]！

```markdown
这段内容 :spoiler[会被隐藏 **直到点击**]！
