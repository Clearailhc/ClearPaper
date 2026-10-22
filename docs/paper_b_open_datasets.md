# Paper B 开源工业数据清单（2026-10-15）

> 用途：在团队自有工业数据之外，为 Paper B（ICDE 2027 Industry，12/1）提供可复现的公开对比数据。
> 核查程度：下面的信息来自论文摘要、项目页和数据仓库页面，**没有逐个下载核对文件**。标“待确认”的项需要在 10/31 go/no-go 前由数据负责人打开仓库确认。

## 1. 可直接用作“规则 / 场景 → 候选动作”评测的基准（第一优先）

| 数据集 | 内容与规模 | 获取方式 / 许可 | 对 Paper B 的用途 |
| :--- | :--- | :--- | :--- |
| **[DiagnosticIQ](https://arxiv.org/abs/2605.08614)**（2026-05） | 6,690 道专家校验多选题，来自 118 个“规则 → 动作”对，覆盖 16 类设备 | arXiv 页面只写了论文本身的 CC BY 4.0，**数据是否公开、在哪下载待确认** | 主基准；Aug（算子翻转）、Pro（10 选项）、Pert（顺序打乱）三个变体对应论文的三个现象 |
| **[FailureSensorIQ](https://arxiv.org/abs/2506.03278)**（NeurIPS D&B 2025） | 8,296 道多选题，基于 ISO 标准文档，讲传感器与失效模式的对应关系 | 公开：[GitHub IBM/FailureSensorIQ](https://github.com/IBM/FailureSensorIQ)，有 HF 排行榜 | 10 选项干扰项实验与保形预测（UAcc / SS） |
| **[AssetOpsBench](https://arxiv.org/abs/2506.03828)**（IBM） | 4 台冷水机组 + 2 台 AHU 共 230 万条传感器数据；3 类设备的 53 条 FMEA 失效记录；4.2K 条工单；原文 140+ 场景（仓库后续版本称 460+） | 公开：[GitHub IBM/AssetOpsBench](https://github.com/IBM/AssetOpsBench)，许可待确认 | 用 FMEA 记录和工单构造新的“规则 → 动作”题和翻转反规则；与 DiagnosticIQ 设备类型（Chiller / AHU）一致 |

## 2. 维修工单与运维文本（用来构造候选动作、做跨领域迁移）

| 数据集 | 内容与规模 | 获取方式 / 许可 | 对 Paper B 的用途 |
| :--- | :--- | :--- | :--- |
| **[MaintIE](https://aclanthology.org/2024.lrec-main.954)**（LREC-COLING 2024） | 真实维修工单短文本：1,076 条细粒度标注 + 7,000 条粗粒度标注；224 个叶子实体类型、6 种关系 | 公开：[GitHub nlp-tlp/maintie](https://github.com/nlp-tlp/maintie)，MIT | 从工单中抽出“部件 – 状态 – 动作”，扩充候选动作池与干扰项 |
| **[MaintNet](https://aclanthology.org/2020.aacl-demo.5)**（AACL 2020 Demo） | 航空、汽车、设施维护等领域的维修日志数据集合 | 公开仓库，**各子集许可待确认** | 跨领域迁移测试 |
| **[风机维修日志 LLM 标注基准](https://arxiv.org/abs/2509.06813)**（2025） | 风机维修日志分类的开源评测框架，并评估置信度校准 | 框架开源；**日志数据本身是否公开待确认** | 校准指标对比的参考 |

## 3. 带故障标签的真实传感器数据（让规则与翻转条件对上真实信号）

| 数据集 | 内容与规模 | 获取方式 / 许可 | 对 Paper B 的用途 |
| :--- | :--- | :--- | :--- |
| **[LBNL 建筑 FDD 数据集](https://faultdetection.lbl.gov/data)** | 号称最大的带标签 HVAC 时序数据：RTU、单/双风道 AHU、VAV、FCU、冷水机组、锅炉；故障与无故障工况，1 分钟采样，附 Brick 模型 | 公开：[OpenEI 910](https://data.openei.org/submissions/910)（data.gov 与镜像给出的 DOI 不一致，引用前核对） | **与 DiagnosticIQ 的 AHU 规则最贴近**：检验规则在真实信号上是否触发，支撑“AHU → 其他设备”零样本迁移 |
| **[CARE to Compare](https://arxiv.org/abs/2404.10320)**（2024） | 3 个风电场、36 台风机、95 个数据集（89 个风机年）；44 个带起止时间和故障描述的异常事件 | 公开：[Zenodo](https://zenodo.org/records/14006163)（用 v6，2025-07-09 修正过标签；v3 有时间戳问题） | 风机场景的“告警条件 → 故障描述”对 |
| **[Kelmarsh](https://zenodo.org/records/16807551) / [Penmanshiel](https://zenodo.org/records/16807304) 风电场** | 10 分钟 SCADA + 事件日志，2016–2024 | 公开，CC BY 4.0 | 带状态码的事件日志，可构造规则与反规则 |

## 4. 必须在相关工作里引用的近期工作

- **[DiagLoop (arXiv:2608.03674)](https://arxiv.org/abs/2608.03674)**：用反事实数据飞轮 + 分阶段强化学习训练诊断 LLM，评测覆盖 8 个工业系统。**这是 Paper B 最接近的竞争工作**：它正是“靠反事实数据增强解决条件变化”的路线，而蓝图第 1.2 节主张“不能只靠数据增强”。需要实验对比，或至少讲清楚结构性方法（Householder 反射）与数据增强的区别。是否开源待确认。
- [PHM-Bench (arXiv:2508.02490)](https://arxiv.org/abs/2508.02490)、[PHMForge (NeurIPS 2026)](https://neurips.cc/virtual/2026/poster/139250)、[JFTA-Bench (arXiv:2603.22978)](https://arxiv.org/abs/2603.22978)、[ADMITBench (arXiv:2608.03866)](https://arxiv.org/abs/2608.03866)：工业 PHM / 故障树 / 运维建议方向的 LLM 基准，放相关工作。

## 5. 建议的使用顺序

1. **10/31 前**：确认 DiagnosticIQ 数据可下载（这是主基准，拿不到就要重新规划），并跑通 FailureSensorIQ。
2. **11 月**：用 AssetOpsBench 的 FMEA 记录和工单，以及 LBNL 的 AHU 数据，补一个“公开数据上可复现的自建翻转测试集”，和自有数据的结果互相印证。
3. **可选**：MaintIE、风电场数据用于跨领域迁移，放在附录。
