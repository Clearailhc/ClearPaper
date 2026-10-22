# A-JEV 三篇论文投稿总纲、可行性校准与共享代码架构（v2.0 融合定稿版）

> **版本：2026-10-15（v2.0）**。本文档深度融合了初始技术蓝图、`paper_plan.md`（与 Claude Fable 5 讨论后的可行性收敛评估），以及针对第 8 节“待确认事项”完成的**一手原文献核查结论**。所有底座模型均已升级至 **2026 年当季最新代际（Qwen3.5 / Qwen3.8 / Gemma 4）**，所有基线引用均已替换为原始论文直链，所有夸大表述均已按顶会审稿防御标准收窄为可验证的实证主张。

## 一、三篇论文总览、算力分配与 Go/No-Go 铁律

### 1.1 投稿顺位与决策排期表

| 论文 | 核心主题与收敛主张 | 首投目标 | 截稿时间（已核实） | Go/No-Go 节点 | 备选目标 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Paper A** | 校准的单次前向多模态事件抽取与免检测器视觉论元定位（以**反事实图像负样本抑制视觉脑补**为主创新） | **[CVPR 2027](https://cvpr.thecvf.com/Conferences/2027/CallForPapers)** | 注册 **11/10**，全文 **11/16**，补充材料 **11/23**（AoE） | **10/24** | ICCV 2027（预计 2027 年 3 月） |
| **Paper C** | 工业视觉巡检风险分级与基于**层间轨迹动力学**的快慢模型升级路由 | **[CVPR 2027](https://cvpr.thecvf.com/Conferences/2027/CallForPapers)** | 同上（**CVPR 绝不延期**；全体作者需注册 OpenReview 并承诺审稿） | **10/22** | ICCV 2027 或 ICML 2027 |
| **Paper B** | 工业故障诊断的神经符号校准决策（**Householder 极性正交反射 + $\alpha$-Entmax 稀疏集合头 + 保形拒识**） | **[ICDE 2027 Industry & Applications](https://icde2027.github.io/important-dates.html)**（已确认有自有工业数据） | **12/1 17:00 PT**（约 2027-02-15 出结果，无 Rebuttal） | **10/31** | ICDE 放榜后再定（见 `docs/paper_plan.md` 第 5 节） |

### 1.2 硬件资源与团队分工矩阵

| 资源类别 | 具体配置与分配方案 |
| :--- | :--- |
| **8 × NVIDIA A800 (80GB)** | **Paper A 主力训练集群**：以 `Qwen3.5-4B/9B` 为主干、`Gemma 4 E4B` 为跨家族复验主干，在 `ACE2005 + imSitu/SWiG` 上微调并评测 `M2E2` 与反事实负样本集。 |
| **8 × NVIDIA H20 (96GB)** | **Paper C 主力集群 + 大模型推理池**：用 vLLM 部署 `Qwen3.5-122B-A10B`（BF16 约 244 GB，8×H20 總显存 768 GB 充裕容纳）与 `Qwen3.8-27B` 作为 System-2 离线刷完训练集/测试集；同时承担 A 与 C 的开源 VLM 基线推理；**自 10/15 起固定划拨 1–2 张 H20 给 Paper B** 跑 `DiagnosticIQ` 与 `FailureSensorIQ`。 |
| **人员架构** | Paper A、C、B 各设 **1 位专职一作**；另设 **1 位共享代码负责人**维护 `SystemOne-Lab` 公共库（数据加载、校准指标 ECE/Brier/RPS、统一评测脚本）；**Haochen 总负责**统筹把关。 |

---

## 二、`paper_plan.md` 第 8 节“待确认事项”一手核查结论（2026-10-15 已全部查清）

针对你与 Fable 5 讨论后列出的待核实问题，我们直接调阅了各篇 arXiv 原文与官方代码库，逐项给出确凿答案：

1. **【已核实】CalOn（[arXiv:2610.17113](https://arxiv.org/html/2610.17113v1)）在 M2E2 上的实验设定到底是什么？**
   * **核查结果**：根据 [CalOn 原文 Section 4.1、Table 3、Table 9 及 Appendix B.2 / Appendix J](https://arxiv.org/html/2610.17113v1)，CalOn 在 M2E2 上是**纯文本、零样本跨数据集评测（Zero-Shot Text-Only Transfer）**。作者将 M2E2 测试集转换为 5,996 条纯文本输入（涉及 8 类事件），**完全丢弃了图像模态**，且其训练集（MAVEN-Arg、GENEVA、RAMS、PHEE 与合成文本）不包含 ACE2005 或 M2E2（而对比基线 [GoLLIE-7B](https://arxiv.org/abs/2310.03668) 训练过与 M2E2 同源的 ACE2005）。
   * **具体数字**：加入事件类型描述（+desc）后，CalOn-0.6B 在 M2E2 上取得 `Arg F1 (gold triggers) = 30.9%`、`Trigger F1 (end-to-end) = 9.2%`、`Arg F1 (end-to-end) = 3.6%`；在未修正前 `ECE = 0.72`，加入先验修正与温度缩放后 `ECE = 0.66`（[CalOn Table 9](https://arxiv.org/html/2610.17113v1)）。
   * **对 Paper A 的指导**：M2E2 官方标准设定（[WASE](https://aclanthology.org/2020.acl-main.230.pdf)、[CAMEL](https://arxiv.org/abs/2306.08966)）是在 `ACE2005（文本）+ imSitu/SWiG（图像）` 上训练、在 `M2E2` 上零样本测试。因此 Paper A 的主表必须**将“遵循 M2E2 标准协议（ACE05+SWiG 训练）”与“纯零样本无 ACE05 训练（对齐 CalOn）”分栏清楚标注**，既公允对比 CalOn 的两步串行误差累积，又在标准多模态协议下正面对标 CAMEL（Multimedia Arg F1 33.2%）。

2. **【重大利好已核实】SafeSceneReason（[arXiv:2608.09230](https://arxiv.org/html/2608.09230v1)）是否公开、是否含图像、有没有现成基线？**
   * **核查结果**：**完全开源（CC BY 4.0，代码与数据见 [GitHub: KangKanng/safescenereason](https://github.com/KangKanng/safescenereason)），且包含大规模真实工业现场图像！** 数据集由两部分构成：① **Scene-centric Track**：基于 10,099 张真实工业现场图像（8,099 张来自 SH17，2,000 张来自含重度粉尘、模糊、遮挡的矿山井下数据集 DsLMF+）构建的 **110,581 条多模态安全问答对**；② **Report-centric Track**：来自 OSHA、NIOSH FACE 与 CSB 真实事故调查报告的 **13,114 条含现场纪实图表的深度问答对**。
   * **直接省去一半工作量的核心发现**：[SafeSceneReason 原文 Table 2](https://arxiv.org/html/2608.09230v1) 已经用 **`Qwen3.5-9B`** 在 `8×A100` 上跑完了 **System-1（`SFT w/o CoT`，直接输出单字母选项）** 与 **System-2（`CoT SFT`，先生成推理链再给答案）** 的完整对比：
     * `Qwen3.5-9B Base`：**37.40% Micro / 41.94% Macro**
     * `Qwen3.5-9B SFT w/o CoT`（天然的 **System-1 快模型**）：**75.10% Micro / 76.22% Macro**
     * `Qwen3.5-9B CoT SFT`（天然的 **System-2 慢模型**）：**89.00% Micro / 88.70% Macro**（甚至超过了闭源 `GPT-5.6-Sol` 的 88.70% 和 `GPT-5.5` 的 87.90%！）
     * 更关键的是，System-1 与 System-2 之间存在 **+13.90 个点**的巨大可纠错空间（在复杂比较推理 `Comp.` 上从 **71.30% 跃升至 92.59%，差值达 +21.29 个点**；在定量推理 `Quant.` 上从 **70.61% 跃升至 88.17%，差值达 +17.56 个点**），且原文 Finding 3 明确指出：*“Supervision reduces reasoning errors but leaves calibration failures... do not fully solve uncertainty calibration or safe intervention selection.”* 这简直是为 **Paper C** 量身定做的官方背书！

3. **【已核实】Qwen3.5 各尺寸的线性/全注意力层精确配比，以及闭源基线型号**
   * **核查结果**：根据 HuggingFace `transformers` 中的 [`modular_qwen3_5.py` 源码定义](https://gist.github.com/justinchuby/0213aa253664fb72e9adb0089816de15) 及 [Qwen 官方技术博客](https://qwen.ai/blog?id=qwen3.8-flash-next)，`Qwen3.5` 全系默认设置 `full_attention_interval = 4`，即严格遵循 **`[Gated DeltaNet 线性注意力 × 3, Full Softmax GQA 全注意力 × 1]` 的 3:1 交替循环结构（75% 线性层 + 25% 全注意力层）**。以 32 层的 `Qwen3.5-9B` 为例，第 4、8、12、16、20、24、28、32 层共 8 层为带 RoPE 的全注意力层，其余 24 层为带因果一维深度卷积（`conv_kernel=4`）且无 RoPE 的 Gated DeltaNet 线性递推层。
   * **对 Paper A 与 Paper C 的架构指导**：
     * **Paper A**：完全印证 `paper_plan.md` 的判断——绝不能直接暴力去掉 Qwen3.5 主干内部的因果掩码（因为 Gated DeltaNet 线性层和因果 Conv1D 强依赖因果递推顺序），而是**保持 Qwen3.5 主干不动，在顶层之上附加 $L_{\text{bi}}=2\sim 4$ 层全向双向注意力交互块**（与 [CalOn Section 3.1](https://arxiv.org/html/2610.17113v1) 的做法完全一致）。
     * **Paper C**：在提取层间轨迹速度 $v_l$ 和方向曲率 $\kappa_l$ 时，由于线性层与全注意力层的残差更新范数尺度不同，**必须在全注意力锚点层序列 $\{h_4, h_8, \dots, h_{24}, h_{28}, h_{32}\}$ 上单独计算跨块轨迹曲率**，并在消融实验中对比“仅全注意力锚点层轨迹”与“混合层全轨迹”，这反而成了针对 2026 混合架构的独特亮点！
   * **闭源多模态基线型号确认**：结合 [SafeSceneReason Table 2](https://arxiv.org/html/2608.09230v1) 与 2026 年 10 月最新 API，闭源视觉大模型统一选用 **`GPT-5.6-Sol`（或 `GPT-5.5`）**、**`Gemini-3.1-Pro`（或 `Gemini-3.5-Flash`）**、**`Claude-Fable-5.1`（或 `Claude Opus 5.5`）**。

4. **【已核实】KDD 2027 第 2 轮（Cycle 2）官方日期**
   * **核查结果**：根据 [KDD 2027 Research Track CFP](https://kdd2027.kdd.org/research-track-call-for-papers/) 与 [ADS Track CFP](https://kdd2027.kdd.org/applied-data-science-ads-track-call-for-papers/) 官方页面，KDD 2027 第一轮（Cycle 1）录用通知日为 **2026 年 11 月 14 日**，官方已明确第二轮（Cycle 2）截稿窗口为 **2027 年 2 月初（February 2027 Cycle）**（具体日期通常在 2 月 1 日—10 日之间，将于 11 月中旬第一轮放榜时开放提交系统）。这与 CVPR Rebuttal（2027-01-25 至 02-01）完美错峰。

5. **【待团队内部拍板】两项组织与数据确认**
   * [ ] **三篇论文的一作人选与共享代码负责人姓名**（由 Haochen 本周内敲定）。
   * [x] **Paper B 是否有真实工业数据**：**已确认有自有工业数据**，12/1 投 **ICDE 2027 Industry & Applications Track**（无 Rebuttal 负担）；开源补充数据见 [`docs/paper_b_open_datasets.md`](../../docs/paper_b_open_datasets.md)。

---

## 三、底座模型选型规范（2026-10-15 全面升级版）

淘汰原草案中的 `Qwen2.5-VL`、`GPT-4o` 等 2024–2025 旧模型，三篇论文统一采用以下 2026 当季模型矩阵：

| 角色定位 | 选定开源/闭源模型 | 核心依据与显存估算 |
| :--- | :--- | :--- |
| **Paper A / C 的主干（System-1）** | **Qwen3.5-2B / 4B / 9B**（2026.03，Apache 2.0） | 原生多模态早融合（Early Fusion）；3:1 Gated DeltaNet 混合注意力极速 Prefill；[Kev](https://github.com/jaredpalmer/kev) 已验证其决策探针性能。 |
| **跨家族主干复验（证明泛化性）** | **Gemma 4 E4B / 26B-A4B**（[2026.04，Apache 2.0](https://rits.shanghai.nyu.edu/ai/google-releases-gemma-4-frontier-open-models-under-apache-2-0/)） | 原生多模态，纯标准注意力结构（与 Qwen3.5 混合结构形成对照），彻底封死“方法只对 Qwen 有效”的质疑。 |
| **Paper C 的 System-2 及开源大基线** | **Qwen3.5-122B-A10B**（MoE，BF16 约 244 GB，8×H20 轻松部署）、**[Qwen3.8-27B](https://github.com/QwenLM/Qwen3.8)**（2026.08，原生支持图像与 Thinking 模式） | 均为当前最强开源视觉推理模型（注：`Qwen3.8-2.4T` 开源版暂不支持图像，故不采用）。在 `SafeSceneReason` 上还可直接复用 `Qwen3.5-9B CoT SFT`（89.0%）。 |
| **其他开源 VLM 对比梯队** | **Gemma 4 31B**、**InternVL3.5**、**Qwen3-VL-8B/32B** | 覆盖主流开源多模态家族（[2026 VLM 综述](https://www.overshoot.ai/blogs/vlm-survey-2026)）。 |
| **闭源旗舰 VLM/LLM 对比梯队** | **GPT-5.6-Sol / GPT-5.5**、**Gemini-3.1-Pro / 3.5-Flash**、**Claude-Fable-5.1 / Opus 5.5**（引用官方表时沿用原表型号） | 在 `DiagnosticIQ` 与 `SafeSceneReason` 上有大量现成官方跑分可直接引用，零 API 成本对比，仅需在自建反事实子集上少量调用 API。 |
| **Paper B 的纯文本主干** | **Qwen3.5-0.8B / 4B（Kev 架构）**、**ModernBERT-large（[Laya](https://github.com/NandhaKishorM/laya)）**、**Qwen3.8-27B** | 与 Paper A、C 统一到 Qwen3.5 代际，共享 `SystemOne-Lab` 底层。 |

---

## 四、三篇论文的方法瘦身与核心纪律（遵循“1 主创新 + 1 辅助创新”）

为避免审稿人批评“堆砌技巧（Kitchen-Sink）”或“把同一工作拆成三篇（Salami Slicing）”，严格执行以下正交切分与做减法原则：

| 维度 | **Paper A（CVPR 2027）** | **Paper C（CVPR 2027）** | **Paper B（ICDE 2027 Industry）** |
| :--- | :--- | :--- | :--- |
| **叙事主线（去 Jev 化）** | **多模态事件抽取与视觉定位校准**：Jev/CalOn 仅在 Related Work / Motivation 提及，正文聚焦跨模态事件抽取的**两步误差传播**与**视觉过度解读假阳性**。 | **工业视觉巡检快慢级联路由**：聚焦边缘快模型（System-1）与云端慢思考模型（System-2）的**可纠错性预测（Error Decorrelation & VoD Routing）**。 | **工业传感器规则与工单故障诊断**：聚焦神经符号规则评估中的**比较算子翻转盲区（Logical Inertia）**与**多干扰项熵稀释**。 |
| **唯一主创新（Main Contribution）** | **反事实图像负样本训练与跨模态归因校准**：将事件图替换为同类正常场景图，惩罚视觉带来的虚高事件置信度。 | **层间隐状态轨迹速度/曲率升级门控**：区分“传感器偶然噪声（早层停滞）”与“单步推理深度不足（末层高曲率）”，用 Value-of-Deliberation（VoD）标签训练路由器。 | **Householder 极性正交反射算子 + $\alpha$-Entmax 稀疏竞争集合头**：代数级消除 `<` 与 `>` 嵌入塌缩，并实现选项顺序 100% 置换不变与无关干扰项精确归零。 |
| **唯一辅助创新（Auxiliary）** | **顶层双向交互块 + 潜触发软边际化 + 空间槽位框回归**：一次前向联合输出触发词、论元与视觉框；$\log(1/\omega)$ 归入实现细节并引用 [Menon et al. ICLR 2021](https://arxiv.org/abs/2007.07314)。 | **代价敏感有序评分（Cost-Sensitive RPS）+ 单峰有序头对比**：推导最优分位数偏移命题 $F^* = \frac{P}{P+\eta(1-P)}$；对比离散 Weibull 与二项/泊松单峰头（[Beckham & Pal, ICML 2017](https://proceedings.mlr.press/v70/beckham17a.html)）。 | **互补逻辑守恒正则 + 保形预测集拒识（Conformal Abstention）**：确保正反规则分支概率互补守恒，最小化不确定性预测集大小 `SS`。 |
| **明确砍掉的冗余包袱** | 砍掉“首个单次前向”（[OneIE](https://aclanthology.org/2020.acl-main.718/) 已是联合单次前向）；砍掉“Arg F1 55%+”虚高预期（改为超越 CAMEL 的 **33.2%**）；砍掉纯文本爆炸数据集；Gaussian RL 仅在消融有效时保留。 | 砍掉“100% 拦截”“自愈闭环”等绝对化宣传语；将 $\mathsf{TC}^0$ 电路深度降级为直觉动机；修正 `InspecSafe-V1` 为真实的 **4 级量表**；所有小样本指标必带 Bootstrap 置信区间。 | 砍掉冗余文本生成模块；放弃与 CVPR 撞车的 11/11 ICDE Research 第 2 轮，用自有工业数据 12/1 投 ICDE Industry。 |

---

## 五、共享底层代码架构（`SystemOne-Lab`）与联合排期

### 5.1 模块化代码库结构
```text
SystemOne-Lab/
├── core/
│   ├── backbones_2026.py      # 统一封装 Qwen3.5-0.8B/2B/4B/9B (3:1 Hybrid Attention) 与 Gemma-4-E4B
│   ├── top_bi_interaction.py  # 主干顶层外挂 2~4 层全向双向注意力块 (不破坏 Qwen3.5 内部 Gated DeltaNet 掩码)
│   ├── metrics_calibration.py # 统一计算 ECE (15-bin), Brier Score, Cost-Sensitive RPS, Conformal Set Size, Bootstrap CI
│   └── logit_adjustment.py    # 空类先验修正 log(1/omega) (Menon et al., ICLR 2021) 与温度缩放基线
├── heads/
│   ├── paper_a_spatial_marginal.py # Paper A: 潜触发边际化 + Spatial Slot 视觉框回归头
│   ├── paper_b_householder_entmax.py # Paper B: Householder 极性反射 + alpha-Entmax 置换不变集合头
│   └── paper_c_trajectory_ordinal.py # Paper C: 全注意力锚点层速度/曲率探针 + 单峰有序风险头 (Weibull/Binomial)
└── benchmarks/
    ├── exp_a_m2e2_swig/            # ACE2005 + imSitu/SWiG -> M2E2 (含反事实正常图测试集)
    ├── exp_b_diagnosticiq_phm/     # DiagnosticIQ (5 变体) + FailureSensorIQ (OptionsPert)
    └── exp_c_inspecsafe_safescene/ # InspecSafe-V1 (4级, 5,013例) + SafeSceneReason (10,099图)
```

### 5.2 10/15 — 12/01 联合冲刺排期表

| 时间窗口 | Paper A（8×A800，CVPR 2027） | Paper C（6–7×H20，CVPR 2027） | Paper B（1–2×H20，ICDE 2027 Industry） |
| :--- | :--- | :--- | :--- |
| **10/15–10/22** | 预处理 ACE05、imSitu/SWiG、M2E2；对齐评测脚本；跑 UniCL/CAMEL 与 Qwen3.5 零样本/微调基线 | 用 vLLM 跑完 `InspecSafe-V1` 与 `SafeSceneReason` 的 S1/S2 预测；**10/22 Go/No-Go 检验** | 下载 `DiagnosticIQ` 与 `FailureSensorIQ`；复现 `<↔>` 嵌入余弦相似度 $>0.95$ 与翻转盲选现象 |
| **10/23–10/24** | **10/24 Go/No-Go 检验**（复现基线误差 $<2\%$，ACE05$\to$M2E2 Text Event F1 $\ge 50$） | 实现全注意力锚点层轨迹探针、VoD 路由器与代价敏感 RPS | 跑通 Laya、Kev（Qwen3.5）与 ModernBERT 基线 |
| **10/25–11/03** | 训练反事实负样本主模型、Gemma 4 复验与消融实验；**11/03 主表冻结** | 完成双数据集主表、Gemma 4 复验、单峰头对比与 Bootstrap CI；**11/03 主表冻结** | **10/31 Go/No-Go 检验**；实现 Householder 反射层与 $\alpha$-Entmax 集合头 |
| **11/04–11/10** | 论文撰写、可视化定位热力图与可靠性曲线；**11/10 CVPR 摘要注册** | 论文撰写、绘制轨迹相空间图与 Risk-Coverage 曲线；**11/10 CVPR 摘要注册** | 推进 `DiagnosticIQ-Aug / Pert` 与 `OptionsPert` 主实验 |
| **11/11–11/16** | 全文打磨与内部互审；**11/16 CVPR 全文提交** | 全文打磨与内部互审；**11/16 CVPR 全文提交** | 汇总跨设备泛化与美元节能榜数据 |
| **11/17–12/01** | **11/23 提交 CVPR 补充材料**，随后全员并入 B | **11/23 提交 CVPR 补充材料**，随后全员并入 B | 全员合流冲刺：**12/01 投递 ICDE Industry Track** |
| **1/25–2/05** | **1/25–2/01 CVPR Rebuttal** | **1/25–2/01 CVPR Rebuttal** | 等待 ICDE 结果（约 2/15） |
