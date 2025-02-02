class RelationshipCalculator {
    constructor() {
        // 基础亲属关系映射表
        this.relationships = {
            father: '爸爸',
            mother: '妈妈',
            husband: '丈夫',
            wife: '妻子',
            son: '儿子',
            daughter: '女儿',
            'older-brother': '哥哥',
            'younger-brother': '弟弟',
            'older-sister': '姐姐',
            'younger-sister': '妹妹'
        };
        
        // 当前选择的关系路径
        this.currentPath = [];
        // 当前选择的地区
        this.selectedRegion = 'common';
        // 关系历史记录
        this.relationHistory = [];
        
        // 初始化各种事件监听器和错误处理
        this.initializeEventListeners();
        this.initializeErrorHandler();
    }

    initializeEventListeners() {
        document.querySelectorAll('.relation-btn').forEach(button => {
            button.addEventListener('click', () => {
                const relation = button.dataset.relation;
                this.addRelation(relation);
                this.updateButtonHighlight(button);
                this.updateCalculateButton();
            });
        });

        document.querySelectorAll('.region-btn').forEach(button => {
            button.addEventListener('click', () => {
                document.querySelectorAll('.region-btn').forEach(btn => {
                    btn.classList.remove('selected');
                });
                button.classList.add('selected');
                this.selectedRegion = button.dataset.region;
            });
        });

        document.getElementById('clearBtn').addEventListener('click', () => {
            this.clearPath();
        });

        document.getElementById('calculateBtn').addEventListener('click', () => {
            this.calculateResult();
        });
    }

    initializeErrorHandler() {
        window.onerror = (msg, url, lineNo, columnNo, error) => {
            this.showError('系统错误', `${msg}`);
            console.error('Error: ', error);
            return false;
        };

        window.onunhandledrejection = (event) => {
            this.showError('网络错误', '请求失败，请检查网络连接');
            console.error('Unhandled promise rejection: ', event.reason);
        };
    }

    /**
     * 显示错误提示框
     * @param {string} title - 错误标题
     * @param {string} message - 错误详细信息
     */
    showError(title, message) {
        const errorContainer = document.createElement('div');
        errorContainer.className = 'error-message';
        errorContainer.innerHTML = `
            <div class="error-content">
                <i class="mdi mdi-alert-circle"></i>
                <div class="error-text">
                    <h4>${title}</h4>
                    <p>${message}</p>
                </div>
                <button class="error-close">
                    <i class="mdi mdi-close"></i>
                </button>
            </div>
        `;

        document.body.appendChild(errorContainer);

        // 自动消失
        setTimeout(() => {
            errorContainer.classList.add('fade-out');
            setTimeout(() => errorContainer.remove(), 300);
        }, 5000);

        // 点击关闭
        errorContainer.querySelector('.error-close').onclick = () => {
            errorContainer.remove();
        };
    }

    /**
     * 显示加载动画
     * @param {string} message - 加载提示文本
     */
    showLoading(message = '计算中...') {
        const resultElement = document.getElementById('result');
        resultElement.innerHTML = `
            <div class="loading-container">
                <div class="loading-spinner"></div>
                <span class="loading-text">${message}</span>
            </div>
        `;
    }

    hideLoading() {
        const loadingContainer = document.querySelector('.loading-container');
        if (loadingContainer) {
            loadingContainer.remove();
        }
    }

    /**
     * 添加新的关系到路径中
     * @param {string} relation - 要添加的关系键名
     */
    addRelation(relation) {
        this.currentPath.push(this.relationships[relation]);
        this.relationHistory.push(relation);
        this.updatePathDisplay();
    }

    /**
     * 更新按钮高亮状态
     * @param {HTMLElement} newButton - 需要高亮的按钮元素
     */
    updateButtonHighlight(newButton) {
        document.querySelectorAll('.relation-btn').forEach(btn => {
            btn.classList.remove('last-selected');
        });
        newButton.classList.add('last-selected');
    }

    /**
     * 清空当前选择的所有关系路径
     */
    clearPath() {
        this.currentPath = [];
        this.relationHistory = [];
        this.updatePathDisplay();
        document.querySelectorAll('.relation-btn').forEach(btn => {
            btn.classList.remove('last-selected');
            btn.classList.remove('selected');
        });
        
        // 清空结果区域
        document.getElementById('result').innerHTML = '';
        
        // 重置地区选择
        document.querySelectorAll('.region-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        document.querySelector('.region-btn[data-region="common"]').classList.add('selected');
        this.selectedRegion = 'common';
    }

    /**
     * 更新路径显示
     * 在界面上显示当前选择的关系路径
     */
    updatePathDisplay() {
        const pathDisplay = document.getElementById('currentPath');
        if (this.currentPath.length === 0) {
            pathDisplay.textContent = '我';
            document.getElementById('calculateBtn').disabled = true;
            return;
        }

        pathDisplay.textContent = '我 → ' + this.currentPath.join(' → ');
        document.getElementById('calculateBtn').disabled = false;
    }

    updateCalculateButton() {
        const calculateBtn = document.getElementById('calculateBtn');
        calculateBtn.disabled = this.relationHistory.length === 0;
    }

    /**
     * 计算并显示称谓结果
     * 通过API请求获取称谓计算结果并展示
     */
    async calculateResult() {
        try {
            this.showLoading('正在计算称谓关系...');
            
            // 构建提示文本
            const prompt = `深呼吸，请你帮仔细我计算以下亲戚关系的称谓。
关系链条：从"我"开始，经过以下关系：${this.currentPath.join('的')}
当前地区：${this.getRegionName(this.selectedRegion)}
要求：
1. 请仔细分析每一步关系的变化
2. 考虑性别和年龄对称谓的影响
3. 给出最准确的称谓，如：
   - 爸爸的爸爸 = 爷爷
   - 妈妈的妈妈 = 外婆
   - 爸爸的妈妈 = 奶奶
   - 妈妈的爸爸 = 外公
   - 妈妈的妈妈的弟弟的老婆 = 舅外婆/舅姥姥
4. 如果有多种可能，请列出所有情况，用/进行分割

请按以下格式返回：
称谓：[最准确的称谓]
解释：[详细解释这个称谓是如何得出的，包括关系推导过程]，不少于200字，尽可能详细解释
地域差异：
- 北方：[北方地区的称谓，包括东北、华北等地区特色]
- 南方：[南方地区的称谓，包括江浙、粤语区等地区特色]
- 西部：[西部地区的称谓，包括少数民族地区的特色]
- 其他：[其他方言区的特色称谓]

示例：
输入：妈妈的妈妈
输出：
称谓：外婆/姥姥
解释：从"我"出发，称呼母亲为"妈妈"，母亲的母亲就是"外婆"。这里"外"字表示是母系这边的长辈。如果母亲是北方人，则称"姥姥"，如果母亲是南方人，则称"外婆"。
地域差异：
- 北方：常用"姥姥"，东北也叫"姥姥"
- 南方：多称"外婆"，上海话叫"外婆婆"，粤语区叫"阿婆"
- 西部：部分地区称"外婆"，新疆称"阿比"
- 其他：闽南语称"外妈"，客家话称"外婆"

请注意返回所选地区（${this.getRegionName(this.selectedRegion)}）的称谓习惯。`;

            // 发送API请求
            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [
                        {
                            role: "system",
                            content: `你是一个精通口语化表达中国亲戚关系称谓的专家。你需要：
1. 精确理解亲属关系链条中的每一步变化
2. 考虑父系/母系对称谓的影响（如：爷爷vs外公）
3. 考虑性别对称谓的影响（如：舅舅vs姑姑）
4. 考虑年龄对称谓的影响（如：哥哥vs弟弟）
5. 了解不同地区的称谓习惯和方言特色
6. 给出准确的称谓推导过程和解释
7. 回答要简洁但详尽，避免重复
8. 最终结果应该是符合口语化表达的`
                        },
                        {
                            role: "user",
                            content: prompt
                        }
                    ],
                    temperature: 0.1,
                    max_tokens: 4096
                })
            });

            // 处理响应结果
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || '网络请求失败');
            }

            const data = await response.json();
            
            if (!data.choices || !data.choices[0] || !data.choices[0].message) {
                throw new Error('API 返回数据格式错误');
            }

            const result = data.choices[0].message.content.trim();
            
            // 解析结果前进行验证
            if (!result.includes('称谓：') || !result.includes('解释：')) {
                throw new Error('API 返回的内容格式不正确');
            }

            // 解析结果
            const sections = result.split('\n').reduce((acc, line) => {
                if (line.startsWith('称谓：')) {
                    acc.title = line.replace('称谓：', '').trim();
                } else if (line.startsWith('解释：')) {
                    acc.explanation = line.replace('解释：', '').trim();
                } else if (line.startsWith('地域差异：')) {
                    acc.regions = [];
                } else if (line.startsWith('- ') && acc.regions !== undefined) {
                    const [region, content] = line.slice(2).split('：');
                    acc.regions.push({ region, content });
                }
                return acc;
            }, { title: '', explanation: '', regions: undefined });
            
            // 先移除加载状态
            this.hideLoading();
            
            // 更新显示
            const resultElement = document.getElementById('result');
            resultElement.innerHTML = `
                <div class="result-container">
                    <div class="result-header">
                        <div class="result-title">${sections.title}</div>
                    </div>
                    <div class="result-content">
                        <div class="explanation">
                            <h3>解释</h3>
                            <p>${sections.explanation}</p>
                        </div>
                        ${sections.regions ? `
                            <div class="region-variations">
                                <h3>地域差异</h3>
                                <div class="region-grid">
                                    ${sections.regions.map(({region, content}) => `
                                        <div class="region-item">
                                            <div class="region-badge">${region}</div>
                                            <div class="region-content">${content}</div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('计算称谓时出错：', error);
            this.showError('计算错误', error.message || '计算称谓时出现错误，请重试');
        } finally {
            if (document.querySelector('.loading-container')) {
                this.hideLoading();
            }
        }
    }

    /**
     * 获取地区的中文名称
     * @param {string} region - 地区代码
     * @returns {string} 地区的中文名称
     */
    getRegionName(region) {
        const regionNames = {
            common: '通用',
            north: '北方',
            south: '南方',
            west: '西部',
            special: '方言区'
        };
        return regionNames[region] || '通用';
    }
}

// 当DOM加载完成后初始化计算器
window.addEventListener('DOMContentLoaded', () => {
    new RelationshipCalculator();
}); 