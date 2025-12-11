## 后端接口（稳定NPU推理）
- 新增 `POST /expert_query`（JSON）
  - 请求：`{ question: string, max_length?: number, temperature?: number }`
  - 响应：`{ success: true, answer, model_dir, device, usage: { prompt_tokens, output_tokens }, latency_ms }`
  - 失败：`{ success: false, error }`
- 模型加载：
  - 使用 `openvino_genai.LLMPipeline(model_path, device="NPU")`
  - `model_path` 默认读取本地 `qwen3-8b-int4-cw-ov/`（或环境变量 `QWEN3_NPU_MODEL_DIR`）
  - 在 `@app.on_event("startup")` 里单例初始化并缓存到全局，避免重复编译
- 生成逻辑：
  - 系统提示：限制为宠物相关问题（猫狗行为、健康、训练、安全），避免非宠物话题
  - 拼接提示词：`system_prompt + "\n用户: " + question + "\n专家:"`
  - 默认参数：`max_length=512, temperature=0.7, top_p=0.9, top_k=50`
  - 计时统计、简单令牌使用估算（按字数近似）
- 稳定性与容错：
  - 设备严格为 `NPU`，不可用时返回明确错误（不自动切设备）
  - 模型路径缺失或不可读 → 返回 503 并提示本地目录与文档路径
  - 接口限流与并发互斥（`threading.Lock`），防止首次编译/并发竞争导致失败

## 前端改动
- 在 `cat-language` 页面新增悬浮圆形询问按钮：
  - 位置：右下角，样式与现有渐变/霓虹风一致
  - 点击跳转到新路由 `/pet-expert`
- 新增页面：`PetExpert.jsx`（专家询问界面）
  - 风格：沿用当前 UI 体系（framer-motion、shadcn/ui、渐变背景卡片）
  - 功能：输入宠物问题、显示回答；保留简易历史列表（本地状态即可）
  - 按钮态：发送中 loading、错误提示区
- 路由注册：
  - 在 `nav-items.jsx` 增加 `title: "宠物专家询问"`，`to: "/pet-expert"`，`page: <PetExpert />`
  - `App.jsx` 已使用 `navItems` 自动挂载，无需额外改动

## 前端服务方法
- 在 `src/services/api.js` 新增：
  - `expertLLMApi.askQuestion(text, opts?)` → POST `http://localhost:8000/expert_query`
  - 返回 `answer` 文本，并携带 `device`、`model_dir`、`latency_ms` 便于前端展示

## 测试与验证
- 后端：
  - 启动 FastAPI，`GET /health` ok；`POST /expert_query` 以示例问题返回回答
  - `device` 字段为 `NPU`；`model_dir` 为 `qwen3-8b-int4-cw-ov`
- 前端：
  - `http://localhost:8080/#/cat-language` 按钮可见、点击跳转
  - 在 `/pet-expert` 输入问题并得到回答；错误态与加载态交互正常

## 兼容与规范
- 不改现有 API；新增接口与页面不影响现有功能
- 严格使用本地 NPU 优化模型；如需切换，支持通过环境变量覆盖目录
- 保持 UI/代码风格与现有组件一致，无内嵌注释与多余文件

确认后我将：
1) 实现后端 `/expert_query`（NPU单例加载，稳定响应）
2) 前端 `cat-language` 增加悬浮按钮并新建 `PetExpert.jsx`
3) 新增前端服务方法并完成端到端验证