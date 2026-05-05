const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const outDir = path.resolve(__dirname, "..", "output", "paper_figures");
fs.mkdirSync(outDir, { recursive: true });

const W = 1800;
const H = 980;

const palette = {
  bg: "#f7f8fb",
  ink: "#18212f",
  muted: "#596275",
  line: "#c8cfdb",
  blue: "#2d6cdf",
  blue2: "#e8f0ff",
  teal: "#168979",
  teal2: "#e7f7f4",
  amber: "#b7791f",
  amber2: "#fff4df",
  red: "#b64242",
  red2: "#fff0f0",
  purple: "#6d4cc2",
  purple2: "#f1edff",
  green: "#3f7f3f",
  green2: "#ecf8ec",
  gray2: "#eef1f6",
  white: "#ffffff",
};

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function wrapText(text, maxChars = 22) {
  const raw = String(text).split("\n");
  const lines = [];
  for (const row of raw) {
    if (row.length <= maxChars) {
      lines.push(row);
      continue;
    }
    let buf = "";
    for (const ch of row) {
      const wide = /[\u4e00-\u9fff]/.test(ch) ? 1 : 0.55;
      const len = Array.from(buf).reduce((n, c) => n + (/[\u4e00-\u9fff]/.test(c) ? 1 : 0.55), 0);
      if (len + wide > maxChars) {
        lines.push(buf);
        buf = ch;
      } else {
        buf += ch;
      }
    }
    if (buf) lines.push(buf);
  }
  return lines;
}

function textBlock(x, y, lines, opts = {}) {
  const {
    size = 24,
    weight = 400,
    fill = palette.ink,
    anchor = "middle",
    lineGap = 1.32,
    maxChars = 22,
  } = opts;
  const list = Array.isArray(lines) ? lines.flatMap((v) => wrapText(v, maxChars)) : wrapText(lines, maxChars);
  const dy = size * lineGap;
  const total = (list.length - 1) * dy;
  return `<text x="${x}" y="${y - total / 2}" text-anchor="${anchor}" font-size="${size}" font-weight="${weight}" fill="${fill}">
${list.map((line, i) => `<tspan x="${x}" dy="${i === 0 ? 0 : dy}">${esc(line)}</tspan>`).join("\n")}
</text>`;
}

function box(x, y, w, h, title, body, opts = {}) {
  const {
    fill = palette.white,
    stroke = palette.line,
    titleFill = palette.ink,
    bodyFill = palette.muted,
    radius = 12,
    titleSize = 28,
    bodySize = 21,
    shadow = true,
    maxChars = Math.floor(w / 28),
  } = opts;
  const titleY = y + 42;
  const bodyY = y + h / 2 + 20;
  return `
  ${shadow ? `<rect x="${x + 8}" y="${y + 10}" width="${w}" height="${h}" rx="${radius}" fill="#d7deea" opacity="0.32"/>` : ""}
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
  ${textBlock(x + w / 2, titleY, title, { size: titleSize, weight: 700, fill: titleFill, maxChars })}
  ${textBlock(x + w / 2, bodyY, body, { size: bodySize, fill: bodyFill, maxChars, lineGap: 1.28 })}
  `;
}

function pill(x, y, w, label, value, color = palette.blue) {
  return `
  <rect x="${x}" y="${y}" width="${w}" height="56" rx="28" fill="${palette.white}" stroke="${color}" stroke-width="2"/>
  <text x="${x + 26}" y="${y + 36}" font-size="20" font-weight="700" fill="${color}">${esc(label)}</text>
  <text x="${x + w - 26}" y="${y + 36}" text-anchor="end" font-size="20" fill="${palette.ink}">${esc(value)}</text>`;
}

function arrow(x1, y1, x2, y2, color = palette.ink, label = "") {
  const midx = (x1 + x2) / 2;
  const midy = (y1 + y2) / 2;
  return `
  <path d="M ${x1} ${y1} C ${midx} ${y1}, ${midx} ${y2}, ${x2} ${y2}" fill="none" stroke="${color}" stroke-width="3.5" marker-end="url(#arrow)"/>
  ${label ? `<rect x="${midx - 70}" y="${midy - 22}" width="140" height="34" rx="17" fill="${palette.bg}" stroke="${color}" stroke-width="1.2"/><text x="${midx}" y="${midy + 3}" text-anchor="middle" font-size="18" fill="${color}" font-weight="700">${esc(label)}</text>` : ""}`;
}

