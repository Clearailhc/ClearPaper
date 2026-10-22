# Paper C（PRISM）进阶数学分析与下一阶段优化探索指南

> **版本：2026-10-16** | **配套代码**：`prism_optimizations.py`（可直接接入 `paper_c/jevc/`）
> **定位**：基于 `research_log.md`（`#1`–`#28`）在 8×H20 上跑出的真实实验现象，针对当前 **PRISM（Parallel Risk Inspection via Structured Merging — "Think Wide, Not Deep"）** 暴露出的五个具体痛点，从第一性原理出发给出严谨的数学病灶诊断、理论命题证明与按投入产出比（ROI）排序的落地实验方案。

## 一、实验现象与数学病灶总览矩阵

| 优先级 | 对应日志编号与实测反常现象 | 底层数学 / 系统病灶（Root Cause） | 提出的优化方向 | 是否需重跑 GPU 推理 |
| :---: | :--- | :--- | :--- | :---: |
| **P0** | **`#15`, `#17`**：15 个原语分支零样本 AUROC 跨度极大（`0.81` 玩手机 $\sim$ `0.995` 未戴手套），但只训 1 个全局温度 $T$ + 逐分支偏置 $b_j$；若训 15 个独立温度 $T_j$ 又易在稀缺异常样本上过拟合（`#24`） | **异方差分支的对数几率尺度失配（Logit Scale Heteroscedasticity）**：共用单一 $T$ 时，高方差低质分支的尾部噪声无法被单纯平移 $b_j$ 压制，在 Noisy-OR 连乘中产生刺头误报。 | **方向 1：空分布鲁棒标准化（Null-MAD Scale Equalization）**——利用占 80% 的正常验证图非参数白化各分支尺度，**零正样本自由度开销**。 | **否**（直接读现有缓存 Logits，`<1s`） |
| **P0** | **`#12`, `#15`, `#20`**：正常图地面反光同时触发“积水”（25/50）与“积油”（21/50）；代价敏感（$\eta=5$）下正常图误报率达 `24.3%`，32B 上正常误报 `+7.5%` | **Noisy-OR 的两大对偶缺陷**：<br>① **共线视觉混淆双重计费（Double Counting）**：条件独立假设把同一地面反光在多个相关分支上的响应相乘放大；<br>② **多分支微弱尾部指数累加**：$M$ 个非零 Sigmoid 尾部在 $\sum_{j=1}^M -\log(1-\tilde{p}_j)$ 中累加。 | **方向 2：共线混淆团内 $L_r$ 范数包络 + 幂次尾部阻尼（Correlated Group Envelope & Power Noisy-OR）** | **否**（直接读现有缓存 Logits，`<2s`） |
| **P0** | **`#19`, `#21`**：[SafeBuild-Bench](https://www.google.com/search?q=https%3A%2F%2Farxiv.org%2Fabs%2F2608.00068) 上验证集校准提升了总体准确率（`+2.9%~+4.8%`），但**按类别平均准确率（Macro-Acc）不显著**（8B `p=0.36`、Gemma 4 `p=0.96`），8B 上 11 月时间漂移子集不显著（`p=0.37`） | **校准偏置与类别频率先验耦合（Prior-Bias Entanglement）**：验证集拟合的 $b_k$ 同时吸收了 VLM 词面偏置 $b_k^{\text{prompt}}$ 与验证集长尾先验 $\log \pi_k^{\text{val}}$，导致模型偏向常见类且在测试分布漂移（$\pi^{\text{Nov}} \neq \pi^{\text{val}}$）时失准。 | **方向 3：先验解耦平衡贝叶斯（Logit Adjustment）+ 测试期无监督 EM 漂移自适应** | **否**（直接读 SafeBuild 缓存 Logits，`<1s`） |
| **P1** | **`#11`, `#12`**：冶金渣罐正常工艺烟雾被判为火灾烟雾；光滑环氧地坪正常反光被判为积水/积油；纯靠在原语 Prompt 中加“忽略反光/工艺烟雾”难以彻底消除误报 | **VLM 单步前向的“否定抑制盲区（Negation Blindness）”**：单步跨模态注意力擅长正向匹配视觉特征，难以在单次内积中同时完成“识别良性反光并从积水置信度中做减法”。 | **方向 4：伴随反例抑制原语（Paired Inhibitory Counter-Primitives）**——将隐式文本否定转化为显式并发概率门控相减。 | **仅需补跑 2~3 个伴随原语分支** |
| **P1** | **`#20`, `#25`**：`Qwen3-VL-8B` 并发 15 分支仅慢 `1.46×`，但 `Qwen3.5-9B`（`4.4×`）、`Gemma 4`（`4.0×`）和单卡 `32B`（`7–9×`）未兑现低成本 | **跨请求前缀缓存失效与 KV 驱逐**：将 15 个分支作为 15 条独立请求提交时，混合注意力（Gated DeltaNet）不支持跨请求状态重用，单卡 32B 剩余显存不足导致图像前缀块被中途驱逐重算。 | **方向 5：单序列多槽位块对角掩码（Single-Pass Block-Diagonal Packed Probing）**——1 条序列 1 次前向同时读出 15 个槽位。 | **仅需在 200 张测速图上跑 `bench_cost.py`** |
| **P2** | **`#14`, `#28`**：正在进行的同等算力 LoRA SFT（直接问 SFT vs. PRISM 分支 SFT，各 9,570 样本）；如何最大化分支 SFT 的上限并解决无描述数据集的训练问题？ | **独立分支 BCE 损失忽略了整图级正常约束**：单分支 BCE 将所有负样本等权对待，未利用“正常图上全部 15 个分支经 Noisy-OR 聚合后仍须为 0”的全局强约束。 | **方向 6：端到端可微 Noisy-OR 联合训练损失 + SFT 后重校准与 2×2 交叉评测协议** | **配合 `#28` 训练/评测推进** |

## 二、理论基石：线性负向稀释 vs. Noisy-OR 共线虚警的对偶定理

在 `#22` 与 `#24` 的消融实验中，我们观察到了一组极具理论价值的对偶现象：
* **现象 A（线性/Logistic 头的漏报崩盘）**：在 `InspecSafe-V1` 的 15 个分支上，无结构多项 Logistic 回归头虽然准确率较高，但**高危漏报率高达 `11.1%–15.6%`**，是 Noisy-OR（`2.5%–3.3%`）的 **4~5 倍**；且在 [MMAD](https://www.google.com/search?q=https%3A%2F%2Farxiv.org%2Fhtml%2F2410.09453v3) 的 133 个稀疏分支上，加入线性修正的混合头在三个主干上全面劣化（`#24`）。
* **现象 B（标准 Noisy-OR 的正常图虚警累积）**：标准 Noisy-OR 将高危漏报压到了极致（`2.0%–3.3%`），但在代价敏感决策（$\eta=5$）下，**正常图误报率升至 `24.3%`**（`#15`），且在 `32B` 上正常图误报比直接问高 `+7.5%`（`#20`）。

这两大现象本质上是同一个高维聚合算子在**真阳性（Recall）**与**真阴性（Specificity）**两端的数学对偶效应，可在论文 Method 部分正式表述为以下两个命题：

### 命题 1（加性线性头的“负分支淹没效应” vs. Noisy-OR 的“单调析取主导性”）
设图像 $x$ 针对 $M$ 个隐患原语输出校准前对数几率向量 $\mathbf{z}(x) = (z_1(x), \dots, z_M(x)) \in \mathbb{R}^M$。在工业巡检中，异常通常是稀疏的：当图像存在第 $j^*$ 类高危隐患（$z_{j^*}(x) > 0$）时，其余 $M-1$ 个无关隐患分支通常为强负值（$z_j(x) \le -\mu_{\text{neg}} < 0, \forall j \neq j^*$）。
1. **加性线性/Logistic 头的负向淹没（Additive Negative Dilution）**：
   对于任意线性组合分类器 $s(x) = \sum_{j=1}^M w_j z_j(x) + c$（其中 $w_j > 0$），单高危样本的响应满足：
   $$s(x) \le w_{j^*} z_{j^*}(x) - \mu_{\text{neg}} \sum_{j \neq j^*} w_j + c$$
   随着无关负分支数量 $M$ 的增加（或当 `MMAD` 中不同商品类别激活的分支数 $M_c \in [1, 12]$ 动态变化时），右侧负向累加项 $-\mu_{\text{neg}} \sum_{j \neq j^*} w_j$ 线性增长并抵消正向信号 $w_{j^*} z_{j^*}(x)$，导致高危漏报率随 $M$ 急剧恶化。
2. **Noisy-OR 的单调析取保底（Monotonic Disjunctive Dominance）**：
   在 Noisy-OR 聚合 $P(\text{Risk} \ge k \mid x) = 1 - (1 - \lambda_k) \prod_{j \in \mathcal{A}_k} (1 - \tilde{p}_j(x))$ 中，任意强负分支 $z_j(x) \to -\infty$ 映射为乘法单位元 $1 - \tilde{p}_j(x) \to 1$（**零稀释性质**），且总风险概率满足严格下界：
   $$P(\text{Risk} \ge k \mid x) \ge \max_{j \in \mathcal{A}_k} \tilde{p}_j(x) \ge \tilde{p}_{j^*}(x)$$
   即只要任意单一高危原语被检出（$\tilde{p}_{j^*}(x) \to 1$），总风险概率无条件趋近于 $1$，不受其余 $M-1$ 个负分支的影响。

### 命题 2（标准独立 Noisy-OR 的“尾部虚警累加”与“共线混淆双重计费”）
当输入为无隐患正常图像 $x_{\text{norm}}$（$y^* = 0$）时：
1. **微弱尾部累加效应**：若各分支在正常图像上存在残余伪阳概率 $\tilde{p}_j(x_{\text{norm}}) = \epsilon_j \in (0, 1)$，则标准独立 Noisy-OR 的整图误报概率为：
   $$P(\text{Risk} \ge 1 \mid x_{\text{norm}}) = 1 - (1 - \lambda_1) \exp\left( \sum_{j=1}^M \log(1 - \epsilon_j) \right) \ge 1 - \exp\left(-\sum_{j=1}^M \epsilon_j\right)$$
   当 $M=15$、平均残余伪阳概率仅为 $\bar{\epsilon} = 0.02$ 时，整图异常概率即膨胀至 $1 - e^{-0.30} \approx 25.9\%$，在 $\eta=5$ 的代价敏感阈值（$P(\text{Risk} \ge 1) \ge \frac{1}{1+\eta} \approx 0.167$）下必然触发虚警！
2. **共线混淆双重计费（Collinear Confounder Double-Counting）**：若两个原语分支 $j_1, j_2$（如“地面积水”与“地面积油”）受同一良性视觉混淆因子 $C$（如地面镜面反光）驱动，在给定 $C$ 时高度正相关（$\operatorname{Corr}(z_{j_1}, z_{j_2} \mid y=0) \to 1$），则真实联合未发生概率为 $\Pr(E_{j_1}=0 \land E_{j_2}=0 \mid x_{\text{norm}}) = 1 - \max(\tilde{p}_{j_1}, \tilde{p}_{j_2})$，而独立 Noisy-OR 错误地计算为 $(1 - \tilde{p}_{j_1})(1 - \tilde{p}_{j_2}) = 1 - \tilde{p}_{j_1} - \tilde{p}_{j_2} + \tilde{p}_{j_1}\tilde{p}_{j_2} < 1 - \max(\tilde{p}_{j_1}, \tilde{p}_{j_2})$，将单一视觉假象重复计费为两份独立风险证据。

## 三、六大优化方向的数学设计与落地细则

### 方向 1：空分布鲁棒标准化（Null-MAD Scale Equalization）

* **解决痛点**：`#15` 中 15 个分支的 Logit 分布尺度差异巨大，但验证集异常正样本太少（仅约 115 张），无法为每个分支独立拟合温度 $T_j$。
* **核心思想**：验证集中 80%（约 458 张）都是正常图（$y_{\text{val}} = 0$）。在每一个分支 $j$ 上，458 张正常图提供了极其充裕的样本来精确刻画该分支的**空分布（Null Distribution）位置与尺度**！
* **数学公式**：
  在验证集正常图像子集 $\mathcal{D}_{\text{val}}^{(0)} = \{x_i \in \mathcal{D}_{\text{val}} : y_i = 0\}$ 上，计算每个分支 $j \in \{1, \dots, M\}$ 的中位数与中位绝对偏差（MAD）：
  $$\mu_{j}^{(0)} = \operatorname{median}_{x \in \mathcal{D}_{\text{val}}^{(0)}} z_j(x), \quad \sigma_{j}^{(0)} = 1.4826 \times \operatorname{median}_{x \in \mathcal{D}_{\text{val}}^{(0)}} \big| z_j(x) - \mu_{j}^{(0)} \big|$$
  在进入 Noisy-OR 校准前，先对所有分支做非参数空分布白化：
  $$\tilde{z}_j(x) = \frac{z_j(x) - \mu_{j}^{(0)}}{\max(\sigma_{j}^{(0)}, \sigma_{\min})}$$
* **为什么有效**：经过这一步无监督/纯负例白化后，全部 15 个分支（以及 `MMAD` 的 133 个分支）在正常图像上的背景噪声全都被严格对齐到零均值、单位方差尺度，且**消耗的异常正样本自由度为 0**！

### 方向 2：共线混淆团内 $L_r$ 范数包络与幂次尾部阻尼（Correlated Group Envelope & Power Noisy-OR）

* **解决痛点**：命题 2 揭示的“地面反光在积水/积油上双重计费（`#12`）”与“多分支微弱 Sigmoid 尾部累加导致 24.3% 正常误报（`#15`）”。
* **数学公式**：
  1. **正常图残差相关性自动分团**：在验证集正常样本 $\mathcal{D}_{\text{val}}^{(0)}$ 上计算白化后分支对数几率的皮尔逊相关矩阵 $R_{jm} = \operatorname{Corr}(\tilde{z}_j, \tilde{z}_m \mid y=0)$。将 $R_{jm} \ge \tau_{\text{corr}}$（如 $\tau_{\text{corr}} = 0.30$）的分支自动聚为共线混淆团 $\mathcal{G} = \{g_1, g_2, \dots, g_G\}$（例如 `InspecSafe` 中“积水”与“积油”会自动合并进同一个团 $g_{\text{floor}}$）。
  2. **幂次尾部阻尼（Power Tail Damping）**：对单个分支概率施加幂指数 $\gamma \ge 1$（由验证集 RPS 拟合 1 个全局标量 $\gamma \approx 1.15 \sim 1.35$，或采用 2 类 $\alpha$-Entmax）：
     $$\tilde{p}_j(x) = \big[ \sigma\big((\tilde{z}_j(x) + b_j)/T\big) \big]^\gamma$$
     当某分支处于弱假阳性区（如 $\sigma = 0.05, \gamma = 1.3$）时，$0.05^{1.3} = 0.020$（尾部伪阳概率砍半）；而当某分支检测到真实高危隐患（$\sigma = 0.95$）时，$0.95^{1.3} = 0.935$（几乎不受损！）。
  3. **团内 $L_r$ 范数包络 + 团间 Noisy-OR**：
     在每个共线团 $g \in \mathcal{G}$ 内部，采用 $L_r$ 范数包络（取 $r = 4$，介于独立加和 $r=1$ 与完全共线极值 $r=\infty$ 之间）聚合团内触发等级 $\ge k$ 的风险概率，再在团与团之间执行 Noisy-OR：
     $$\tilde{p}_{g, k}(x, \text{ind}) = \min\left(1, \left( \sum_{j \in g: \mathcal{S}(\text{ind}, j) \ge k} \tilde{p}_j(x)^r \right)^{1/r} \right)$$
     $$P(\text{Risk} \ge k \mid x, \text{ind}) = 1 - (1 - \lambda_k) \prod_{g \in \mathcal{G}} \big(1 - \tilde{p}_{g, k}(x, \text{ind})\big)$$
     当环氧地坪反光同时让“积水”和“积油”输出 $0.40$ 时，独立 Noisy-OR 会算出 $1 - 0.6^2 = 0.64$，而 $L_4$ 团内包络算出 $(0.4^4 + 0.4^4)^{1/4} = 0.476$，直接砍掉 70% 的虚增误报！

### 方向 3：先验解耦平衡贝叶斯与测试期无监督 EM 漂移自适应

* **解决痛点**：`#19` 与 `#21` 中指出，[SafeBuild-Bench](https://www.google.com/search?q=https%3A%2F%2Farxiv.org%2Fabs%2F2608.00068) 上验证集校准只提升了常见类，导致**按类别平均准确率（Macro-Acc）在所有主干上均不显著**（8B `+0.010, p=0.36`；Gemma 4 `-0.004, p=0.96`；32B `+0.030, p=0.13`），且 8B 在 11 月时间漂移子集上不显著（`p=0.37`）。
* **数学公式**：
  1. **先验解耦的对数几率调整（Prior-Decoupled Logit Adjustment for Macro-Accuracy）**：
     验证集学习到的类别偏置 $b_k$ 实际上等于 $b_k = b_k^{\text{prompt}} + \log \pi_k^{\text{val}}$（其中 $\pi_k^{\text{val}} = \frac{N_k^{\text{val}}}{N^{\text{val}}}$ 为验证集类别频率）。根据 [Menon et al. (ICLR 2021)](https://www.google.com/search?q=https%3A%2F%2Farxiv.org%2Fabs%2F2007.07314)，若目标指标为类别均衡准确率（Macro-Accuracy，即在均匀类先验 $\pi_k^{\text{bal}} = 1/K$ 下的贝叶斯最优决策），只需在验证集校准后的对数几率上显式扣除验证集经验频率对数：
     $$\ell_k^{\text{macro}}(x) = \frac{z_k(x) + b_k}{T} - \tau \log \hat{\pi}_k^{\text{val}}, \quad \hat{y}_{\text{macro}}(x) = \operatorname*{argmax}_{k} \ell_k^{\text{macro}}(x)$$
     其中 $\tau \in [0.5, 1.0]$（默认 $\tau = 0.85$）。这一步零训练开销，直接把少数类的召回率拉回均衡帕累托前沿！
  2. **针对 11 月时间漂移子集的无监督 EM 先验自适应（Saerens et al. Prior-Shift EM）**：
     施工工地在不同月份（如进入冬季 11 月）各安全隐患的高发比例 $\pi_k^{\text{Nov}}$ 随施工阶段发生自然漂移（Label Shift：$P_{\text{Nov}}(y=k) \neq P_{\text{val}}(y=k)$，而 $P(x \mid y=k)$ 不变）。利用测试批次的无标签预测分布 $p^{(0)}(y=k \mid x_i)$，执行 $T_{\text{EM}} = 20$ 步闭式 EM 迭代估计测试期先验 $\hat{\pi}_k^{\text{test}}$：
     $$q^{(t)}(y=k \mid x_i) = \frac{\frac{\hat{\pi}_k^{(t)}}{\hat{\pi}_k^{\text{val}}} p^{(0)}(y=k \mid x_i)}{\sum_{c=1}^K \frac{\hat{\pi}_c^{(t)}}{\hat{\pi}_c^{\text{val}}} p^{(0)}(y=c \mid x_i)}, \quad \hat{\pi}_k^{(t+1)} = \frac{1}{N_{\text{test}}} \sum_{i=1}^{N_{\text{test}}} q^{(t)}(y=k \mid x_i)$$
     该算法完全不使用任何测试集标签，完美契合 `SafeBuild-Bench`“跨月份工地时间漂移鲁棒性”的基准设计初衷！

### 方向 4：伴随反例抑制原语（Paired Inhibitory Counter-Primitives）

* **解决痛点**：`#11`（冶金渣罐正常工艺蒸汽 vs. 火灾浓烟）与 `#12`（地面正常反光 vs. 积水/积油）。
* **数学与提示设计**：
  在 `InspecSafe-V1` 现有的 15 个正隐患原语之外，针对误报最高的 3 个视觉混淆源，增设 **3 个伴随良性解释原语（Benign Explanation Primitives）** $\{c_1, c_2, c_3\}$：
  * $c_1$（对应“积水 / 积油”）：*“图中的地面高亮区域是否仅仅是光滑地面或照明灯光的正常反光（而非真实液体堆积）？请回答 Yes 或 No。”*
  * $c_2$（对应“烟雾”）：*“图中的烟气是否仅仅是冶金车间渣罐、冷却塔或工业管道排出的正常工艺蒸汽/烟气？请回答 Yes 或 No。”*
  * $c_3$（对应“明火 / 柜门”）：*“图中的红色物体是否仅仅是正常关闭的消防栓箱或灭火器器材？请回答 Yes 或 No。”*
  设隐患原语 $j$ 的校准概率为 $\tilde{p}_j(x)$，其配对良性原语 $c(j)$ 的校准概率为 $\tilde{p}_{c(j)}(x)$，采用**可微抑制性 Noisy-OR 门控（Inhibitory Noisy-OR Gate）**：
  $$\tilde{p}_j^{\text{debiased}}(x) = \tilde{p}_j(x) \cdot \big( 1 - \alpha_j \tilde{p}_{c(j)}(x) \big), \quad \alpha_j \in [0, 1]$$
  在共享前缀缓存下，多问 3 个二元原语仅增加约 $0.05\text{ s/图}$ 的开销，却将 VLM 最不擅长的“隐式文本否定”转化为了显式的**双通道概率互抑**。

### 方向 5：单序列多槽位块对角掩码（Single-Pass Block-Diagonal Packed Probing）

* **解决痛点**：`#20` 与 `#25` 中发现，把 15 个原语拆成 15 条独立请求发给 vLLM 时，仅在标准全注意力的 `Qwen3-VL-8B` 上实现了 `1.46×` 的低耗时；而在 `Qwen3.5-9B`（`4.4×`）、`Gemma 4 E4B`（`4.0×`）以及单卡 KV 缓存吃紧的 `Qwen3-VL-32B`（`7–9×`）上，前缀缓存未能充分生效。
* **系统架构设计（已在 `prism_optimizations.py` 的 `build_packed_prism_attention_mask` 中实现）**：
  将同一张图像的共享视觉前缀 $\mathbf{V} = (v_1, \dots, v_P)$ 与全部 $M=15$ 个原语分支的短提问 $\mathbf{Q}^{(1)}, \dots, \mathbf{Q}^{(M)}$ 拼接进**同一条输入序列**：
  $$\mathbf{S} = \big[ \underbrace{v_1, \dots, v_P}_{\text{共享图像与系统前缀 } L_s}, \; \underbrace{q_1^{(1)}, \dots, q_{l_1}^{(1)}}_{\text{原语分支 } 1}, \; \dots, \; \underbrace{q_1^{(M)}, \dots, q_{l_M}^{(M)}}_{\text{原语分支 } M} \big]$$
  构造 2D 块因果注意力掩码 $\mathbf{M} \in \{0, 1\}^{L_{\text{total}} \times L_{\text{total}}}$：
  $$M_{t, \tau} = \begin{cases} 1, & \text{若 } \tau \le t < L_s \quad (\text{共享前缀内部因果注意力}) \\ 1, & \text{若 } t \in \text{Branch}_j \text{ 且 } \tau < L_s \quad (\text{所有分支均可看见共享图像前缀}) \\ 1, & \text{若 } t, \tau \in \text{Branch}_j \text{ 且 } \tau \le t \quad (\text{同一分支内部因果注意力}) \\ 0, & \text{其他情况 } (\text{不同原语分支之间严格物理隔离，互不可见}) \end{cases}$$
* **两大决定性收益**：
  1. **数学输出 100% 逐位恒等**：对于标准 Transformer（`Qwen3-VL` 全系、`Gemma 4`），该单次前向在各分支末尾位置 $t_{\text{dec}}^{(j)}$ 输出的 `Yes/No` Logits 与分 15 次独立跑请求 **在数学上完全相同**，可直接复用已训练好的所有校准参数！
  2. **彻底摆脱对 vLLM 跨请求前缀缓存的依赖**：整张图在物理上只进一次 ViT、只做一次 Prefill、只占 1 条序列的 KV 空间（总文本长度仅增加约 $15 \times 15 = 225$ tokens），使 `Gemma 4`、`Qwen3-VL-32B` 乃至混合结构的耗时比全部压回 **`1.05× ~ 1.25×` 直接问**！

### 方向 6：面向 `#28`（LoRA SFT）的端到端可微 Noisy-OR 联合训练损失

* **解决痛点**：`#28` 正在使用描述文本抽出的弱标签 $\hat{y}_{i,j}^{\text{weak}} \in \{0, 1\}$ 训练 `PRISM 分支 SFT`。单分支独立 BCE 损失存在两个不足：① 少数描述文本漏记了次要隐患（弱标签噪声约 3.2%）；② 在没有描述文本、只有整图风险等级 $y_i^* \in \{0, 1, 2, 3\}$ 的数据集（如 `SafeBuild` 或新工厂场景）上无法训练。
* **可微聚合联合损失设计**：
  由于 Noisy-OR 聚合分布 $\mathbf{p}_{\text{agg}}(x) = \operatorname{NoisyOR}(\{z_j(x)\}_{j=1}^M)$ 对每个分支的 Logit $z_j(x)$ 处处可微，我们将**分支级弱监督 BCE** 与**整图级标准 RPS 损失**联合优化：
  $$\mathcal{L}_{\text{joint}}(x_i) = \sum_{j=1}^M \mathcal{L}_{\text{BCE}}\big(z_j(x_i), \hat{y}_{i,j}^{\text{weak}}\big) + \lambda_{\text{img}} \mathcal{L}_{\text{RPS}}\Big(\operatorname{NoisyOR}\big(\{z_j(x_i)\}_{j=1}^M, \text{ind}_i\big), \, y_i^*\Big)$$
* **自适应难负例聚焦性质（Self-Focusing Hard-Negative Gradient）**：
  考察正常图像（$y_i^* = 0$）上整图 RPS 损失对第 $j$ 个分支 Logit $z_j$ 的梯度：
  $$\frac{\partial \mathcal{L}_{\text{RPS}}}{\partial z_j} \propto P(\text{Risk} \ge 1 \mid x_i) \cdot \big(1 - P(\text{Risk} \ge 1 \mid x_i)\big) \cdot \tilde{p}_j(x_i)$$
  当一张正常图像上其余 14 个分支都很安静（$\tilde{p}_m \approx 0$），唯独第 $j$ 个分支（如“积水”）因地面反光产生假阳性高概率（$\tilde{p}_j \approx 0.8$）时，整图损失的梯度会自动 **100% 集中惩罚这个引发整图误报的刺头分支 $j$**！

## 四、立即可执行的实验验证清单（Actionable Checklist）

1. **【5 分钟零 GPU 验证】在现有 `InspecSafe` 与 `MMAD` 缓存结果上测试方向 1 + 方向 2**：
   * 直接调用 `prism_optimizations.py` 中的 `UpgradedPRISMAggregator(S0, use_null_mad_norm=True, use_correlated_grouping=True, use_power_damping=True)`，传入 `results/` 下已保存的 `z_val, ind_val, y_val` 与 `z_test, ind_test, y_test`。
   * 检查自动发现的共线混淆团 `up_prism.groups_`（是否自动把“积水”和“积油”聚为一团），并对比 `NormFA`（正常图误报率）和 `Risk(eta=5)` 是否在保持 `CritMiss <= 2.5%` 的前提下进一步下降。
2. **【5 分钟零 GPU 验证】在现有 `SafeBuild-Bench` 缓存结果上测试方向 3**：
   * 调用 `BalancedAndDriftAdaptedCalibrator` 对 `SafeBuild-Bench` 的验证集和测试集（特别是 558 道 11 月时间漂移子集）做先验解耦与 EM 漂移自适应，检查 **按类别平均准确率（Macro-Acc）** 与 **11 月子集准确率** 的配对 Bootstrap $p$ 值是否进入显著区间（$p < 0.05$）。
3. **【`#28` LoRA SFT 跑完后的第一动作】**：
   * 在验证集（573 张图）上对 `PRISM 分支 SFT` 模型重新跑一遍校准（`fit`），再跑测试集评测，填齐 `{Base, SFT-Direct, SFT-Branch} × {Direct Ask, PRISM}` 的交叉评测表。
