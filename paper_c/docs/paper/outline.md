# LUX 论文主框架（CVPR 2027，正文 8 页）——v0

> 写法参考了近年 CVPR 最佳论文的结构（见文末“参考结构”）。正文用英文写作；本文件用英文写各段的主题句与草稿，中文写注释和待办。
> 数字以 `lux_mainline.md` 和研究日志为准；**TBD** 表示等 V26 / V38 等实验结果。

---

## 参考结构：从最佳论文学到的几点

| 论文 | 可借鉴之处 |
|---|---|
| **Visual Programming**（CVPR 2023 最佳论文；VLM / LLM + 组合程序，与我们最接近） | 引言：先讲端到端的局限（每个任务都要专门数据，无法覆盖长尾），用一个具体例子说明，再引出方法，接着说与神经模块网络的区别，然后讲可解释性，最后列贡献并给出关键数字；图 1 是一眼看懂的流程示意；没有单独的局限性小节（我们要写，更稳妥） |
| **VGGT**（CVPR 2025 最佳论文） | 方法从“问题定义与记号”开始；实验每个小节回答一个问题、配一张表；最后有“讨论”节，集中写局限、运行时间与显存 |
| **Rich Human Feedback**（CVPR 2024 最佳论文） | 第二段专门讲“现有方法缺什么”；贡献列表里单独有一条“泛化到训练时没见过的模型” |

**由此确定的原则**：
1. 图 1 要让人一眼看懂“规程 ∘ 状态”、RAW 与 JPEG、以及规则变化时谁会失效；
2. 引言用一个具体的工业例子贯穿；
3. 方法先写问题定义；
4. 实验按研究问题组织，一节一问、一表一答；
5. 单独设“讨论与局限”一节。

---

## 标题
**暂定（2026-10-19，research_log #97）：LUX: Recovering Overexposed Visual Facts for Rule-Editable Decisions**

> 选择理由：以新现象（过曝）为中心，避免“学中间状态而不是标签”与概念瓶颈 / 属性学习等旧思想撞车；方法名、现象、用途三者都在题目里。
> 写作要求：正文第一次出现 overexposure 时立即给出精确定义（判定监督下训练曝光为零、部署曝光为正的事实）；相关工作主动对比概念瓶颈模型与推理捷径。

**此前的候选（已不用）**：
1. **LUX: Learning Policy-Sufficient Visual States, Not Verdicts**
2. **Think Wide, Not Deep: Learning Policy-Sufficient Visual States from Saturating Decisions**
3. **Record the RAW, Not the JPEG: Rule-Editable Visual Decisions with LUX**

> 注：推荐 1，简短，概念明确；“Think Wide, Not Deep”可作为图 1 的标语或引言的小标题。

## 摘要（草稿，约 200 词）
> Many visual decisions are rule-constrained: a safety grade, a defect verdict or a compliance check is obtained by applying a written policy to what is visible in the image. Policies change across sites and over time, yet the visual facts they act on do not. We argue that a model should learn a **policy-sufficient visual state** — a representation from which the decision under any policy in a family can be computed — rather than the verdict of one policy. We show that the minimal such state is the set of atomic facts the policies refer to, and introduce **LUX**, which reads this state with parallel typed queries over a single shared prefill of a vision-language model and develops verdicts by exactly composing them under any policy. Training such a state from verdicts alone suffers from **overexposure**: saturating policies (max, OR) erase the information a label carries about non-decisive facts. We give a graded information-theoretic characterisation of this effect, show how it surfaces as errors when the policy is edited, and propose HDR-style training that bracket-exposes policies and spot-meters individual facts. On three benchmarks, LUX matches the latency of a direct query, is 11–15× faster and more accurate than slow-thinking VLMs, applies edited policies, new facts and new sites without new labels, and [TBD: matches fine-tuned classifiers in distribution].

---

## 1. Introduction（约 1 页，6 段）

