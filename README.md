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

**✅ 阶段一：工程基建与架构搭建（已完成 - v0.5.0）**

- [x] 初始化 Git 仓库
- [x] 前端项目初始化（React + TypeScript + Vite）
- [x] 后端项目初始化（FastAPI）
- [x] 定义核心数据契约（GameState、Card、Enemy、Player）
- [x] SVG 渲染基础设施搭建
- [x] 前后端通信联调
- [x] SQLite 数据库集成与 CRUD 验证
- [x] 组件化拆分（App.tsx → 15+ 独立组件）
- [x] 完整奖励系统（卡牌池、3选1奖励、金币奖励）
- [x] 敌人意图可视化（图标+数值显示）
- [x] 休息站点系统（回复HP/升级卡牌）
- [x] 商店系统（购买/移除卡牌）
- [x] Framer Motion 动画集成
- [x] 工具函数库与游戏系统框架
- [x] 代码质量保证（Lint + TypeScript 检查通过）

## 项目结构

```
N.P.Nemo/
├── frontend/                    # 前端项目
│   ├── src/
│   │   ├── components/          # React 组件
│   │   │   ├── ErrorBoundary.tsx # 错误边界组件
│   │   │   ├── GameLayers.tsx    # 图层容器（Background/GameObjects/FX/UI）
│   │   │   ├── views/            # 视图组件（按游戏相位）
│   │   │   │   ├── MapView.tsx       # 地图界面
│   │   │   │   ├── BattleView.tsx    # 战斗界面
│   │   │   │   ├── RewardView.tsx    # 奖励选择界面（3选1卡牌）
│   │   │   │   ├── RestSiteView.tsx  # 休息站点界面（回复/升级）
│   │   │   │   ├── ShopView.tsx      # 商店界面（购买/移除卡牌）
│   │   │   │   ├── VictoryOverlay.tsx # 胜利弹窗
│   │   │   │   └── DefeatOverlay.tsx # 失败弹窗
│   │   │   └── battle/           # 战斗子组件
│   │   │       ├── CardComponent.tsx  # 单张卡牌
│   │   │       ├── EnemyPanel.tsx     # 敌人面板
│   │   │       ├── PlayerPanel.tsx    # 玩家面板
│   │   │       └── HandArea.tsx       # 手牌区域
│   │   ├── systems/             # 游戏系统框架（BattleSystem/MapSystem/RewardSystem）
│   │   ├── stores/              # Zustand 状态管理
│   │   │   ├── gameStore.ts     # 游戏状态
│   │   │   └── uiStore.ts       # UI状态
│   │   ├── services/            # API 服务层
│   │   │   └── api.ts           # 后端通信（含错误处理+camelCase转换+奖励/商店API）
│   │   ├── svg/                 # SVG 渲染模块
│   │   │   ├── SVGCanvas.tsx    # SVG 画布容器
│   │   │   └── layers/          # 图层容器
│   │   ├── types/               # TypeScript 类型定义
│   │   │   └── game.ts          # 游戏数据契约（含奖励/商店类型）
│   │   └── utils/               # 工具函数（数学工具、数组操作、颜色常量）
│   └── vite.config.ts           # Vite 配置（含代理）
├── backend/                     # 后端项目
│   ├── routers/                 # API 路由
│   │   └── game.py              # 游戏相关路由
│   ├── services/                # 业务逻辑
│   │   └── game_service.py      # 游戏服务（SQLite CRUD + 奖励/休息/商店逻辑）
│   ├── models/                  # 数据库模型
│   │   └── game.py              # 游戏数据模型
│   ├── schemas/                 # Pydantic Schema
│   │   └── game.py              # 请求/响应模型（含奖励/商店/休息Schema）
│   ├── scripts/                 # 工具脚本
│   │   └── generate_openapi.py  # OpenAPI 生成脚本
│   ├── core/                    # 核心配置
│   │   ├── config.py            # 应用配置
│   │   ├── database.py          # 数据库连接
│   │   ├── error_handler.py     # 全局错误处理中间件
│   │   └── state_machine.py     # 游戏状态机框架
│   └── main.py                  # FastAPI 入口
├── PLAN.md                      # 项目规划文档
└── README.md                    # 项目说明
```

## 快速开始

### 环境要求

- Node.js >= 18
- Python >= 3.10
- pnpm / npm / yarn

### 安装与运行

#### 前端

```bash
cd frontend
npm install
npm run dev
```

#### 后端

```bash
cd backend
python -m venv venv
.\venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn main:app --reload
```

### API 文档

后端启动后访问：
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
- OpenAPI JSON: http://localhost:8000/openapi.json

### 生成 OpenAPI 文件

```bash
cd backend
python scripts/generate_openapi.py -o openapi.json
```

### 生成前端类型（需要后端运行）

```bash
cd frontend
npm run generate:types
```

## 开发指南

详细的项目规划与阶段性目标请参阅 [PLAN.md](./PLAN.md)。

## 版本记录

| 版本 | 日期 | 内容 |
|:---|:---|:---|
| v0.1.0 | 2026-04-18 | 项目初始化，定义技术栈与四阶段规划 |
| v0.2.0 | 2026-04-18 | 完成前后端项目架构搭建，定义核心数据契约 |
| v0.2.1 | 2026-04-18 | 添加 OpenAPI 生成脚本与前端类型生成工具 |
| v0.2.2 | 2026-04-18 | 完善架构：状态机、错误处理、开发代理、错误边界组件 |
| v0.3.0 | 2026-04-18 | 阶段一核心完成：完整游戏循环（地图→战斗→奖励），前后端联调通过 |
| v0.3.1 | 2026-04-19 | 修复 SVG 交互、胜负判定、API 错误处理；添加 Victory/Defeat 界面 |
| v0.4.0 | 2026-04-19 | 阶段一完善：SQLite 数据库集成、组件化拆分（10+独立组件） |
| v0.5.0 | 2026-04-22 | **阶段一遗留问题全面完善**：<br>✅ 完整奖励系统（12张奖励卡牌池、3选1卡牌奖励、金币奖励、跳过选项）<br>✅ 敌人意图图标显示（攻击/防御/增益/减益可视化）<br>✅ 休息站点系统（30%HP回复或升级一张卡牌）<br>✅ 商店系统（10张商店卡牌池、购买/移除卡牌、金币系统）<br>✅ Framer Motion 动画集成（卡牌悬浮放大、HP条动画、入场动画）<br>✅ 工具函数库（数学工具、数组操作、颜色常量）<br>✅ 游戏系统框架（BattleSystem/MapSystem/RewardSystem 配置化）<br>✅ 代码质量优化（Lint 检查通过、TypeScript 类型检查通过） |

## 许可证

本项目采用 [MIT License](./LICENSE) 开源协议。
