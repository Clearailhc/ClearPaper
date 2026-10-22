# Paper C：并行隐患原语 + 结构化有序聚合 + 分支级升级

研究过程按时间只增不改地记录在 [docs/research_log.md](docs/research_log.md)。
方向与动机见 [docs/direction.md](docs/direction.md)，每一步要验证什么、过线标准见 [docs/validation_plan.md](docs/validation_plan.md)，文献核查见 [docs/literature_notes.md](docs/literature_notes.md)。

## 代码结构

```
paper_c/
├── configs/inspecsafe_taxonomy.json   隐患原语（问题、文本匹配规则）+ 官方分行业严重度表
├── jevc/
│   ├── taxonomy.py                    读取上面的配置
│   ├── data/inspecsafe.py             扫描数据、解析等级（官方规则）、按巡检点分组切验证集
│   ├── prompts.py                     官方提示（慢模型）与四选一提示（快模型）
│   ├── metrics.py                     准确率 / Macro-F1 / QWK / ECE / 代价敏感 RPS / 漏报误报 / Bootstrap
│   ├── backends/vllm_backend.py       vLLM 离线推理（开启前缀缓存）
│   └── ideas/                         每个想法一个文件，可单独开发和消融
│       ├── fanout_primitives.py       想法 1：共享预填充的并行是/否隐患问题
│       ├── noisy_or_ordinal.py        想法 2：行业条件 noisy-OR 有序聚合 + 校准
│       ├── branch_escalation.py       想法 3：按信息价值选分支交给慢模型；整图级级联对照
│       └── chain_to_fan.py            想法 4：从推理过程 / 人工描述抽分支弱标签
├── scripts/                           build_index → run_direct / run_fanout / run_thinking → evaluate
└── tests/                             单元测试 + 无 GPU 的端到端冒烟测试（python3 -m pytest tests）
```

## 在 H20 上跑（数据下完后）

```bash
cd /nas/home/ab/jev/code/paper_c
D=/nas/home/ab/jev/datasets/InspecSafe-V1; O=/nas/home/ab/jev/outputs/c; M=/nas/home/ab/jev/models/Qwen
mkdir -p $D/extracted $O && tar -xzf $D/test.tar.gz -C $D/extracted && tar -xzf $D/train.tar.gz -C $D/extracted
scripts/h20_run.sh build_index.py --root $D/extracted --out $O/index.jsonl          # V1：先看输出的数据核对
GPUS=0,1 scripts/h20_run.sh run_direct.py  --index $O/index.jsonl --model $M/Qwen3-VL-8B-Instruct --tp 2 --gpu-mem 0.17 --out $O/direct_instruct.jsonl
GPUS=0,1 scripts/h20_run.sh run_fanout.py  --index $O/index.jsonl --model $M/Qwen3-VL-8B-Instruct --tp 2 --gpu-mem 0.17 --out $O/fanout_instruct.jsonl
GPUS=2,3 scripts/h20_run.sh run_thinking.py --index $O/index.jsonl --model $M/Qwen3-VL-8B-Thinking --tp 2 --gpu-mem 0.17 --out $O/thinking.jsonl
scripts/h20_run.sh evaluate.py --index $O/index.jsonl --direct $O/direct_instruct.jsonl --fanout $O/fanout_instruct.jsonl \
    --thinking $O/thinking.jsonl --weak-labels --emit-queries $O/branch_queries.jsonl --report $O/report_v4.md
```

- 解压目录下应直接是 `train/`、`test/`；若多一层目录，把 `--root` 指到那一层。
- 先加 `--limit 50` 试跑一遍，确认显存和输出格式。
- V5：用 Thinking 模型回答 `branch_queries.jsonl`（`run_fanout.py --queries ... --generate`），再给 `evaluate.py` 加 `--branch-answers`。
- 宿主机 Python 没有 numpy / torch，所有脚本都通过 `h20_run.sh` 在 vLLM 容器（`vllm-openai:v0.25.0`，已验证测试全过）里运行，结果文件属于当前用户。
