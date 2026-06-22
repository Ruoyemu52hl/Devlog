---
title: 用 Flutter + Flame 做一个像素风俯视角生存肉鸽
published: 2026-06-15
description: 从默认 Flutter 项目到单场景生存肉鸽 MVP 的完整开发记录，包括架构、动画、技能、敌人、配置表、踩坑和修复。
tags:
  - Flutter
  - Flame
  - 游戏开发
  - 像素风
  - 开发记录
category: 技术
draft: false
pinned: false
comment: false
encrypted: false
hideHomeContent: false
---

这篇文章记录我用 Flutter + Flame 做一个像素风俯视角生存肉鸽 MVP 的完整过程。项目最开始只是一个 Flutter 默认工程，后面逐步变成了一个可以运行在 Windows 和 Web 上的单场景生存游戏：玩家移动、敌人刷怪、自动瞄准、手动释放技能、拾取经验石、升级三选一、生命和经验 UI、胜利失败流程，以及一份可以直接调整数值的 JSON 配置表。

这个项目的定位不是完整地牢肉鸽，而是更接近 Vampire Survivors 的单场景俯视角生存玩法。目前第一版不追求复杂地图房间、不做局外成长、不做 Boss、不做移动端虚拟摇杆，而是先把一局游戏最核心的闭环做出来。

我把这篇文章写成一个偏详细的开发复盘。它不只是介绍最终代码，还会讲为什么这样拆结构、Flame 里哪些地方容易踩坑、角色和怪物动画为什么一开始会错、技能素材为什么要拆飞行帧和命中帧、龙卷风吸附如何避免穿墙，以及最后为什么要把数值抽到 `assets/config/game_config.json`。

注：本项目是移动应用开发技术课程的期末大作业，开发过程中我使用了 Codex、Claude Code 等智能体工具辅助完成，我在 Claude Code 环境中接入的是 DeepSeek 系列模型。但这个项目并不是简单输入一句需求后由工具自动生成成品，而是一个不断拆分需求、检查资源、阅读代码、运行验证和反复修改的过程。

在开发前，我先明确了项目范围：不做完整地牢肉鸽，而是先实现类似 Vampire Survivors 的单场景俯视角生存 MVP，包括玩家移动、敌人刷怪、自动瞄准、5 种技能、经验升级、HP/技能 UI 和胜负流程。随后我根据已有素材整理可用资源，并把功能拆成玩家、敌人、技能、地图、寻路、升级、HUD 和配置表等模块，再借助智能体工具逐步实现和调整。

实际开发中，智能体工具主要承担代码草稿生成、重复性修改和排查建议的工作；具体方案是否采用、代码是否正确、运行效果是否符合预期，都需要我结合项目目标和实际表现进行判断。例如玩家动画闪烁问题，需要检查素材帧尺寸后确认是切帧宽度错误；火球和风刃的表现问题，是因为飞行动画中混入了命中特效帧；地刺和龙卷风的位置问题，则需要把技能逻辑中心和视觉偏移拆开处理；暗影飞环的回旋逻辑和停留伤害，也需要根据实际运行效果继续调整。

我也对比了不同智能体工具在这个项目中的表现。Claude Code 在第一版实现上推进较快，但后续遇到资源读取、动画切帧、隐藏 bug 和细节修复时，调试成本较高。Codex 在理解现有代码结构、读取素材、结合截图定位问题和持续迭代方面更稳定，更适合这种需要频繁查看资源、修改代码并运行验证的 Flutter + Flame 项目。

这次经历让我更明显地感受到，智能体工具可以提高开发效率，但不能替代开发者对需求、代码和运行效果的判断。尤其是游戏项目里，很多问题不是代码能否编译，而是动画是否对齐、技能反馈是否自然、敌人行为是否合理、UI 是否遮挡画面。工具可以辅助实现，但最终仍然需要开发者理解代码、发现问题并完成验收。

# 项目目标

项目目标可以概括成一句话：用 Flutter + Flame 做一个 Windows/Web 优先的像素风俯视角生存肉鸽 MVP。

第一版我希望它至少有这些内容：

- 玩家可以用 WASD 或方向键移动。
- 开局选择一个初始技能。
- 技能槽支持数字 1-5 或鼠标点击释放。
- 技能自动寻找最近敌人作为目标。
- 有 5 种技能：火球、风刃、龙卷风、地刺、暗影飞环。
- 有两类敌人：骷髅和狗。
- 敌人会在屏幕外刷出，并向玩家寻路。
- 敌人进入攻击范围后播放攻击动画，只有命中帧才扣血。
- 敌人死亡掉落经验石。
- 玩家拾取经验石后升级，并弹出三选一升级界面。
- 游戏有生命条、经验条、技能槽、冷却遮罩和倒计时。
- 玩家死亡显示失败，倒计时结束显示胜利。
- 音效暂时不做，后续再加。

这就是一个典型的 MVP 范围：玩法闭环必须完整，但内容量和系统复杂度先控制住。否则如果一开始就做完整地牢、局外养成、背包、装备、Boss、多关卡，很容易每个系统都做一点但没有一个系统真正可玩。

# 为什么选 Flutter + Flame

如果是做 2D 游戏，很多人第一反应会是 Unity、Godot 或者 Cocos。Flutter + Flame 的优势不是它比这些引擎更专业，而是它有几个很适合这个项目的点：

- Flutter 本身跨平台，Windows 和 Web 都能跑。
- Flame 是 Flutter 生态里比较成熟的 2D 游戏框架。
- UI 可以直接用 Flutter overlay 做，弹窗、按钮、卡片会比纯游戏引擎手写 UI 更省事。
- 游戏主体可以用 Flame component 管理，实体、技能、地图、HUD 都能拆成组件。
- 对课程作业或轻量原型来说，工程复杂度低于引入完整游戏引擎。

当然它也有缺点：Flame 不像 Unity 那样自带编辑器、场景面板、Prefab、Timeline、全局光照、烘焙和一整套可视化工具。很多东西要自己组织代码完成。比如地图生成、碰撞、寻路、动画切帧、技能生命周期、HUD 渲染，都需要自己写。

所以这个项目的核心思路是：游戏逻辑用 Flame 写，复杂 UI 用 Flutter overlay 写，数值调试用 JSON 配置表解决。

# 工程结构

最终工程里，主要代码集中在 `lib/game` 下，结构大概是这样：

```text
lib/
  main.dart
  ui/
    game_overlays.dart
  game/
    roguelike_game.dart
    asset_paths.dart
    config/
      game_config.dart
    models/
      game_models.dart
    arena/
      arena_grid.dart
      pathfinder.dart
    components/
      arena_component.dart
      player_component.dart
      enemy_component.dart
      experience_gem_component.dart
      hud_component.dart
    skills/
      skill_effects.dart
      tornado_logic.dart
```

每个文件负责的事情尽量单一：

| 文件                    | 职责                                                                               |
| ----------------------- | ---------------------------------------------------------------------------------- |
| `roguelike_game.dart`   | 游戏入口，加载资源，创建世界、相机、玩家、地图，处理刷怪、技能释放、升级、胜负流程 |
| `game_models.dart`      | 技能、敌人、升级选项、局内状态等数据模型                                           |
| `game_config.dart`      | 从 JSON 加载配置，并提供默认值兜底                                                 |
| `arena_grid.dart`       | 地图网格、阻挡格、坐标转换、碰撞移动修正                                           |
| `pathfinder.dart`       | A\* 寻路                                                                           |
| `arena_component.dart`  | 地块和装饰物渲染                                                                   |
| `player_component.dart` | 玩家动画、移动、受击反馈                                                           |
| `enemy_component.dart`  | 敌人动画、寻路、攻击、死亡、受击、减速、龙卷风受控                                 |
| `skill_effects.dart`    | 5 种技能的实际表现和伤害逻辑                                                       |
| `hud_component.dart`    | Flame HUD：生命条、经验条、倒计时、技能槽                                          |
| `game_overlays.dart`    | Flutter overlay：开局选技能、升级三选一、胜利/失败弹窗                             |

