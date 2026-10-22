# A-JEV 三篇论文投稿计划（v2.0 已核实待确认事项更新版）

> 版本：2026-10-15（v2.1：统一五份文档间的矛盾；B 确定用自有工业数据投 ICDE Industry；新增 [Paper B 开源工业数据清单](paper_b_open_datasets.md)）。v2.0 说明：依据项目文件夹 `A-JEV/designs/Jev_Industrial_3_Papers_Research_Pack/` 中的原始蓝图、与 Fable 5 的同日可行性评估，以及针对第 8 节“待确认事项”完成的原文献一手核查整理。日期与论文实验设定均已按官方页面/原文核实（见文末“来源”）。

## 1. 总览

| 论文 | 主题 | 首投 | 截稿 | Go/No-go | 备选 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **A** | 校准的单次前向多模态事件抽取与视觉论元定位 | **[CVPR 2027](https://cvpr.thecvf.com/Conferences/2027/CallForPapers)** | 注册 11/10，全文 11/16，补充材料 11/23（AoE） | **10/24** | ICCV 2027（预计 2027 年 3 月） |
| **C** | 工业巡检风险分级与快慢模型升级路由 | **[CVPR 2027](https://cvpr.thecvf.com/Conferences/2027/CallForPapers)** | 同上 | **10/22** | ICCV 2027 或 ICML 2027 |
| **B** | 工业故障诊断的神经符号校准决策 | **[ICDE 2027 Industry & Applications](https://icde2027.github.io/important-dates.html)**（已确认有自有工业数据） | 12/1 17:00 PT | **10/31** | ICDE 放榜（约 2/15）后再定，见第 5 节 |

CVPR 不延期；所有作者都要承诺担任审稿人，并且要有 OpenReview 账号。

## 2. 资源与分工

| 资源 | 分配 |
| :--- | :--- |
| 8×A800 | Paper A 训练（Qwen3.5-4B/9B 为主、Gemma 4 E4B 为辅，在 ACE2005 + imSitu/SWiG 上微调；选型见第 2.1 节） |
| 8×H20 | Paper C 主体（用 vLLM 跑 Qwen3.5-122B-A10B / Qwen3.8-27B 慢模型，训练探针和门控）；A 和 C 的大模型基线推理；从 10/15 起拨 1–2 张给 B |
| 人员 | A、C、B 各一位一作；另设 1 人维护共享代码（数据加载、校准指标、评测脚本）；Haochen 总负责 |
| 数据 | ACE2005（已有 LDC 授权）、imSitu/SWiG、M2E2（只有测试集）、InspecSafe-V1（HF 公开）、SafeSceneReason（GitHub 公开，含 10,099 张工业现场图）、DiagnosticIQ、FailureSensorIQ |

### 2.1 模型选型（10/15 更新，替换原蓝图中的 Qwen2.5-VL / GPT-4o 等旧模型）

截至 2026-10-15，原蓝图里的 Qwen2.5-VL（2025 年 1 月）、SigLIP + ModernBERT 拼接、GPT-4o、GPT-5.4 都已经落后一到两代。CVPR 审稿人看到 2025 年初的底座，会直接质疑“换成新模型后问题是否还存在”。

| 用途 | 选用 | 理由 |
| :--- | :--- | :--- |
| A、C 的主干（System-1） | **Qwen3.5-2B/4B/9B**（2026 年 3 月，Apache 2.0） | 原生多模态早融合；尺寸齐全；[Kev](https://github.com/jaredpalmer/kev) 也基于 Qwen3.5，B 可以共用 |
| 换主干复验（证明方法不依赖 Qwen） | **[Gemma 4 E4B / 26B-A4B](https://rits.shanghai.nyu.edu/ai/google-releases-gemma-4-frontier-open-models-under-apache-2-0/)**（2026 年 4 月，Apache 2.0） | 原生多模态；纯标准全注意力结构，与 Qwen3.5 的 3:1 混合注意力形成对照 |
| C 的 System-2，以及大模型基线 | **Qwen3.5-122B-A10B**（BF16 约 244 GB，8×H20 放得下）、**[Qwen3.8-27B](https://github.com/QwenLM/Qwen3.8)**（2026 年 8 月，支持图像输入，Apache 2.0）；在 SafeSceneReason 上直接复用官方已测的 **Qwen3.5-9B CoT SFT** | 都是开源、支持图像输入的当前一代模型。Qwen3.8-2.4T 的开源版不支持图像，不用 |
| 其他开源 VLM 基线 | Gemma 4 31B、InternVL3.5、Qwen3-VL-8B/32B | 覆盖不同家族，回应“只比 Qwen”的质疑 |
| 闭源基线 | **GPT-5.6-Sol / GPT-5.5**、**Gemini-3.1-Pro / Gemini-3.5-Flash**、**Claude-Fable-5.1 / Claude Opus 5.5**（自跑用最新型号；引用官方表时沿用原表型号，如 DiagnosticIQ 的 `claude-opus-4-6`） | 替换 GPT-4o；在 [SafeSceneReason Table 2](https://arxiv.org/html/2608.09230v1) 与 [DiagnosticIQ Table 2](https://arxiv.org/html/2605.08614v1) 中已有现成官方跑分可直接对齐引用 |
| B 的文本主干 | Qwen3.5-0.8B/4B（[Kev](https://github.com/jaredpalmer/kev)）、ModernBERT（[Laya](https://github.com/NandhaKishorM/laya)）、Qwen3.8-27B | 与 A、C 统一到 Qwen3.5 一代 |

**结构上的注意事项（源码已核实）**：根据 HuggingFace `transformers` 的 [`modular_qwen3_5.py` 源码](https://gist.github.com/justinchuby/0213aa253664fb72e9adb0089816de15)，Qwen3.5 全系默认由 `full_attention_interval = 4` 控制，**Gated DeltaNet 线性注意力层（含因果 Conv1D `kernel=4`，无 RoPE）与标准 GQA 全注意力层严格按 3:1 交替（即 `[linear, linear, linear, full_attention]` 循环，75% 线性层 + 25% 全注意力层）**。线性注意力层本质上是因果递推的，没法简单“去掉因果掩码”变成双向。所以：
1. **Paper A** 的双向交互改为**在主干之上新加 2–4 层双向全注意力交互层**（与 [CalOn Section 3.1](https://arxiv.org/html/2610.17113v1) 一致），不再修改主干掩码。
2. **Paper C** 的层间轨迹特征要**区分两类层来算**：在全注意力锚点层序列（第 4, 8, 12, ..., $L$ 层）上单独提取跨块速度 $v_l$ 与方向曲率 $\kappa_l$，并在消融中报告全注意力层与线性层分开统计的结果。

**传统任务专用基线不用换**：[WASE](https://aclanthology.org/2020.acl-main.230.pdf)、[UniCL](https://aclanthology.org/2022.acl-long.519/)、[CAMEL](https://arxiv.org/abs/2306.08966)、[GSRTR](https://arxiv.org/abs/2109.00802)、[CoFormer](https://arxiv.org/abs/2203.16518) 等是 M2E2 和 SWiG 上的任务 SOTA 记录，年代早不影响它们作为对比；需要更新的是“通用大模型”这一梯队。

## 3. Paper A：多模态事件抽取（CVPR 2027）

**主张**：用一次前向完成 schema 条件化的多模态事件抽取和视觉论元定位，靠反事实图像负样本抑制“看图脑补”，并输出校准过的置信度。

**方法（收窄后）**
- 把 schema、文本和图像拼成一个序列预填充（Qwen3.5 早融合主干）。双向交互不靠修改主干掩码，而是在主干之上新加 2–4 层双向注意力交互层；原因见第 2.1 节。
- 用触发词分布对论元做边际化（作为实现方式，不作为理论创新）。
- 用空间槽位查询直接回归视觉论元框，不依赖外部检测器。
- 主创新是反事实负样本训练：把事件图换成同类的正常场景图，惩罚视觉带来的虚高置信度。
- 空类的 $\log(1/\omega)$ 先验修正作为实现细节，引用 logit adjustment（[Menon et al., ICLR 2021](https://arxiv.org/abs/2007.07314)）。
- Gaussian 扰动 logit 的 RL 训练只有在消融里优于直接损失时才保留。

**删掉的内容**：“首个单次前向”的说法（[OneIE](https://aclanthology.org/2020.acl-main.718/)、[DyGIE++](https://aclanthology.org/D19-1304/) 早已是联合单次前向）；Arg F1 55%+ 的目标；工业爆炸事故数据集（纯文本）；把两模态 Shapley 当主理论贡献。

**目标指标**
- M2E2 多媒体论元 F1 超过 **33.2**（[CAMEL](https://arxiv.org/abs/2306.08966)），事件 F1 不低于 57.5。
- SWiG 定位指标与 [GSRTR](https://arxiv.org/abs/2109.00802)、[CoFormer](https://arxiv.org/abs/2203.16518) 可比。
- 在反事实“正常图”测试集上，假阳性率和 ECE 明显优于第 2.1 节列出的开源和闭源 VLM。

**基线**：[WASE](https://aclanthology.org/2020.acl-main.230.pdf)、[UniCL](https://aclanthology.org/2022.acl-long.519/)、[CLIP-Event](https://openaccess.thecvf.com/content/CVPR2022/papers/Li_CLIP-Event_Connecting_Text_and_Images_With_Event_Structures_CVPR_2022_paper.pdf)、[CAMEL](https://arxiv.org/abs/2306.08966)、[UMIE](https://ojs.aaai.org/index.php/AAAI/article/view/29873/31523)、[MMUTF](https://aclanthology.org/2024.findings-emnlp.381.pdf)；[GSRTR](https://arxiv.org/abs/2109.00802)、[CoFormer (CVPR 2022)](https://arxiv.org/abs/2203.16518)；VLM 梯队按第 2.1 节（Qwen3.5-9B/27B、Qwen3.8-27B、Gemma 4 31B、InternVL3.5，零样本与微调；再加 1–2 个闭源模型）；[CalOn](https://arxiv.org/html/2610.17113v1)（已核实：其 M2E2 设定为纯文本零样本且未用 ACE05 训练，表格中分栏注明）。

**Go/no-go（10/24）**：M2E2 评测脚本能复现 UniCL 或 CAMEL 的一个数字（误差 2 个点以内）；自己的模型在 ACE05 → M2E2 文本事件上 F1 ≥ 50。没达到就改投 ICCV 2027，人手并入 C。

## 4. Paper C：工业巡检升级路由（CVPR 2027）

> 文献与数据集调研见 [paper_c_survey.md](paper_c_survey.md)（10/15 第一轮）：核心想法已有前作（Gupta et al. ICLR 2024、Signed Rescue Routing），go/no-go 需加“单层线性探针”对照；SafeSceneReason 降为附录数据，第二数据集建议 MMAD。

**主张**：在工业视觉巡检中，用单次前向得到的层间轨迹特征，预测“慢模型能否纠正快模型”。在相同升级预算下，它应优于基于置信度或熵的路由。

**方法（收窄后）**
- System-1：Qwen3.5-2B/4B/9B（LoRA 微调），并用 Gemma 4 E4B 复验结论。System-2：Qwen3.5-122B-A10B、Qwen3.8-27B（思考模式）及 `Qwen3.5-9B CoT SFT`（对齐 SafeSceneReason），再加 1 个闭源模型。两者都离线跑完整个训练集和测试集。
- 轨迹特征：末几层（全注意力锚点层）的层间速度、方向曲率、早退层与末层预测之间的 JSD、末端熵，输入一个小 MLP 做升级门控。
- 升级标签：System-2 相对 System-1 的净收益是否超过调用成本。这与 learning-to-defer 同类，需引用 [L2D (ICML 2020)](https://proceedings.mlr.press/v119/mozannar20b.html)、[RouteLLM (ICLR 2025)](https://arxiv.org/abs/2406.18665)、[Hybrid LLM (ICLR 2024)](https://arxiv.org/abs/2404.14618)。
- 代价敏感 RPS：漏报权重 η。表述为代价敏感评分规则，**不叫**严格适当；它的最优解 $F^*=P/(P+\eta(1-P))$ 写成 Proposition。
- 有序头：在 4 级量表上对比有限支撑归一化的离散 Weibull、binomial/Poisson 单峰头（[Beckham & Pal, ICML 2017](https://proceedings.mlr.press/v70/beckham17a.html)）和普通 softmax；注意尾部截断可能在最高级造成第二个峰。

**删掉的内容**：“100% 拦截”“自愈闭环”这类没有实验支撑的说法；把 TC⁰ 电路深度当成已证明的机制（降为动机讨论）；InspecSafe 的“1~10 级”（实际只有 4 级）。

**数据与统计**：[InspecSafe-V1](https://arxiv.org/html/2601.21173v1) 训练 3,763 张、测试 1,250 张（异常 251 张）。所有指标给出 bootstrap 置信区间，不报告 “<0.5% 漏报” 这类小样本下没有意义的数字。第二个数据集用 [SafeSceneReason (arXiv:2608.09230)](https://github.com/KangKanng/safescenereason)（**已核实公开且含 10,099 张真实工业现场图像，且官方表 2 已测出 Qwen3.5-9B 无 CoT 75.1% vs. CoT 89.0% 的 +13.9 点快慢差距！**）；文本 rubric 面板只放附录。

**基线**：MSP、[温度缩放](https://proceedings.mlr.press/v70/guo17a.html)、MC Dropout、[语义熵](https://www.nature.com/articles/s41586-024-07421-0)、熵与 MSP 的组合；[FrugalGPT](https://arxiv.org/abs/2305.05176)、[RouteLLM](https://arxiv.org/abs/2406.18665) 式路由、[StepGate](https://arxiv.org/html/2610.07816v1)；[L2D](https://proceedings.mlr.press/v119/mozannar20b.html)；纯 S1 和纯 S2。

**Go/no-go（10/22）**：轨迹特征预测“可纠错”的 AUROC 比 MSP + 熵高 ≥5 个点，且在 20% 升级预算下级联比最佳单模型高 ≥3 个点。达不到就去掉曲率叙事，改成“VoD 训练的路由器 + 视觉场景错误相关性分析”，或者改投 ICCV。

## 5. Paper B：工业故障诊断（ICDE 2027 Industry & Applications）

**主张**：比较算子翻转（`<`↔`>`）和干扰项增多会让模型失效。用 Householder 极性反射加 α-entmax 集合头，再配合保形预测拒识来解决。

**投稿选择（10/15 已定）**
- 团队有自有工业数据：**12/1 投 [ICDE 2027 Industry & Applications](https://icde2027.github.io/important-dates.html)**（约 2/15 出结果，无 rebuttal）。自有数据做主实验之一；公开基准（DiagnosticIQ、FailureSensorIQ，以及 [开源工业数据清单](paper_b_open_datasets.md)）用于可复现对比。
- KDD 2027 第 2 轮（2 月初截稿）早于 ICDE 放榜，不能给同一篇做备选。若 ICDE 被拒，放榜后再选下一站（如 CIKM 2027 或 KDD 2028 第 1 轮，日期待查）。
- ICDE Research 第 2 轮（11/11）与 CVPR 撞车，不选。

**Go/no-go（10/31）**：[DiagnosticIQ](https://arxiv.org/html/2605.08614v1) 和 [FailureSensorIQ](https://github.com/IBM/FailureSensorIQ) 可以获取；实测复现“`>` 与 `<` 规则嵌入高度相似”和“条件翻转后仍盲选原动作”两个现象；[Laya](https://github.com/NandhaKishorM/laya)、[Kev](https://github.com/jaredpalmer/kev)（Qwen3.5 底座）、Qwen3.5/Qwen3.8 基线能跑通；自有工业数据完成脱敏，并整理成“规则 → 候选动作”格式（含算子翻转后的反规则）。达不到就降级为 workshop 论文或推迟。

## 6. 联合排期

| 日期 | Paper A | Paper C | Paper B |
| :--- | :--- | :--- | :--- |
| 10/15–10/22 | 处理 ACE05、imSitu/SWiG、M2E2；写评测脚本；跑基线 | **10/22 go/no-go** | 获取数据，复现两个现象 |
| 10/23–10/24 | **10/24 go/no-go** | 实现方法 | 跑基线 |
| 10/25–11/03 | 主模型、反事实负样本、消融 | 主表、SafeSceneReason 第二数据集、消融 | **10/31 go/no-go**；之后实现方法 |
| 11/03 | 主表冻结 | 主表冻结 | 出初步结果 |
| 11/04–11/09 | 写作、画图 | 写作、画图 | 继续实验 |
| 11/10 | 注册摘要 | 注册摘要 | |
| 11/16 | **提交全文** | **提交全文** | |
| 11/17–12/01 | 11/23 交补充材料 | 11/23 交补充材料 | 全员加入，**12/1 投 ICDE Industry** |
| 1/25–2/01 | CVPR rebuttal | CVPR rebuttal | 等 ICDE 结果（约 2/15） |

**回退规则**：A 或 C 没通过 go/no-go 就改投 ICCV 2027，人手并入另一篇 CVPR 论文。

## 7. 共性原则

1. **不要把论文身份绑在 Jev 上**：Jev 只在动机里出现，方法要能用在任意 VLM/LLM 上；A 和 C 正文都不要以“Jev 范式”为主线，避免被看成同一工作拆成两篇。
2. **每篇只保留 1 个主创新加 1 个辅助创新**，不堆砌技巧。
3. **只写实测数字**：蓝图里的显存、训练时长、吞吐、提升百分比等都是预期值，正文只能用跑出来的结果。
4. **引用用原始出处**：已全部替换为各算法的原始论文链接（见各篇 v2.0 蓝图）。
5. **如实转述前人结论**：[arXiv:2609.29769](https://www.emergentmind.com/papers/2609.29769) 的“96% 重复错误”是每个面板挑出的 top-12 高置信错误对（252 次判断中 242 次），数据是纯文本；C 需要在视觉数据（InspecSafe-V1 与 SafeSceneReason）上自己测一遍。

## 8. 待确认事项（2026-10-15 核查状态更新）

- [ ] **三篇的一作人选与共享代码负责人**（待团队内部拍板）
- [x] **B 是否有真实工业数据**：**已确认有自有工业数据**，12/1 投 ICDE 2027 Industry & Applications。开源补充数据见 [paper_b_open_datasets.md](paper_b_open_datasets.md)。
- [x] **CalOn（[arXiv:2610.17113](https://arxiv.org/html/2610.17113v1)）M2E2 结果的实验设定**：**已核实**——为**纯文本零样本评测（Zero-Shot Text-Only）**，丢弃了图像，且训练集未包含 ACE2005。带描述时 Gold-Trigger Arg F1 为 30.9%，端到端 Trigger F1 仅 9.2%、Arg F1 仅 3.6%，ECE 为 0.66。Paper A 表中将分栏注明“无 ACE05 纯零样本设定”与“ACE05+SWiG 标准跨模态设定”。
- [x] **SafeSceneReason（[arXiv:2608.09230](https://arxiv.org/html/2608.09230v1)）是否公开、是否含图像**：**已核实**——**完全开源（[GitHub: KangKanng/safescenereason](https://github.com/KangKanng/safescenereason)，CC BY 4.0），且包含 10,099 张真实工业现场图像**（110,581 条场景问答 + 13,114 条事故报告图表问答）。更重要的是，原文 Table 2 已经跑出了 **`Qwen3.5-9B SFT w/o CoT`（75.10%）vs. `Qwen3.5-9B CoT SFT`（89.00%）** 的 System-1/2 对比，差距高达 **+13.90 个点**（比较推理子类差距达 **+21.29 个点**），可直接作为 Paper C 的第二主力基准！
- [x] **KDD 2027 第 2 轮的官方日期**：**已核实**——[KDD 2027 官方 CFP](https://kdd2027.kdd.org/research-track-call-for-papers/) 确认每年两轮，Cycle 1 于 2026-11-14 通知结果，Cycle 2 为 **2027 年 2 月初（February 2027 Deadline）**。
- [x] **Qwen3.5 各尺寸的线性/全注意力层配比；闭源基线的具体型号与图像输入支持**：**已核实**——根据 [`modular_qwen3_5.py` 源码](https://gist.github.com/justinchuby/0213aa253664fb72e9adb0089816de15)，Qwen3.5 全系默认 `full_attention_interval = 4`，即严格按 **3:1 比例（3 层 Gated DeltaNet 线性层 + 1 层标准 GQA 全注意力层）** 交替循环；闭源支持图像的最新基线确认为 `GPT-5.6-Sol / GPT-5.5`、`Gemini-3.1-Pro / 3.5-Flash`、`Claude-Fable-5.1 / Opus 5.5`（10/15 统一为最新型号）。

## 来源

- CVPR 2027 Call for Papers：https://cvpr.thecvf.com/Conferences/2027/CallForPapers
- ICDE 2027 Important Dates：https://icde2027.github.io/important-dates.html
- KDD 2027 Research Track CFP（官方）：https://kdd2027.kdd.org/research-track-call-for-papers/
- InspecSafe-V1：https://arxiv.org/html/2601.21173v1
- SafeSceneReason（论文与官方仓库）：https://arxiv.org/html/2608.09230v1 ，https://github.com/KangKanng/safescenereason
- CalOn（M2E2 零样本设定核实）：https://arxiv.org/html/2610.17113v1
- DiagnosticIQ：https://arxiv.org/html/2605.08614v1
- FailureSensorIQ：https://arxiv.org/abs/2506.03278 ，https://github.com/IBM/FailureSensorIQ
- Qwen 发布记录与源码：https://github.com/QwenLM/Qwen3.8 ，https://gist.github.com/justinchuby/0213aa253664fb72e9adb0089816de15
- Qwen3.5 混合注意力与早融合：https://trilogyai.substack.com/p/deep-dive-qwen-35-brings-native-multimodality
- Gemma 4：https://rits.shanghai.nyu.edu/ai/google-releases-gemma-4-frontier-open-models-under-apache-2-0/
- 开源 VLM 汇总（2026-03）：https://www.overshoot.ai/blogs/vlm-survey-2026
- CAMEL（M2E2 结果）：https://arxiv.org/abs/2306.08966
- JEV vs. LLMs as Rubric Judges（arXiv:2609.29769）：https://www.emergentmind.com/papers/2609.29769
