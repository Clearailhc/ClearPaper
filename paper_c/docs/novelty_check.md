# 查新报告：PRISM 各项创新与已有工作（2026-10-19）

> 范围：针对 #60–#66 讨论的各项创新，以及拟议的“VLM 内部结构化读出”新架构（存在性汇聚适配器 + 场景混合 + 规程层 + 规程观测训练），检索直接相关的已有工作。
> 方法：网页检索，每个方向 1–2 轮。大多只看了摘要或二手介绍，**不是系统综述**；标注“需细读”的条目，写相关工作前必须读原文。

## 一、逐项结论

| 我们的创新 | 最接近的已有工作 | 重叠程度 | 我们的区别 | 风险 |
|---|---|---|---|---|
| 拆成类型化的是 / 否原语问题 | 概念瓶颈模型（CBM）系列：LaBo（LLM 生成概念）、Label-free CBM、VLG-CBM（NeurIPS 2024）；**Concept-QA + V-IP（ICLR 2024）**：LLM 提出概念查询，轻量网络回答二元问题；Dynamic Clue Bottlenecks（2023）；Vision-Language Programs（NeurIPS 2025 / CVPR 2026） | **高**。“概念 = 可回答的二元问题”已有先例 | 它们面向分类，合并层是线性头或程序；我们是零训练、VLM 原生读出、行业条件的有序 noisy-OR，判据表在测试时可编辑，并有正常参照校准 | 高：不能把“拆”当贡献 |
| 行业条件的有序 noisy-OR + 可编辑判据表 | 检索到有序回归的噪声标签方法（WACV 2025 等）、基于规则的弱监督（Snorkel 类），**没有找到**“多原因 noisy-OR + 有序严重度 + 可编辑规则表”的组合 | 低 | — | 低：目前最站得住的部分 |
| 部署偏移协议与误差界（规程修订 / 新隐患 / 新行业） | CBM 的测试时干预（修改某个概念的值）；Stochastic CBM（NeurIPS 2024）研究干预如何传播 | 中 | CBM 的干预是改“概念的值”，我们改的是“规则本身”（判据表），且给出升级 / 降级不对称的误差界 | 中：要把两种干预分清 |
| 把规程当作已知观测信道训练感知（latent MIL / 决策层适当评分） | **DeepProbLog（NeurIPS 2018）**：神经谓词 + 概率逻辑，从最终标签训练感知；**Semantic Loss（ICML 2018）**：约束满足概率的负对数；Scallop / Lobster；Embed2Rule（2024） | **高（原理层面）**。“通过逻辑程序、从最终标签训练感知”是成熟范式，我们的目标是它的一个特例 | 闭式的有序取最大结构（不需要知识编译）；按行业门控的 PU 提及信道；**被掩盖格子不可辨识**的分析（命题 4）；决策加权的随机规程项；用在 VLM 上 | 高：必须定位为“该范式下一个可处理的实例 + 新的可辨识性分析”，不能说是新范式 |
| 存在性汇聚（适配器：log-sum-exp / noisy-OR 汇聚图像块证据） | **MIL 汇聚**：max / noisy-OR / log-sum-exp 的比较（2016–2018），attention-MIL（Ilse 2018，用的是 softmax）；**MLLM 中细粒度信号被稀释**：Visual Attenuation（Zhu & Feng，ACL Findings 2026，用 CVAE + GMM 重新激活关键视觉线索）、AVC（2024，“盲 token”导致细粒度幻觉）、“Seeing Small”（小目标研究）；softmax 替代：MultiMax、normalized attention | 动机：**高**；机制：**中低** | 汇聚函数本身是 MIL 老方法；“MLLM 里稀疏视觉信号被稀释”这个动机已被 2026 年的工作提出。没有找到“为存在性问题在 MLLM 答案位置加不稀释汇聚、并与规程层联合训练”的工作 | 中高：需要与 VIF（Zhu & Feng）比较或至少讨论；**需细读** |
| 场景混合乘积（放松条件独立） | **Stochastic CBM**（概念 logit 的多元高斯）、**Causal Neural Probabilistic Circuits**（2026，用概率电路建模概念依赖并精确推断） | **高** | 我们的混合乘积是最简单的概率电路，优点是与有序规程层组合后仍是闭式 | 高：不应作为独立贡献，只作组件 |
| 共享前缀并行读出（想得宽） | Jev / TypeSafe System One（2026-09，纯文本，无论文，RLCD 未公开）；推理系统里的前缀共享（vLLM 前缀缓存等） | 中 | 视觉输入；与有序规程层组合；单请求延迟证据 | 中：引用 Jev 为同期工作；效率不作为核心创新 |
| 工业安全 VLM | InspecSafe-V1（2026-01，有像素级分割）、SafeSceneReason（2026-08）、施工安全合规（ITcon 2026 检索增强 + 结构化条件核验，2408.07146 细粒度 PPE 合规，HKUST 检索增强合规检查） | 中 | 没有找到带可编辑有序规程层与零标注规则变更评测的工作 | 低 |

