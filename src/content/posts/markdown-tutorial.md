---
title: Markdown 教程
published: 2025-01-20
pinned: true
description: 一个 Markdown 博客文章示例。
tags: [Markdown, 博客]
category: 示例
licenseName: "Unlicensed"
author: emn178
sourceLink: "https://github.com/emn178/markdown"
draft: false
---

# Markdown 教程

这是一篇 Markdown 写作示例，展示常用语法和扩展语法。

- 块级元素
  - 段落与换行
  - 标题
  - 引用
  - 列表
  - 代码块
  - 分隔线
  - 表格
- 行内元素
  - 链接
  - 强调
  - 行内代码
  - 图片
  - 删除线
- 其他语法
  - 自动链接
  - 反斜杠转义
- 内联 HTML

## 块级元素

### 段落与换行

#### 段落

HTML 标签：`<p>`

一个或多个空行会分隔段落。只包含**空格**或 **Tab** 的行也会被视为空行。

代码：

    This will be
    inline.

    This is second paragraph.

预览：

---

This will be
inline.

This is second paragraph.

---

#### 换行

HTML 标签：`<br />`

在一行末尾添加**两个或更多空格**，可以生成一个换行。

代码：

    This will be not
    inline.

预览：

---

This will be not  
inline.

---

### 标题

Markdown 支持两种标题写法：Setext 和 atx。

#### Setext

HTML 标签：`<h1>`、`<h2>`

使用任意数量的**等号（=）**作为 `<h1>`，使用**短横线（-）**作为 `<h2>`。

代码：

    This is an H1
    =============
    This is an H2
    -------------

预览：

---

# This is an H1

## This is an H2

---

#### atx

HTML 标签：`<h1>`、`<h2>`、`<h3>`、`<h4>`、`<h5>`、`<h6>`

在行首使用 1 到 6 个 **井号（#）**，分别对应 `<h1>` 到 `<h6>`。

代码：

    # This is an H1
    ## This is an H2
    ###### This is an H6

预览：

---

# This is an H1

## This is an H2

###### This is an H6

---

atx 标题也可以在末尾添加井号作为“闭合”标记。末尾井号的数量**不需要**和开头一致。

代码：

    # This is an H1 #
    ## This is an H2 ##
    ### This is an H3 ######

预览：

---

# This is an H1

## This is an H2

### This is an H3

---

### 引用

HTML 标签：`<blockquote>`

Markdown 使用类似邮件的 **>** 字符表示引用。多行引用时，推荐每一行前都加上 `>`。

代码：

    > This is a blockquote with two paragraphs. Lorem ipsum dolor sit amet,
    > consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus.
    > Vestibulum enim wisi, viverra nec, fringilla in, laoreet vitae, risus.
    >
    > Donec sit amet nisl. Aliquam semper ipsum sit amet velit. Suspendisse
    > id sem consectetuer libero luctus adipiscing.

预览：

---

> This is a blockquote with two paragraphs. Lorem ipsum dolor sit amet,
> consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus.
> Vestibulum enim wisi, viverra nec, fringilla in, laoreet vitae, risus.
>
> Donec sit amet nisl. Aliquam semper ipsum sit amet velit. Suspendisse
> id sem consectetuer libero luctus adipiscing.

---

Markdown 也允许只在段落第一行前添加 `>`，后续换行仍会被视为同一个引用段落。

代码：

    > This is a blockquote with two paragraphs. Lorem ipsum dolor sit amet,
    consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus.
    Vestibulum enim wisi, viverra nec, fringilla in, laoreet vitae, risus.

    > Donec sit amet nisl. Aliquam semper ipsum sit amet velit. Suspendisse
    id sem consectetuer libero luctus adipiscing.

预览：

---

> This is a blockquote with two paragraphs. Lorem ipsum dolor sit amet,
> consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus.
> Vestibulum enim wisi, viverra nec, fringilla in, laoreet vitae, risus.

> Donec sit amet nisl. Aliquam semper ipsum sit amet velit. Suspendisse
> id sem consectetuer libero luctus adipiscing.

