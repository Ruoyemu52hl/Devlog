// 项目数据配置文件
// 用于管理项目展示页面的数据

export interface Project {
	id: string;
	title: string;
	description: string;
	image: string;
	category: "web" | "mobile" | "desktop" | "other";
	techStack: string[];
	status: "completed" | "in-progress" | "planned";
	liveDemo?: string;
	sourceCode?: string;
	visitUrl?: string;
	startDate: string;
	endDate?: string;
	featured?: boolean;
	tags?: string[];
	showImage?: boolean;
}

export const projectsData: Project[] = [
	{
		id: "mizuki",
		title: "Mizuki",
		description:
			"基于 Astro 构建的新一代 Material Design 3 博客主题，支持多语言、暗色模式和响应式布局。",
		image: "/assets/projects/mizuki.webp",
		category: "web",
		techStack: ["Astro", "TypeScript", "Tailwind CSS", "Svelte"],
		status: "completed",
		sourceCode: "https://github.com/LyraVoid/Mizuki",
		visitUrl: "https://mizuki.mysqil.com",
		startDate: "2024-01-01",
		endDate: "2024-06-01",
		featured: true,
		tags: ["博客", "主题", "开源"],
	},
	{
		id: "folkpatch",
		title: "FolkPatch",
		description:
			"基于 KernelPatch 的内核级 ROOT 方案，包含完整 UI、APM 模块系统和 KPM 内核模块支持。",
		image: "/assets/projects/folkpatch.webp",
		category: "mobile",
		techStack: ["Kotlin", "Rust", "C++", "Java"],
		status: "in-progress",
		sourceCode: "https://github.com/LyraVoid/FolkPatch",
		visitUrl: "https://fp.mysqil.com",
		startDate: "2024-03-01",
		featured: true,
		tags: ["Android", "Root", "内核"],
	},
	{
		id: "folktool",
		title: "FolkTool",
		description:
			"面向 FolkPatch 的 ROOT 刷写工具，提供图形界面和自动化操作，简化复杂刷写流程。",
		image: "",
		category: "desktop",
		techStack: ["Flutter", "Dart", "C++", "CMake"],
		status: "completed",
		sourceCode: "https://github.com/LyraVoid/FolkTool",
		startDate: "2026-02-01",
		endDate: "2026-02-28",
		tags: ["Android", "工具", "桌面端"],
		showImage: false,
	},
	{
		id: "folkadb",
		title: "FolkADB",
		description:
			"使用 C 编写的便携式 ADB/Fastboot 工具，支持交互式 CLI、Tab 补全、拖拽安装模块和 Shizuku 激活。",
		image: "",
		category: "desktop",
		techStack: ["C"],
		status: "completed",
		sourceCode: "https://github.com/LyraVoid/FolkADB",
		startDate: "2025-06-01",
		endDate: "2026-01-01",
		tags: ["Android", "ADB", "CLI"],
		showImage: false,
	},
	{
		id: "folksplash",
		title: "FolkSplash",
		description:
			"面向 OPPO、Realme、OnePlus 设备的网页端 splash.img 可视化工具，支持解包、预览、替换和重新打包。",
		image: "",
		category: "web",
		techStack: ["React", "TypeScript", "Vite", "Material-UI", "Zustand"],
		status: "completed",
		sourceCode: "https://github.com/LyraVoid/FolkSplash",
		visitUrl: "https://splash.mysqil.com",
		startDate: "2025-09-01",
		endDate: "2025-10-01",
		tags: ["Android", "工具", "前端"],
		showImage: false,
	},
];

// 获取项目统计
export const getProjectStats = () => {
	const total = projectsData.length;
	const completed = projectsData.filter((p) => p.status === "completed").length;
	const inProgress = projectsData.filter(
		(p) => p.status === "in-progress",
	).length;
	const planned = projectsData.filter((p) => p.status === "planned").length;

	return {
		total,
		byStatus: {
			completed,
			inProgress,
			planned,
		},
	};
};

// 按分类获取项目
export const getProjectsByCategory = (category?: string) => {
	if (!category || category === "all") {
		return projectsData;
	}
	return projectsData.filter((p) => p.category === category);
};

// 获取精选项目
export const getFeaturedProjects = () => {
	return projectsData.filter((p) => p.featured);
};

// 获取所有技术栈
export const getAllTechStack = () => {
	const techSet = new Set<string>();
	projectsData.forEach((project) => {
		project.techStack.forEach((tech) => {
			techSet.add(tech);
		});
	});
	return Array.from(techSet).sort();
};