## 二、整体判断
1. **原理层面的新颖性有限**：“拆成概念问题”（CBM / Concept-QA）、“通过逻辑从最终标签训练感知”（DeepProbLog / Semantic Loss）、“概念依赖建模”（SCBM / 概率电路）、“MIL 汇聚”，都有成熟的先例。我们**不能**声称其中任何一个是新范式。
2. **组合与分析层面有真正的空白**：
   - 有序、行业条件、测试时可编辑的规程层，以及它在部署偏移下的误差界与实验协议；
   - 被掩盖格子不可辨识（命题 4），以及由此推出的行业门控 PU 提及信道；
   - 若存在性汇聚在 VLM 内部被证实有效，是一个有动机支撑、但需要与 Visual Attenuation 类工作对比的机制贡献。
3. **建议的定位**：“面向规程约束视觉决策的神经符号方法：一个闭式、可编辑、可辨识的实例”。正面引用 CBM、DeepProbLog / Semantic Loss、SCBM、MIL 汇聚，把贡献放在：
   - (a) 规程层的可编辑性与部署偏移理论；
   - (b) 被掩盖格子的可辨识性分析与对应训练；
   - (c) VLM 原生的存在性读出（若实验成立）；
   - (d) 系统的预注册实证。
4. **对创新度评分的影响**：查新后，“新架构”这条路的上限从此前估计的 3.5–4 下调到 **约 3–3.5**。存在性汇聚和混合乘积单独看都有很近的先例，真正的独特性仍在规程层、可辨识性分析和部署偏移证据上。

## 三、写作前必须细读的文献
- Concept-QA + V-IP（ICLR 2024）
- DeepProbLog（NeurIPS 2018）与 Semantic Loss（ICML 2018）
- Stochastic CBM（NeurIPS 2024）
- Causal Neural Probabilistic Circuits（arXiv 2603.01372）
- From Attenuation to Attention / VIF（ACL Findings 2026，arXiv 2604.12508）
- InspecSafe-V1 原文（arXiv 2601.21173），确认其基线设置与像素级分割的可用性
- Vision-Language Programs（arXiv 2511.18964）