这个拆分很重要。Flame 项目很容易把所有逻辑堆到一个 `Game` 类里，前期写得快，后期调技能、调敌人、改 UI 时会非常痛苦。这个项目后来能比较顺利地反复调整技能和动画，很大程度上是因为把实体和系统拆开了。

# 资源加载和路径管理

像素素材通常目录多、文件名多，而且这个项目的资源路径里有空格和中文，例如：

```text
assets/Player/The Female Adventurer - Free/Walk/walk_Down.png
assets/Terrain and trees/树1.png
assets/Skill/Wind Blade/001.png
```

如果直接在各个组件里散写字符串，后期非常容易漏改或打错。因此我把资源路径集中到了 `AssetPaths`：

```dart
class AssetPaths {
  const AssetPaths._();

  static const playerIdleDown =
      'assets/Player/The Female Adventurer - Free/Idle/Idle_Down.png';
  static const playerWalkDown =
      'assets/Player/The Female Adventurer - Free/Walk/walk_Down.png';

  static const dogWalk = 'assets/Enemy/enemy-dog/Root_Walk.png';
  static const dogAttack = 'assets/Enemy/enemy-dog/Root_Attack.png';
  static const dogDeath = 'assets/Enemy/enemy-dog/Root_Death.png';
}
```

然后在游戏加载时统一预加载图片：

```dart
@override
Future<void> onLoad() async {
  images.prefix = '';
  config = await GameConfig.loadFromAsset();
  session = GameSessionState(config: config);

  await images.loadAll(AssetPaths.allImagePaths);

  arena = ArenaGrid.generated(config: config.arena);
  pathfinder = GridPathfinder(arena);
  levelWorld = World();
}
```

这里有个细节：`images.prefix = ''`。项目中路径统一写成 `assets/...`，所以 Flame 加载和缓存读取要保持一致。否则很容易出现资源明明在 `pubspec.yaml` 里注册了，但运行时找不到。

`pubspec.yaml` 中也要注册资源目录：

```yaml
flutter:
  uses-material-design: true
  assets:
    - assets/
    - assets/config/
    - assets/Enemy/
    - assets/Player/
    - assets/Skill/
    - assets/UI/
```

现在项目是按多个子目录显式注册的，这样 Web 和 Windows 构建都能正确打包资源。

# 游戏入口：RoguelikeGame

整个游戏最核心的入口是 `RoguelikeGame`。它继承自 `FlameGame`，并混入 `KeyboardEvents` 处理键盘输入：

```dart
class RoguelikeGame extends FlameGame with KeyboardEvents {
  static const startOverlay = 'start';
  static const levelUpOverlay = 'levelUp';
  static const victoryOverlay = 'victory';
  static const gameOverOverlay = 'gameOver';

  final Random random = Random(17);
  late final GameConfig config;
  late final GameSessionState session;
  late final Vector2 viewportSize;
  late final World levelWorld;
  late final ArenaGrid arena;
  late final GridPathfinder pathfinder;
  late final PlayerComponent player;

  final List<EnemyComponent> _enemies = <EnemyComponent>[];
  double _spawnTimer = 0;
}
```

这个类里做几件大事：

- 加载 JSON 配置。
- 加载图片资源。
- 创建地图网格和 A\* 寻路器。
- 创建 Flame 的 `World` 和 `CameraComponent`。
- 创建玩家、地图、HUD。
- 处理键盘输入。
- 处理技能释放。
- 控制刷怪。
- 控制升级暂停、胜利暂停、失败暂停。

`onLoad` 是初始化入口：

```dart
@override
Future<void> onLoad() async {
  images.prefix = '';
  config = await GameConfig.loadFromAsset();
  session = GameSessionState(config: config);
  viewportSize = Vector2(
    config.camera.viewportWidth,
    config.camera.viewportHeight,
  );
  _spawnTimer = config.spawn.initialTimer;
  await images.loadAll(AssetPaths.allImagePaths);

  arena = ArenaGrid.generated(config: config.arena);
  pathfinder = GridPathfinder(arena);
  levelWorld = World();
  camera = CameraComponent.withFixedResolution(
    world: levelWorld,
    width: viewportSize.x,
    height: viewportSize.y,
  );
  camera.viewfinder.anchor = Anchor.center;

  await addAll(<Component>[levelWorld, camera]);
  await levelWorld.add(ArenaComponent(arena));

  player = PlayerComponent()..position = arena.center;
  await levelWorld.add(player);
  await camera.viewport.add(HudComponent(viewportSize));
  _syncCameraToPlayer();
  pauseEngine();
}
```

这里我用了 `CameraComponent.withFixedResolution`。这对像素风游戏很实用：逻辑视口固定，真实窗口缩放由 Flutter/Flame 处理。后来我想“调低摄像机高度”，实际就是把配置里的逻辑视口从 `960x540` 调小到 `864x486`，画面会更近，玩家和怪物看起来更大。

```json
"camera": {
  "viewportWidth": 864,
  "viewportHeight": 486
}
```

这也是后来把摄像机参数抽进配置表的原因：如果每次都进代码里改 `fixedViewport`，调试体验会很差。

# 输入处理：WASD、方向键和技能快捷键

移动输入在 `onKeyEvent` 里处理：

```dart
@override
KeyEventResult onKeyEvent(
  KeyEvent event,
  Set<LogicalKeyboardKey> keysPressed,
) {
  _updateMoveDirection(keysPressed);
  if (event is KeyDownEvent) {
    final index = _slotIndexForKey(event.logicalKey);
    if (index != null) {
      castSkillSlot(index);
    }
  }
  return KeyEventResult.handled;
}
```

`keysPressed` 是当前按住的所有键，所以移动方向不是只看当前事件，而是根据按键集合计算：

```dart
void _updateMoveDirection(Set<LogicalKeyboardKey> keysPressed) {
  final direction = Vector2.zero();
  if (keysPressed.contains(LogicalKeyboardKey.keyW) ||
      keysPressed.contains(LogicalKeyboardKey.arrowUp)) {
    direction.y -= 1;
  }
  if (keysPressed.contains(LogicalKeyboardKey.keyS) ||
      keysPressed.contains(LogicalKeyboardKey.arrowDown)) {
    direction.y += 1;
  }
  if (keysPressed.contains(LogicalKeyboardKey.keyA) ||
      keysPressed.contains(LogicalKeyboardKey.arrowLeft)) {
    direction.x -= 1;
  }
  if (keysPressed.contains(LogicalKeyboardKey.keyD) ||
      keysPressed.contains(LogicalKeyboardKey.arrowRight)) {
    direction.x += 1;
  }
  player.moveDirection = direction.length2 == 0
      ? direction
      : direction.normalized();
}
```

这里 `normalized()` 很关键。否则斜向移动时速度会变成横向速度的 `sqrt(2)` 倍，玩家按 W+D 会比只按 W 更快。

# 局内状态：GameSessionState

我把“这一局游戏”的状态放在 `GameSessionState`：

