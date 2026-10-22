# Paper C 完整技术蓝图（v2.0 收敛定稿版）：工业视觉巡检风险分级与基于层间轨迹的快慢模型升级路由

* **锁定投稿目标（顺位 1）**：**[CVPR 2027](https://cvpr.thecvf.com/Conferences/2027/CallForPapers)**（*Robotics, Embodied Vision & Industrial Safety Applications Track*）
  * **关键时间节点**：摘要注册 **2026-11-10 (AoE)** | 全文提交 **2026-11-16 (AoE)** | 补充材料 **2026-11-23 (AoE)**
  * **Go/No-Go 评估节点**：**2026-10-22**（最早检验点：在 `8×H20` 上离线跑完快慢模型预测后立即检验轨迹特征的 AUROC 与级联增益）
  * **第二顺位备选**：**ICCV 2027** 或 **ICML 2027**
* **论文暂定标题**：*Learning When Slow Thinking Can Correct Fast Vision: Inter-Layer Trajectory Probing and Cost-Sensitive Escalation for Industrial Safety Inspection*
* **核心主张（v2.0 收窄后）**：在工业视觉巡检与现场安全风险分级中，单次前向快模型（System-1）的输出端置信度/熵无法区分“图像遮挡模糊导致的不可恢复噪声”与“复杂多源隐患导致的单步推理不足”。我们利用单次前向中提取的**层间隐状态轨迹特征（区分 Qwen3.5 的全注意力锚点层与线性注意力层）**，直接预测**“慢模型（System-2）能否纠正快模型（Value of Deliberation）”**，并配合代价敏感有序评分（Cost-Sensitive RPS）与单峰有序头，在相同升级预算下显著超越基于置信度或熵的级联路由。

---

## 一、核心故事线（Storyline）与审稿防御修正

### 1.1 为什么常规“低置信度升级”在工业巡检中效率低下？
在工业巡检机器人（**[InspecSafe-V1, arXiv:2601.21173](https://arxiv.org/html/2601.21173v1)**）与工业现场安全隐患推理（**[SafeSceneReason, arXiv:2608.09230](https://arxiv.org/html/2608.09230v1)**）中，边缘端快模型（System-1）与云端慢思考模型（System-2）级联面临两个核心挑战：

1. **快慢模型的高置信度错误重合与无效升级**：
   * **如实转述前人文献（按 `paper_plan.md` 第 7.5 条修正）**：[arXiv:2609.29769](https://www.emergentmind.com/papers/2609.29769) 在 7 个纯文本多级打分面板（Rubric Panels）中发现，在每个面板挑出的 top-12 高置信度错误样本对上，生成式慢模型有 **96%（252 次判断中的 242 次）** 重复了单步快模型的错误，导致基于置信度阈值的级联相对最佳单模型仅带来 **+1.5% ~ +2.0%** 的微弱提升；同时 [StepGate (arXiv:2610.07816)](https://arxiv.org/html/2610.07816v1) 也指出常规不确定性路由在等预算下难以显著拉开与随机升级的差距。
   * **在工业视觉数据上的核心科学问题**：上述“错误高度重合”结论来自纯文本量表，在真实工业视觉巡检（存在浓烟遮挡、强反光、多工人多设备交互）中，快慢模型的错误相关性究竟如何？哪些样本才是慢模型真正能救回来的？
2. **[SafeSceneReason (arXiv:2608.09230)](https://arxiv.org/html/2608.09230v1) 已证实的巨大“快慢纠错空间”**：
   * 经核查 [SafeSceneReason 原文 Table 2](https://arxiv.org/html/2608.09230v1)，在 10,099 张真实工业现场图像（含 SH17 与井下重度粉尘模糊数据集 DsLMF+）上，同为 **`Qwen3.5-9B`**：
     * **System-1（`SFT w/o CoT`，单步直接输出）**：Micro 准确率为 **75.10%**（在复杂比较推理 `Comp.` 上仅 **71.30%**，定量推理 `Quant.` 上仅 **70.61%**）；
     * **System-2（`CoT SFT`，长推理链模式）**：Micro 准确率跃升至 **89.00%**（在 `Comp.` 上达 **92.59%**，净增 **+21.29 个点**；在 `Quant.` 上达 **88.17%**，净增 **+17.56 个点**！）。
   * 原文 Finding 3 明确指出：微调后的单步模型与推理模型仍然面临严重的**不确定性失准（Calibration Failures）**。当图像因井下粉尘、强光而高度模糊时，快模型输出低置信度，但慢模型同样看不清（升级白白浪费算力）；当图像清晰但涉及多物体空间安全规程对比（如 `Comp.` / `Quant.`）时，单步快模型往往给出**表面高置信度的错误判断**，而这恰恰是慢模型能以 $>90\%$ 把握纠正的高价值目标！

### 1.2 方法定位与审稿避坑修正（遵循 `paper_plan.md` 第 4 节）
* **降级 $\mathsf{TC}^0$ 电路深度表述**：将单步预填充模型固定层数与多步思维链的计算深度差异作为**直观动机讨论（Motivation）**，不作为已证明的复杂性理论定理。
* **明确与 Learning-to-Defer (L2D) 及 LLM Routing 的关系**：预测“System-2 相对 System-1 的净收益是否超过调用成本”在问题建模上与 Learning-to-Defer（[Mozannar & Sontag, ICML 2020](https://proceedings.mlr.press/v119/mozannar20b.html)）及模型路由（[FrugalGPT](https://arxiv.org/abs/2305.05176)、[RouteLLM (ICLR 2025)](https://arxiv.org/abs/2406.18665)、[Hybrid LLM (ICLR 2024)](https://arxiv.org/abs/2404.14618)）同源。我们的核心区别在于：**不训练额外的外部大型路由器，而是直接提取 System-1 自身单次前向的层间隐状态轨迹动力学特征（速度、曲率、早退 JSD）来捕捉单步推理未收敛信号**。
* **修正 `InspecSafe-V1` 量表级数与统计规范**：`InspecSafe-V1` 实际为 **4 级安全风险量表**（训练集 3,763 张，测试集 1,250 张，其中异常样本 251 张）。在小样本异常子集上，**严禁报告 `<0.5%` 这类缺乏统计支撑的极端百分比**，所有指标一律附带 **1,000 次 Bootstrap 95% 置信区间（CI）**。

---

## 二、全面更新的 Baseline 与数据集配置（2026-10-15 核实版）

### 2.1 双主力工业视觉数据集（均已核实公开且含图像）
1. **[InspecSafe-V1 (arXiv:2601.21173)](https://arxiv.org/html/2601.21173v1)**（HuggingFace 公开）：41 台巡检机器人在隧道、烧结车间、石化厂、输煤栈桥等 5 大恶劣场景采集的 **5,013 个多模态实例**（训练 3,763 / 测试 1,250，含 4 级 Safety Level 标注）。
2. **[SafeSceneReason (arXiv:2608.09230)](https://github.com/KangKanng/safescenereason)**（GitHub CC BY 4.0 公开）：**10,099 张真实工业现场与矿山井下图像**上的 110,581 条多模态安全问答与风险干预评估，外加 13,114 条含事故调查图表的 OSHA/NIOSH/CSB 报告问答（纯文本 Rubric Judges 面板仅放在附录作为补充分析）。

### 2.2 2026 当季快慢模型配对与对比基线矩阵

| 类别 | 具体模型与方法（均附原始出处） | 角色与对比设计 |
| :--- | :--- | :--- |
| **System-1（边缘快模型主干）** | **`Qwen3.5-2B / 4B / 9B`**（LoRA 微调，单步 Prefill-Only）+ **`Gemma 4 E4B`**（跨家族复验主干） | 證明层间轨迹探针在混合注意力（Qwen3.5）与标准全注意力（Gemma 4）两类主干上均有效。 |
| **System-2（云端慢思考模型池）** | **`Qwen3.5-122B-A10B`**（8×H20 vLLM 部署）、**[`Qwen3.8-27B`](https://github.com/QwenLM/Qwen3.8)（Thinking 模式）**、`Qwen3.5-9B CoT SFT`（对齐 SafeSceneReason 官方表 2），外加 1 个闭源模型（**`GPT-5.6-Sol`** 或 **`Gemini-3.1-Pro`**） | 离线跑完整个训练集与测试集并缓存输出分布，支持零成本测试任意升级预算（10% / 20% / 30%）。 |
| **输出端不确定性路由基线** | 最大 Softmax 概率（MSP）、[温度缩放 (Guo et al., ICML 2017)](https://proceedings.mlr.press/v70/guo17a.html)、MC Dropout、[语义熵 (Farquhar et al., Nature 2024)](https://www.nature.com/articles/s41586-024-07421-0)、MSP + 末端熵组合 | 检验“仅看最后一层输出概率/熵”在工业视觉巡检上的路由上限。 |
| **主流级联与 L2D 路由基线** | [FrugalGPT (TMLR 2024)](https://arxiv.org/abs/2305.05176)、[RouteLLM (ICLR 2025)](https://arxiv.org/abs/2406.18665)、[Hybrid LLM (ICLR 2024)](https://arxiv.org/abs/2404.14618)、[Learning-to-Defer (ICML 2020)](https://proceedings.mlr.press/v119/mozannar20b.html)、[StepGate (arXiv:2610.07816)](https://arxiv.org/html/2610.07816v1)、[REFLEX (arXiv:2609.26532)](https://arxiv.org/abs/2609.26532) | 在严格对齐的升级率（Escalation Rate）下对比 QWK、Macro-F1、高危漏报数与 AURC。 |

---

## 三、模型结构与训练方法（Methodology）

### 3.1 适配 Qwen3.5 混合架构的层间轨迹探针（Inter-Layer Trajectory Probe）
* **关键结构发现与分层采样设计（已核实 Qwen3.5 源码）**：
  `Qwen3.5` 采用 **`full_attention_interval = 4` 的 3:1 混合结构**（每 3 层 Gated DeltaNet 线性注意力层后接 1 层标准 Full Softmax GQA 全注意力层）。由于线性递推层与全注意力层的残差更新几何性质不同，若将两类层混在一起直接算二阶差分会产生周期性伪影。因此，我们定义两套清晰的轨迹统计序列：
  1. **全注意力锚点层轨迹（Full-Attention Anchor Trajectory）**：仅在全注意力层索引序列 $\mathcal{I}_{\text{full}} = \{4, 8, 12, \dots, L\}$ 上提取决策位置归一化隐状态 $\hat{\mathbf{h}}_l = \operatorname{LayerNorm}(\mathbf{h}_l)$；
  2. **线性注意力子轨迹（Gated DeltaNet Trajectory）**：在最后一组线性层上单独统计局部更新速度。
* **四维零开销轨迹特征 $\boldsymbol{\xi}(s_t)$**：
  对末段锚点层序列 $l \in \mathcal{I}_{\text{full}}$（令前一个锚点层为 $l' = l - 4$），计算：
  1. **锚点层间速度（Inter-Block Velocity）**：$v_l = \|\hat{\mathbf{h}}_l - \hat{\mathbf{h}}_{l'}\|_2$；
  2. **锚点层间方向曲率（Representational Turning Curvature）**：$\kappa_l = 1 - \frac{\langle \Delta \mathbf{h}_l, \Delta \mathbf{h}_{l'} \rangle}{\|\Delta \mathbf{h}_l\|_2 \|\Delta \mathbf{h}_{l'}\|_2 + \epsilon}$，其中 $\Delta \mathbf{h}_l = \hat{\mathbf{h}}_l - \hat{\mathbf{h}}_{l'}$；
  3. **早退层与末层预测分布 JSD（Early-Exit JSD）**：将倒数第二个全注意力锚点层 $\hat{\mathbf{h}}_{L-4}$ 与末层 $\hat{\mathbf{h}}_L$ 输入同一分类头，计算 $d_{\text{JSD}} = \operatorname{JSD}(P_L \parallel P_{L-4})$；
  4. **末层预测熵与最大概率**：$H(P_L)$ 与 $p_{\max}(P_L)$。
* **升级门控与纠错收益标签（Value-of-Deliberation Gate）**：
  将 $\boldsymbol{\xi}(s_t)$ 输入一个 2 层 MLP 门控头预测升级概率 $p_{\text{esc}}(s_t) = \sigma(\operatorname{MLP}(\boldsymbol{\xi}(s_t)))$。训练标签定义为 System-2 相对 System-1 的代价敏感损失下降量是否超过升级成本阈值 $c_{\text{esc}}$：
  $$\Delta \mathcal{L}(s_t) = \mathcal{L}_{\text{CS-RPS}}\big(\mathbf{p}_{\text{S1}}(s_t), y^*\big) - \mathcal{L}_{\text{CS-RPS}}\big(\mathbf{p}_{\text{S2}}(s_t), y^*\big), \quad z_{\text{esc}}^*(s_t) = \mathbb{I}\big[\Delta \mathcal{L}(s_t) > c_{\text{esc}}\big]$$

### 3.2 4 级量表上的单峰有序头对比与代价敏感 RPS（Cost-Sensitive RPS）
1. **单峰有序分布头系统对比（回应尾部截断双峰风险）**：
   在 `InspecSafe-V1` 的 $K=4$ 级安全风险量表 $\{0, 1, 2, 3\}$ 上，如 `paper_plan.md` 所指出，若离散 Weibull 分布 $p_i = \exp(-(i/\lambda)^k) - \exp(-((i+1)/\lambda)^k)$ 在最高级 $K-1=3$ 处直接做尾部截断 $p_{K-1} = \exp(-((K-1)/\lambda)^k)$，当尺度参数 $\lambda$ 偏大时可能在最高级产生人为的第二个截断峰。为此，我们：
   * 一方面采用**未截断有限支撑归一化** $\tilde{p}_i = \frac{p_i}{\sum_{j=0}^{K-1} p_j}$ 消除尾部堆积峰；
   * 另一方面同场对比天然定义在有限集合 $\{0, \dots, K-1\}$ 上的**二项/泊松单峰有序头（Binomial / Poisson Unimodal Head，[Beckham & Pal, ICML 2017](https://proceedings.mlr.press/v70/beckham17a.html)）**与标准 Softmax 头，用实测 QWK 和 ECE 说话。
2. **代价敏感有序评分规则（Cost-Sensitive RPS）**：
   设累积预测分布为 $F_m = \sum_{i=0}^m p_i$，真实风险等级指示阶跃为 $O_m = \mathbb{I}[y^* \le m]$。由于将高风险漏报为低风险（预测等级偏小 $\Rightarrow F_m > O_m$）的代价远高于虚警，引入漏报惩罚权重 $\eta \ge 1$：
   $$\mathcal{L}_{\text{CS-RPS}}(\mathbf{p}, y^*) = \frac{1}{K-1} \sum_{m=0}^{K-2} \Big[ \eta \cdot \max(0, F_m - O_m)^2 + \max(0, O_m - F_m)^2 \Big]$$
   * **Proposition 1（代价敏感最优分位数位移）**：*注：正文中严谨表述为“代价敏感评分规则（Cost-Sensitive Scoring Rule）”，在 $\eta \neq 1$ 时不称作“严格适当（Strictly Proper）”。* 对任意真实后验累积概率 $P_m = P(y^* \le m \mid s_t)$，最小化期望代价敏感 RPS 的唯一最优预测累积分布满足闭式关系：
     $$F_m^* = \frac{P_m}{P_m + \eta (1 - P_m)}$$
     当 $\eta = 1$ 时退化为标准严格适当 RPS（$F_m^* = P_m$）；当 $\eta > 1$ 时，$F_m^* < P_m$，即在保持单调性的同时自动将高风险等级预测概率向上偏移，且可通过逆映射 $\hat{P}_m = \frac{\eta F_m^*}{1 + (\eta - 1) F_m^*}$ 无损还原真实校准概率！

---

## 四、实验设计与 10/22 Go/No-Go 执行清单

### 4.1 四大核心实验表（全指标附带 Bootstrap 95% CI）
1. **Table 1（`InspecSafe-V1` 与 `SafeSceneReason` 级联总表）**：
   * 在 10% / 20% / 30% 升级预算下，对比 MSP、温度缩放、语义熵、FrugalGPT、RouteLLM、L2D、StepGate 与我方方法，报告 Accuracy、Macro-F1、QWK、ECE 及高危漏报数（附 95% Bootstrap CI）。
2. **Table 2（“可纠错性（Correctability）”预测 AUROC 与快慢模型错误相关性表）**：
   * 在 `InspecSafe-V1`（视觉巡检）与 `SafeSceneReason`（视觉安全推理，按 `Perc.` / `Comp.` / `Quant.` 子类拆解）上，实测快慢模型的错误重合率，并对比“仅用末端 MSP+熵” vs. “加入全注意力锚点层轨迹速度/曲率”预测 `S1 错且 S2 对` 的 **AUROC 与 AUPRC**。
3. **Table 3（混合注意力分层轨迹消融与跨主干复验表）**：
   * 对比 `Qwen3.5-4B/9B`（全注意力锚点层轨迹 vs. 线性注意力层轨迹 vs. 全层混合轨迹）与 `Gemma 4 E4B`（纯全注意力层轨迹），验证针对 3:1 Gated DeltaNet 混合架构分层提取轨迹的必要性。
4. **Table 4（4 级量表有序头与代价敏感系数 $\eta$ 消融表）**：
   * 对比归一化离散 Weibull 头、Binomial 单峰头（[Beckham & Pal 2017](https://proceedings.mlr.press/v70/beckham17a.html)）与普通 Softmax 头；展示 $\eta \in \{1, 2, 5, 10\}$ 下的漏报-虚警帕累托曲线及逆映射还原后的 ECE。

### 4.2 10/15 — 10/22 第一周闪电验证与 Go/No-Go 判据
* **10/15–10/19**：在 `8×H20` 上下载 `InspecSafe-V1` 与 `SafeSceneReason`；用 `Qwen3.5-4B/9B` 跑通 System-1 微调，同时用 vLLM 跑完 `Qwen3.5-122B-A10B` 与 `Qwen3.8-27B`（及 `SafeSceneReason` 的 `Qwen3.5-9B CoT`）在全集上的离线预测，生成每道题的 `(S1 预测, S1 各层隐状态, S2 预测, 真实标签)` 缓存表。
* **10/20–10/22**：在缓存表上直接训练轻量轨迹 MLP 门控头，对比 MSP + 熵基线。
* **10/22 Go/No-Go 硬指标**：
  1. 加入层间轨迹特征（速度 $v_l$ + 曲率 $\kappa_l$ + 早退 JSD）预测“System-2 能纠正 System-1”的 **AUROC 比单纯使用 `MSP + 末端熵` 高出 $\ge 5.0$ 个点**；
  2. 在 **20% 升级预算**下，级联系统的整体准确率或 Macro-F1 **比最佳单一模型高出 $\ge 3.0$ 个点**。
  * **决策与回退规则（Fallback Plan）**：
    * 若通过：锁定现有架构，全速推进 `Gemma 4 E4B` 复验与完整消融，直冲 11/16 CVPR 截稿；
    * 若层间曲率未达 +5 AUROC 但 VoD 路由本身有效：立即砍掉“流形曲率”包装，将故事线收敛为**“面向工业多模态安全评估的代价敏感可纠错路由（Value-of-Deliberation Routing）与视觉场景错误相关性实证分析”**（依托 `SafeSceneReason` 高达 +21.29 点的 `Comp.` 子类差距，依然是一篇极具分量的实证+方法论文），或视进度调整至 ICCV 2027。
