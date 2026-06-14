import { collection, config, fields } from "@keystatic/core";

export default config({
	storage: {
		kind: "local",
	},
	ui: {
		brand: {
			name: "Mizuki 博客编辑器",
		},
		navigation: {
			内容: ["posts"],
		},
	},
	collections: {
		posts: collection({
			label: "文章",
			slugField: "title",
			path: "src/content/posts/*",
			entryLayout: "content",
			format: {
				contentField: "content",
			},
			columns: ["title", "published", "category", "draft", "pinned"],
			schema: {
				title: fields.slug({
					name: {
						label: "标题",
						validation: {
							isRequired: true,
						},
					},
				}),
				published: fields.date({
					label: "发布日期",
					defaultValue: {
						kind: "today",
					},
					validation: {
						isRequired: true,
					},
				}),
				updated: fields.date({
					label: "更新日期",
				}),
				description: fields.text({
					label: "摘要",
					multiline: true,
				}),
				image: fields.text({
					label: "封面图片路径",
				}),
				tags: fields.array(fields.text({ label: "标签" }), {
					label: "标签",
					itemLabel: (props) => props.value,
				}),
				category: fields.text({
					label: "分类",
				}),
				lang: fields.text({
					label: "语言",
					description: "可留空，例如 zh_CN、en、ja",
				}),
				draft: fields.checkbox({
					label: "草稿",
					defaultValue: false,
				}),
				pinned: fields.checkbox({
					label: "置顶",
					defaultValue: false,
				}),
				comment: fields.checkbox({
					label: "允许评论",
					defaultValue: true,
				}),
				author: fields.text({
					label: "作者",
				}),
				sourceLink: fields.text({
					label: "来源链接",
				}),
				licenseName: fields.text({
					label: "许可证名称",
				}),
				licenseUrl: fields.text({
					label: "许可证链接",
				}),
				encrypted: fields.checkbox({
					label: "加密文章",
					defaultValue: false,
				}),
				password: fields.text({
					label: "文章密码",
				}),
				passwordHint: fields.text({
					label: "密码提示",
				}),
				hideHomeContent: fields.checkbox({
					label: "首页隐藏正文预览",
					defaultValue: false,
				}),
				alias: fields.text({
					label: "别名",
				}),
				permalink: fields.text({
					label: "自定义链接",
				}),
				content: fields.mdx({
					label: "正文",
					extension: "md",
				}),
			},
		}),
	},
});