```dart
class GameSessionState {
  final GameConfig config;
  final double duration;
  double elapsed = 0;
  double maxHp;
  double hp;
  double moveSpeed;
  int level = 1;
  int xp = 0;
  int xpToNext;
  bool hasStarted = false;
  bool isVictory = false;
  bool isGameOver = false;
  final List<SkillInstance> skillSlots = <SkillInstance>[];
}
```

这个类不负责渲染，也不依赖 Flame 组件。它只描述局内数值和流程状态，比如：

- 当前是否已经开始。
- 是否胜利或失败。
- 当前生命、最大生命、移速。
- 当前等级、经验、下一级经验需求。
- 已解锁技能槽和技能冷却。

这样做好处是可以单独写测试，不需要启动 Flame 游戏。比如经验升级和胜利计时可以直接测：

```dart
test('xp threshold levels up and timer creates victory', () {
  final session = GameSessionState(duration: 300)
    ..startWithSkill(SkillType.fireBall);

  final leveled = session.addXp(session.xpToNext);
  session.tick(300);

  expect(leveled, isTrue);
  expect(session.level, 2);
  expect(session.isVictory, isTrue);
});
```

经验成长公式后来也抽到了配置表：

```dart
xpToNext =
    (xpToNext * config.upgrades.xpGrowthMultiplier +
            config.upgrades.xpGrowthFlat)
        .round();
```

对应 JSON：

```json
"upgrades": {
  "startingXpToNext": 10,
  "xpGrowthMultiplier": 1.22,
  "xpGrowthFlat": 6,
  "maxHealthIncrease": 18,
  "moveSpeedIncrease": 12
}
```

这样我可以直接调升级节奏，不用重新进代码里找常量。

# 地图：网格、阻挡和随机装饰

这个项目的地图不是 Tiled 地图，而是程序生成的网格大地图。每个格子默认 32 像素，当前地图是 `100x100` 格。

核心数据结构是 `ArenaGrid`：

```dart
class ArenaGrid {
  ArenaGrid({
    required this.width,
    required this.height,
    required this.tileSize,
    Set<GridPoint>? blockedCells,
    List<ArenaDecoration>? decorations,
  }) : blockedCells = blockedCells ?? <GridPoint>{},
       decorations = decorations ?? <ArenaDecoration>[];

  final int width;
  final int height;
  final double tileSize;
  final Set<GridPoint> blockedCells;
  final List<ArenaDecoration> decorations;

  double get worldWidth => width * tileSize;
  double get worldHeight => height * tileSize;
  Vector2 get center => Vector2(worldWidth / 2, worldHeight / 2);
}
```

地图里有两类装饰：

- 树、石头：阻挡移动。
- 花草：只做视觉装饰，不阻挡移动。

生成时会给玩家出生点周围留安全区：

```dart
bool inSafeZone(GridPoint cell) {
  return (cell.x - safeCenter.x).abs() <= arenaConfig.safeRadius &&
      (cell.y - safeCenter.y).abs() <= arenaConfig.safeRadius;
}
```

移动碰撞不是复杂物理，而是网格碰撞。实体移动前会计算目标位置是否可占据：

```dart
bool canOccupy(Vector2 position, double radius) {
  final points = <Vector2>[
    Vector2(position.x - radius, position.y - radius),
    Vector2(position.x + radius, position.y - radius),
    Vector2(position.x - radius, position.y + radius),
    Vector2(position.x + radius, position.y + radius),
    position,
  ];
  return points.every((point) => isWalkableCell(worldToCell(point)));
}
```

移动修正用的是一个很实用的简化方式：如果完整移动不行，就尝试只沿 X 移动，再尝试只沿 Y 移动。这样实体撞到障碍时会沿边缘滑动，而不是完全停死。

```dart
Vector2 resolveMovement(Vector2 from, Vector2 desired, double radius) {
  final clamped = Vector2(
    desired.x.clamp(radius, worldWidth - radius).toDouble(),
    desired.y.clamp(radius, worldHeight - radius).toDouble(),
  );
  if (canOccupy(clamped, radius)) {
    return clamped;
  }

  final xOnly = Vector2(clamped.x, from.y);
  if (canOccupy(xOnly, radius)) {
    return xOnly;
  }

  final yOnly = Vector2(from.x, clamped.y);
  if (canOccupy(yOnly, radius)) {
    return yOnly;
  }

  return from.clone();
}
```

这段逻辑也被龙卷风吸附复用了。也就是说，龙卷风拉怪时不是强行改位置，而是通过同样的 `resolveMovement`，因此敌人不会被吸穿树和石头。

# 地面贴图从规律到不规律

一开始地面土块生成用过类似 `(x + y) % 9` 的规则，结果画面出现很明显的规律斜线。像素风地图最怕这种“假随机”，玩家一眼就能看出规律。

后来改成了基于坐标哈希的噪声：

```dart
int _tileNoise(int x, int y) {
  var hash = x * 374761393 + y * 668265263 + game.config.arena.dirtNoiseSeed;
  hash = (hash ^ (hash >> 13)) * 1274126177;
  hash = hash ^ (hash >> 16);
  return hash.abs() % 100;
}
```

再用阈值决定是否使用土块：

```dart
bool _shouldUseDirtTile(int x, int y) {
  final config = game.config.arena;
  final value = _tileNoise(x, y);
  if (value >= config.dirtThreshold) {
    return false;
  }

  final neighborCount =
      (_tileNoise(x - 1, y) < config.dirtThreshold ? 1 : 0) +
      (_tileNoise(x + 1, y) < config.dirtThreshold ? 1 : 0) +
      (_tileNoise(x, y - 1) < config.dirtThreshold ? 1 : 0) +
      (_tileNoise(x, y + 1) < config.dirtThreshold ? 1 : 0);

  return neighborCount <= config.dirtNeighborLimit ||
      value < config.dirtClusterThreshold;
}
```

这些参数也进了配置表：

```json
"arena": {
  "dirtNoiseSeed": 24301,
  "dirtThreshold": 14,
  "dirtClusterThreshold": 6,
  "dirtNeighborLimit": 1
}
```

这个改动不复杂，但对画面观感影响很大。规律斜线消失后，地图看起来更自然。

# 敌人寻路：低频 A\*

敌人不能只是直线冲向玩家，因为地图上有树和石头。如果直线移动，敌人会被障碍卡住。所以项目里实现了网格 A\* 寻路。

敌人每隔一段时间重新计算路径：

```dart
void _updateChase(double dt) {
  _pathTimer -= dt;
  if (_pathTimer <= 0 || _path.isEmpty) {
    _pathTimer = definition.pathRefreshInterval;
    final start = game.arena.worldToCell(position);
    final goal = game.arena.worldToCell(game.player.position);
    _path = game.pathfinder.findPath(start, goal);
    _pathIndex = _path.length > 1 ? 1 : 0;
  }

  Vector2 target;
  if (_path.isNotEmpty && _pathIndex < _path.length) {
    target = game.arena.cellCenter(_path[_pathIndex]);
    if (position.distanceTo(target) < 6 && _pathIndex < _path.length - 1) {
      _pathIndex += 1;
      target = game.arena.cellCenter(_path[_pathIndex]);
    }
  } else {
    target = game.player.position;
  }

  final toTarget = target - position;
  if (toTarget.length2 == 0) {
    return;
  }
  _facing = toTarget.normalized();
  _setAnimation(_walkAnimationForFacing());
  final desired =
      position + _facing * definition.speed * _slowMultiplier * dt;
  position = game.arena.resolveMovement(position, desired, bodyRadius);
}
```

这里没有每帧重算 A\*，而是用 `pathRefreshInterval` 控制重算频率。当前默认是 `0.45` 秒。这样敌人会持续追玩家，但不会每帧都做寻路计算。

