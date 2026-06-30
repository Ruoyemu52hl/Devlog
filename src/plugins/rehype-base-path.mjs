import { visit } from "unist-util-visit";

function isInternalRootPath(value) {
	return (
		typeof value === "string" &&
		value.startsWith("/") &&
		!value.startsWith("//")
	);
}

function withBasePath(value, base) {
	if (!isInternalRootPath(value) || base === "/") {
		return value;
	}

	const normalizedBase = `/${base.replace(/^\/+|\/+$/g, "")}`;
	if (value === normalizedBase || value.startsWith(`${normalizedBase}/`)) {
		return value;
	}

	return `${normalizedBase}${value}`;
}

export function rehypeBasePath(options = {}) {
	const base = options.base || "/";

	return (tree) => {
		visit(tree, "element", (node) => {
			const properties = node.properties;
			if (!properties) {
				return;
			}

			for (const key of ["src", "href"]) {
				if (isInternalRootPath(properties[key])) {
					properties[key] = withBasePath(properties[key], base);
				}
			}
		});
	};
}
