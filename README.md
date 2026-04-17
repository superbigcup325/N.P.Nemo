# N.P.Nemo

一款基于 SVG 矢量渲染的回合制卡牌 Roguelike 游戏，玩法灵感来源于《杀戮尖塔》。

## 项目简介

N.P.Nemo 是一个纯 SVG 渲染的卡牌游戏项目，所有视觉元素均通过手搓 SVG 实现，零图片依赖。游戏采用后端权威架构，所有游戏逻辑（卡牌结算、敌人AI、随机数生成）均在后端运行，确保游戏逻辑的一致性与可扩展性。

## 技术栈

| 层级 | 技术选型 |
|:---|:---|
| **前端** | React + TypeScript + Vite |
| **状态管理** | Zustand |
| **动画** | Framer Motion |
| **渲染** | 纯 SVG（零图片） |
| **后端** | FastAPI (Python) |
| **数据库** | SQLite + SQLAlchemy |
| **通信** | REST API |

## 当前阶段

**阶段一：工程基建与架构搭建**

- [x] 初始化 Git 仓库
- [ ] 前端项目初始化（React + TypeScript + Vite）
- [ ] 后端项目初始化（FastAPI）
- [ ] 定义核心数据契约（GameState、Card、Enemy、Player）
- [ ] SVG 渲染基础设施搭建
- [ ] 前后端通信联调

## 项目结构

```
N.P.Nemo/
├── frontend/          # 前端项目（待创建）
│   ├── src/
│   │   ├── components/   # React 组件
│   │   ├── systems/      # 游戏系统
│   │   ├── stores/       # Zustand 状态管理
│   │   ├── services/     # API 服务层
│   │   └── svg/          # SVG 渲染模块
│   └── ...
├── backend/           # 后端项目（待创建）
│   ├── routers/          # API 路由
│   ├── services/         # 业务逻辑
│   ├── models/           # 数据模型
│   ├── schemas/          # Pydantic Schema
│   └── core/             # 核心配置
├── PLAN.md            # 项目规划文档
└── README.md          # 项目说明
```

## 快速开始

### 环境要求

- Node.js >= 18
- Python >= 3.10
- pnpm / npm / yarn

### 安装与运行

（待项目初始化后补充）

## 开发指南

详细的项目规划与阶段性目标请参阅 [PLAN.md](./PLAN.md)。

## 版本记录

| 版本 | 日期 | 内容 |
|:---|:---|:---|
| v0.1.0 | 2026-04-18 | 项目初始化，定义技术栈与四阶段规划 |

## 许可证

本项目采用 [MIT License](./LICENSE) 开源协议。