对应配置：

```json
"pathRefreshInterval": 0.45
```

如果后期敌人数量更多，可以继续优化，比如：

- 分帧计算 A\*。
- 用流场寻路替代每个敌人单独 A\*。
- 距离玩家很远的敌人降低寻路频率。
- 只在玩家跨格后重新寻路。

但对当前 MVP 来说，低频 A\* 已经够用。

# 敌人攻击：动画不是伤害本身

敌人进入攻击范围后会播放攻击动画，但不能动画一开始就扣血。更合理的做法是：攻击动画播放到某个命中时间点时，如果玩家仍在范围内，才扣血。

代码里用 `_attackElapsed` 和 `_attackHasHit` 控制：

```dart
void _updateAttack(double dt) {
  if (state != EnemyState.attacking) {
    state = EnemyState.attacking;
    _attackElapsed = 0;
    _attackHasHit = false;
    final attackDirection = game.player.position - position;
    if (attackDirection.length2 > 0) {
      _facing = attackDirection.normalized();
    }
    _setAnimation(_attackAnimationForFacing(), reset: true);
  }

  _attackElapsed += dt;
  if (!_attackHasHit && _attackElapsed >= definition.hitTime) {
    _attackHasHit = true;
    final playerDistance = position.distanceTo(game.player.position);
    if (playerDistance <= definition.attackRange + 10) {
      game.damagePlayer(definition.attackDamage);
    }
  }

  if (_attackElapsed >= definition.attackDuration) {
    state = EnemyState.chasing;
    _setAnimation(_walkAnimationForFacing());
    _attackElapsed = 0;
    _attackHasHit = false;
  }
}
```

这让攻击有了“前摇”和“命中帧”。玩家如果在命中帧前离开范围，就不会受到伤害。

敌人定义里有这些参数：

```json
"attackRange": 44,
"attackDamage": 10,
"attackDuration": 0.9,
"hitTime": 0.42
```

这几个数值决定了敌人的手感。`hitTime` 太早，玩家会感觉敌人刚抬手就打到；太晚，敌人会显得迟钝。

# 动画系统：横条帧和网格帧

项目中有两种常见动画素材。

第一种是横向排列的一行序列帧，例如玩家、骷髅的一些动作。这种用 `stripAnimation`：

```dart
SpriteAnimation stripAnimation(
  String path, {
  required int frames,
  required double stepTime,
  bool loop = true,
  Vector2? frameSize,
}) {
  final image = images.fromCache(path);
  final resolvedFrameSize = frameSize ?? Vector2(64, 64);
  final sprites = List<Sprite>.generate(
    frames,
    (index) => Sprite(
      image,
      srcPosition: Vector2(index * resolvedFrameSize.x, 0),
      srcSize: resolvedFrameSize,
    ),
  );
  return SpriteAnimation.spriteList(sprites, stepTime: stepTime, loop: loop);
}
```

第二种是多行多列的网格动画，比如狗的四方向动画。它用 `gridAnimation`：

```dart
SpriteAnimation gridAnimation(
  String path, {
  required int row,
  required int frames,
  required double stepTime,
  bool loop = true,
}) {
  final image = images.fromCache(path);
  final sprites = List<Sprite>.generate(
    frames,
    (index) => Sprite(
      image,
      srcPosition: Vector2(index * 64, row * 64),
      srcSize: Vector2.all(64),
    ),
  );
  return SpriteAnimation.spriteList(sprites, stepTime: stepTime, loop: loop);
}
```

这个拆分解决了后面很多动画问题。因为不同资源的排布方式不同，如果所有动画都当成一行横条切，会很快出错。

# 踩坑一：玩家动画一闪一闪

项目中比较早遇到的问题是：玩家动画看起来一闪一闪，像是在直接播放一整张序列帧图，而不是按正确帧切。

根因是玩家素材不是默认的 `64x64`，而是 `48x64`。如果按 `64x64` 切，Flame 每一帧都会截到错误区域。结果就是有些帧包含旁边帧的一部分，有些帧为空或错位，视觉上就像闪烁。

修复方式是给玩家动画显式指定帧尺寸：

```dart
PlayerVisualState.walkDown: game.stripAnimation(
  AssetPaths.playerWalkDown,
  frames: 8,
  stepTime: 0.11,
  frameSize: Vector2(48, 64),
),
```

玩家组件本身也设置成同样的显示比例：

```dart
PlayerComponent()
  : super(size: Vector2(48, 64), anchor: Anchor.center, priority: 50);
```

这个问题给我的教训是：像素动画不要假设每张图都是 `64x64`。必须先确认素材的帧尺寸、行列数量和方向排列。

# 踩坑二：狗只会朝左走

狗的移动动画是一张 4 行 x 4 列的图，每一行代表一个方向：

- 第 0 行：向上/背面。
- 第 1 行：向左。
- 第 2 行：向右。
- 第 3 行：向下/正面。

一开始只用了第二行，所以狗无论怎么移动都朝左。修复方式是根据当前移动方向选择行：

```dart
int _dogRowForFacing() {
  final absX = _facing.x.abs();
  final absY = _facing.y.abs();
  if (absY >= absX && _facing.y < -0.2) {
    return 0;
  }
  if (absY >= absX && _facing.y > 0.2) {
    return 3;
  }
  return _facing.x >= 0 ? 2 : 1;
}
```

加载时把四行都生成成动画：

```dart
for (var row = 0; row < 4; row += 1) {
  _dogWalkAnimations[row] = game.gridAnimation(
    AssetPaths.dogWalk,
    row: row,
    frames: 4,
    stepTime: 0.12,
  );
  _dogAttackAnimations[row] = game.gridAnimation(
    AssetPaths.dogAttack,
    row: row,
    frames: 4,
    stepTime: definition.attackDuration / 4,
    loop: false,
  );
  _dogDeathAnimations[row] = game.gridAnimation(
    AssetPaths.dogDeath,
    row: row,
    frames: 4,
    stepTime: 0.14,
    loop: false,
  );
}
```

这样狗的移动、攻击和死亡都有了四方向动画。

# 踩坑三：骷髅没有完整四方向死亡素材

骷髅素材和狗不一样。狗有四方向走路、攻击、死亡图；骷髅有前、后、侧面的走路和攻击图，但没有完整死亡动画资源。

所以骷髅处理方式是：

- 上方向使用 Back。
- 下方向使用 F。
- 左右使用 34F，其中左方向通过 `scale.x = -1` 水平翻转。
- 死亡没有动画，死亡后直接掉落经验并移除。

方向判断：

```dart
int _skeletonDirectionKey() {
  final absX = _facing.x.abs();
  final absY = _facing.y.abs();
  if (absY >= absX && _facing.y < -0.2) {
    return 0;
  }
  if (absY >= absX && _facing.y > 0.2) {
    return 2;
  }
  return 1;
}
```

水平翻转：

```dart
void _applyFacingFlip() {
  if (definition.kind == EnemyKind.skeleton &&
      _skeletonDirectionKey() == 1 &&
      _facing.x < 0) {
    scale.x = -1;
  } else {
    scale.x = 1;
  }
}
```

这也是项目里一个比较实际的取舍：不要为了“完美四方向死亡动画”强行做假效果。素材没有就先承认没有，等后续补资源再做。

# 技能系统总览

技能系统的核心模型是 `SkillDefinition` 和 `SkillInstance`。

`SkillInstance` 表示玩家已经解锁的某个技能，包括等级和冷却：