function straightArrow(x1, y1, x2, y2, color = palette.ink, label = "") {
  const midx = (x1 + x2) / 2;
  const midy = (y1 + y2) / 2;
  return `
  <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="3.5" marker-end="url(#arrow)"/>
  ${label ? `<rect x="${midx - 72}" y="${midy - 22}" width="144" height="34" rx="17" fill="${palette.bg}" stroke="${color}" stroke-width="1.2"/><text x="${midx}" y="${midy + 3}" text-anchor="middle" font-size="18" fill="${color}" font-weight="700">${esc(label)}</text>` : ""}`;
}

function header(title, subtitle, accent = palette.blue) {
  return `
  <rect x="0" y="0" width="${W}" height="${H}" fill="${palette.bg}"/>
  <rect x="0" y="0" width="${W}" height="118" fill="${palette.white}"/>
  <rect x="0" y="116" width="${W}" height="4" fill="${accent}"/>
  <text x="70" y="52" font-size="34" font-weight="800" fill="${palette.ink}">${esc(title)}</text>
  <text x="70" y="88" font-size="22" fill="${palette.muted}">${esc(subtitle)}</text>`;
}

function defs(color = palette.ink) {
  return `
  <defs>
    <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="${color}"/>
    </marker>
    <style>
      text { font-family: "Microsoft YaHei", "SimHei", "Noto Sans CJK SC", Arial, sans-serif; }
    </style>
  </defs>`;
}