---

引用可以嵌套，只需要增加更多层级的 `>`。

代码：

    > This is the first level of quoting.
    >
    > > This is nested blockquote.
    >
    > Back to the first level.

预览：

---

> This is the first level of quoting.
>
> > This is nested blockquote.
>
> Back to the first level.

---

引用中也可以包含其他 Markdown 元素，例如标题、列表和代码块。

代码：

    > ## This is a header.
    >
    > 1.   This is the first list item.
    > 2.   This is the second list item.
    >
    > Here's some example code:
    >
    >     return shell_exec("echo $input | $markdown_script");

预览：

---

> ## This is a header.
>
> 1.  This is the first list item.
> 2.  This is the second list item.
>
> Here's some example code:
>
>     return shell_exec("echo $input | $markdown_script");

---

### 列表

Markdown 支持有序列表和无序列表。

#### 无序列表

HTML 标签：`<ul>`

无序列表可以使用**星号（\*）**、**加号（+）**或**短横线（-）**。

代码：

    *   Red
    *   Green
    *   Blue

预览：

---

- Red
- Green
- Blue

---

等同于：

代码：

    +   Red
    +   Green
    +   Blue

也等同于：

代码：

    -   Red
    -   Green
    -   Blue

#### 有序列表

HTML 标签：`<ol>`

有序列表使用数字加英文句点：

代码：

    1.  Bird
    2.  McHale
    3.  Parish

预览：

---

1.  Bird
2.  McHale
3.  Parish

---

如果一行以“数字 + 英文句点”开头，可能会意外触发有序列表：

代码：

    1986. What a great season.

预览：

---

1986. What a great season.

---

可以用**反斜杠（\\）**转义句点，避免触发列表：

代码：

    1986\. What a great season.

预览：

---

1986\. What a great season.

---

#### 缩进

##### 列表中的引用

如果要在列表项中放入引用，引用的 `>` 也需要缩进：

代码：

    *   A list item with a blockquote:

        > This is a blockquote
        > inside a list item.

预览：

---

- A list item with a blockquote:

  > This is a blockquote
  > inside a list item.

---

##### 列表中的代码块

如果要在列表项中放入代码块，代码块需要额外缩进一次，也就是 **8 个空格**或 **2 个 Tab**。

代码：

    *   A list item with a code block:

            <code goes here>

预览：

---

- A list item with a code block:

      <code goes here>

---

##### 嵌套列表

代码：

    * A
      * A1
      * A2
    * B
    * C

预览：

---

- A
  - A1
  - A2
- B
- C

---

### 代码块

HTML 标签：`<pre>`

将每一行至少缩进 **4 个空格**或 **1 个 Tab**，即可创建缩进代码块。

代码：

    This is a normal paragraph:

        This is a code block.

预览：

---

This is a normal paragraph:

    This is a code block.

---

代码块会一直持续到遇到未缩进的行，或者文章结束。

在代码块中，**和号（&）**以及**尖括号（< 和 >）**会自动转换为 HTML 实体。

代码：

        <div class="footer">
            &copy; 2004 Foo Corporation
        </div>

预览：

---

    <div class="footer">
        &copy; 2004 Foo Corporation
    </div>

---

下面的围栏代码块和语法高亮属于扩展语法，也是更常用的写法。

#### 围栏代码块

用三个反引号包裹代码，就不需要再缩进 4 个空格。

代码：

    Here's an example:

    ```
    function test() {
      console.log("notice the blank line before this function?");
    }
    ```

预览：

---

Here's an example:

```
function test() {
  console.log("notice the blank line before this function?");
}
```

---

#### 语法高亮