```dart
class SkillInstance {
  SkillInstance({
    required this.type,
    this.level = 1,
    this.cooldownRemaining = 0,
    GameConfig? config,
  }) : config = config ?? GameConfig.defaults();

  final SkillType type;
  final GameConfig config;
  int level;
  double cooldownRemaining;

  SkillDefinition get definition =>
      SkillDefinition.forLevel(type, level, config);
  bool get canCast => cooldownRemaining <= 0;
  bool get canUpgrade => level < config.upgrades.maxSkillLevel;
}
```

`SkillDefinition` 是根据技能类型、等级和配置表计算出来的最终数值：

```dart
static SkillDefinition forLevel(
  SkillType type,
  int level, [
  GameConfig? config,
]) {
  final rank = max(0, level - 1);
  final tuning = (config ?? GameConfig.defaults()).skills.forKey(
    type.configKey,
  );

  return SkillDefinition(
    type: type,
    cooldown: max(
      tuning.minCooldown,
      tuning.cooldownBase - rank * tuning.cooldownReductionPerLevel,
    ),
    damage: tuning.damageBase + rank * tuning.damagePerLevel,
    range: tuning.rangeBase + rank * tuning.rangePerLevel,
    radius: tuning.radiusBase + rank * tuning.radiusPerLevel,
    duration: tuning.durationBase + rank * tuning.durationPerLevel,
    pullSpeed: tuning.pullSpeedBase + rank * tuning.pullSpeedPerLevel,
    tickInterval: tuning.tickInterval,
    pierce: tuning.pierceBase + rank * tuning.piercePerLevel,
  );
}
```

技能释放入口在 `RoguelikeGame.castSkillSlot`：

```dart
void castSkillSlot(int index) {
  if (!session.isPlaying) {
    return;
  }
  final skill = session.skillAtSlot(index);
  if (skill == null || !skill.canCast) {
    return;
  }
  final definition = skill.definition;
  final target = findNearestEnemy(definition.range);
  if (target == null) {
    return;
  }

  final targetPosition = target.position.clone();
  final start = player.position.clone();
  final effect = switch (skill.type) {
    SkillType.fireBall => FireBallComponent(
      definition: definition,
      start: start,
      target: targetPosition,
    ),
    SkillType.windBlade => WindBladeComponent(
      definition: definition,
      start: start,
      target: targetPosition,
    ),
    SkillType.tornado => TornadoComponent(
      definition: definition,
      center: targetPosition,
    ),
    SkillType.earthSpike => EarthSpikeComponent(
      definition: definition,
      center: targetPosition,
    ),
    SkillType.shadowRing => throw StateError('Shadow ring is handled above.'),
  };
  skill.triggerCooldown();
  levelWorld.add(effect);
}
```

除了暗影飞环需要特殊处理多个飞环，其他技能都可以通过 switch 创建对应组件。

# 火球：飞行帧和爆炸帧必须分离

火球一开始的问题是：飞行动画里包含了爆炸特效帧。结果火球还没命中时，飞行过程中就会播放爆炸，看起来很怪。

修复方式是：

- 飞行组件只使用前 5 帧。
- 命中后生成爆炸组件，爆炸组件使用第 6-10 帧。

飞行火球：

```dart
class FireBallComponent extends SkillEffectComponent {
  FireBallComponent({
    required super.definition,
    required Vector2 start,
    required Vector2 target,
  }) : _direction = (target - start).normalized(),
       super(position: start, size: Vector2.all(definition.visualSize)) {
    angle = atan2(_direction.y, _direction.x);
  }

  @override
  Future<void> onLoad() async {
    animation = game.skillAnimation(
      SkillType.fireBall,
      stepTime: 0.055,
      frameCount: 5,
    );
  }
}
```

命中爆炸：

```dart
class FireBallExplosionComponent extends SkillEffectComponent {
  @override
  Future<void> onLoad() async {
    animation = game.skillAnimation(
      SkillType.fireBall,
      stepTime: 0.07,
      loop: false,
      startFrame: 5,
    );
    angle = _directionAngle;
  }
}
```

命中逻辑：

```dart
for (final enemy in game.enemiesSnapshot) {
  if (enemy.position.distanceTo(position) <= definition.hitRadius) {
    game.levelWorld.add(
      FireBallExplosionComponent(
        definition: definition,
        center: position.clone(),
        directionAngle: angle,
      ),
    );
    game.damageEnemiesInRadius(
      position,
      definition.radius,
      definition.damage,
    );
    removeFromParent();
    return;
  }
}
```

后来火球的大小、伤害、范围、速度都抽成配置：

```json
"fireBall": {
  "damageBase": 44,
  "damagePerLevel": 16,
  "radiusBase": 72,
  "radiusPerLevel": 6,
  "speed": 264,
  "visualSize": 108,
  "hitRadius": 46,
  "effectDuration": 0.36
}
```

`visualSize` 控制动画显示大小，`radiusBase` 控制爆炸伤害半径，`hitRadius` 控制飞行中是否撞到敌人。这三个值分开很重要，否则调大火球贴图时会意外改变伤害范围。

# 风刃：穿透弹道和命中特效

风刃也遇到了类似问题：飞行动画包含了命中特效帧。因此修复方式和火球一样，飞行帧和命中帧拆开。

飞行动画：

```dart
animation = game.skillAnimation(
  SkillType.windBlade,
  stepTime: 0.045,
  frameCount: 5,
);
```

命中特效：

```dart
animation = game.skillAnimation(
  SkillType.windBlade,
  stepTime: 0.06,
  loop: false,
  startFrame: 5,
);
```

风刃和火球的区别是风刃会穿透多个敌人，所以它需要记录已经命中过的敌人：

```dart
final Set<EnemyComponent> _hit = <EnemyComponent>{};

for (final enemy in game.enemiesSnapshot) {
  if (_hit.contains(enemy)) {
    continue;
  }
  if (enemy.position.distanceTo(position) <= definition.hitRadius) {
    _hit.add(enemy);
    enemy.takeDamage(definition.damage);
    if (_hit.length >= definition.pierce) {
      removeFromParent();
      return;
    }
  }
}
```

这里用 `Set<EnemyComponent>` 防止同一个风刃在多帧内重复伤害同一个敌人。`definition.pierce` 决定最多命中几个敌人。

# 龙卷风：持续 AoE + 吸附 + 不穿墙

龙卷风是这个项目里逻辑稍微复杂一点的技能。它不是弹体，而是在目标点生成一个持续 AoE：

- 持续一段时间。
- 每隔 `tickInterval` 造成一次伤害。
- 每帧把范围内敌人往中心拉。
- 被拉扯的敌人不能穿过树石障碍。
- 被拉扯时会打断当前攻击状态。

组件里每帧处理吸附：

```dart
for (final enemy in game.enemiesSnapshot) {
  if (enemy.position.distanceTo(position) <= definition.radius) {
    enemy.applyTornadoPull(position, definition, dt);
  }
}
```

周期伤害：

```dart
if (_tick <= 0) {
  _tick = definition.tickInterval;
  game.damageEnemiesInRadius(
    position,
    definition.radius,
    definition.damage,
    flashDuration: definition.tickInterval + 0.08,
  );
}
```

敌人被吸附时：

```dart
void applyTornadoPull(Vector2 center, SkillDefinition definition, double dt) {
  if (!isAlive) {
    return;
  }
  interruptAttack();
  state = EnemyState.controlled;
  _controlledTimer = 0.12;
  position = TornadoLogic.pullPosition(
    grid: game.arena,
    current: position,
    center: center,
    radius: definition.radius,
    pullSpeed: definition.pullSpeed,
    dt: dt,
    bodyRadius: bodyRadius,
  );
}
```

