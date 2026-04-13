// 解析 Markdown 文章的 --- 头部信息（增强鲁棒性）
export function parsePostFrontmatter(text) {
    // 严格匹配 --- 包裹的前置元数据
    const frontmatterRegex = /^---\s*?\n([\s\S]*?)\n---\s*?\n([\s\S]*)$/;
    const match = text.match(frontmatterRegex);

    // 默认元数据
    const defaultData = {
        title: '无标题',
        date: '',
        category: '',
        tags: [],
        excerpt: ''
    };

    if (!match) {
        // 无前置元数据，返回默认值+完整内容
        return { data: defaultData, content: text };
    }

    const data = { ...defaultData };
    const frontmatterLines = match[1].split('\n').filter(line => line.trim());

    frontmatterLines.forEach(line => {
        const colonIndex = line.indexOf(':');
        if (colonIndex === -1) return;

        const key = line.slice(0, colonIndex).trim().toLowerCase();
        let value = line.slice(colonIndex + 1).trim();

        // 处理标签数组（兼容多种格式）
        if (key === 'tags') {
            if (value.startsWith('[') && value.endsWith(']')) {
                try {
                    // 兼容JSON数组格式
                    value = JSON.parse(value.replace(/([a-zA-Z\u4e00-\u9fa5\s]+)/g, '"$1"'));
                } catch (e) {
                    // 兼容逗号分隔格式
                    value = value.slice(1, -1).split(',').map(t => t.trim()).filter(t => t);
                }
            } else if (value.includes(',')) {
                // 兼容纯逗号分隔
                value = value.split(',').map(t => t.trim()).filter(t => t);
            } else {
                // 单个标签
                value = value ? [value] : [];
            }
        }

        // 赋值（覆盖默认值）
        if (key in data) {
            data[key] = value;
        }
    });

    return {
        data,
        content: match[2].trim() // 去除首尾空白
    };
}