在围栏代码块后添加语言标识，就可以启用语法高亮。支持的语言可参考 [GitHub Linguist](https://github.com/github/linguist/blob/master/lib/linguist/languages.yml)。

代码：

    ```ruby
    require 'redcarpet'
    markdown = Redcarpet.new("Hello World!")
    puts markdown.to_html
    ```

预览：

---

```ruby
require 'redcarpet'
markdown = Redcarpet.new("Hello World!")
puts markdown.to_html
```

---

### 分隔线

HTML 标签：`<hr />`
在单独一行中放置**三个或更多短横线（-）、星号（\*）或下划线（\_）**，即可创建分隔线。符号之间可以包含空格。

代码：

    * * *
    ***
    *****
    - - -
    ---------------------------------------
    ___

预览：

---

---

---

---

---

---

---

---

### 表格

HTML 标签：`<table>`

表格属于 Markdown 扩展语法。

使用**竖线（|）**分隔列，使用**短横线（-）**分隔表头和表体，使用**冒号（:）**控制对齐方式。

表格两侧外层竖线和对齐方式都是可选的。分隔表头时，每个单元格至少需要 3 个短横线。

代码：

```
| Left | Center | Right |
|:-----|:------:|------:|
|aaa   |bbb     |ccc    |
|ddd   |eee     |fff    |

 A | B
---|---
123|456


A |B
--|--
12|45
```

预览：

---

| Left | Center | Right |
| :--- | :----: | ----: |
| aaa  |  bbb   |   ccc |
| ddd  |  eee   |   fff |

| A   | B   |
| --- | --- |
| 123 | 456 |

| A   | B   |
| --- | --- |
| 12  | 45  |

---

## 行内元素

### 链接

HTML 标签：`<a>`

Markdown 支持两种链接写法：行内链接和引用式链接。

#### 行内链接

行内链接格式如下：`[Link Text](URL "Title")`

标题属性是可选的。

代码：

    This is [an example](http://example.com/ "Title") inline link.

    [This link](http://example.net/) has no title attribute.

预览：

---

This is [an example](http://example.com/ "Title") inline link.

[This link](http://example.net/) has no title attribute.

---

如果链接指向同一站点内的本地资源，可以使用相对路径：

代码：

    See my [About](/about/) page for details.

预览：

---

See my [About](/about/) page for details.

---

#### 引用式链接

你可以预先定义链接引用，格式如下：`[id]: URL "Title"`

标题同样是可选的。使用引用时，格式为：`[Link Text][id]`

代码：

    [id]: http://example.com/  "Optional Title Here"
    This is [an example][id] reference-style link.

预览：

---

[id]: http://example.com/ "Optional Title Here"

This is [an example][id] reference-style link.

---

也就是说，引用定义由以下部分组成：

- 方括号中的链接标识符（**不区分大小写**，最多可以缩进 3 个空格）；
- 后跟一个冒号；
- 后跟一个或多个空格或 Tab；
- 后跟链接 URL；
- URL 可以选择用尖括号包裹；
- 最后可以选择添加标题属性，标题可用双引号、单引号或括号包裹。

下面几种链接定义是等价的：

代码：

    [foo]: http://example.com/  "Optional Title Here"
    [foo]: http://example.com/  'Optional Title Here'
    [foo]: http://example.com/  (Optional Title Here)
    [foo]: <http://example.com/>  "Optional Title Here"

如果使用空方括号，链接文本本身会被作为引用名称。

代码：

    [Google]: http://google.com/
    [Google][]

预览：

---

[Google]: http://google.com/

[Google][]

---

### 强调

HTML 标签：`<em>`、`<strong>`

Markdown 使用**星号（\*）**和**下划线（\_）**表示强调。单个分隔符会生成 `<em>`，两个分隔符会生成 `<strong>`。

代码：

    *single asterisks*

    _single underscores_

    **double asterisks**

    __double underscores__

预览：

---

_single asterisks_

_single underscores_

**double asterisks**

**double underscores**

---

如果 `*` 或 `_` 两侧有空格，它们会被视为普通字符。

也可以用反斜杠进行转义：

代码：

    \*this text is surrounded by literal asterisks\*

预览：

---

\*this text is surrounded by literal asterisks\*

---

### 行内代码

HTML 标签：`<code>`

使用**反引号（`）**包裹行内代码。

代码：

    Use the `printf()` function.

预览：

---

Use the `printf()` function.

---

如果行内代码本身包含反引号，可以使用**多个反引号**作为开始和结束分隔符：

代码：

    ``There is a literal backtick (`) here.``

预览：

---

``There is a literal backtick (`) here.``

---

行内代码分隔符内部可以包含空格，也就是开始反引号后一个空格，结束反引号前一个空格。这样可以在行内代码开头或结尾显示反引号字符。

代码：

    A single backtick in a code span: `` ` ``

    A backtick-delimited string in a code span: `` `foo` ``

预览：

---

A single backtick in a code span: `` ` ``

A backtick-delimited string in a code span: `` `foo` ``

---

### 图片

HTML 标签：`<img />`

Markdown 的图片语法和链接语法类似，也支持行内写法和引用式写法。

#### 行内图片

行内图片语法如下：`![Alt text](URL "Title")`

标题属性是可选的。

代码：

    ![Alt text](/path/to/img.jpg)

    ![Alt text](/path/to/img.jpg "Optional title")

预览：

---

![Alt text](https://s2.loli.net/2024/08/20/5fszgXeOxmL3Wdv.webp)

![Alt text](https://s2.loli.net/2024/08/20/5fszgXeOxmL3Wdv.webp "Optional title")

---

也就是说，图片语法由以下部分组成：

- 一个感叹号 `!`；
- 后跟一组方括号，里面是图片的替代文本；
- 后跟一组圆括号，里面是图片 URL 或路径，以及可选的标题属性。

#### 引用式图片

引用式图片语法如下：`![Alt text][id]`

代码：

    [img id]: https://s2.loli.net/2024/08/20/5fszgXeOxmL3Wdv.webp  "Optional title attribute"
    ![Alt text][img id]

预览：

---

[img id]: https://s2.loli.net/2024/08/20/5fszgXeOxmL3Wdv.webp "Optional title attribute"

![Alt text][img id]

---

### 删除线

HTML 标签：`<del>`

删除线属于 Markdown 扩展语法。

GFM 增加了用于表示删除线文本的语法。

代码：

```
~~Mistaken text.~~
```

预览：

---

~~Mistaken text.~~

---

## 其他语法

### 自动链接

Markdown 支持一种创建“自动链接”的快捷写法：只需要用尖括号包裹 URL 或邮箱地址。

代码：

    <http://example.com/>

    <address@example.com>

预览：

---

<http://example.com/>

<address@example.com>

---

GFM 会自动识别标准 URL 并转换为链接。

代码：

```
https://github.com/emn178/markdown
```

预览：

---

https://github.com/emn178/markdown

---

### 反斜杠转义

Markdown 允许使用反斜杠转义，让原本具有特殊含义的字符按字面量显示。

代码：

    \*literal asterisks\*

预览：

---

\*literal asterisks\*

---

Markdown 支持对以下字符进行反斜杠转义：

代码：

    \   backslash
    `   backtick
    *   asterisk
    _   underscore
    {}  curly braces
    []  square brackets
    ()  parentheses
    #   hash mark
    +   plus sign
    -   minus sign (hyphen)
    .   dot
    !   exclamation mark

## 内联 HTML

对于 Markdown 语法没有覆盖的标记，可以直接使用 HTML。你不需要额外声明“切换到 HTML”，直接写标签即可。

代码：

    This is a regular paragraph.

    <table>
        <tr>
            <td>Foo</td>
        </tr>
    </table>

    This is another regular paragraph.

预览：

---

This is a regular paragraph.

<table>
    <tr>
        <td>Foo</td>
    </tr>
</table>

This is another regular paragraph.

---

需要注意，块级 HTML 标签内部的 Markdown 语法**不会被处理**。

与块级 HTML 标签不同，行内 HTML 标签中的 Markdown 语法**会被处理**。

代码：

    <span>**Work**</span>

    <div>
        **No Work**
    </div>

预览：

---

<span>**Work**</span>

<div>
  **No Work**
</div>
***