这里的关键是 `TornadoLogic.pullPosition` 不直接返回中心方向的新坐标，而是通过地图的 `resolveMovement` 做碰撞修正。这样敌人被吸向中心时，如果中间有树或石头，会沿可走方向滑动或停止，而不是穿过去。

龙卷风还有一个视觉问题：动画看起来不在目标圆心。修复时我把“伤害圆心”和“动画偏移”分开：

```dart
canvas.save();
canvas.translate(size.x / 2, size.y / 2);
canvas.drawCircle(
  Offset.zero,
  definition.radius,
  Paint()..color = const Color(0x3338D7FF),
);
canvas.restore();

canvas.save();
canvas.translate(definition.animationOffsetX, definition.animationOffsetY);
super.render(canvas);
canvas.restore();
```

这样 `position` 永远是技能逻辑中心，`animationOffsetX/Y` 只影响视觉。对应配置：

```json
"tornado": {
  "radiusBase": 88,
  "radiusPerLevel": 10,
  "durationBase": 3,
  "durationPerLevel": 0.35,
  "pullSpeedBase": 100,
  "pullSpeedPerLevel": 18,
  "tickInterval": 0.45,
  "animationOffsetY": -28
}
```

这是一个非常值得保留的设计：逻辑中心和视觉中心不要绑死。

# 地刺：预警、爆发和减速

地刺技能分成两个阶段：

- 预警阶段：只显示圆圈。
- 爆发阶段：播放地刺动画，并造成一次范围伤害。

一开始地刺的问题也和视觉中心有关：动画出现在技能圆圈底部，而不是中心。后来同样通过 `animationOffsetX/Y` 解决。

渲染逻辑：

```dart
@override
void render(Canvas canvas) {
  canvas.save();
  canvas.translate(size.x / 2, size.y / 2);
  final warningRatio = (_elapsed / definition.warningTime)
      .clamp(0, 1)
      .toDouble();
  canvas.drawCircle(
    Offset.zero,
    definition.radius,
    Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = 3
      ..color = Color.lerp(
        const Color(0x55FFFFFF),
        const Color(0xDDFF5A42),
        warningRatio,
      )!,
  );
  canvas.restore();

  if (_elapsed >= definition.warningTime) {
    canvas.save();
    canvas.translate(
      definition.animationOffsetX,
      definition.animationOffsetY,
    );
    super.render(canvas);
    canvas.restore();
  }
}
```

爆发时造成伤害，并给敌人减速：

```dart
if (!_hasDamaged && _elapsed >= definition.warningTime) {
  _hasDamaged = true;
  game.damageEnemiesInRadius(
    position,
    definition.radius,
    definition.damage,
  );
  for (final enemy in game.enemiesSnapshot) {
    if (enemy.position.distanceTo(position) <= definition.radius) {
      enemy.applySlow(
        percent: definition.slowPercent,
        duration: definition.slowDuration,
      );
    }
  }
}
```

减速效果在敌人组件里实现：

```dart
void applySlow({required double percent, required double duration}) {
  if (!isAlive || percent <= 0 || duration <= 0) {
    return;
  }
  _slowMultiplier = min(_slowMultiplier, (1 - percent).clamp(0.1, 1));
  _slowTimer = max(_slowTimer, duration);
}
```

配置表里地刺减速随等级成长：

```json
"earthSpike": {
  "slowPercentBase": 0.3,
  "slowPercentPerLevel": 0.075,
  "slowPercentMax": 0.6,
  "slowDuration": 1,
  "warningTime": 0.65,
  "burstDuration": 0.72,
  "animationOffsetY": -40
}
```

也就是说，Lv.1 减速 30%，每级提高 7.5%，最多 60%。

# 暗影飞环：回旋镖和多飞环

暗影飞环的逻辑后来改过几次。最终效果是：

- 飞环飞向目标敌人。
- 飞出一定距离后返回玩家当前位置，而不是返回释放时的位置。
- 技能每升一级，额外增加一个飞环。
- 每个飞环有独立目标。
- 如果飞环停留在敌人身上，每隔 `0.3` 秒造成一次伤害。

释放多个飞环是在 `castSkillSlot` 里做的：

```dart
if (skill.type == SkillType.shadowRing) {
  final targets = findNearestEnemies(definition.range, skill.level);
  for (var i = 0; i < skill.level; i += 1) {
    final ringTarget = targets.isEmpty
        ? target
        : targets[i % targets.length];
    levelWorld.add(
      ShadowRingComponent(
        definition: definition,
        start: start,
        targetEnemy: ringTarget,
        launchDelay: i * definition.launchDelayStep,
      ),
    );
  }
  skill.triggerCooldown();
  return;
}
```

飞环方向每帧重新计算：

```dart
Vector2 _currentDirection() {
  final targetPosition = _returning
      ? game.player.position
      : (_targetEnemy.isAlive ? _targetEnemy.position : _fallbackTarget());
  final toTarget = targetPosition - position;
  if (toTarget.length2 == 0) {
    return _lastDirection;
  }
  _lastDirection = toTarget.normalized();
  return _lastDirection;
}
```

注意返回阶段用的是 `game.player.position`，不是释放时记录的 `start`。这就实现了“回到玩家当前位置”。

重复伤害用的是每个敌人的冷却表：

```dart
final Map<EnemyComponent, double> _hitCooldowns = <EnemyComponent, double>{};

for (final enemy in game.enemiesSnapshot) {
  if ((_hitCooldowns[enemy] ?? 0) > 0) {
    continue;
  }
  if (enemy.position.distanceTo(position) <= definition.hitRadius) {
    _hitCooldowns[enemy] = definition.hitInterval;
    enemy.takeDamage(definition.damage);
  }
}
```

这个设计比“命中一次就永远不再命中”更适合飞环当前的表现，因为飞环有时会贴着敌人转或短暂停留。如果没有间隔伤害，玩家会看到飞环在敌人身上，但敌人不掉血，反馈很奇怪。

# 受击反馈：短暂变红

一开始玩家和敌人受到伤害时缺少反馈。后来加了一个简单但有效的表现：受击后贴图短暂变红。

敌人里是这样做的：

```dart
void showHitFlash({double duration = 0.16}) {
  _hitFlashTimer = max(_hitFlashTimer, duration);
  _applyHitFlashPaint();
}

void _applyHitFlashPaint() {
  paint.colorFilter = _hitFlashTimer > 0
      ? const ColorFilter.mode(Color(0xFFFF4444), BlendMode.modulate)
      : null;
}
```

持续伤害会不断刷新 `_hitFlashTimer`，所以龙卷风这种持续伤害期间敌人会一直保持红色反馈。玩家也用了同样思路。这个实现成本很低，但对战斗手感提升明显。

# HUD：Flame 内绘制生命、经验和技能槽

游戏里有两类 UI：

- 常驻 HUD：生命条、经验条、倒计时、技能槽。这些用 Flame 组件画在 camera viewport 上。
- 弹窗 UI：开局选技能、升级三选一、胜利/失败。这些用 Flutter overlay。

HUD 的生命条使用了资源 `Health bar frame.png` 和 `Health bar.png`。一开始黑底还保留着，后来既然已经用完整血条框资源，就去掉了原来的黑底。

生命条绘制逻辑：

```dart
void _drawHealthBar(
  Canvas canvas,
  Vector2 position,
  Vector2 barSize,
  double ratio,
) {
  canvas.save();
  canvas.clipRect(
    Rect.fromLTWH(position.x, position.y, barSize.x * ratio, barSize.y),
  );
  _healthBarSprite.render(canvas, position: position, size: barSize);
  canvas.restore();
  _healthFrameSprite.render(canvas, position: position, size: barSize);
}
```

