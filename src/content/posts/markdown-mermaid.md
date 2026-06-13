---
title: Markdown Mermaid 图表
published: 2023-10-01
pinned: false
description: 一个在 Markdown 文章中使用 Mermaid 图表的简单示例。
tags: [Markdown, 博客, Mermaid]
category: 示例
draft: false
---
# Markdown Mermaid 图表示例

本文演示如何在 Markdown 文档中使用 Mermaid 创建流程图、时序图、甘特图、类图和状态图。

## 流程图示例

流程图适合表示业务流程或算法步骤。




```mermaid
graph TD
    A[Start] --> B{Condition Check}
    B -->|Yes| C[Process Step 1]
    B -->|No| D[Process Step 2]
    C --> E[Subprocess]
    D --> E
    subgraph E [Subprocess Details]
        E1[Substep 1] --> E2[Substep 2]
        E2 --> E3[Substep 3]
    end
    E --> F{Another Decision}
    F -->|Option 1| G[Result 1]
    F -->|Option 2| H[Result 2]
    F -->|Option 3| I[Result 3]
    G --> J[End]
    H --> J
    I --> J
```

## 时序图示例

Sequence diagrams show interactions between objects over time.

```mermaid
sequenceDiagram
    participant User
    participant WebApp
    participant Server
    participant Database

    User->>WebApp: Submit Login Request
    WebApp->>Server: Send Auth Request
    Server->>Database: Query User Credentials
    Database-->>Server: Return User Data
    Server-->>WebApp: Return Auth Result
    
    alt Auth Successful
        WebApp->>User: Show Welcome Page
        WebApp->>Server: Request User Data
        Server->>Database: Get User Preferences
        Database-->>Server: Return Preferences
        Server-->>WebApp: Return User Data
        WebApp->>User: Load Personalized Interface
    else Auth Failed
        WebApp->>User: Show Error Message
        WebApp->>User: Prompt Re-entry
    end
```

## 甘特图示例

Gantt charts are perfect for displaying project schedules and timelines.

```mermaid
gantt
    title Website Development Project Timeline
    dateFormat  YYYY-MM-DD
    axisFormat  %m/%d
    
    section Design Phase
    Requirements Analysis      :a1, 2023-10-01, 7d
    UI Design                 :a2, after a1, 10d
    Prototype Creation        :a3, after a2, 5d
    
    section Development Phase
    Frontend Development      :b1, 2023-10-20, 15d
    Backend Development       :b2, after a2, 18d
    Database Design           :b3, after a1, 12d
    
    section Testing Phase
    Unit Testing              :c1, after b1, 8d
    Integration Testing       :c2, after b2, 10d
    User Acceptance Testing   :c3, after c2, 7d
    
    section Deployment
    Production Deployment     :d1, after c3, 3d
    Launch                    :milestone, after d1, 0d
```

## 类图示例

Class diagrams show the static structure of a system, including classes, attributes, methods, and their relationships.

```mermaid
classDiagram
    class User {
        +String username
        +String password
        +String email
        +Boolean active
        +login()
        +logout()
        +updateProfile()
    }
    
    class Article {
        +String title
        +String content
        +Date publishDate
        +Boolean published
        +publish()
        +edit()
        +delete()
    }
    
    class Comment {
        +String content
        +Date commentDate
        +addComment()
        +deleteComment()
    }
    
    class Category {
        +String name
        +String description
        +addArticle()
        +removeArticle()
    }
    
    User "1" -- "*" Article : writes
    User "1" -- "*" Comment : posts
    Article "1" -- "*" Comment : has
    Article "1" -- "*" Category : belongs to
```

## 状态图示例

State diagrams show the sequence of states an object goes through during its life cycle.

```mermaid
stateDiagram-v2
    [*] --> Draft
    
    Draft --> UnderReview : submit
    UnderReview --> Draft : reject
    UnderReview --> Approved : approve
    Approved --> Published : publish
    Published --> Archived : archive
    Published --> Draft : retract
    
    state Published {
        [*] --> Active
        Active --> Hidden : temporarily hide
        Hidden --> Active : restore
        Active --> [*]
        Hidden --> [*]
    }
    
    Archived --> [*]
```

## 饼图示例

饼图适合展示占比和百分比数据。

```mermaid
pie title Website Traffic Sources Analysis
    "Search Engines" : 45.6
    "Direct Access" : 30.1
    "Social Media" : 15.3
    "Referral Links" : 6.4
    "Other Sources" : 2.6
```

## 总结

Mermaid 是一个适合在 Markdown 文档中绘制图表的工具。本文展示了流程图、时序图、甘特图、类图、状态图和饼图的基本写法。

使用时只需要在代码块中指定 `mermaid` 语言，并用简洁的文本语法描述图表结构，Mermaid 会自动渲染为可视化图表。

在技术博客或项目文档中使用 Mermaid，可以让流程、结构和关系表达得更清晰。
