# 文献核查记录（2026-10-15）

对“Paper C 研究包 v2.1”中引用的逐条核对结果。写论文时以本表为准。

| 引用 | 研究包里的说法 | 原文核对结果 |
| :--- | :--- | :--- |
| [SRR, arXiv:2609.07786](https://arxiv.org/abs/2609.07786) | 只用 13 维输出统计量、不看隐状态；AUACC 0.6811 vs 0.6716 | **正确**。Section 5.3 原话 “no hidden states … are required at runtime”；熵路由 0.6659；Qwen3-4B → Qwen3-8B（关闭思考），MMLU / HellaSwag / ARC-C 共 5,165 例 |
| [Gupta et al., ICLR 2024](https://arxiv.org/abs/2404.10136) | Embed-1+2 需先跑大模型第 1 层；只用单向救回标签 | 前半**正确**（大模型第一解码层首 token 嵌入）。后半**不完全对**：翻译任务上用两个模型 BLEURT 之差、平方损失回归，即已有“有符号连续收益” |
| [LSD, arXiv:2510.04933](https://arxiv.org/abs/2510.04933) | 速度 d=0.012；加速度 d=0.015, p=0.921 | 速度正确（表 1）。d=0.015、p=0.921 属于“方向一致性”行；加速度在表 2，d≈0、p=0.991。仅 GPT-2 (117M) |
| [LayerMix, arXiv:2608.28930](https://arxiv.org/abs/2608.28930) | 压成标量范数丢失 95% 以上信息 | **原文没有此说法**。实际：一维均值偏移方向 AUROC 0.834，完整 L2 逻辑回归 0.952；该方向占总方差不到 3%。LayerMix 本身是交叉验证选多层、平均各层探针 |
| [Steifer, arXiv:2605.16640](https://arxiv.org/abs/2605.16640) | 严格证明 GDN 有损压缩、GA 精确检索 | **言过其实**。原文证明的是合成任务（奇偶条件检索）上的可分性：混合结构只需常数长度推理链，纯 DeltaNet 不行。“压缩 / 检索分工”只能写成动机 |
| [MMAD, arXiv:2410.09453](https://arxiv.org/abs/2410.09453) 表 6 | CoT 救回定位 / 描述，异常判别掉 3.77 | **错误**。64.45 → 59.42 是 InternVL2-40B，掉 5.03；该模型定位 −1.50、描述 −8.51，仅物体分析 +2.93。InternVL2-76B：异常判别 −0.07，其余 +2 至 +2.6 |
| InspecSafe-V1 | Thinking 比 Instruct 高约 8 点；GPT-5.2 把 30% 以上正常判异常 | 与原文一致 |
| SafeBuild-Bench / LogiScope-VQA | HF 仓库可下载 | **存在**：`peter23333/SafeBuild-Bench`（CC BY 4.0）、`zhouhanjing/LogiScope-VQA-preview`（CC BY-NC-SA 4.0，preview 版） |
| CVPR 2027 Industrial Safety Track | — | CVPR 不分 track，删去 |
