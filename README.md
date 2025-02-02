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
- AI: 基于硅基流动(SiliconFlow)提供的DeepSeek-V3大语言模型进行称谓计算

## 本地开发

1. 克隆项目
```bash
git clone https://github.com/HisMax/RelationshipCalculator_AI.git
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
4. 获取API密钥
- 访问 [硅基流动官网](https://cloud.siliconflow.cn/i/g6TYzS6H)
- 注册/登录账号
- 在个人中心页面找到"API密钥"选项
- 点击"创建API密钥"按钮生成新的密钥
- 复制生成的密钥,粘贴到 `.config` 文件中

注意:请妥善保管API密钥,不要泄露给他人。首次注册用户可获得免费的14元额度


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

## 感谢

- 感谢硅基流动提供的国产DeepSeek-V3大语言模型
- 感谢Cursor和DeepSeek提供的AI支持
- 感谢所有为开源社区做出贡献的开发者们

## 缺陷

- 由于是基于大语言模型进行计算,所以计算结果可能存在误差,需要用户自行判断，如果追求最准确的计算结果，推荐使用[亲戚关系计算器](https://passer-by.com/relationship/)