**P1 场景与问题**：规程约束的视觉决策无处不在；规程会变。
> Inspection robots, quality control and compliance audits produce verdicts by applying written policies to visible facts: a worker without gloves is Level-1 in a petrochemical plant but Level-3 in a tunnel, and next year's code may change either. Policies change; what the camera sees does not.

**P2 现有做法的缺陷**（对应 Rich HF 的“缺口段”）：VLM 的直接问、慢思考、微调，都输出某一规程下的结论。
> 证据：微调分类器在零新标注改规程后，等级变化的图上只有 4%–46%；慢思考慢 11–15 倍且更不准。
> 句式：*Current practice asks a VLM for the verdict … this bakes the policy into the output, like a JPEG developed with one fixed style.*

**P3 第一性原理与核心思想**：决策 = 规程 ∘ 状态；学习规程充分状态；最小规程充分状态即原子事实状态；RAW vs JPEG。
> *A model should record the RAW, not the JPEG.*

**P4 没那么简单：过曝**（引言的“转折”段）：即使拆成事实，只用结论标签训练，饱和的规程会截断非决定性事实的信息。
> 需要点明与已有现象的关系：解释消除、推理捷径、WSOL 只激活最显著部位；指出已有工作缺分级刻画，也没有研究部署时改规程。

**P5 LUX**：并行读出状态（想得宽）+ 精确冲洗 + HDR 式训练（包围曝光 = 规程随机化，点测光 = 逐事实测量）。

**P6 贡献**（3–4 条，每条带一个关键数字）：
1. 规程充分状态的视角与最小性命题；
2. 过曝定理：分级刻画 + 部署误差界（预测并验证升级 / 降级不对称）；
3. LUX 方法：与直接问同样快、比慢思考快 11–15 倍且更准；HDR 训练 [TBD]；
4. 部署偏移评测协议：规程修订、新增事实、新站点；零新标注下 [关键数字]。

## 2. Related Work（约 0.5 页）
1. **VLM 用于规程 / 安全决策**：工业安全基准（InspecSafe、SafeSceneReason）、施工合规（检索增强、条件核验）。
2. **分解与概念**：CBM 系列（LaBo、Label-free、VLG-CBM）、Concept-QA、Visual Programming、Vision-Language Programs。与我们的区别：零训练读出、可编辑的有序规程层、研究规程修改。
3. **经由知识学习感知**：DeepProbLog、Semantic Loss、Scallop；推理捷径（Marconato 2023、Bortolotti 2025）。区别：分级刻画、部署时改知识。
4. **证据被压制的老问题**：解释消除（Pearl）、WSOL 擦除（ACoL、Hide-and-Seek、EIL）、MIL 汇聚、信息瓶颈与判别性–迁移性权衡。
5. **高效推理**：前缀共享、慢思考与快思考、Jev（同期、纯文本）。

## 3. Decisions as Policy ∘ State（约 0.75 页）
- 3.1 设定与记号：状态 s(x) ∈ {0,1}^J，规程族 Π，结论 y = π(s(x))；三类算子（有序取最大、或、恰好一个）。
- 3.2 规程充分状态：定义；**命题 1**（最小规程充分状态 = 原子事实状态，条件为每个事实在某个规程下可见）。
- 3.3 由此推出的推理接口：读出状态，再冲洗。

## 4. LUX（约 1.5 页）
- 4.1 **Reading the state wide**：共享前缀并行读出；精确合成（闭式解）；不稀释；单请求延迟模型。
- 4.2 **Calibrating against normal**：以正常图为参照的逐事实校准（只有拆分后才能做）。
- 4.3 **Overexposure**：可见度定义；**定理 1**（信息 = 可见度 × 熵；梯度 ∝ 可见度；改规程后的误差界）；推论（升级 / 降级不对称、跨站点）；摄影类比用一张小图说明。
- 4.4 **HDR training**：主曝光 + 包围曝光 + 点测光（提及信道，行业门控、PU）+ 不可辨识事实锚定基座；**命题 2**（适当性 / 一致性）；共享前缀训练。
- 4.5 **[视 V38 结果] Dual-path development**：整体查询作为一个分支，同分布不劣于直接分类器；改规程时去掉。

