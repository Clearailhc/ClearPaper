# Paper C 文献与数据集调研（第一轮，2026-10-15）

> 范围：工业视觉巡检的快慢模型升级路由（Paper C）。按“数据集 → 级联/路由 → 隐状态与层间轨迹 → 何时需要慢思考 → 有序与代价敏感评分”五条线检索。
> 核查程度：InspecSafe-V1 读了原文和 HF 数据卡；SafeSceneReason 下载了仓库逐项检查；其余大多只读了摘要或检索摘要，标“未细读”的需要后续精读。arXiv 编号都来自检索结果，引用前需逐个打开确认。

## 0. 结论速览（对 C 影响最大的五条）

1. **C 的核心想法已有前人工作，创新点需要收窄。** “用小模型的内部表征训练升级规则，标签是‘大模型对、小模型错’”在 [Gupta et al., ICLR 2024](https://arxiv.org/abs/2404.10136) 里已经做过（用小模型 embedding 和大模型中间层 embedding 做 post-hoc deferral）；[Signed Rescue Routing (arXiv:2609.07786)](https://arxiv.org/abs/2609.07786) 把标签进一步拆成“救回概率 − 误伤概率”，与我们的 VoD 标签几乎相同。C 剩下能站住的新意是：① 工业视觉巡检场景与快慢模型错误相关性的实证；② 针对 3:1 线性/全注意力混合结构的分层轨迹特征；③ 用代价敏感有序损失定义“纠错收益”。
2. **层间轨迹特征不一定赢过简单探针。** 多篇 2026 工作发现单层线性探针就能拿到很高 AUROC（[mean-shift](https://arxiv.org/abs/2608.28930)、[量化模型中层线性可解](https://arxiv.org/abs/2606.02628)）；[ICML 2025 的 Tuned Lens 分析](https://arxiv.org/abs/2507.06722)发现确定与不确定预测的层间轨迹几乎一样。**go/no-go 的对照组必须加上“单层线性探针”，只比 MSP + 熵不够。**
3. **InspecSafe-V1 自带天然的快慢模型对。** 原文报告 Qwen3-VL-8B 的 Thinking 版比 Instruct 版准确率高约 8 个点。可以先用 Qwen3-VL Instruct / Thinking 做 S1 / S2，不必先训练 CoT 模型。
4. **SafeSceneReason 不能当第二主数据集**（见 1.2），需要换。候选里最稳的是 [MMAD (ICLR 2025)](https://arxiv.org/abs/2410.09453)；工业安全方向可选 [LogiScope-VQA](https://arxiv.org/abs/2609.09790)。
5. **现有蓝图有两个引用查不到。** StepGate 的 arXiv 号 2610.07816 检索不到（只找到同名的 NeurIPS 2026 海报），REFLEX (arXiv:2609.26532) 完全找不到。投稿前必须核实或删除。

---

## 1. 数据集

### 1.1 主数据集：InspecSafe-V1（已读原文与数据卡）
- 链接：[论文 arXiv:2601.21173](https://arxiv.org/abs/2601.21173)，[HF: Tetrabot2026/InspecSafe-V1](https://huggingface.co/datasets/Tetrabot2026/InspecSafe-V1)，**CC BY 4.0，无访问限制，23.6 GB**。
- 规模：训练 3,763 帧（正常 3,014 / 异常 749），测试 1,250 帧（正常 999 / 异常 251）。没有验证集，需要从训练集切。
- **安全等级定义（原文附录 S1）**：Level I 高危（明火、烟雾、人员倒地）；Level II 中危（玩手机、积油、缺 PPE）；Level III 低危（积水、未戴口罩）；**Level IV 无异常**。一张图有多个隐患时取最严重的等级。
  - 注意顺序：**I 最危险、IV 是正常**，蓝图里写的 $\{0,1,2,3\}$ 要对齐方向。
  - **原文没给各等级的数量**，下载后要先统计；异常只有 251 张，分到三个危险等级后每级可能只有几十张，Bootstrap CI 必须做。
- 标注：Label Studio 多边形分割 + 场景描述 + 安全等级；两轮抽检（图像 5%、语义 10%），准确率要求 > 95%。
- 原文任务：输入 RGB 帧 + 标准提示，VLM 输出场景描述和安全等级；指标是等级准确率和 BGE-M3 描述相似度，附混淆矩阵。
- 原文基线：约 15 个 VLM（Claude-Opus-4.5、Gemini-3-Flash、GPT-5.2、GLM-4.6、多个尺寸的 Qwen3-VL Instruct / Thinking 等）。Thinking 版 Qwen3-VL-8B 比 Instruct 高约 8 个点；GPT-5.2 偏保守，把 30% 以上的正常样本判成异常。具体数字只在图 6 里，需要从图中读取。
- 数据卡提醒：HF 预览器报错（Arrow 结构问题），要直接下载文件读取；目录名里的 “Level01–Level04” 含义不明，**不一定是安全等级**，等级以标注文本为准。

### 1.2 SafeSceneReason（已下载仓库核查，降为附录数据）
- 仓库实际是 **MIT** 许可，不是 CC BY 4.0。
- **没有模型权重和逐题预测**；训练数据只有文本（no-CoT 8,810 条 / CoT 8,783 条），引用的 16,877 张图片未公开，文件名是 SHA-256 哈希。
- 测试集 1,000 题，**只有 200 题附图**（514 张，最长边 448 像素、JPEG 质量 45）。
- 题目主要来自 CDC / CSB 事故报告配图，不是蓝图说的 SH17 与井下现场照片。
- 原文没有测 ECE 或置信度；蓝图引用的 “Finding 3 校准失败” 指的是选项位置偏差。
- 用法：最多拿 200 道带图题做附录；或者向作者索要图片。

### 1.3 候选第二数据集

| 数据集 | 内容 | 获取 / 许可 | 适配度与问题 |
| :--- | :--- | :--- | :--- |
| **[MMAD](https://arxiv.org/abs/2410.09453)**（ICLR 2025） | 8,366 张工业图（38 类，来自 MVTec / VisA 等），39,672 道多选题，7 个子任务（异常判别、缺陷分类 / 定位 / 描述 / 分析等） | 公开：[GitHub jam-cc/MMAD](https://github.com/jam-cc/MMAD) | **推荐**：多选格式便于算置信度；领域内基准，引用多；原文 GPT-4o 平均 74.9%，留有纠错空间。缺点：是质检缺陷，不是安全风险 |
| **[LogiScope-VQA](https://arxiv.org/abs/2609.09790)**（2026-09） | 物流园区真实数据：2,476 图 + 2,918 视频，10,274 道人工校验 VQA，20 种风险、39 个子任务 | 摘要称 CC BY-NC-SA 4.0 公开，**下载链接待找** | 安全风险方向贴合；有“思考预算”分析。未细读，不确定有无风险等级 |
| **[SafeBuild-Bench](https://arxiv.org/abs/2608.00068)**（2026-08） | 3,314 个施工安全实例，保留时间戳与工地 ID（可按时间 / 工地切分） | 称已公开基准与评测脚本 | 施工场景；可做时间外推测试。未细读 |
| **ConstructionSite-10k**（arXiv 编号待核，检索结果指向 [2508.11011](https://arxiv.org/abs/2508.11011)） | 1 万张施工图：描述、违规 VQA、元素定位 | 待确认 | 规则违规（PPE、高处防护、危险接近），无风险等级 |
| **[iSafetyBench](https://arxiv.org/abs/2508.00399)**（2025） | 工业安全视频-语言基准 | 待确认 | 视频，S1 成本高 |
| **[MMR-AD](https://arxiv.org/abs/2604.10971)**（CVPR 2026） | 面向 MLLM 后训练的通用异常检测推理数据集（源自公开 AD 数据集） | 待确认 | 可作推理型 S2 的训练数据。未细读 |
| [TSHA](https://arxiv.org/abs/2603.29759)（2026） | 室内家居安全隐患，66,668 QA（测试 1,707） | 未给链接 | 非工业，仅备选 |
| [变电站外观缺陷集](https://ieee-dataport.org/documents/substation-equipment-appearance-defect-dataset-complex-inspection-scenarios)（IEEE DataPort） | 4,235 张电网巡检图，5 类缺陷 | 许可不明 | 与 InspecSafe 的电力场景接近，可做小规模迁移 |

**建议**：主数据 InspecSafe-V1；第二数据集用 MMAD（马上能下载、格式友好）；LogiScope-VQA 找到下载链接后作为第三个安全方向的数据集。

---

## 2. 相关方法

### 2.1 级联、路由与 Learning-to-Defer（与 C 最直接相关）

| 工作 | 要点 | 与 C 的关系 |
| :--- | :--- | :--- |
| [Jitkrittum et al., NeurIPS 2023](https://arxiv.org/abs/2307.02764) | 证明只看小模型置信度的 deferral 在大模型错误分布不均、标签噪声、分布偏移时可能显著次优；最优规则同时依赖两个模型 | 理论动机：为什么要预测“大模型能否纠正” |
| **[Gupta et al., ICLR 2024](https://arxiv.org/abs/2404.10136)** | 学习型 post-hoc deferral：标签是“大模型对且小模型错”；加入小模型 embedding 和大模型中间层 embedding 后进一步提升 | **最接近的前作，必须作为基线并讲清区别** |
| **[Signed Rescue Routing (arXiv:2609.07786)](https://arxiv.org/abs/2609.07786)** | 双头路由器分别预测“救回”和“误伤”，按差值排序，称在固定预算下 Bayes 最优；Qwen3-4B / 8B，MMLU 等 | 与 VoD 标签几乎一致；目前是 v1 预印本，摘要里数字还是 “TBD” |
| [Early Abstention (arXiv:2502.09054)](https://arxiv.org/abs/2502.09054) | 利用大小模型错误相关性，让小模型提前预判大模型会弃权 | 错误相关性的已有证据 |
| [Gatekeeper (arXiv:2502.19335)](https://arxiv.org/abs/2502.19335) | 微调小模型置信度，让它知道何时 defer；含视觉-语言任务 | 基线候选 |
| [Prefill 激活路由 (arXiv:2603.20895)](https://arxiv.org/abs/2603.20895) | 用开源编码模型的残差流激活预测闭源模型正确性，Fisher 可分性选层；SharedTrunkNet | 激活特征路由的近期工作 |
| [难度预测路由 (arXiv:2511.03808)](https://arxiv.org/abs/2511.03808)（NeurIPS 2025 WS） | 用 s1.1-32B 中间层表征预测难度 / 正确性，路由到最小可解模型 | 同上 |
| [RouteLLM](https://arxiv.org/abs/2406.18665)、[FrugalGPT](https://arxiv.org/abs/2305.05176)、[Hybrid LLM](https://arxiv.org/abs/2404.14618)、[L2D](https://proceedings.mlr.press/v119/mozannar20b.html) | 经典路由与 deferral | 蓝图已列 |
| [RouterBench](https://arxiv.org/abs/2403.12031)、[RouterArena](https://arxiv.org/abs/2510.00202)、[LLMRouterBench](https://arxiv.org/abs/2601.07206) | 路由评测框架；RouterArena 发现现有路由器不擅长识别“小模型就够了” | 评测协议参考 |
| StepGate（[NeurIPS 2026 海报](https://neurips.cc/virtual/2026/171289)） | 智能体逐步升级，Qwen2.5-1.5B / 7B | 蓝图写的 arXiv:2610.07816 **未检索到，需核实** |
| [ECVL-Router](https://arxiv.org/abs/2510.27256)、[VLM 选择路由 (2606.08970)](https://arxiv.org/abs/2606.08970)、[CUA 自适应 VLM 路由 (2603.12823)](https://arxiv.org/abs/2603.12823)、[SAFE-Cascade (2606.19646)](https://arxiv.org/abs/2606.19646) | 视觉-语言模型的路由 / 级联 | VLM 路由相关工作 |
| [Forced Deferral (2606.15308)](https://arxiv.org/abs/2606.15308) | 对抗图像压低小模型置信度，迫使级联升级 | 置信度路由的安全弱点，可放讨论 |
| **[SAEC (arXiv:2509.17136)](https://arxiv.org/abs/2509.17136)**、[AIVD (2601.04734)](https://arxiv.org/abs/2601.04734)、[LAECIPS (2404.10498)](https://arxiv.org/abs/2404.10498) | 工业视觉的边-云协同：SAEC 用场景复杂度估计决定是否上云，MVTec / KSDD2，开源 | **工业场景下最直接的竞品**，SAEC 应作基线 |

### 2.2 隐状态探针与层间动力学

| 工作 | 要点 | 对 C 的启示 |
| :--- | :--- | :--- |
| [LSD / Geometry of Truth (arXiv:2510.04933)](https://arxiv.org/abs/2510.04933) | 把各层隐状态当时间序列，单次前向检测幻觉；TruthfulQA AUROC 0.96；[代码开源](https://github.com/sirraya-tech/Sirraya_LSD_Code) | “层间动力学”已有人做，C 不能宣称首创 |
| [ICR Probe (arXiv:2507.16488)](https://arxiv.org/abs/2507.16488) | 看各模块对隐状态更新的贡献 | 类似“速度”特征 |
| [HSAD (arXiv:2509.13154)](https://arxiv.org/abs/2509.13154) | 跨层激活做 FFT 取频域特征 | 另一种轨迹特征，可作对照 |
| [TriLens (arXiv:2606.01033)](https://arxiv.org/abs/2606.01033) | 逐层 logit-lens 熵 | 与早退 JSD 特征相近 |
| [Automatic Layer Selection (arXiv:2605.26366)](https://arxiv.org/abs/2605.26366) | 中间层比末层更含幻觉信号；其“曲率”是 token 维度的，不是层维度 | 定义曲率时要说清楚是哪一维 |
| **[Mean Shift Suffices (arXiv:2608.28930)](https://arxiv.org/abs/2608.28930)**、**[中层线性可解 (arXiv:2606.02628)](https://arxiv.org/abs/2606.02628)** | 简单单层探针就够强（后者 AUROC 0.904–1.000） | **必须加“单层线性探针”基线** |
| **[Tuned Lens 不确定性分析 (ICML 2025, arXiv:2507.06722)](https://arxiv.org/abs/2507.06722)** | 确定与不确定预测的层间轨迹几乎一致，置信度在相近层突跃 | **对轨迹特征的直接反证**，是 C 最大的风险 |
| [LLM Microscope (arXiv:2510.04013)](https://arxiv.org/abs/2510.04013) | 用模型内部信号预测答案正确性与上下文利用 | 相关 |
| [VIB-Probe (arXiv:2601.05547)](https://arxiv.org/abs/2601.05547) | VLM 注意力头输出 + 变分信息瓶颈探针检测幻觉 | VLM 探针基线候选 |
| 8 个 VLM 的内部状态探针研究（[ACL Anthology 作者页](https://aclanthology.org/people/sai-akhil-kogilathota/)） | 不生成文本即可预测幻觉，AUROC 最高 0.93；通常末段 query token 状态最有用，个别架构中层或视觉特征更好 | 选层要逐个架构验证 |
| [Linear Probes Detect Task Format (arXiv:2606.02907)](https://arxiv.org/abs/2606.02907) | 探针分出的“推理模式”可能只是题型差异 | 实验要控制场景 / 题型混杂 |
| [HSRM (arXiv:2608.30841)](https://arxiv.org/abs/2608.30841) | 思考模式下，只读思考结束后的隐状态做验证更好 | S2 侧特征设计参考 |

混合注意力结构：没找到对 Gated DeltaNet 层做探针的工作；[一篇理论工作 (arXiv:2605.16640)](https://arxiv.org/abs/2605.16640) 证明 Qwen 式混合结构在某类检索任务上只需常数步思维链，纯 DeltaNet 做不到，可作为“两类层承载信息不同”的动机。**这是 C 目前最干净的空白点。**

### 2.3 何时需要慢思考
- [To CoT or not to CoT (ICLR 2025)](https://arxiv.org/abs/2409.12183)：CoT 的收益集中在数学和符号推理，其他任务提升很小，可选择性使用 CoT。
- [AdaThinkV (arXiv:2608.01980)](https://arxiv.org/abs/2608.01980)、[L2T (arXiv:2610.15810)](https://arxiv.org/abs/2610.15810)：多模态模型内部学习“想不想、想多久”，不需要外部路由器。是 C 的替代路线，应作为基线或至少讨论。
- [Controlling Thinking Speed (arXiv:2507.03704)](https://arxiv.org/abs/2507.03704)、[OThink-R1 (arXiv:2506.02397)](https://arxiv.org/abs/2506.02397)：推理模型内部快慢切换。
- [What Am I Missing? (arXiv:2605.31561)](https://arxiv.org/abs/2605.31561)：用隐状态探针分数决定是否干预，Qwen3 thinking / non-thinking 对比，收益不稳定。
- 检索里提到一项 30 对 base / thinking 模型的研究：思考模式在中等难度收益最大，最难档消失。来源待补。

### 2.4 有序风险头与代价敏感评分
- 单峰头：[Beckham & Pal, ICML 2017](https://proceedings.mlr.press/v70/beckham17a.html)（单参数同时控制众数位置和衰减速度，表达不了“平但不确定”的分布）；[Shaham et al. (arXiv:2011.07607)](https://arxiv.org/abs/2011.07607)（最优传输损失 + 单峰输出，更少过度自信）。
- 秩一致：[CORAL / CORN (arXiv:2111.08851)](https://arxiv.org/abs/2111.08851)。
- 校准：[ORCU (arXiv:2410.15658)](https://arxiv.org/abs/2410.15658)——只加有序约束会单峰但不校准，只加校准会校准但不单峰，两者要同时加。
- 非对称评分：[ACPS (arXiv:2006.11265)](https://arxiv.org/abs/2006.11265)、[Buchweitz, Romano, Tibshirani (arXiv:2505.00937)](https://arxiv.org/abs/2505.00937)。C 的代价敏感 RPS 应引用这两篇，并说明与已有非对称评分规则的关系。
- 结论：Table 4 应加 CORN 和 ORCU 两个对照，只比 Weibull / Binomial / Softmax 不够。

---

## 3. 对 Paper C 方案的修改建议

1. **重新表述贡献**：不再说“用单次前向内部特征预测慢模型能否纠正”是新问题；改为“在工业视觉巡检上，针对混合注意力主干做分层轨迹特征，并用代价敏感有序收益定义升级标签”，同时把快慢模型错误相关性的实证分析作为独立贡献。
2. **基线必须补上**：Gupta et al. 的 post-hoc embedding deferral；SRR 式双头（救回 / 误伤）；单层线性探针；SAEC 场景复杂度调度；AdaThinkV 或 L2T 式内部自适应思考（至少讨论）。
3. **修改 10/22 go/no-go**：轨迹特征的 AUROC 不仅要比 MSP + 熵高 ≥5 个点，还要**不低于单层线性探针**；否则按回退方案改成“VoD 路由 + 错误相关性实证”。
4. **S1 / S2 先用现成模型对**：Qwen3-VL-8B Instruct 与 Thinking（InspecSafe 原文已有约 8 点差距）可以马上跑；Qwen3.5 系列作为主干复验。
5. **InspecSafe 标签方向**：Level I 最严重、Level IV 正常；代价敏感 RPS 的漏报方向要按这个顺序重写。
6. **删除或核实**：StepGate 的 arXiv 号、REFLEX (arXiv:2609.26532)、SafeSceneReason 的“Finding 3”与“10,099 张现场图”说法。

## 4. 下一步

- [ ] 下载 InspecSafe-V1（23.6 GB），统计各安全等级数量，确认测试标签齐全。
- [ ] 下载 MMAD，确认题型与评测脚本。
- [ ] 找 LogiScope-VQA、SafeBuild-Bench 的下载链接。
- [ ] 精读：Gupta et al. ICLR 2024、SRR、LSD、Tuned Lens 不确定性分析、SAEC、AdaThinkV。
- [ ] 第二轮检索：Qwen3-VL Thinking vs Instruct 在工业 / 安全基准上的差距；VLM 层间探针的选层规律。
