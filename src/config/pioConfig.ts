import type { PioConfig } from "../types/config";

// Pio 看板娘配置
export const pioConfig: PioConfig = {
	enable: false, // 启用看板娘
	models: ["/pio/models/NOIR/noir.model3.json"], // 默认模型路径
	position: "left", // 模型位置
	width: 280, // 默认宽度
	height: 250, // 默认高度
	mode: "draggable", // 默认为可拖拽模式
	hiddenOnMobile: true, // 默认在移动设备上隐藏
	hideAboutMenu: false, // 隐藏内置 About 菜单按钮
	dialog: {
		welcome: "欢迎来到 Mizuki 技术博客！", // 欢迎词
		touch: [
			"你在做什么？",
			"别再点我啦！",
			"请专心看文章。",
			"这里是技术博客，不是互动游戏。",
		], // 触摸提示
		home: "点击这里返回首页。", // 首页提示
		skin: ["想看看新的外观吗？", "新的外观看起来不错。"], // 换装提示
		close: "下次再见。", // 关闭提示
		link: "https://github.com/LyraVoid/Mizuki", // 关于链接
	},
};
