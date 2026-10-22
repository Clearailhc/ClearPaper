# Paper A 完整技术蓝图（v2.0 收敛定稿版）：校准的单次前向多模态事件抽取与免检测器视觉论元定位

* **锁定投稿目标（顺位 1）**：**[CVPR 2027](https://cvpr.thecvf.com/Conferences/2027/CallForPapers)**（*Vision & Language / Multimodal Learning Track*）
  * **关键时间节点**：摘要注册 **2026-11-10 (AoE)** | 全文提交 **2026-11-16 (AoE)** | 补充材料 **2026-11-23 (AoE)**
  * **Go/No-Go 评估节点**：**2026-10-24**（若未达标则改投 ICCV 2027，算力与人手并入 Paper C）
* **论文暂定标题**：*Calibrated Single-Pass Multimodal Event Extraction and Grounding with Counterfactual Visual Negative Training*
* **核心主张（v2.0 收窄后）**：以 2026 原生多模态早融合模型（**Qwen3.5-4B/9B** 与 **Gemma 4 E4B**）为底座，在主干顶层外挂轻量级双向注意力交互层，在单次前向（Single Forward Pass）中完成 Schema 条件化的多模态事件抽取与免检测器视觉论元定位；以**反事实图像负样本训练（Counterfactual Visual Negative Training）**作为核心创新抑制 VLM 的“看图脑补（Visual Over-interpretation）”，输出经严格校准的事件与论元置信度。

---

## 一、核心故事线（Storyline）与审稿防御立意

### 1.1 现有三大流派的真实瓶颈（全部基于一手文献核实）
1. **传统跨模态图网络与检测器流水线（[WASE (ACL 2020)](https://aclanthology.org/2020.acl-main.230.pdf)、[UniCL (ACL 2022)](https://aclanthology.org/2022.acl-long.519/)、[CLIP-Event (CVPR 2022)](https://openaccess.thecvf.com/content/CVPR2022/papers/Li_CLIP-Event_Connecting_Text_and_Images_With_Event_Structures_CVPR_2022_paper.pdf)、[CAMEL (arXiv 2023)](https://arxiv.org/abs/2306.08966)）**：
   * 强依赖预训练外部目标检测器（Faster R-CNN）提取固定 RoI 并构建跨模态图；即便如当前 M2E2 多媒体论元 SOTA 模型 **[CAMEL](https://arxiv.org/abs/2306.08966)**，其端到端 Multimedia Argument F1 也仅为 **33.2%**（Event F1 为 **57.5%**），且事件类别写死在分类头中，无法通过上下文 Schema 扩展新事件类型。
2. **通用与专用自回归多模态大模型（[UMIE (AAAI 2024)](https://ojs.aaai.org/index.php/AAAI/article/view/29873/31523)、[MMUTF (EMNLP 2024 Findings)](https://aclanthology.org/2024.findings-emnlp.381.pdf)、[MLLM Knowledge Editing (EMNLP 2025)](https://aclanthology.org/2025.emnlp-main.205.pdf)、[ECHO (2026)](https://arxiv.org/abs/2603.06683) 及 Qwen3.5/Gemma 4 生成模式）**：
   * **视觉显著性劫持（“看图脑补”假阳性）**：[EMNLP 2025 实证研究](https://aclanthology.org/2025.emnlp-main.205.pdf) 指出，MLLM 极易对图像中的显著物体产生过度联想（例如看到日常街景中的警察或正常行驶的槽罐车，即使未发生任何冲突或事故，仍以极高置信度输出 `Justice:Arrest-Jail` 或 `Transport:Accident`）。
   * **生成式边界偏移与高延迟**：自回归逐 Token 生成 JSON 坐标与文本跨度不仅慢一个数量级，且缺乏内生校准的空类（Abstention）概率。
3. **两阶段单步文本编码器（[CalOn (arXiv:2610.17113, 2026.10)](https://arxiv.org/html/2610.17113v1)、[GLiNER2 (EMNLP 2025 Demo)](https://aclanthology.org/2025.emnlp-demos.10/)）**：
   * **核实后的 CalOn M2E2 设定**：经核查 [CalOn 原文 Section 4.1、Table 3、Table 9 及 Appendix J](https://arxiv.org/html/2610.17113v1)，CalOn 在 M2E2 上采用的是**纯文本零样本迁移评测**（完全丢弃图像模态，且未在同源的 ACE2005 上训练）。更重要的是，由于论元角色受制于触发词激活的事件类型，CalOn 被迫拆分为**两次串行前向传播**（先预测触发词，再将预测出的触发词拼回输入预测论元）。一旦第一步触发词失准，第二步全盘崩溃：在给定真实触发词（Gold Triggers）时其 M2E2 Argument F1 为 **30.9%**，但端到端（End-to-End）Trigger F1 暴跌至 **9.2%**、**Argument F1 仅 3.6%**，且论元校准误差 **ECE 高达 0.66**（修正前为 0.72）！

### 1.2 严谨收窄后的核心贡献（遵循“1 主创新 + 1 辅助创新”）
* **注意避坑（按 `paper_plan.md` 审稿防御修正）**：绝不在论文中宣称“首个单次前向联合信息抽取”（纯文本领域的 [OneIE (ACL 2020)](https://aclanthology.org/2020.acl-main.718/) 与 [DyGIE++ (EMNLP 2019)](https://aclanthology.org/D19-1304/) 早已实现单次前向联合抽取）。我们的明确定位是：**在原生多模态 VLM 上实现 Schema 条件化的单次前向图文联合事件抽取与免检测器视觉论元定位，并通过反事实视觉负样本校准解决 VLM 的视觉脑补与过度自信问题**。
* **主创新：反事实视觉负样本与跨模态边际抑制训练（Counterfactual Visual Negative Calibration）**
  将正样本事件图替换为包含同类主体但无事件发生的**正常场景图（Hard Counterfactual Scene Images）**，利用同批次注意力掩码对比图文联合视图 $(T, I)$ 与纯文本视图 $(T, \varnothing)$ 的置信度增量，重罚由无关或正常视觉对象诱发的虚高事件概率。
* **辅助创新：主干顶层双向交互块 + 潜触发软边际化 + 空间槽位定位头**
  适应 `Qwen3.5` 的 3:1 Gated DeltaNet 混合注意力结构，不修改主干内部掩码，而是在主干顶层外挂 $L_{\text{bi}}=2\sim 4$ 层全向双向注意力交互块；用触发词概率分布对论元角色做软边际化（消除 CalOn 的两步串行割裂），并用轻量空间查询槽位（Spatial Slot Queries）一步回归视觉论元边界框。

---

## 二、全面更新的 Baseline 对比矩阵（2026-10-15 核实版）

| 基线梯队 | 具体对比模型（均附原始出处） | 实验设定与对比目标 |
| :--- | :--- | :--- |
| **梯队 1：M2E2 传统多模态事件抽取基线** | [WASE (ACL 2020)](https://aclanthology.org/2020.acl-main.230.pdf)、[UniCL (ACL 2022)](https://aclanthology.org/2022.acl-long.519/)、[CLIP-Event (CVPR 2022)](https://openaccess.thecvf.com/content/CVPR2022/papers/Li_CLIP-Event_Connecting_Text_and_Images_With_Event_Structures_CVPR_2022_paper.pdf)、**[CAMEL (arXiv 2023)](https://arxiv.org/abs/2306.08966)**、[UMIE (AAAI 2024)](https://ojs.aaai.org/index.php/AAAI/article/view/29873/31523)、[MMUTF (EMNLP 2024 Findings)](https://aclanthology.org/2024.findings-emnlp.381.pdf) | 遵循 M2E2 标准协议（在 `ACE2005 + imSitu/SWiG` 上训练，在 `M2E2` 上测试），目标：**多媒体论元 F1 超过 33.2%（CAMEL），事件 F1 不低于 57.5%**。 |
| **梯队 2：SWiG 视觉态势感知与角色定位基线** | [JSL (ECCV 2020)](https://arxiv.org/abs/2003.12058)、[GSRTR (BMVC 2021)](https://arxiv.org/abs/2109.00802)、**[CoFormer (CVPR 2022)](https://arxiv.org/abs/2203.16518)** | 验证免检测器空间槽位（Spatial Slots）在 SWiG 上的动词分类与视觉论元框定位（$\text{IoU} > 0.5$）指标与 GSRTR、CoFormer 可比。 |
| **梯队 3：2026 当季开源与闭源 VLM 基线** | **开源**：`Qwen3.5-9B`、`Qwen3.8-27B`、`Gemma 4 31B`、`InternVL3.5`（零样本与 LoRA 微调）；<br>**闭源**：`GPT-5.6-Sol / GPT-5.5`、`Gemini-3.1-Pro`、`Claude-Fable-5.1` | 在 M2E2（遵循 [ACL 2026 StrictEval](https://aclanthology.org/2026.acl-long.1426.pdf)）及**反事实“正常图”测试集**上对比，证明本方法显著降低视觉假阳性率（FPR）与校准误差（ECE）。 |
| **梯队 4：单步 Schema 抽取模型对比** | **[CalOn-0.6B (arXiv:2610.17113)](https://arxiv.org/html/2610.17113v1)**、[GoLLIE-7B (ICLR 2024)](https://arxiv.org/abs/2310.03668)、[GLiNER2 (EMNLP 2025)](https://aclanthology.org/2025.emnlp-demos.10/) | 同时报告“无 ACE05 零样本设定（对齐 CalOn）”与“有 ACE05+SWiG 标准设定”，直观展示单次前向软边际化相比两步串行（3.6% Arg F1）的巨大收益。 |

---

## 三、模型结构与训练方法（Methodology）

### 3.1 Qwen3.5 早融合预填充与顶层外挂双向交互层
给定动态事件 Schema $\mathcal{E} = \{(e_m, d_m^{\text{ev}}, \mathcal{R}_m)\}_{m=1}^M$、输入文本 $X = (x_1, \dots, x_T)$ 及输入图像 $I$（视觉 Token $v_1, \dots, v_P$），拼接为单一序列输入 `Qwen3.5-4B/9B`（并用 `Gemma 4 E4B` 复验）：
$$\texttt{<EVENT> } e_1: d_1^{\text{ev}} \dots \texttt{<ROLE> } r_1: d_1^{\text{role}} \dots \texttt{<TEXT> } x_1 \dots x_T \texttt{ <IMAGE> } v_1 \dots v_P$$
* **为什么不直接去掉 Qwen3.5 主干的因果掩码？（已核实源码结构）**：
  `Qwen3.5` 采用 **3:1 混合注意力架构**（每 3 层 Gated DeltaNet 线性注意力 + 1 层标准 GQA 全注意力，由 `full_attention_interval = 4` 控制）。其中 Gated DeltaNet 层包含因果深度卷积（`conv_kernel=4`）与状态递推，天然不可直接改为全向注意力。因此，我们**保持预训练主干内部掩码不变**，在主干输出的隐状态 $\mathbf{H}^{(L)} \in \mathbb{R}^{N \times D}$ 之上，**外挂 $L_{\text{bi}} = 2\sim 4$ 层无因果掩码的双向全注意力交互层（Bidirectional Interaction Layers）**，让 Schema 原型、文本 Token 与视觉 Patch 充分双向对齐。

### 3.2 潜触发分布边际化与免检测器空间槽位（Single-Pass Marginalization & Spatial Slots）
1. **文本跨度与视觉空间槽位表征**：
   * 文本跨度 $s_{ij}$ 由首尾 Token、跨度均值与宽度嵌入拼接投影得到 $\mathbf{s}_{ij} \in \mathbb{R}^D$。
   * 视觉侧不依赖 Faster R-CNN，而是引入 $Q=32$ 个可学习空间查询槽位 $\mathbf{Q}^{\text{box}} \in \mathbb{R}^{Q \times D}$，通过与视觉 Patch $\mathbf{H}^{\text{vis}}$ 的交叉注意力提取候选区域特征 $\mathbf{v}_q \in \mathbb{R}^D$，并用轻量 MLP 回归归一化边界框 $\hat{b}_q \in [0, 1]^4$。
2. **先验修正的触发词分布与论元软边际化**：
   * 对候选触发源 $u \in \{s_{ij}\} \cup \{\bar{\mathbf{v}}\}$，计算其属于各事件类型 $m \in \{1, \dots, M\}$ 及空类 $0$ 的 Logits $z_{m, u}^{\text{ev}}$。
   * 为抵消负样本降采样权重 $\omega \in (0, 1)$ 带来的非空概率膨胀，采用经典的 **Logit Adjustment 先验修正**（引用 [Menon et al., ICLR 2021](https://arxiv.org/abs/2007.07314)，作为扎实的数学实现细节）：
     $$z_{0, u}^{\text{corr}} = z_{0, u}^{\text{ev}} + \log\left(\frac{1}{\omega}\right)$$
   * 筛选非空触发概率 $g_{\text{ev}}(u) = 1 - P(e=0 \mid u)$ 最高的 Top-$K$（$K=24$）个候选源，用其触发分布 $P(e=m \mid u)$ 对事件嵌入做软汇聚 $\tilde{\mathbf{e}}(u) = \sum_{m=1}^M P(e=m \mid u)\mathbf{e}_m$，并在单次前向中对候选论元 $a \in \{s_{kl}\} \cup \{\mathbf{v}_q\}$ 边缘化求得角色概率：
     $$P(r = k \mid u, a) = \sum_{m: r_k \in \mathcal{R}_m} P(e = m \mid u) \cdot P(r = k \mid u, a, \tilde{\mathbf{e}}(u))$$

### 3.3 核心创新：反事实图像负样本训练与校准损失
为彻底抑制 VLM 看到相关场景/物体就强行触发事件的幻觉，我们在训练集中为每条事件样本检索或配对一张**同类对象但处于正常状态的反事实负样本图像 $I^{\text{neg}}$**（例如来自 SWiG / 日常场景中正常行驶的车辆、正常集会、日常办公的警察等）：
* 利用注意力掩码在同一前向中计算图文全视图非空事件概率 $p^{(T, I)}$ 与屏蔽图像的纯文本视图概率 $p^{(T, \varnothing)}$，定义视觉诱发增量 $\Delta_{\text{vis}}(u, I) = \max\big(0, p^{(T, I)}(u) - p^{(T, \varnothing)}(u)\big)$。
* 当输入为反事实正常图像 $I^{\text{neg}}$（或图文不匹配负样本）时，任何正向的视觉置信度抬升 $\Delta_{\text{vis}}(u, I^{\text{neg}}) > 0$ 均为“看图脑补”，直接施加平方校准惩罚，并与多分类 Brier Score 及框回归损失（$\text{L1} + \text{GIoU}$）联合优化：
  $$\mathcal{L}_{\text{total}} = \mathcal{L}_{\text{NLL}}^{\text{adj}} + \frac{\beta}{2} \|\mathbf{p} - \mathbf{y}\|_2^2 + \lambda_{\text{cf}} \sum_{u} \Delta_{\text{vis}}(u, I^{\text{neg}})^2 + \lambda_{\text{box}} (\mathcal{L}_{\text{L1}} + \mathcal{L}_{\text{GIoU}})$$
  *（注：关于对 Logits 注入高斯噪声的采样强化学习项 $\mathcal{L}_{\text{PG}}$，严格按 `paper_plan.md` 原则作为消融项测试——只有当其在 M2E2 验证集上显著优于上述直接可微损失时才写入正文，否则果断砍掉以保持方法干净。）*

---

## 四、实验设计与 10/24 Go/No-Go 执行清单

### 4.1 四大核心实验表（全部基于实测结果填写）
1. **Table 1（M2E2 标准协议与零样本双设定主表）**：
   * 上半区（标准跨模态迁移：`ACE2005 + imSitu/SWiG` 训练 $\rightarrow$ `M2E2` 测试）：对比 WASE、UniCL、CLIP-Event、CAMEL、UMIE、MMUTF 及微调后的 `Qwen3.5-9B` / `Gemma 4 E4B`。
   * 下半区（纯零样本设定與大模型对比）：对比 `CalOn-0.6B`、`GoLLIE-7B`、`Qwen3.8-27B`、`Gemma 4 31B`、`GPT-5.6-Sol`、`Gemini-3.1-Pro`。
2. **Table 2（反事实“正常场景图”抗脑补与概率校准 ECE 专项表）**：
   * 在混入反事实正常图像的测试集上，报告**视觉假阳性率（Visual FPR）**、**15-bin ECE**、**Brier Score** 以及 **Risk-Coverage 曲线下面积（AURC）**。
3. **Table 3（SWiG 视觉态势角色接地表）**：
   * 对比 JSL、GSRTR、CoFormer，报告动词准确率与视觉论元框定位精度（$\text{IoU} \ge 0.5$）。
4. **Table 4（核心组件与跨主干消融表）**：
   * 对比 `Qwen3.5-4B/9B` vs. `Gemma 4 E4B` 主干；消融顶层双向交互层、软边际化（对比两步硬串行）、反事实视觉负样本损失 $\lambda_{\text{cf}}$、$\log(1/\omega)$ 先验修正及空间槽位数 $Q$。

### 4.2 10/15 — 10/24 第一阶段攻坚与 Go/No-Go 判据
* **10/15–10/19**：在 `8×A800` 上跑通 `ACE2005`、`imSitu/SWiG` 与 `M2E2` 数据加载与官方评测脚本（同步接入 [ACL 2026 StrictEval](https://aclanthology.org/2026.acl-long.1426.pdf) 评测器），复现 `UniCL` 或 `CAMEL` 的官方指标（复现误差控制在 $\le 2.0$ 个点以内）。
* **10/20–10/24**：用 `Qwen3.5-4B` 跑通外挂 2 层双向交互块 + 软边际化基线模型。
* **10/24 Go/No-Go 硬指标**：
  1. 评测脚本准确复现 `CAMEL` 或 `UniCL` 指标（误差 $<2$ 个点）；
  2. 我方基础模型在 `ACE2005 -> M2E2` 纯文本事件抽取上 **Event F1 $\ge 50.0\%$**。
  * **决策规则**：若达标，全速推进反事实负样本训练与 `Gemma 4 E4B` 复验，冲刺 11/16 CVPR 截稿；若未达标，立即转为 ICCV 2027 周期，释放 `8×A800` 与人员全力保 Paper C 与 Paper B。