function svg(title, subtitle, accent, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
${defs(accent)}
${header(title, subtitle, accent)}
${body}
</svg>`;
}

function figureLstmEkf() {
  const accent = palette.blue;
  let b = "";
  b += pill(70, 145, 270, "窗口 N", "50-100", accent);
  b += pill(370, 145, 320, "输入维度 d", "12-15", accent);
  b += pill(720, 145, 300, "LSTM hidden", "64 / 128", accent);
  b += pill(1050, 145, 270, "输出", "ΔE ΔN ΔU", accent);
  b += pill(1350, 145, 360, "滤波器", "EKF 固定 R", accent);

  b += box(70, 245, 255, 230, "数据窗口", ["IMU 三轴角速度", "三轴比力", "姿态 / 速度 / 高度", "X ∈ R^(N×d)"], { fill: palette.blue2, stroke: accent, maxChars: 12 });
  b += box(385, 245, 260, 230, "LSTM 编码器", ["1-2 层循环单元", "门控记忆历史运动", "取最后隐状态 h_t"], { fill: palette.white, stroke: accent, maxChars: 12 });
  b += box(705, 245, 235, 230, "FC 映射", ["128 → 64 → 3", "dropout 0.1-0.3", "输出位置增量"], { fill: palette.white, stroke: accent, maxChars: 12 });
  b += box(1000, 245, 260, 230, "伪 GNSS 量测", ["ΔP_hat(t+1)", "z_k = P_INS + ΔP_hat", "GNSS 中断时启用"], { fill: palette.amber2, stroke: palette.amber, maxChars: 13 });
  b += box(1325, 245, 320, 230, "EKF 量测更新", ["K = P^-Hᵀ(HP^-Hᵀ+R)^-1", "x_hat = x^- + Kν", "传统误差状态约束"], { fill: palette.green2, stroke: palette.green, maxChars: 18 });

  b += straightArrow(325, 360, 385, 360, accent);
  b += straightArrow(645, 360, 705, 360, accent);
  b += straightArrow(940, 360, 1000, 360, accent);
  b += straightArrow(1260, 360, 1325, 360, accent);

  b += box(210, 570, 405, 185, "离线训练", ["GNSS 正常段提供真值 ΔP", "人为屏蔽部分 GNSS 构造拒止样本", "损失: MSE = mean(||ΔP_hat - ΔP||²)"], { fill: palette.white, stroke: palette.line, maxChars: 22, titleSize: 26, bodySize: 20 });
  b += box(695, 570, 405, 185, "在线推理", ["GNSS 可用: 使用真实量测", "GNSS 中断: 使用 LSTM 伪量测", "保持原 EKF 框架基本不变"], { fill: palette.white, stroke: palette.line, maxChars: 22, titleSize: 26, bodySize: 20 });
  b += box(1180, 570, 405, 185, "工程特性", ["优势: 接入简单、结构清晰", "限制: 依赖训练场景覆盖", "风险: 分布外工况产生偏差"], { fill: palette.white, stroke: palette.line, maxChars: 22, titleSize: 26, bodySize: 20 });

  b += arrow(410, 570, 770, 475, accent, "训练后部署");
  b += arrow(900, 570, 1160, 475, accent, "量测输入");

  b += `<rect x="70" y="820" width="1575" height="86" rx="12" fill="${palette.gray2}" stroke="${palette.line}"/>
  ${textBlock(858, 863, "算法逻辑：LSTM 学习 GNSS 正常阶段的运动增量规律；GNSS 失效时输出伪量测，EKF 继续完成误差约束和状态修正。", { size: 24, weight: 700, fill: palette.ink, maxChars: 58 })}`;
  return svg("算法一：LSTM + EKF 伪 GNSS 量测算法", "网络预测伪 GNSS 增量，EKF 负责传统误差状态约束", accent, b);
}

function figureGruAkf() {
  const accent = palette.teal;
  let b = "";
  b += pill(70, 145, 260, "窗口 N", "30-80", accent);
  b += pill(360, 145, 280, "GRU hidden", "64", accent);
  b += pill(670, 145, 300, "创新窗口 M", "10-30", accent);
  b += pill(1000, 145, 330, "自适应对象", "R_k", accent);
  b += pill(1360, 145, 350, "检测指标", "卫星数 / DOP", accent);

  b += box(70, 245, 260, 215, "输入窗口", ["IMU + INS 状态", "X ∈ R^(N×d)", "短窗口降低延迟"], { fill: palette.teal2, stroke: accent, maxChars: 13 });
  b += box(390, 245, 250, 215, "GRU 预测器", ["1-2 层 GRU", "更新门 / 重置门", "参数量小于 LSTM"], { fill: palette.white, stroke: accent, maxChars: 13 });
  b += box(700, 245, 240, 215, "FC 输出", ["64 → 32 → 3", "ΔP_hat 或 ΔV_hat", "伪量测来源"], { fill: palette.white, stroke: accent, maxChars: 13 });
  b += box(1000, 245, 265, 215, "GNSS 检测", ["卫星数阈值", "DOP 异常", "残差门限"], { fill: palette.amber2, stroke: palette.amber, maxChars: 13 });
  b += box(1325, 245, 320, 215, "量测选择", ["可靠: 真实 GNSS", "异常: GRU 伪量测", "切换到 AKF 模式"], { fill: palette.white, stroke: accent, maxChars: 15 });

  b += straightArrow(330, 352, 390, 352, accent);
  b += straightArrow(640, 352, 700, 352, accent);
  b += straightArrow(940, 352, 1000, 352, accent);
  b += straightArrow(1265, 352, 1325, 352, accent);

  b += box(180, 560, 300, 190, "INS 预测", ["x_k^- , P_k^-", "惯导机械编排", "提供先验状态"], { fill: palette.white, stroke: palette.line, maxChars: 14, titleSize: 26, bodySize: 20 });
  b += box(555, 560, 330, 190, "创新计算", ["ν_k = z_k - Hx_k^-", "统计近期残差", "判断量测可信度"], { fill: palette.white, stroke: palette.line, maxChars: 16, titleSize: 26, bodySize: 20 });
  b += box(960, 560, 355, 190, "自适应估计 R_k", ["R_hat = mean(ννᵀ) - HP^-Hᵀ", "网络不稳时增大 R", "降低伪量测权重"], { fill: palette.green2, stroke: palette.green, maxChars: 18, titleSize: 26, bodySize: 20 });
  b += box(1390, 560, 250, 190, "AKF 更新", ["更新 K_k", "修正导航状态", "输出融合结果"], { fill: palette.teal2, stroke: accent, maxChars: 13, titleSize: 26, bodySize: 20 });

  b += straightArrow(480, 655, 555, 655, accent);
  b += straightArrow(885, 655, 960, 655, accent);
  b += straightArrow(1315, 655, 1390, 655, accent);
  b += arrow(1485, 560, 725, 460, accent, "创新反馈");

  b += `<rect x="70" y="820" width="1575" height="86" rx="12" fill="${palette.gray2}" stroke="${palette.line}"/>
  ${textBlock(858, 863, "算法逻辑：GRU 负责轻量增量预测；AKF 根据创新序列在线调整量测噪声 R_k，从而抑制不可靠伪量测。", { size: 24, weight: 700, fill: palette.ink, maxChars: 58 })}`;
  return svg("算法二：GRU + AKF 自适应卡尔曼滤波算法", "轻量网络预测，滤波器根据创新序列动态调整伪量测权重", accent, b);
}

function figureCnnGruCkf() {
  const accent = palette.purple;
  let b = "";
  b += pill(70, 145, 250, "窗口 N", "50-100", accent);
  b += pill(350, 145, 325, "Conv1D", "kernel 3/5", accent);
  b += pill(705, 145, 305, "通道数", "32 → 64", accent);
  b += pill(1040, 145, 325, "GRU hidden", "64 / 128", accent);
  b += pill(1395, 145, 315, "CKF 容积点", "2n", accent);

  b += box(70, 245, 240, 210, "输入序列", ["IMU + INS 状态", "X ∈ R^(N×d)", "统一归一化"], { fill: palette.purple2, stroke: accent, maxChars: 12 });
  b += box(360, 245, 250, 210, "Conv1D 层 1", ["channels = 32", "kernel = 3/5", "ReLU"], { fill: palette.white, stroke: accent, maxChars: 12 });
  b += box(660, 245, 250, 210, "Conv1D 层 2", ["channels = 64", "kernel = 3", "BatchNorm"], { fill: palette.white, stroke: accent, maxChars: 12 });
  b += box(960, 245, 250, 210, "GRU 记忆", ["1-2 层", "捕捉长时依赖", "输出 h_t"], { fill: palette.white, stroke: accent, maxChars: 12 });
  b += box(1260, 245, 250, 210, "FC 输出", ["128 → 64 → 3", "ΔP_hat", "伪 GNSS 增量"], { fill: palette.white, stroke: accent, maxChars: 12 });

  b += straightArrow(310, 350, 360, 350, accent);
  b += straightArrow(610, 350, 660, 350, accent);
  b += straightArrow(910, 350, 960, 350, accent);
  b += straightArrow(1210, 350, 1260, 350, accent);

  b += box(170, 565, 310, 205, "CNN 提取内容", ["短时加速度突变", "姿态快速变化", "转弯 / 制动局部模式"], { fill: palette.white, stroke: palette.line, maxChars: 15, titleSize: 26, bodySize: 20 });
  b += box(555, 565, 310, 205, "CKF 时间更新", ["生成 2n 个容积点", "通过非线性状态方程传播", "估计 x_k^- , P_k^-"], { fill: palette.white, stroke: palette.line, maxChars: 16, titleSize: 26, bodySize: 20 });
  b += box(940, 565, 330, 205, "CKF 量测更新", ["伪量测 z_pseudo", "计算互协方差和增益", "避免 EKF 一阶线性化"], { fill: palette.green2, stroke: palette.green, maxChars: 17, titleSize: 26, bodySize: 20 });
  b += box(1345, 565, 295, 205, "适用场景", ["强非线性运动", "急转弯 / 加减速", "精度优先平台"], { fill: palette.purple2, stroke: accent, maxChars: 15, titleSize: 26, bodySize: 20 });

  b += arrow(1385, 455, 1105, 565, accent, "伪量测");
  b += straightArrow(865, 668, 940, 668, accent);
  b += straightArrow(1270, 668, 1345, 668, accent);

  b += `<rect x="70" y="820" width="1575" height="86" rx="12" fill="${palette.gray2}" stroke="${palette.line}"/>
  ${textBlock(858, 863, "算法逻辑：CNN 捕捉局部机动特征，GRU 学习长时序演化；CKF 用容积点处理非线性融合，复杂机动下更平稳。", { size: 24, weight: 700, fill: palette.ink, maxChars: 58 })}`;
  return svg("算法三：CNN-GRU + CKF 耦合算法", "局部卷积特征、门控时序记忆与非线性容积滤波协同工作", accent, b);
}

function figureDualBranch() {
  const accent = palette.red;
  let b = "";
  b += pill(70, 145, 250, "窗口 N", "50-100", accent);
  b += pill(350, 145, 315, "水平分支", "CNN + LSTM", accent);
  b += pill(695, 145, 310, "垂向分支", "GRU", accent);
  b += pill(1035, 145, 310, "损失权重", "α β γ", accent);
  b += pill(1375, 145, 335, "输出", "ΔE ΔN ΔU", accent);

  b += box(70, 250, 275, 210, "统一输入窗口", ["IMU + INS 状态", "X ∈ R^(N×d)", "按方向拆分特征"], { fill: palette.red2, stroke: accent, maxChars: 13 });

  b += box(445, 220, 300, 190, "水平输入特征", ["vE, vN, yaw", "ax, ay, roll", "东 / 北运动相关"], { fill: palette.white, stroke: accent, maxChars: 15, titleSize: 26, bodySize: 20 });
  b += box(820, 220, 310, 190, "水平 CNN-LSTM", ["Conv1D: 32 → 64", "LSTM hidden = 128", "提取机动 + 长依赖"], { fill: palette.white, stroke: accent, maxChars: 16, titleSize: 26, bodySize: 20 });

  b += box(445, 520, 300, 190, "垂向输入特征", ["h, vU, pitch", "az, 高度历史", "天向漂移相关"], { fill: palette.white, stroke: palette.amber, maxChars: 15, titleSize: 26, bodySize: 20 });
  b += box(820, 520, 310, 190, "垂向 GRU", ["hidden = 32 / 64", "layers = 1", "轻量刻画缓慢漂移"], { fill: palette.amber2, stroke: palette.amber, maxChars: 16, titleSize: 26, bodySize: 20 });

  b += box(1225, 365, 245, 210, "特征融合", ["concat 拼接", "水平 + 垂向特征", "192 → 128 → 64"], { fill: palette.white, stroke: accent, maxChars: 13 });
  b += box(1530, 365, 210, 210, "三维输出", ["ΔE_hat", "ΔN_hat", "ΔU_hat", "轨迹积分 / 融合"], { fill: palette.green2, stroke: palette.green, maxChars: 10 });

  b += straightArrow(345, 355, 445, 315, accent, "水平");
  b += straightArrow(345, 355, 445, 615, palette.amber, "垂向");
  b += straightArrow(745, 315, 820, 315, accent);
  b += straightArrow(745, 615, 820, 615, palette.amber);
  b += arrow(1130, 315, 1225, 435, accent);
  b += arrow(1130, 615, 1225, 505, palette.amber);
  b += straightArrow(1470, 470, 1530, 470, accent);

  b += box(190, 775, 390, 120, "单步增量损失 L_ΔP", ["约束 ΔE / ΔN / ΔU 单步精度"], { fill: palette.white, stroke: palette.line, titleSize: 23, bodySize: 19, maxChars: 20 });
  b += box(705, 775, 390, 120, "轨迹一致性 L_traj", ["约束累计轨迹与真实轨迹接近"], { fill: palette.white, stroke: palette.line, titleSize: 23, bodySize: 19, maxChars: 20 });
  b += box(1220, 775, 390, 120, "平滑损失 L_smooth", ["抑制相邻预测异常抖动"], { fill: palette.white, stroke: palette.line, titleSize: 23, bodySize: 19, maxChars: 20 });

  b += `<text x="900" y="940" text-anchor="middle" font-size="26" font-weight="800" fill="${palette.ink}">总损失：L = αL_ΔP + βL_traj + γL_smooth；按轴分治，水平机动与高度漂移采用不同网络结构。</text>`;
  return svg("算法四：双分支 CNN-LSTMGRU 三维定位算法", "水平/垂向分治建模，兼顾三维增量、轨迹一致性和平滑约束", accent, b);
}

const figures = [
  ["fig1_lstm_ekf", figureLstmEkf()],
  ["fig2_gru_akf", figureGruAkf()],
  ["fig3_cnn_gru_ckf", figureCnnGruCkf()],
  ["fig4_dual_branch_cnn_lstmgru", figureDualBranch()],
];

for (const [name, content] of figures) {
  const svgPath = path.join(outDir, `${name}.svg`);
  fs.writeFileSync(svgPath, content, "utf8");
}

const chromeCandidates = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
];
const browser = chromeCandidates.find((p) => fs.existsSync(p));

if (browser) {
  for (const [name] of figures) {
    const svgPath = path.join(outDir, `${name}.svg`);
    const htmlPath = path.join(outDir, `${name}.html`);
    const pngPath = path.join(outDir, `${name}.png`);
    const html = `<!doctype html><html><head><meta charset="utf-8"><style>
html,body{margin:0;width:${W}px;height:${H}px;background:white;overflow:hidden;}
img{display:block;width:${W}px;height:${H}px;}
</style></head><body><img src="${svgPath.replace(/\\/g, "/")}"></body></html>`;
    fs.writeFileSync(htmlPath, html, "utf8");
    execFileSync(browser, [
      "--headless=new",
      "--disable-gpu",
      "--hide-scrollbars",
      `--window-size=${W},${H}`,
      `--screenshot=${pngPath}`,
      `file:///${htmlPath.replace(/\\/g, "/")}`,
    ], { stdio: "ignore" });
  }
}

console.log(JSON.stringify({
  output: outDir,
  svg: figures.map(([name]) => path.join(outDir, `${name}.svg`)),
  png: browser ? figures.map(([name]) => path.join(outDir, `${name}.png`)) : [],
}, null, 2));
