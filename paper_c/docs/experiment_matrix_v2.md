# 实验矩阵 v2（2026-10-20，research_log #129）

> 用户决定：所有实验按统一规范从头重跑，“干净地开始”。旧结果保留在原目录作为探索记录，论文只用 v2 的结果。
> 每一项都在运行前写定判据；结果出来后逐条判定，失败的也报告。

## 0. 统一规范（所有实验共用）

| 项目 | 规范 |
|---|---|
| 问题生成 | **主设置：LLM 生成**（#130 修订：用主干同一个模型 Qwen3-VL-8B-Instruct 生成，不另换 LLM）。纯文本、贪心解码、固定提示，只给“事实名称 + 一句领域说明”，不许加示例、阈值或例外，不做人工修改。三个数据集同一个流程。生成结果原样存档。 |
| 问题包装 | 中性指令 “Answer the question about this image with a single word: Yes or No.”，三个数据集相同（不再写“工业巡检机器人”）。 |
| 事实名称 | InspecSafe：官方判据表里的措辞；BDD-OIA：目视核对过的 6 个停车原因名称；MMAD：缺陷类型名 + 物体类别。 |
| 主干 | 主：Qwen3-VL-8B-Instruct；尺寸：Qwen3-VL 2B / 4B（训练）、32B（零样本）；跨家族：Gemma 4 E4B。 |
| 训练 | LoRA rank 16，2 轮，8 卡；共享前缀（Gemma 走完整序列 + 梯度检查点）。种子：8B 核心运行 2 个（0、1），其余 1 个（0）。 |
| 校准 | 零样本：正常图参照（MAD）+ 温度 + 偏置（γ 保留但已知作用很小）；训练后：温度 + 每事实偏置；都在验证集上拟合。 |
| 统计 | 按图配对自助法 2000 次；同一表内的主检验用 Holm 校正；非劣效界：AUROC −0.01、准确率 −1 点。 |
| 目录 | 输出 `outputs/v2/{inspecsafe,bddoia,mmad}/`，模型 `models/ft/v2_*`，日志 `logs/v2/`，事件日志 `logs/v2/events.log`。 |

## 1. 方法（每个数据集同一组）

| 代号 | 方法 | 设置 |
|---|---|---|
| ZS | 零样本 LUX | 不训练 |
| VO | 只用判定标签（verdict-only） | 判定似然，固定温度，无先验填充、无事实标签 |
| FS | 事实监督（未标即负） | 判定 + 事实标签，c = 0.99，无先验填充，固定温度 |
| LF | 等级填充（仅 InspecSafe） | 由等级约束补全的事实标签（`train_lora --mode branches`） |
| LUX | 完整方法 | 判定 + 事实标签的联合似然（观测模型，曝光格子 EM 估计 c，c0 = 0.9）+ 随机规程表（α = 0.5，ρ = 0.3）+ 全格子先验填充（β = 0.1）+ 固定温度 |
| DS | Direct-SFT | 同一 VLM 直接回答判定问题（InspecSafe：官方四选一提示；BDD / MMAD：LLM 生成的判定问题）；规程修改时把新规则写进提示 |

## 2. 实验块（按优先级分层）