## 四、来源
- [LLM-based Hierarchical Concept Decomposition](https://arxiv.org/pdf/2405.18672) · [Dynamic Clue Bottlenecks](https://arxiv.org/abs/2305.14882v2) · [Concept-QA + V-IP (ICLR 2024)](https://iclr.cc/virtual/2024/poster/19290) · [VLG-CBM (NeurIPS 2024)](https://mlanthology.org/neurips/2024/srivastava2024neurips-vlgcbm)
- [LaBo](https://arxiv.org/pdf/2211.11158) · [Label-Free CBM](https://arxiv.org/pdf/2304.06129)
- [DeepProbLog](https://arxiv.org/pdf/1805.10872) · [Semantic Loss (ICML 2018)](https://proceedings.mlr.press/v80/xu18h.html) · [Scallop](https://arxiv.org/pdf/2304.04812) · [Lobster](https://arxiv.org/pdf/2503.21937) · [Embed2Rule](https://spiral.imperial.ac.uk/entities/publication/29e81a2b-923b-4207-9ce9-ae3b5c880991) · [Vision-Language Programs](https://arxiv.org/pdf/2511.18964v1)
- [Stochastic CBM (NeurIPS 2024)](https://proceedings.neurips.cc/paper_files/paper/2024/hash/5c7894ac8788555f1cecf536f1e0fd35-Abstract.html) · [Causal Neural Probabilistic Circuits](https://arxiv.org/pdf/2603.01372)
- [Max vs Noisy-OR pooling in MIL](https://arxiv.org/pdf/1804.01146) · [Revisiting MI Neural Networks](https://arxiv.org/pdf/1610.02501)
- [From Attenuation to Attention (ACL Findings 2026)](https://aclanthology.org/2026.findings-acl.927/) · [AVC](https://arxiv.org/pdf/2405.17820) · [Seeing Small](https://escholarship.org/uc/item/8wm0x4vx) · [MINT](https://arxiv.org/pdf/2502.00717) · [MultiMax](https://arxiv.org/pdf/2406.01189) · [Normalized Attention Pooling](https://arxiv.org/pdf/2005.09561)
- [Jev (The New Stack)](https://thenewstack.io/typesafe-jev-system-one/) · [RLCD 词条](https://www.envisioning.com/vocab/rlcd-reinforcement-learning-for-calibrated-decisions)
- [InspecSafe-V1](https://arxiv.org/html/2601.21173v1) · [SafeSceneReason](https://arxiv.org/pdf/2608.09230) · [VLM 细粒度安全合规](https://arxiv.org/pdf/2408.07146) · [ITcon 2026 施工危险检测](https://itcon.org/papers/2026_45-ITcon-Orooje.pdf)

## 五、补充查新（#75）：“过曝”是不是一个已知的基础问题？

**结论：是。同一现象在多个领域以不同名字被发现过，解决思路也已有两大类。**

| 领域 | 名字 | 现象 | 已有的解决办法 |
|---|---|---|---|
| 概率推理 | **解释消除（explaining away）**（Pearl 1988） | noisy-OR 中，一个原因已经解释了结果，其他原因的后验就退回先验 | 不是“解决”，而是推断时的正确行为；我们的命题 4 正是它在学习上的后果 |
| 神经符号学习 | **推理捷径（reasoning shortcuts）**（Marconato 等，NeurIPS 2023）；概念模型中的可辨识性（Bortolotti、Marconato 等，arXiv 2502.11245） | 经由知识 / 推理层从任务标签学概念，存在“拟合标签但概念语义错误”的最优解；同一标签可由多个概念组合推出时就有捷径 | 概念监督、**多任务学习（共享概念、不同知识）**、重构、解耦、熵、对比学习；结论：“很难处理”，没有通用办法，概念监督有效，对比学习部分有效 |
| 弱监督定位 | **只激活最具判别性的部位**（CAM） | 用图像级标签训练，只要一处证据足以判类，其他部位就得不到梯度 | **对抗擦除**（擦掉最显著区域再训练）、Hide-and-Seek（随机遮挡）、ACoL、ADL |
| 多示例学习 | 包级准确 ≠ 实例级准确 | 最大值汇聚只依赖单个关键实例，其余实例的标签不可靠 | 注意力 MIL、确定性汇聚等 |
| 表示学习 | 信息瓶颈 / 判别性–迁移性权衡 | 监督学习得到的是对当前标签“最小充分”的表示，会丢弃其他任务需要的信息 | 多任务、自监督、多视角信息瓶颈 |

**两大类解决思路**（与我们的 HDR 式训练一一对应）：
1. **直接监督被遮住的部分**：概念监督、伪标签，对应我们的“点测光”（提及信道）；
2. **改变任务，让被遮住的部分变得必要**：多任务（不同知识）、对抗擦除 / 随机遮挡，对应我们的“包围曝光”（规程随机化）。

**对新颖性的影响**：
- “过曝”这个**现象本身不新**，HDR 式训练的**两个思路也有先例**（概念监督、多任务不同知识、擦除）。
- 仍然站得住的部分：
  1. **统一的定量刻画**：用“可见度”（翻转会改变结论的概率）把解释消除、推理捷径、判别部位偏置、MIL 实例不可靠统一成一个信息论量；已有工作多为组合计数（推理捷径的个数）或经验观察。
  2. **测试时改规程的后果**：误差按新规程下的可见度显现、升级 / 降级不对称、跨行业。查到的推理捷径工作讨论的是训练时的可辨识性，没有看到“部署时编辑知识会把未学好的概念暴露出来”的误差界（需细读两篇原文确认）。
  3. 在 VLM + 规程约束视觉决策上的方法与实证。
- **写作上必须**：正面引用 Pearl、推理捷径两篇、WSOL 擦除系列、MIL 与信息瓶颈；把过曝定理表述为“对一个已知现象的统一、定量刻画及其部署后果”，不能说成发现了新现象。

来源：[Marconato et al., NeurIPS 2023](https://proceedings.neurips.cc/paper_files/paper/2023/hash/e560202b6e779a82478edb46c6f8f4dd-Abstract.html) · [Bortolotti et al., arXiv 2502.11245](https://arxiv.org/html/2502.11245v4) · [ACoL, CVPR 2018](https://openaccess.thecvf.com/content_cvpr_2018/papers/Zhang_Adversarial_Complementary_Learning_CVPR_2018_paper.pdf) · [EIL, CVPR 2020](https://openaccess.thecvf.com/content_CVPR_2020/papers/Mai_Erasing_Integrated_Learning_A_Simple_Yet_Effective_Approach_for_Weakly_CVPR_2020_paper.pdf) · [擦除 + 伪标签 WSOL](https://arxiv.org/pdf/2404.09475) · [Explaining away（综述引用 Pearl 1988）](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2020.502751/pdf) · [Certainty Pooling for MIL](https://arxiv.org/pdf/2008.10548) · [Attention-based MIL](https://arxiv.org/pdf/1802.04712) · [判别性–迁移性权衡](https://arxiv.org/pdf/2203.03871)

## 六、细读两篇推理捷径论文（#76）

### Marconato 等，NeurIPS 2023：“Not All Neuro-Symbolic Concepts Are Created Equal”
- **定义**：推理捷径 = 学习目标的“非预期最优解”：标签拟合得很好，但概念的语义不对。成因有四：先验知识 K、真实概念的支撑集结构、训练目标、概念提取器的架构。
- **缓解**（理论）：
  - **多任务**：共享概念、知识不同，最优解等价于“各任务知识取合取”，不符合任一任务知识的概念映射被排除（命题 4）；
  - **概念监督**：在完整支撑集上全监督时，唯一最优解是恒等映射（命题 5），代价是需要稠密标注；
  - 重构、解耦（实验中在 XOR / MNIST-Addition 上把捷径降到 0%）、熵（启发式，可能与主目标冲突）。
- **真实数据**（BDD-OIA）：不加概念监督时，DPL 标签 F1 71.4、概念 F1 只有 39.4；加概念监督后，概念 F1 升到 60.5，标签 F1 降到 68.2。
- **与我们的关系**：
  - 他们**定性地**指出捷径会损害跨任务复用（例如学到的数字概念不能用于乘法），但**所有实验的 K 在训练和评测中都固定**，没有研究测试时修改知识；
  - **没有分级的量**：只用 F1 和最优解计数，熵项不是“标签对概念的信息量”。

### Bortolotti、Marconato 等，arXiv 2502.11245：“Shortcuts and Identifiability in Concept-based Models from a Neuro-Symbolic Lens”
- **结果**：在可外推、知识确定、极值性三个假设下，若“联合推理捷径”个数为 0，则任何达到最大似然的概念模型都具有预期语义（定理 3.9）。分析同时覆盖知识已知（固定推理层）与需学习两种情形。
- **分布外**：明确写出捷径“在分布内给出好的标签，却损害分布外表现”（分布外 F1 常低于 0.40）。但这里的“分布外”指**训练中未出现的概念组合**，不是知识的修改。
- **缓解**（实验）：除概念监督外，传统方法作用有限；只有对比学习部分有效；知识监督无效。多任务只有理论讨论，没有实验。
- **未涉及**：测试时修改推理层 / 知识（作者把“约束推理层”列为未来工作）；分级或信息论的可辨识性度量；部分指定的知识。

### 结论：我们的空白得到确认
| 我们的主张 | 两篇是否已有 | 判断 |
|---|---|---|
| 过曝现象本身（经由知识从结论学概念时不可辨识） | 有（推理捷径），且更一般 | 不能声称为新；应定位为其在单调、饱和型知识下的具体形态：被截断的概念是**欠约束**（任何取值都拟合标签），而非语义互换 |
| 分级的信息论刻画：I = 可见度 × H | **没有**（只有计数和 F1） | 新 |
| 测试时修改规程 / 知识的误差后果（误差界、升级 / 降级不对称、跨行业） | **没有**（K 始终固定；分布外只指未见过的概念组合） | 新，且是最贴近部署的部分 |
| 缓解思路：概念监督（点测光）+ 多任务不同知识（包围曝光） | 有（理论），实验上概念监督有效、多任务未做实验 | 思路不新；我们可以提供“规程随机化”在真实 VLM 任务上的实证，并结合 PU 提及信道与行业门控 |
| VLM、零训练读出、有序规程、正常参照校准 | 没有（他们用 MNIST / Clevr / BDD-OIA 和小模型） | 新的应用面 |

**写作定位**：把过曝定理表述为“推理捷径在单调饱和知识下的分级（信息论）刻画，并推广到部署时修改知识的情形”。正面引用这两篇，并说明我们沿用他们的两类缓解思路，在规程约束的 VLM 决策上给出系统实证。BDD-OIA（带概念标注和规则的驾驶数据）是他们的真实数据集，可以作为相关工作提及；按 #69 的决定，不新增领域。

## 七、补充查新（#99）：概念泄漏、梯度饥饿、单正标签学习

| 工作 | 内容 | 与我们的关系 |
|---|---|---|
| **Mahinpei、Clark、Lage、Doshi-Velez、Pan**，*Promises and Pitfalls of Black-Box Concept Learning Models*（arXiv 2106.13314，2021） | 概念模型学到的概念表示会编码预定义概念之外的信息（概念泄漏）；常见缓解办法不能完全去掉泄漏，下游解释因此可能误导 | 我们测到的“判定泄漏”（#93）属于这一类现象。我们的定义更窄、可检验：**给定事实不存在时**，它的读数与判定之间的依赖，也就是 A2′（给定内容条件独立）被违反的程度 |
| **Havasi、Parbhoo、Doshi-Velez**，*Addressing Leakage in Concept Bottleneck Models*（NeurIPS 2022） | 用概念概率（软概念）训练标签预测器会提高标签准确率，但代价是概念被污染，概念准确率和干预准确率下降。他们把根源归结为两点：**概念集不充分**、**概念预测器表达力不足**。修正：加侧通道捕捉未知潜在概念 + 更有表达力的概念预测器 | ① “用软概念换标签准确率、代价是概念被污染”与我们“同分布准确率 vs 过曝 / 泄漏”的权衡是同一结构；② 他们的侧通道就是用户在 #90 否决的独立判定通路，后续工作也指出侧通道让潜在概念难以解释；③ 他们的两个根源，在我们的数据上第一个不成立（规程对描述中的原子 100% 精确，#92），第二个成立（关键原子漏读）。**我们的区别**：不加侧通道，而用“对一族规程充分 + 最小信息补全”从目标层面约束，并把干预推广到“修改规程本身”，而不只是修改概念值 |
| **Pezeshki、Kaba、Bengio、Courville、Precup、Lajoie**，*Gradient Starvation: A Learning Proclivity in Neural Networks*（NeurIPS 2021） | 交叉熵 + 梯度下降下，模型只抓住一部分任务相关特征，其余有预测力的特征得不到学习；用动力学分析证明数据的某些统计结构会导致这种不平衡；提出解耦特征学习动力学的正则 | 与过曝机制最接近：判定饱和后其余原子没有梯度。区别：他们讲的是**特征**层面、单一固定任务下的优化偏置；我们讲的是**有名字的事实**在**规程变化**下的可辨识性，而且是信息层面的限制（换成任何损失或 RL 都一样，定理 2），不是优化偏置 |
| **Cole、Mac Aodha、Lorieul、Perona、Morris、Jojic**，*Multi-Label Learning from Single Positive Labels*（CVPR 2021） | 每张图只确认一个正标签、没有确认的负标签；把未标注类当成负类会产生假负；提出约束**期望正例数**的损失变体 | 直接对应我们提及信道的 c_j 问题：描述没写 ≠ 不存在。V41 的 EM 把 c_j 推高（#98），本质就是“未标即负”的自我强化退化。**修正版 V42 的辨识思路与他们不同**：不约束正例总数，而是只用判定已经确定原子存在的格子（选择只依赖 x 和 y、不依赖 m）来估计 c_j，这是无偏的 |
| **Margeloiu 等**，*Do Concept Bottleneck Models Learn as Intended?*（ICLR 2021 workshop） | 联合训练的概念瓶颈模型，其概念并不对应预期的输入区域 | 概念泄漏系列的起点，写作时引用 |

**对写作的影响**：
- 相关工作必须有“概念泄漏”一段。我们的判定泄漏指标要说明与它的关系：我们测的是条件依赖，可以直接对应定理的假设。
- “修复泄漏的代价”这个权衡，Havasi 2022 已经在固定任务下指出过。我们要说清楚自己多出来的东西：规程修改下的误差界、曝光缺口，以及不加侧通道的修复。

来源：[Mahinpei et al. 2021](https://arxiv.org/abs/2106.13314) · [Havasi et al., NeurIPS 2022](https://proceedings.neurips.cc/paper_files/paper/2022/hash/944ecf65a46feb578a43abfd5cddd960-Abstract.html) · [Pezeshki et al., NeurIPS 2021](https://arxiv.org/abs/2011.09468) · [Cole et al., CVPR 2021](https://arxiv.org/abs/2106.09708)

## 八、更正（#105）：推理捷径工作里已经有“测试时修改知识”的分布外检验

- **rsbench**（Bortolotti、Marconato 等，*A Neuro-Symbolic Benchmark Suite for Concept Quality and Reasoning Shortcuts*，NeurIPS 2024 Datasets & Benchmarks）在 SDD-OIA 上定义了分布外测试集：允许车辆在紧急情况下闯红灯，也就是在测试时修改先验知识（交通规则），并用它暴露推理捷径。
  - 这个测试是在合成数据（SDD-OIA，1,000 个样本）上做的；真实数据 BDD-OIA 上没有这样的划分。
- **因此第六节的判断要收窄**：“没有人研究测试时修改知识”不成立。推理捷径社区已经把“改知识”当作暴露捷径的分布外探针。
- **我们仍然新的部分**：
  1. **分级的信息论刻画**：曝光度 × 熵，以及部署遗憾的曝光加权误差界，而不是计数或 F1；
  2. 在**真实图像**、**真实规程**（工业安全规程）上的规程修改，加上升级与降级不对称、跨行业；
  3. **修复方法**：对一族规程充分的目标与最小信息补全，而不只是诊断；
  4. 用 VLM 实现、一次 prefill 的推理。
- **写作上**：必须引用 rsbench，并把我们的规程修改实验表述为“把他们在合成数据上的知识修改探针，推广到真实数据并给出定量理论”。
- **机会**：BDD-OIA 是这个社区的真实数据基准，有 21 个原因概念（多标签真值）、4 个动作和公开的交通规则。在它上面做我们的过曝检验和规程修改，可以与最接近的工作直接对话。
- 来源：[rsbench, arXiv 2406.10368](https://arxiv.org/abs/2406.10368) · [rsbench 项目页](https://unitn-sml.github.io/rsbench) · [Zenodo 数据](https://zenodo.org/doi/10.5281/zenodo.11612555) · [BDD-OIA, Xu et al. CVPR 2020](https://arxiv.org/abs/2003.09405)