`clipRect` 只裁内部血条，外框完整绘制。这样血量减少时，内部条缩短，但外框不变。

HUD 布局后来也抽成配置：

```json
"hud": {
  "healthBar": {
    "x": 24,
    "y": 18,
    "width": 240,
    "height": 40
  },
  "skillSlots": {
    "startX": 281,
    "y": 414,
    "size": 54,
    "gap": 62
  }
}
```

当我把摄像机视口从 `960x540` 调成 `864x486` 后，也同步把技能槽从 `y = 468` 调到 `y = 414`，否则技能槽会被裁掉或贴到屏幕外。

# Flutter Overlay：开局、升级、胜负

Flame 很适合画游戏实体，但复杂 UI 还是 Flutter 更顺手。项目里用 `GameWidget` 的 `overlayBuilderMap` 注册几个 overlay：

```dart
GameWidget<RoguelikeGame>(
  game: _game,
  initialActiveOverlays: const <String>[RoguelikeGame.startOverlay],
  overlayBuilderMap: <String, Widget Function(BuildContext, RoguelikeGame)>{
    RoguelikeGame.startOverlay: (_, game) => StartSkillOverlay(game: game),
    RoguelikeGame.levelUpOverlay: (_, game) => LevelUpOverlay(game: game),
    RoguelikeGame.victoryOverlay: (_, game) =>
        RunResultOverlay(game: game, title: '生存成功', subtitle: '你撑过了 5 分钟。'),
    RoguelikeGame.gameOverOverlay: (_, game) =>
        RunResultOverlay(game: game, title: '战斗失败', subtitle: '敌人的攻势压垮了你。'),
  },
)
```

升级时暂停引擎：

```dart
void _openLevelUp() {
  if (_levelUpOpen || session.isGameOver || session.isVictory) {
    return;
  }
  pendingUpgradeOptions = session.buildUpgradeOptions(random);
  _levelUpOpen = true;
  overlays.add(levelUpOverlay);
  pauseEngine();
}
```

选择升级后恢复：

```dart
void applyUpgrade(UpgradeOption option) {
  session.applyUpgrade(option);
  pendingUpgradeOptions = <UpgradeOption>[];
  _levelUpOpen = false;
  overlays.remove(levelUpOverlay);
  resumeEngine();
}
```

这个结构很清晰：游戏逻辑决定什么时候弹窗，Flutter 负责显示弹窗，玩家点击后再回到游戏逻辑。

# 配置表：为什么要做 JSON

项目做到后面，数值越来越多：

- 玩家生命、移速、碰撞半径。
- 敌人生命、速度、攻击距离、攻击命中帧。
- 技能伤害、冷却、范围、飞行速度、动画尺寸、视觉偏移。
- 地图大小、障碍数量、安全区半径、地面噪声。
- 刷怪间隔、每波数量、最大敌人数、狗出现概率。
- HUD 位置、血条尺寸、技能槽位置。
- 摄像机视口大小。

如果每次都改 Dart 源码，会很慢，也容易引入无关改动。所以我做了：

```text
assets/config/game_config.json
```

加载器是 `GameConfig.loadFromAsset()`：

```dart
static Future<GameConfig> loadFromAsset({String path = assetPath}) async {
  try {
    final text = await rootBundle.loadString(path);
    final decoded = jsonDecode(text);
    return GameConfig.fromJson(_objectMap(decoded));
  } on Object {
    return GameConfig.defaults();
  }
}
```

这里有两个设计点。

第一，配置从 `assets/config/game_config.json` 读，而不是从项目根目录读。因为 Web 构建时，浏览器不能随便访问本地文件系统；放到 assets 里，Windows 和 Web 都能以同一种方式加载。

第二，解析失败时回退到 `GameConfig.defaults()`。这能避免配置文件缺字段或格式不完整时游戏直接崩溃。当然，真正发布前还是要跑测试和构建确认配置有效。

配置表里还加了 `_comment` 和 `_fields` 字段作为注释：

```json
{
  "_comment": "此文件必须保持合法 JSON；不要使用 // 或 /* */ 注释。所有以 _ 开头的说明字段只给人阅读，游戏代码会忽略。",
  "schemaVersion": 1
}
```

为什么不用 `//`？因为 Dart 的 `jsonDecode` 不支持 JSONC。如果写 `//` 注释，游戏加载会失败。用普通字段写说明，既合法，又能在编辑器里直接看懂。

# 配置驱动技能数值

技能配置长这样：

```json
"fireBall": {
  "cooldownBase": 1.55,
  "cooldownReductionPerLevel": 0.08,
  "minCooldown": 0.7,
  "damageBase": 44,
  "damagePerLevel": 16,
  "rangeBase": 460,
  "rangePerLevel": 18,
  "radiusBase": 72,
  "radiusPerLevel": 6,
  "speed": 264,
  "visualSize": 108,
  "hitRadius": 46,
  "effectDuration": 0.36
}
```

这里我没有只给一个 `damage`，而是拆成 `damageBase` 和 `damagePerLevel`。这样技能等级公式统一：

```text
rank = skillLevel - 1
最终伤害 = damageBase + rank * damagePerLevel
最终范围 = rangeBase + rank * rangePerLevel
最终半径 = radiusBase + rank * radiusPerLevel
最终冷却 = max(minCooldown, cooldownBase - rank * cooldownReductionPerLevel)
```

这让所有技能升级都能从同一套逻辑算出来。配置表只负责给参数，不负责写逻辑。

# 配置驱动敌人数值

敌人配置也类似：

```json
"skeleton": {
  "baseHp": 66,
  "hpDifficultyScale": 0.55,
  "baseSpeed": 66,
  "speedDifficultyBonus": 8,
  "attackRange": 44,
  "attackDamage": 10,
  "damageDifficultyScale": 0.25,
  "attackDuration": 0.9,
  "hitTime": 0.42,
  "xpValue": 4
}
```

敌人随时间变强，用 `difficulty = elapsed / duration` 表示当前局内进度：

```dart
final hpScale = 1 + difficulty * tuning.hpDifficultyScale;
final damageScale = 1 + difficulty * tuning.damageDifficultyScale;
return EnemyDefinition(
  kind: kind,
  maxHp: tuning.baseHp * hpScale,
  speed: tuning.baseSpeed + difficulty * tuning.speedDifficultyBonus,
  attackDamage: tuning.attackDamage * damageScale,
  // ...
);
```

这比手写多个时间阶段简单。缺点是成长曲线是线性的，如果后期想做更复杂的节奏，可以把配置扩展成阶段表或曲线表。

# Web 运行和发布

这个项目现在可以直接在 Web 上运行：

```bash
flutter run -d chrome
```

如果想指定端口：

```bash
flutter run -d chrome --web-port 8080
```

如果只想开一个本地 Web 服务，不自动打开 Chrome：

```bash
flutter run -d web-server --web-port 8080
```

发布版构建：

```bash
flutter build web
```

构建结果在：

```text
build/web
```

如果部署到 GitHub Pages，并且地址类似：

```text
https://用户名.github.io/仓库名/
```

构建时要加 `--base-href`：

```bash
flutter build web --release --base-href /仓库名/
```

这里不要直接双击 `build/web/index.html`，Flutter Web 通常需要通过 HTTP 服务访问，否则资源路径可能加载失败。

# 测试：先把纯逻辑测起来

这个项目不是所有东西都适合单元测试，比如动画播放和手感需要运行验证。但一些纯逻辑很适合测试：