| 层 | 块 | 内容 | 数据集 × 主干 × 种子 | 训练次数 | 估计卡时 | 回答的问题 / 预注册预测 |
|---|---|---|---|---|---|---|
| 0 | **Q0 问题生成** | 8B 生成三个数据集的问题；零样本扇出（train/val/test） | 3 × 8B | 0 | 1 h | 生成质量人工抽查（只看、不改） |
| 0 | **Q 问题生成消融（零样本）** | 问题来源三档（#131）：规则槽位模板 / 8B 生成（主）/ Opus 生成，两个 LLM 同一提示、看完整文档 | 3 × 8B | 0 | 1 h | **HQ1**：8B 与 Opus 的零样本准确率差 ≤ 2 点；**HQ2**：8B 生成不差于槽位模板 |
| 1 | **C 核心表（种子 0）** | ZS / VO / FS / LUX / DS（+ LF） | InspecSafe、BDD、MMAD × 8B | 13 | 7 h | **H1** 过曝：VO 的双重差分 > 0（三个数据集）；**H2** 修复：LUX 截断格子误报 < VO；**H3** InspecSafe 规程修改（人工真值，107 张）：LUX > DS（新规则写进提示）；**H4** BDD E1 全部图像：LUX > VO 且 > DS；**H5** 标签完整时（BDD、MMAD）LUX 的 AUROC 对 VO 非劣效 |
| 2 | **C′ 核心复现（种子 1）** | VO / LUX / DS | InspecSafe、BDD × 8B | 6 | 3.5 h | H1–H5 在种子 1 上同向 |
| 2 | **Q′ 问题生成消融（训练）** | LUX 用 槽位模板 / Opus 问题各训练一次（8B 生成即主设置） | InspecSafe × 8B | 2 | 1 h | **HQ3**：三档问题来源下，规程修改（人工真值）的 LUX 准确率差 ≤ 3 点 |
| 3 | **M 标签不完整** | MMAD：保留 78% / 58% / 37%（LUX）+ 58% 未标即负（FS）；BDD：保留 50%，FS / LUX（EM）/ LUX（交叉拟合 c）/ LUX（真实 c） | MMAD、BDD × 8B | 8 | 4 h | **H6** 代价随缺失率单调增加；**H7** 50% 缺失时 LUX 的 AUROC 代价 < FS，召回 > FS |
| 3 | **A 组件消融** | LUX 去掉：随机规程表 / 先验填充（改为只作用于 U）/ EM（c 固定）/ 固定温度 | InspecSafe × 8B | 4 | 2 h | 各组件对过曝、规程修改、同分布的贡献（描述性，不做通过 / 不通过判定） |
| 4 | **B 主干与尺寸** | VO / LUX / DS | InspecSafe、BDD × Qwen3-VL 2B、4B、Gemma 4 E4B；32B 只做零样本 | 18 | 9 h | **H8** 每个主干上 H1–H3 成立；**H9** VO 的双重差分在 2B / 4B / 8B 上都显著，不随规模趋近 0 |
| 5 | **T 迁移与新事实** | 留一行业 4 折：LUX、DS、VO；留出新隐患（抽烟、非机动车）：LUX、DS | InspecSafe × 8B | 16 | 8 h | **H10** 留一行业合并：LUX > DS；**H11** 新隐患只加一个问题和一列，LUX > DS |
| 5 | **D 训练动态** | 训练中每 50 步评测（VO、LUX） | BDD × 8B | 2 | 1.5 h | Figure 4（描述性） |
| 5 | **E 推理端对比** | LLM 汇总事实概率（8B / 32B）、同模型先描述再判断、检测器 + 规则、延迟 | InspecSafe × 8B | 0 | 1.5 h | 结构化组合优于 LLM 汇总与生成式（复用 V31 / V35 / V32 的设计，问题换成 v2） |

合计约 69 次训练，约 40 卡时（8 卡并行），预计 2–2.5 天完成；第 0–2 层（论文核心）约 14 小时。

## 3. 评测清单（每个数据集）

- **InspecSafe**：准确率、AUROC（是否有隐患）、AURC；截断 / 可见格子误报与双重差分；规程修改 R1–R3（三位标注者盲标真值，107 张变化 + 21 张对照）；判定泄漏；留一行业；新隐患。
- **BDD-OIA**：停车 AUROC；截断 / 可见格子误报与双重差分；E1 / E2（全部图像与变化子集）；原因召回。
- **MMAD**：图像 AUROC；截断 / 可见格子误报与双重差分；缺陷类型准确率。

## 4. 不再重跑、直接沿用的

- 与问题无关的结果：检测器基线（V32）、直接问的零样本（V3 等）、Thinking 模型、延迟测量方法；人工盲标真值（V36）。
- 旧的探索性结果（V26–V47）保留在研究日志中，作为方法演化的记录，论文正文不再引用其数字。

<!-- v2-status:begin -->
## 5. 运行状态（由 `scripts/v2_status.py` 从 `logs/v2/events.log` 自动生成）

完成 90，运行中 8，失败 0。

