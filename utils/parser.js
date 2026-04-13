export function parsePostFrontmatter(text) {
    // 严格匹配 --- 包裹的前置元数据
    const frontmatterRegex = /^---\s*?\n([\s\S]*?)\n---\s*?\n([\s\S]*)$/
    const match = text.match(frontmatterRegex)

    // 默认兜底数据，永远不会 undefined
    const defaultData = {
        title: '无标题',
        date: '',
        category: '',
        tags: [],
        excerpt: ''
    }

    if (!match) {
        return { data: defaultData, content: text }
    }

    const data = { ...defaultData }
    const lines = match[1].split('\n').filter(line => line.trim())

    lines.forEach(line => {
        const colonIndex = line.indexOf(':')
        if (colonIndex === -1) return

        const key = line.slice(0, colonIndex).trim().toLowerCase()
        let value = line.slice(colonIndex + 1).trim()

        // 处理标签数组（兼容多种格式）
        if (key === 'tags') {
            if (value.startsWith('[') && value.endsWith(']')) {
                try {
                    value = JSON.parse(value.replace(/([\u4e00-\u9fa5\w\s]+)/g, '"$1"'))
                } catch (e) {
                    value = value.slice(1, -1).split(',').map(t => t.trim()).filter(t => t)
                }
            } else if (value.includes(',')) {
                value = value.split(',').map(t => t.trim()).filter(t => t)
            } else {
                value = value ? [value] : []
            }
        }

        // 仅覆盖有效字段
        if (key in data) {
            data[key] = value
        }
    })

    return {
        data,
        content: match[2].trim()
    }
}