- A\* 是否绕开阻挡格。
- 移动碰撞是否不会进入阻挡格。
- 玩家出生点附近是否可走。
- 技能槽是否按解锁顺序填充。
- 冷却是否阻止重复释放。
- 升级选项是否包含未解锁技能。
- 经验阈值是否能升级。
- 胜利计时是否生效。
- 龙卷风是否把敌人往中心拉。
- 龙卷风是否不会把敌人拉穿障碍。
- 配置表是否能覆盖默认值。

比如龙卷风测试：

```dart
test('tornado pull does not move an enemy through an obstacle', () {
  final grid = ArenaGrid(
    width: 6,
    height: 4,
    tileSize: 32,
    blockedCells: <GridPoint>{const GridPoint(2, 1)},
  );
  final current = grid.cellCenter(const GridPoint(1, 1));
  final center = grid.cellCenter(const GridPoint(4, 1));

  final pulled = TornadoLogic.pullPosition(
    grid: grid,
    current: current,
    center: center,
    radius: 160,
    pullSpeed: 40,
    dt: 1,
    bodyRadius: 10,
  );

  expect(grid.worldToCell(pulled), isNot(const GridPoint(2, 1)));
});
```

配置表测试：

```dart
test('game config applies nested overrides while keeping defaults', () {
  final defaults = GameConfig.defaults();
  final config = GameConfig.fromJson(const <String, Object?>{
    'player': <String, Object?>{'maxHp': 120, 'moveSpeed': 180},
    'camera': <String, Object?>{'viewportWidth': 800, 'viewportHeight': 450},
    'arena': <String, Object?>{'width': 64, 'obstacleCount': 50},
  });

  expect(config.player.maxHp, 120);
  expect(config.player.moveSpeed, 180);
  expect(config.camera.viewportWidth, 800);
  expect(config.arena.width, 64);
  expect(config.arena.height, defaults.arena.height);
});
```

这些测试不需要启动完整游戏，却能保证核心规则不会因为改技能或改配置时被破坏。

# 验证命令

开发过程中主要用这些命令验证：

```bash
flutter pub get
flutter analyze
flutter test
flutter build windows
flutter build web
```

其中：

- `flutter analyze` 用来发现类型问题、未使用代码、风格问题。
- `flutter test` 用来跑逻辑测试。
- `flutter build windows` 确认 Windows 打包能通过。
- `flutter build web` 确认 Web 打包和资源注册没问题。

这次配置表加入后，尤其要跑 Web 构建。因为配置表是 asset，如果 `pubspec.yaml` 没注册 `assets/config/`，桌面调试时可能不明显，但 Web 打包后很容易资源缺失。

# 开发中犯过的错误和修正

## 错误一：低估了动画切帧的重要性

一开始看到素材是序列帧，就直接按默认 `64x64` 去切。结果玩家动画闪烁、滑动、错位。后来才确认玩家帧是 `48x64`。

修正方式：

- 给 `stripAnimation` 增加 `frameSize` 参数。
- 玩家动画全部显式传 `Vector2(48, 64)`。
- 不同资源按实际帧尺寸切，不再假设统一尺寸。

经验：像素动画最先要确认三件事：单帧宽高、帧数、方向排列。不要凭感觉切。

## 错误二：把技能飞行帧和命中帧混在一起

火球和风刃素材里，前几帧是飞行，后几帧是命中特效。一开始全部放进飞行动画，导致弹体飞行时就播放爆炸或命中特效。

修正方式：

- `skillAnimation` 支持 `startFrame` 和 `frameCount`。
- 飞行组件只取前 5 帧。
- 命中特效组件从第 6 帧开始播放。

经验：技能素材通常不是“一套动画从头播到尾”，而是多个阶段共用一组帧。应该按技能状态拆组件。

## 错误三：逻辑中心和视觉中心绑死

地刺和龙卷风都遇到过动画不在目标点中心的问题。最开始如果直接改组件 `position`，伤害范围也会跟着偏，逻辑会乱。

修正方式：

- 组件 `position` 永远表示技能逻辑中心。
- 伤害圆和判定都围绕 `position`。
- 动画用 `animationOffsetX/Y` 单独偏移。

经验：技能的“判定中心”和“视觉素材中心”经常不是一回事。应该从一开始就拆开。

## 错误四：只做一次伤害，忽略停留伤害

暗影飞环因为索敌逻辑，有时会停留在敌人身上。一开始它只有刚接触时造成一次伤害，之后贴着敌人却没有伤害，反馈很差。

修正方式：

- 给每个敌人维护独立命中冷却 `_hitCooldowns`。
- 飞环停留时每隔 `hitInterval` 再次造成伤害。

经验：视觉上持续接触的东西，逻辑上也应该有持续反馈，否则玩家会觉得“打中了但没效果”。

## 错误五：地图随机看起来不随机

最初土块使用简单取模，导致地图出现规律斜线。

修正方式：

- 使用坐标哈希生成稳定噪声。
- 用邻居数量做简单抑制，减少规律连线。
- 把阈值抽进配置表。

经验：程序生成地图不只要随机，还要“看起来随机”。简单数学规律很容易被玩家看出来。

## 错误六：数值散落在代码里

项目中期，技能、敌人、HUD、刷怪、摄像机参数都散落在不同文件里。每次调一个参数都要找代码，甚至会误改逻辑。

修正方式：

- 新增 `assets/config/game_config.json`。
- 新增 `GameConfig` 解析层。
- 所有核心数值从配置表读取。
- 保留 `GameConfig.defaults()` 兜底。

经验：原型前期可以硬编码，但当数值开始频繁调整时，就应该尽快配置化。

# 当前项目还可以继续做什么

这个 MVP 已经有了基本闭环，但离完整游戏还有不少距离。后续可以继续扩展：

- 加音效和背景音乐。
- 增加 Boss 或精英怪。
- 增加更多技能组合和被动升级。
- 加局外成长系统。
- 做更丰富的地形和地图事件。
- 优化大量敌人时的性能，例如分帧寻路或流场寻路。
- 增加移动端虚拟摇杆。
- 做外部配置覆盖，让打包后的 Windows 版本也能直接改本地 JSON。
- 做 Web 部署页面和在线试玩版本。

其中我认为最优先的是音效和更多升级选项。因为当前玩法闭环已经存在，但反馈还可以更强。生存类游戏的爽感很大一部分来自击中音效、死亡音效、升级音效和持续刷怪的节奏反馈。

# 总结

这个项目从一个 Flutter 默认工程，逐步变成了一个可玩的像素风生存肉鸽 MVP。过程中最重要的不是某一个具体技能，而是几个工程决策：

- 用 Flame component 拆游戏实体和技能。
- 用 Flutter overlay 做复杂界面。
- 用网格和 A\* 解决俯视角寻路。
- 用配置表管理技能、敌人、地图、HUD 和摄像机参数。
- 把视觉表现和逻辑判定拆开。
- 用测试覆盖纯逻辑，避免后续调参破坏基础规则。

Flutter + Flame 并不是传统意义上的专业游戏引擎，但做这种 2D 单场景生存 MVP 是完全可行的。它最大的优势是 Flutter UI 和跨平台能力，最大的挑战是很多游戏引擎内置的东西需要自己组织代码完成。

如果只看最终效果，这只是一个小型像素游戏；但从开发过程看，它包含了一个 2D 游戏原型里非常典型的一整套问题：资源管理、动画切帧、地图阻挡、寻路、技能生命周期、命中判定、状态机、UI overlay、配置化和跨平台构建。把这些问题一个个解决后，项目就已经具备继续扩展成更完整游戏的基础。
