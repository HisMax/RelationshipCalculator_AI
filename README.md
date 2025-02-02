# 亲戚称谓计算器

一个帮助用户计算复杂亲戚关系称谓的Web应用。支持多地区称谓习惯,提供详细的称谓解释和地域差异说明。

10分钟+Cursor+DeepSeek 开发

## 预览

![预览](docs/a.jpg)

## 功能特点

- 🌍 支持多地区称谓习惯(通用/北方/南方/西部/方言区)
- 👨‍👩‍👧‍👦 完整的亲属关系选择(父母/兄弟姐妹/子女等)
- 📝 详细的称谓解释和推导过程
- 🗺️ 全面的地域差异说明
- 💻 响应式设计,支持各种设备
- ⚡ 实时计算,快速响应

## 技术栈

- 前端: HTML5, CSS3, JavaScript (原生)
- 后端: FastAPI
- AI: 基于大语言模型的称谓计算

## 本地开发

1. 克隆项目
```bash
git clone [项目地址]
```

2. 安装依赖
```bash
pip install -r requirements.txt
```

3. 配置API密钥
创建 `.config` 文件并添加:
```
API_KEY=你的API密钥
```

4. 启动服务器
```bash
python app.py
```

5. 访问应用
打开浏览器访问 `http://localhost:8190`

## 项目结构

```
.
├── app.py              # FastAPI后端服务
├── static/            # 静态资源目录
│   ├── index.html    # 主页面
│   ├── styles.css    # 样式文件
│   └── script.js     # 前端逻辑
├── .config           # 配置文件(需自行创建)
└── README.md         # 项目说明
```

## API接口

### POST /chat
计算亲戚称谓关系

请求体:
```json
{
    "messages": [
        {
            "role": "system",
            "content": "系统提示"
        },
        {
            "role": "user", 
            "content": "用户输入"
        }
    ],
    "temperature": 0.1
}
```

响应:
```json
{
    "choices": [
        {
            "message": {
                "content": "计算结果"
            }
        }
    ]
}
```