| 任务 | 状态 | 开始 | 结束 | 备注 |
|---|---|---|---|---|
| v2 queue | ⏳ 运行中 | 10-20 22:18:09 |  |  |
| T0 zero-shot fan-outs | ⏳ 运行中 | 10-20 22:24:40 |  |  |
| fanout inspecsafe_llm8/fanout_zs | ✅ 完成 | 10-20 17:19:23 | 10-20 17:24:45 | 5013 rows |
| fanout bddoia_llm8/fanout_zs | ✅ 完成 | 10-20 17:24:45 | 10-20 17:41:10 | 9572 rows |
| fanout mmad_llm8/fanout_zs | ✅ 完成 | 10-20 17:41:10 | 10-20 17:47:50 | 8242 rows |
| fanout bddoia_llm8/fanout_zs_direct | ✅ 完成 | 10-20 17:47:50 | 10-20 17:52:59 | 9572 rows |
| fanout mmad_llm8/fanout_zs_direct | ✅ 完成 | 10-20 17:52:59 | 10-20 17:57:55 | 8242 rows |
| fanout inspecsafe_template/fanout_zs | ✅ 完成 | 10-20 17:57:55 | 10-20 18:03:15 | 5013 rows |
| fanout bddoia_template/fanout_zs | ✅ 完成 | 10-20 18:03:15 | 10-20 18:13:22 | 5572 rows |
| fanout mmad_template/fanout_zs | ✅ 完成 | 10-20 18:13:22 | 10-20 18:18:55 | 6520 rows |
| fanout inspecsafe_opus/fanout_zs | ✅ 完成 | 10-20 18:18:55 | 10-20 18:24:13 | 5013 rows |
| fanout bddoia_opus/fanout_zs | ✅ 完成 | 10-20 18:24:13 | 10-20 18:34:17 | 5572 rows |
| fanout mmad_opus/fanout_zs | ✅ 完成 | 10-20 18:34:17 | 10-20 18:39:49 | 6520 rows |
| T0 | ✅ 完成 |  | 10-20 22:24:40 |  |
| preflight smoke tests | ⏳ 运行中 | 10-20 18:39:49 |  |  |
| preflight | ✅ 完成 |  | 10-20 18:45:49 |  |
| T1 core seed 0 | ⏳ 运行中 | 10-20 22:24:40 |  |  |
| train v2_is_lf | ✅ 完成 | 10-20 18:45:49 | 10-20 20:40:50 |  |
| train v2_is_vo | ✅ 完成 | 10-20 18:45:49 | 10-20 19:08:57 |  |
| fanout inspecsafe_llm8/fanout_is_vo | ✅ 完成 | 10-20 19:08:57 | 10-20 19:19:57 | 1823 rows |
| train v2_is_fs | ✅ 完成 | 10-20 19:19:57 | 10-20 19:43:09 |  |
| fanout inspecsafe_llm8/fanout_is_fs | ✅ 完成 | 10-20 19:43:09 | 10-20 19:49:33 | 1823 rows |
| train v2_is_lux | ✅ 完成 | 10-20 19:49:33 | 10-20 20:12:36 |  |
| fanout inspecsafe_llm8/fanout_is_lux | ✅ 完成 | 10-20 20:12:36 | 10-20 20:23:45 | 1823 rows |
| train v2_bdd_vo | ✅ 完成 | 10-20 20:23:45 | 10-20 20:42:19 |  |
| fanout inspecsafe_llm8/fanout_is_lf | ✅ 完成 | 10-20 20:40:50 | 10-20 20:55:04 | 1823 rows |
| fanout bddoia_llm8/fanout_bdd_dec | ✅ 完成 | 10-20 20:42:19 | 10-20 20:57:02 | 5572 rows |
| train v2_is_ds | ⏳ 运行中 | 10-20 20:55:04 |  |  |
| train v2_bdd_fs | ✅ 完成 | 10-20 20:57:02 | 10-20 21:15:33 |  |
| fanout bddoia_llm8/fanout_bdd_atom | ✅ 完成 | 10-20 21:15:33 | 10-20 21:30:14 | 5572 rows |
| train v2_bdd_lux | ✅ 完成 | 10-20 21:30:14 | 10-20 21:48:30 |  |
| fanout bddoia_llm8/fanout_bdd_v42 | ✅ 完成 | 10-20 21:48:30 | 10-20 22:03:56 | 5572 rows |
| train v2_bdd_ds | ✅ 完成 | 10-20 22:03:56 | 10-20 22:16:35 |  |
| fanout bddoia_llm8/fanout_bdd_direct | ✅ 完成 | 10-20 22:24:40 | 10-20 22:28:38 | 5572 rows |
| fanout bddoia_llm8/fanout_bdd_direct_e1 | ✅ 完成 | 10-20 22:28:38 | 10-20 22:32:40 | 5572 rows |
| fanout bddoia_llm8/fanout_bdd_direct_e2 | ✅ 完成 | 10-20 22:32:40 | 10-20 22:36:40 | 5572 rows |
| train v2_mmad_vo | ✅ 完成 | 10-20 22:36:40 | 10-20 22:45:00 |  |
| fanout mmad_llm8/fanout_mmad_dec | ✅ 完成 | 10-20 22:45:00 | 10-20 22:55:57 | 6520 rows |
| train v2_mmad_fs | ✅ 完成 | 10-20 22:55:57 | 10-20 23:04:34 |  |
| fanout mmad_llm8/fanout_mmad_atom | ✅ 完成 | 10-20 23:04:34 | 10-20 23:15:33 | 6520 rows |
| train v2_mmad_lux | ✅ 完成 | 10-20 23:15:33 | 10-20 23:24:02 |  |
| fanout mmad_llm8/fanout_mmad_v42 | ✅ 完成 | 10-20 23:24:02 | 10-20 23:35:30 | 6520 rows |
| direct inspecsafe/direct_is_ds | ✅ 完成 | 10-20 23:25:16 | 10-20 23:35:35 | 1823 rows |
| train v2_mmad_ds | ✅ 完成 | 10-20 23:35:30 | 10-20 23:42:37 |  |
| direct inspecsafe/direct_is_ds_rules_R1_ppe_stricter | ✅ 完成 | 10-20 23:35:35 | 10-20 23:42:55 | 1823 rows |
| fanout mmad_llm8/fanout_mmad_direct | ✅ 完成 | 10-20 23:42:37 | 10-20 23:50:41 | 6520 rows |
| direct inspecsafe/direct_is_ds_rules_R2_ppe_relaxed | ✅ 完成 | 10-20 23:42:55 | 10-20 23:50:14 | 1823 rows |
| direct inspecsafe/direct_is_ds_rules_R3_phone_smoking_relaxed | ✅ 完成 | 10-20 23:50:14 | 10-20 23:57:28 | 1823 rows |
| T1 | ✅ 完成 |  | 10-20 23:57:28 |  |
| LUX fixed c | ✅ 完成 | 10-20 23:57:28 | 10-21 00:46:16 | no EM |
| train v2_bdd_luxfix | ✅ 完成 | 10-20 23:57:29 | 10-21 00:13:38 |  |
| fanout bddoia_llm8/fanout_bdd_luxfix | ✅ 完成 | 10-21 00:13:38 | 10-21 00:27:41 | 5572 rows |
| train v2_mmad_luxfix | ✅ 完成 | 10-21 00:27:41 | 10-21 00:35:24 |  |
| fanout mmad_llm8/fanout_mmad_luxfix | ✅ 完成 | 10-21 00:35:24 | 10-21 00:46:16 | 6520 rows |
| T2 seed 1 + question sources | ⏳ 运行中 | 10-21 00:46:16 |  |  |
| train v2_is_ds_s1 | ✅ 完成 | 10-21 00:46:16 | 10-21 03:14:57 |  |
| train v2_is_vo_s1 | ✅ 完成 | 10-21 00:46:16 | 10-21 01:09:17 |  |
| fanout inspecsafe_llm8/fanout_is_vo_s1 | ✅ 完成 | 10-21 01:09:17 | 10-21 01:15:40 | 1823 rows |
| train v2_is_lux_s1 | ✅ 完成 | 10-21 01:15:40 | 10-21 01:38:48 |  |
| fanout inspecsafe_llm8/fanout_is_lux_s1 | ✅ 完成 | 10-21 01:38:48 | 10-21 01:45:06 | 1823 rows |
| train v2_bdd_vo_s1 | ✅ 完成 | 10-21 01:45:06 | 10-21 02:03:33 |  |
| fanout bddoia_llm8/fanout_bdd_dec_s1 | ✅ 完成 | 10-21 02:03:33 | 10-21 02:18:30 | 5572 rows |
| train v2_bdd_fs_s1 | ✅ 完成 | 10-21 02:18:30 | 10-21 02:37:04 |  |
| fanout bddoia_llm8/fanout_bdd_atom_s1 | ✅ 完成 | 10-21 02:37:04 | 10-21 02:52:16 | 5572 rows |
| train v2_bdd_lux_s1 | ✅ 完成 | 10-21 02:52:16 | 10-21 03:10:49 |  |
| fanout bddoia_llm8/fanout_bdd_v42_s1 | ✅ 完成 | 10-21 03:10:49 | 10-21 03:26:11 | 5572 rows |
| direct inspecsafe/direct_is_ds_s1 | ✅ 完成 | 10-21 03:14:58 | 10-21 03:24:22 | 1823 rows |
| direct inspecsafe/direct_is_ds_s1_rules_R1_ppe_stricter | ✅ 完成 | 10-21 03:24:22 | 10-21 03:31:38 | 1823 rows |
| train v2_bdd_ds_s1 | ✅ 完成 | 10-21 03:26:11 | 10-21 03:38:48 |  |
| direct inspecsafe/direct_is_ds_s1_rules_R2_ppe_relaxed | ✅ 完成 | 10-21 03:31:38 | 10-21 03:38:54 | 1823 rows |
| fanout bddoia_llm8/fanout_bdd_direct_s1 | ✅ 完成 | 10-21 03:38:48 | 10-21 03:46:08 | 5572 rows |
| direct inspecsafe/direct_is_ds_s1_rules_R3_phone_smoking_relaxed | ✅ 完成 | 10-21 03:38:54 | 10-21 03:46:11 | 1823 rows |
| fanout bddoia_llm8/fanout_bdd_direct_s1_e1 | ✅ 完成 | 10-21 03:46:08 | 10-21 03:50:07 | 5572 rows |
| fanout bddoia_llm8/fanout_bdd_direct_s1_e2 | ✅ 完成 | 10-21 03:50:07 | 10-21 03:54:05 | 5572 rows |
| train v2_is_lux_template | ✅ 完成 | 10-21 03:54:05 | 10-21 04:17:03 |  |
| fanout inspecsafe_template/fanout_is_lux | ✅ 完成 | 10-21 04:17:03 | 10-21 04:28:37 | 1823 rows |
| train v2_is_lux_opus | ✅ 完成 | 10-21 04:28:37 | 10-21 04:52:35 |  |
| fanout inspecsafe_opus/fanout_is_lux | ✅ 完成 | 10-21 04:52:35 | 10-21 05:04:03 | 1823 rows |
| T2 | ✅ 完成 |  | 10-21 05:04:03 |  |
| T3 missing labels + ablations | ⏳ 运行中 | 10-21 05:04:03 |  |  |
| train v2_mmad_dose80 | ✅ 完成 | 10-21 05:04:03 | 10-21 05:11:56 |  |
| fanout mmad_llm8/fanout_mmad_dose80 | ✅ 完成 | 10-21 05:11:56 | 10-21 05:22:30 | 6520 rows |
| train v2_mmad_dose60 | ✅ 完成 | 10-21 05:22:30 | 10-21 05:30:17 |  |
| fanout mmad_llm8/fanout_mmad_dose60 | ✅ 完成 | 10-21 05:30:17 | 10-21 05:39:43 | 6520 rows |
| train v2_mmad_dose40 | ✅ 完成 | 10-21 05:39:43 | 10-21 05:47:34 |  |
| fanout mmad_llm8/fanout_mmad_dose40 | ✅ 完成 | 10-21 05:47:34 | 10-21 05:58:11 | 6520 rows |
| train v2_mmad_dose60_fs | ✅ 完成 | 10-21 05:58:11 | 10-21 06:06:01 |  |
| fanout mmad_llm8/fanout_mmad_dose60_fs | ✅ 完成 | 10-21 06:06:01 | 10-21 06:16:54 | 6520 rows |
| train v2_bdd_drop_fs | ✅ 完成 | 10-21 06:16:54 | 10-21 06:33:28 |  |
| fanout bddoia_llm8/fanout_bdd_drop_fs | ✅ 完成 | 10-21 06:33:28 | 10-21 06:47:44 | 5572 rows |
| train v2_bdd_drop_em | ✅ 完成 | 10-21 06:47:44 | 10-21 07:04:10 |  |
| fanout bddoia_llm8/fanout_bdd_drop_em | ✅ 完成 | 10-21 07:04:10 | 10-21 07:18:20 | 5572 rows |
| cross-fitted c | ✅ 完成 |  | 10-21 07:18:28 | {"obstacle_car": 0.4922, "traffic_sign": 0.3214, "obstacle_rider": 0.3667, "obstacle_person": 0.3214, "traffic_light": 0.375, "obstacle_othe |
| train v2_bdd_drop_xfit | ✅ 完成 | 10-21 07:18:28 | 10-21 07:34:48 |  |
| fanout bddoia_llm8/fanout_bdd_drop_xfit | ✅ 完成 | 10-21 07:34:48 | 10-21 07:48:57 | 5572 rows |
| train v2_bdd_drop_oracle | ✅ 完成 | 10-21 07:48:57 | 10-21 08:05:09 |  |
| fanout bddoia_llm8/fanout_bdd_drop_oracle | ✅ 完成 | 10-21 08:05:09 | 10-21 08:19:20 | 5572 rows |
| train v2_is_lux_notable | ⏳ 运行中 | 10-21 08:19:20 |  |  |
<!-- v2-status:end -->
