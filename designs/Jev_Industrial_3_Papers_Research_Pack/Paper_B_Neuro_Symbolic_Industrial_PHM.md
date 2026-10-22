# Paper B 完整技术蓝图（v2.0 收敛定稿版）：工业故障诊断的神经符号校准决策模型

* **锁定投稿目标（10/15 已确认团队有自有工业数据）**：**[IEEE ICDE 2027 Industry & Applications Track](https://icde2027.github.io/important-dates.html)**
  * **截稿时间**：**2026-12-01 (17:00 PT)** | **录用通知**：**2027-02-15**（一轮定胜负，无 Rebuttal 负担）
  * **数据**：自有工业数据（主实验之一）+ 公开基准 `DiagnosticIQ` / `FailureSensorIQ` + [开源工业数据清单](../../docs/paper_b_open_datasets.md)
  * *注：放弃 11/11 截稿的 ICDE Research Round 2，避免与 11/10–11/16 的 CVPR 2027 双篇冲刺正面撞车。KDD 2027 Cycle 2（2 月初截稿）早于 ICDE 放榜，不能给同一篇做备选。*
* **Go/No-Go 评估节点**：**2026-10-31**
* **论文暂定标题**：*Overcoming Logical Inertia and Distractor Collapse: Polarity-Orthogonal and Set-Invariant Calibrated Decision Models for Industrial Fault Diagnosis*
* **核心主张（v2.0 收窄后）**：针对工业传感器规则与机修工单诊断中，前沿大模型与单步决策模型面临的**比较算子翻转盲区（`<` ↔ `>` 翻转后仍盲选原动作）**与**多干扰项扩充崩盘（候选项增至 10 项时准确率断崖下跌）**两大实证缺陷，提出 **Householder 极性正交反射算子**与 **$\alpha$-Entmax 置换不变稀疏竞争集合头**，配合**保形预测集拒识（Conformal Abstention）**实现毫秒级、零顺序偏置、高可靠的工业故障诊断。

---

## 一、核心故事线（Storyline）与两大实证痛点

### 1.1 权威工业基准揭示的两大反直觉失效现象
在风电机组、冷水机组（Chiller）、空气处理机组（AHU）、空压机与旋转机械运维中，传感器告警规则（如 `AHU Running AND (OAT - SAT > 5°F) for 2 Hours`）触发后，系统需从候选维修动作（SOP）或故障模式（FMEA）中给出准确推荐与校准置信度。IBM Research 与 RPI 发布的 **[DiagnosticIQ (ICLR 2026 / arXiv:2605.08614)](https://arxiv.org/html/2605.08614v1)** 与 **[FailureSensorIQ (NeurIPS D&B / arXiv:2506.03278)](https://arxiv.org/abs/2506.03278)** 揭示了两个极具冲击力的现象：

1. **条件翻转下的逻辑惯性盲区（Logical Inertia under Condition Inversion）**：
   * 在 `DiagnosticIQ-Aug` 变体中，仅将规则中的比较算子翻转（`< ↔ >`，`≤ ↔ ≥`）并加入 `"None of the above"` 拒识项，排行榜第一的闭源大模型（`claude-opus-4-6`）竟有 **63.43%** 的概率无视物理条件反转、继续盲目选择原维修动作，仅 **20.73%** 能正确选出 `"None of the above"`（[DiagnosticIQ Table 8](https://arxiv.org/html/2605.08614v1)）。
   * 算术与比较算子密度越高，模型越脆弱：规则中每增加一个比较或算术运算，LLM 答对的赔率（Odds）就下降 **47%**（$\beta = -0.627, p < 0.001$）。
2. **多干扰项扩充崩盘与选项顺序敏感性（Distractor Expansion Collapse & Order Sensitivity）**：
   * 当候选项从 4 个扩充到 10 个同类设备相邻干扰项时，29 个主流 LLM 在 `DiagnosticIQ Pro` 上有 **14 个输给了无监督的 `all-mpnet-base-v2` 余弦相似度（38.89%）**（[DiagnosticIQ Section 5.1](https://arxiv.org/html/2605.08614v1)）；而在 `FailureSensorIQ OptionsPert`（10 选项）上，榜首 LLM 准确率从 **60% 断崖式暴跌至 5.74%**（[FailureSensorIQ 官方仓库](https://github.com/IBM/FailureSensorIQ)）。
   * 同时，现有自回归 LLM 与初代单步指针模型（[Laya](https://github.com/NandhaKishorM/laya)、[Kev](https://github.com/jaredpalmer/kev)）将所有候选项拼接在同一位置序列中编码，导致严重的选项顺序偏置（在 `DiagnosticIQ Pert` 打乱测试上最高一致性仅 **51.48%**）。

### 1.2 核心机制解释：为什么不能只靠数据增强？
* **代数视角（解释算子翻转盲区）**：在预训练 Transformer 的连续嵌入空间中，`Temperature > 80°F` 与 `Temperature < 80°F` 共享了 90% 以上的上下文词汇，其句向量余弦相似度超过 $0.95$（**符号谓词的拓扑塌缩**）。单纯靠少量翻转样本微调难以打破预训练表征的局部平滑性。我们引入 **Householder 极性正交反射（Householder Polarity Reflection）**，在不改变预训练向量模长的前提下，将互斥比较算子沿正交超平面做代数镜像反射。
* **集合竞争视角（解释多干扰项崩盘）**：标准 Softmax 注意力对所有半相关的同设备干扰项均分配严格正权重（$\exp(z_i) > 0$），候选数从 4 增至 10+ 时引发分母熵稀释。我们设计**位置重置的 $\alpha$-Entmax 稀疏集合交互头**，从数学上保证：① **100% 选项顺序置换不变性**；② **无关干扰项权重精确截断归零**。

---

## 二、全面更新的 Baseline 对比矩阵（2026-10-15 核实版）

| 基线梯队 | 具体对比模型（均附原始出处） | 对比维度与核心指标 |
| :--- | :--- | :--- |
| **梯队 1：编码器与工业 Embedding 基线** | `all-mpnet-base-v2`（D.IQ **52.73%** / Pro **38.89%**）、`multi-qa-mpnet`（**51.43%** / **37.53%**）、`minilm-l6`（**52.65%** / **37.76%**）、微调 **ModernBERT-large**（[DiagnosticIQ Table 2](https://arxiv.org/html/2605.08614v1)） | 验证传统双塔/分类编码器虽对选项顺序不敏感，但缺乏复杂布尔规则组合推理与条件翻转拒识能力。 |
| **梯队 2：2026 当季开源与闭源大模型** | **官方已测闭源/开源榜首**：`claude-opus-4-6`（D.IQ **73.59%** / Pro **59.81%** / Aug 拒识 **20.73%**）、`gpt-5.4`（**73.27%** / **59.21%**）、`gemini-3.1-pro`（**72.74%** / **57.74%**，美元节能榜首 **$4.82M**）；<br>**新增 2026.08 最新开源基线**：**[Qwen3.8-27B](https://github.com/QwenLM/Qwen3.8)**、`Qwen3.5-9B` | 证明我们的 `0.8B / 4B` 模型以单次前向推理（`<25 ms`），在主榜、`Pro` 多干扰项榜、`Aug` 逻辑翻转榜、`Pert` 顺序一致性榜及美元节能收益上全面超越大模型。 |
| **梯队 3：工业 PHM 领域微调与规则增强基线** | [DiagnosticIQ 官方 `Qwen3-8B SFT`（**72.12%**）与 `Granite-3.3-8B GRPO`（**63.56%**）](https://arxiv.org/html/2605.08614v1)、[RuAG 规则增强 (ICLR 2025)](https://openreview.net/forum?id=52b4f21276)、[MaintNet 微调模型](https://papers.phmsociety.org/index.php/phmap/article/view/4652) | 在跨工业设备零样本迁移（仅在 AHU 空气处理机组上训练 $\rightarrow$ 测试其余 15 类工业设备）上对比泛化能力。 |
| **梯队 4：单步预填充决策模型（与 A/C 统一底座）** | **[Laya-421M (ModernBERT)](https://github.com/NandhaKishorM/laya)**、**[Kev-0.8B / 4B (基于 Qwen3.5 底座)](https://github.com/jaredpalmer/kev)**、[InnerJev-4B (arXiv:2610.03935)](https://arxiv.org/html/2610.03935v1) | 直接在完全相同的 `Qwen3.5-0.8B/4B` 与 `ModernBERT` 主干上对比原生 Pointer Head 与我方 Householder + $\alpha$-Entmax Head，形成最严格的同底座控制变量消融。 |

---

## 三、模型结构与训练方法（Methodology）

### 3.1 工业规则 DNF 解析与 Householder 极性正交反射层
给定工业设备描述与触发的传感器条件树（按 [DiagnosticIQ Section 3.2.2](https://arxiv.org/html/2605.08614v1) 规范化为析取范式 $\mathcal{TR}_{\text{DNF}} = \bigvee_{k=1}^K \bigwedge_{j=1}^{m_k} c_{kj}$，其中原子谓词 $c_{kj} = (\text{Sensor}, \text{op}, \text{Threshold}, \text{Duration})$，$\text{op} \in \{>, <, \ge, \le, =, \neq, \text{NOT}\}$）：
* **Householder 极性正交反射（Householder Polarity Reflection）**：
  将每个原子谓词表征分解为物理量幅值向量 $\mathbf{h}_{kj}^{\text{mag}} \in \mathbb{R}^D$ 与比较算子极性 $\text{op}_{kj}$。为每对互斥算子（如 `>` 与 `<`）定义一个可学习的单位法向量 $\mathbf{u}_{\text{op}} \in \mathbb{R}^D$（$\|\mathbf{u}_{\text{op}}\|_2 = 1$）。对正向算子保持恒等映射，对反向算子施加 **Householder 反射变换**：
  $$\mathbf{H}(\mathbf{u}_{\text{op}}) = \mathbf{I} - 2 \mathbf{u}_{\text{op}} \mathbf{u}_{\text{op}}^\top, \quad \tilde{\mathbf{h}}_{kj} = \mathbf{H}(\mathbf{u}_{\text{op}}) \mathbf{h}_{kj}^{\text{mag}}$$
  由于 $\mathbf{H}(\mathbf{u}_{\text{op}})$ 是对称正交矩阵（$\mathbf{H}^\top = \mathbf{H}, \mathbf{H}^2 = \mathbf{I}$），它严格保持特征模长 $\|\tilde{\mathbf{h}}_{kj}\|_2 = \|\mathbf{h}_{kj}^{\text{mag}}\|_2$（不破坏 `Qwen3.5` / `ModernBERT` 的预训练特征分布尺度），同时使互斥谓词在判别超平面法向上严格反号：$\langle \tilde{\mathbf{h}}_{kj}^{+}, \mathbf{u}_{\text{op}} \rangle = -\langle \tilde{\mathbf{h}}_{kj}^{-}, \mathbf{u}_{\text{op}} \rangle$。
* **可微 Łukasiewicz 逻辑汇聚与拒识门控**：
  计算各原子谓词成立概率 $q_{kj} = \sigma(\mathbf{w}_p^\top \tilde{\mathbf{h}}_{kj})$，通过无连乘梯度消失的 Łukasiewicz t-模汇聚整棵规则树的满足度 $Q_{\text{tree}}$：
  $$Q_k^{\text{conj}} = \max\left(0, \sum_{j=1}^{m_k} q_{kj} - (m_k - 1)\right), \quad Q_{\text{tree}} = \min\left(1, \sum_{k=1}^K Q_k^{\text{conj}}\right)$$
  当条件被反事实翻转时，$Q_{\text{tree}} \to 0$，直接推高 `"None of the above"` / 拒识槽位得分 $z_{\text{abstain}} = \gamma (1 - Q_{\text{tree}})$。

### 3.2 位置重置与 $\alpha$-Entmax 稀疏竞争集合头
1. **平行位置重置分支（Position-Reset Parallel Encoding）**：
   共享状态与规则序列长度为 $L_s$。对于 $N$ 个候选维修动作 $\{o_1, \dots, o_N\}$，所有候选项在 RoPE 中均从**完全相同的起始位置索引 $L_s + 1$** 开始编码，并用块对角分支掩码（Block-Diagonal Branch Mask）物理隔离各候选项内部的 Token，提取候选表征集合 $\mathbf{C} = \{\mathbf{c}_1, \dots, \mathbf{c}_N\}$。
2. **无位置编码的 $\alpha$-Entmax 集合交互层**：
   在候选集合 $\mathbf{C}$ 上施加不含位置编码的集合自注意力，并用 **$\alpha$-Entmax**（[Peters et al., ACL 2019](https://aclanthology.org/P19-1146/)，训练期将 $\alpha$ 从 $1.01$ 线性退火至 $1.50$ 以避免初期零梯度）生成最终选项概率分布：
   $$\mathbf{p} = \alpha\text{-}\operatorname{entmax}(\mathbf{z}) = \operatorname*{argmax}_{\mathbf{p} \in \Delta^N} \left( \mathbf{p}^\top \mathbf{z} + \mathbf{H}_{\alpha}^{\text{Tsallis}}(\mathbf{p}) \right)$$
   * **性质 1（严格置换等变性）**：对任意选项排列置换 $\mathbf{\Pi}$，输出概率严格满足 $\mathbf{p}(\mathbf{\Pi}\mathbf{C}) = \mathbf{\Pi}\mathbf{p}(\mathbf{C})$，在纯选项打乱测试中一致性恒为 **100%**。
   * **性质 2（紧支撑稀疏截断）**：得分低于内生阈值 $\tau(\mathbf{z})$ 的无关干扰项被精确赋零（$p_i = 0$），消除 10~50 个候选项下的分母摊薄效应。

### 3.3 训练目标与保形预测集拒识（Conformal Prediction Set）
1. **互补逻辑守恒正则与节能加权损失**：
   对原规则 $\mathcal{C}$ 与算子翻转后的反规则 $\neg \mathcal{C}$，约束其对原正确动作 $o^*$ 的预测概率满足互补不等式 $P(o^* \mid \mathcal{C}) + P(o^* \mid \neg \mathcal{C}) \le 1$：
   $$\mathcal{L}_{\text{total}} = w_{\text{save}}^i \cdot \mathcal{L}_{\text{Entmax-Brier}}(\mathbf{p}, y^*) + \lambda_{\text{logic}} \max\big(0, P(o^* \mid \mathcal{C}) + P(o^* \mid \neg \mathcal{C}) - 1\big)^2$$
   其中 $w_{\text{save}}^i$ 为 [DiagnosticIQ Appendix A.8](https://arxiv.org/html/2605.08614v1) 提供的规则级节能经济权重。
2. **保形预测集校准（Conformal Calibration on FailureSensorIQ）**：
   直接在校准集上采用分裂保形预测（Split Conformal Prediction，对齐 [FailureSensorIQ](https://arxiv.org/abs/2506.03278) 官方评测协议），以 $s(x, y) = 1 - \hat{p}(y \mid x)$ 为非一致性得分，在给定覆盖率 $1 - \alpha_{\text{conf}} = 0.90$ 下输出最小尺寸的候选故障诊断集合 $\hat{\mathcal{C}}(x)$，报告**不确定性调整准确率（`UAcc`）**与**平均预测集大小（`SS`）**。

---

## 四、实验设计与 10/31 Go/No-Go 执行清单

### 4.1 核心实验大表规划（只写实测结果）
1. **Table 1（`DiagnosticIQ` 全系 5 变体与美元节能收益主表）**：
   * 对齐官方 29 个 LLM 与 4 个编码器基线，报告 `DiagnosticIQ`、`DiagnosticIQ Pro`（多干扰项）、`DiagnosticIQ Pert`（顺序扰动一致性）以及**累计美元节能收益（USD Savings）**。
2. **Table 2（`DiagnosticIQ-Aug` 条件翻转逻辑盲区专项击穿表）**：
   * 统计算子翻转后模型的**错误惯性选择率（Logical Inertia Rate，越低越好）**与**正确拒识率（Correct Abstention Rate，越高越好）**，配合翻转前后句向量余弦相似度与法向投影分布图。
3. **Table 3（`FailureSensorIQ` 10 选项扩充 `OptionsPert` 与保形预测 `UAcc / SS` 表）**：
   * 对比 4 选项与 10 选项下的准确率留存率、ECE、Brier Score 以及保形预测集大小 `SS`。
4. **Table 4（跨工业设备零样本迁移 `AHU -> 15 Assets` 与同底座模块消融表）**：
   * 在 `Qwen3.5-0.8B/4B` 与 `ModernBERT-large` 上分别消融 Householder 反射层、位置重置、$\alpha$-Entmax（对比标准 Softmax）与互补逻辑守恒项。
5. **Table 5（自有工业数据实测表）**：
   * 在团队自有工单 / 规则数据上报告准确率、翻转后的错误惯性选择率与正确拒识率、ECE 及保形集大小 `SS`，作为 ICDE Industry Track 要求的真实场景证据。

### 4.2 反事实数据的可信度设计（回应“合成数据”质疑）
算子翻转 + 拒识的测试本质上是人工构造的反事实数据。最接近的竞争工作 [DiagLoop (arXiv:2608.03674)](https://arxiv.org/abs/2608.03674) 训练数据全部合成，工业侧评测用的 LBNL 数据也部分来自仿真，没有真实现场数据。我们按以下三条避免同样的质疑：
1. **主结论落在自有工业数据上**：Table 5 必须先证明“翻转盲区”和“干扰项崩盘”两个现象在真实工单 / 规则上同样存在，再报告方法的提升；公开基准上的结果只作可复现对比。
2. **翻转反规则做专家抽样核对**：从自动生成的反规则中抽 200–300 条，由 2 名领域专家独立判断“翻转后的规则在物理上是否成立、原动作是否确实不再适用”，报告标注一致率（Cohen's κ）和不成立比例；不成立的模板从训练和测试中剔除。
3. **训练与测试的数据来源隔离，防止循环论证**：
   * 训练用翻转样本：来自自有数据的训练划分 + [AssetOpsBench](https://github.com/IBM/AssetOpsBench) 的 FMEA 记录与工单；
   * 测试：`DiagnosticIQ-Aug`（官方构造，不参与训练）+ 自有数据中按设备或时间预留的测试划分；
   * 生成翻转样本的模板和规则不得参考测试集内容；在论文中写明各划分的来源与去重方式。

### 4.3 10/15 — 10/31 第一阶段攻坚与 Go/No-Go 判据
* **10/15–10/22**：在划拨的 `1–2 × H20` 上下载并跑通 `DiagnosticIQ` 与 `FailureSensorIQ` 官方代码库；提取 `Qwen3.5-0.8B/4B` 与 `ModernBERT` 在翻转算子 `<` 与 `>` 下的隐状态余弦相似度。
* **10/23–10/31**：跑通原生 `Laya`、`Kev (Qwen3.5)` 与 `Qwen3.8-27B` 基线，并验证 Householder 反射 + $\alpha$-Entmax 原型。
* **10/31 Go/No-Go 硬指标**：
  1. `DiagnosticIQ` 与 `FailureSensorIQ` 全部变体数据到位且基线脚本跑通；
  2. 实测复现两大核心现象：① 标准主干中 `<` 与 `>` 规则嵌入余弦相似度 $>0.95$；② `DiagnosticIQ-Aug` 条件翻转后基线模型出现高比例盲选原动作；
  3. 自有工业数据完成脱敏，并整理成与 `DiagnosticIQ` 一致的“规则 → 候选动作”格式（含算子翻转后的反规则），保证 **12/01 投 ICDE 2027 Industry & Applications Track** 的主实验可用。