## 5. Experiments（约 3 页，一节一问）
- 5.0 **Setup**：数据集 InspecSafe-V1（取最大）/ MMAD（或）/ SafeBuild（恰好一个）；主干 Qwen3-VL 2B–32B + 跨家族；基线（直接问 + 矩阵缩放、慢思考、Direct-SFT 及其变体、检测器 + 规程、拆分 + LLM 汇总）；配对 Bootstrap + Holm；预注册。
- 5.1 **Is reading the state better than asking for the verdict?**
  - 表 1：三个数据集零训练；
  - 图：准确率–延迟帕累托（直接问 / LUX / 生成式 / 慢思考，8B 与 32B）。
- 5.2 **Is overexposure real?**
  - 图：可见 vs 被截断格子的误报（训练前后），以及剂量–反应；
  - 升级 / 降级不对称；
  - [TBD] MMAD（或）上的检验。
- 5.3 **Does HDR training record the full state?**
  - 表：HDR vs 只用结论标签（同流程对照）vs 不读描述 vs Direct-SFT（含 + 描述版），列为同分布准确率、被截断误报、AURC；
  - 消融：去掉包围曝光 / 点测光 / 噪声项 / 门控。
- 5.4 **Does it survive deployment shifts?**
  - 表：规程修订 R1–R3（零新标注 / 200 张重标 / 全量重训上界；+ 人工重标子集）；
  - 新增事实（训练与校准均不见）；
  - 新站点（留一行业，四折，双种子）。
- 5.5 **Is it just clever decomposition?**
  - 检测器 + 规程（V32 ✅：显著更差）；拆分 + LLM 汇总；问题改写与全自动生成；事实集合扰动（V30 ✅）。
- 5.6 **Is it usable?**
  - 选择性预测（自动处理 90% 时，高危漏报 0 vs 2 / 7）；可审计依据（判对时 90% / 87% 与描述一致）；定性例子。

## 6. Discussion and Limitations（约 0.3 页）
- 适用前提：状态可写成有限个可查询的事实；规程是明文的。
- 同分布与小样本：如实报告（双通路的结果视 V38 而定）。
- 效率依赖前缀缓存。
- 评测：规则变更的真值由描述推出（人工重标验证），部分子集样本小。
- 与 Paper A 的关系：框架用于事件抽取的模式约束（只在讨论中提及）。

## 7. Conclusion（约 0.2 页）

## 附录（补充材料）
- A 证明（命题 1、定理 1、命题 2、误差界）；
- B 实现细节（提示词、校准、训练超参、共享前缀训练、8 卡并行）；
- C 预注册记录与全部配对检验；
- D 额外实验（全部主干、Qwen3.5、标注量曲线、种子复验）；
- E 定性例子与失败分析；
- F 数据泄漏核查与去重结果。

---

## 图表预算（正文）
| 编号 | 内容 | 位置 |
|---|---|---|
| 图 1 | 标语图：同一张图 → JPEG（直接问 / 微调）vs RAW（LUX 读出状态）→ 规则一改，JPEG 失效，RAW 重新冲洗；角落放“过曝”的小示意 | 第 1 页 |
| 图 2 | LUX 总览：共享前缀并行读出 → 规程程序 → 结论；训练时的三种“曝光” | §4 |
| 图 3 | 过曝：(a) 示意；(b) 可见 / 截断格子误报，训练前后；(c) 剂量–反应 | §5.2 |
| 图 4 | 准确率–延迟帕累托 | §5.1 |
| 表 1–4 | 零训练主表；HDR 训练主表与消融；部署偏移；基线 | §5 |

## 待办（写作与实验交错）
1. 等 V26 主检验（今天之内），决定 §4.4 / §5.3 的表述强度；
2. 视结果预注册 V38（双通路联合训练），决定是否写 §4.5；
3. MMAD 过曝检验（§5.2 的通用性）；
4. 人工重标约 100 张（§5.4，需要人手）；
5. 先写 §1、§3、§4 的英文初稿（不依赖新结果），再填 §5。
