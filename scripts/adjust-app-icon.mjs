import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const translateX = Number(process.argv[2] ?? "0.8");
const translateY = Number(process.argv[3] ?? "1");

if (!Number.isFinite(translateX) || !Number.isFinite(translateY)) {
  throw new Error("平移参数必须是数字，例如：node scripts/adjust-app-icon.mjs 0.8 1");
}

const filePath = path.resolve("public/assets/app-icon.svg");
const source = fs.readFileSync(filePath, "utf8");

const targetBlock = `  <!-- 猫耳 M：纯程序计算 X轴横向缩放 115%，100%保留了 Claude 原有的平滑度和垂直腿部 -->
  <path d="M12.7 38 C12.7 38 12.7 18 15 14.5
           C16.7 13 17.8 13.5 23 25
           C23 25 23.9 27 24.7 25
           C25.5 23 29.3 13.5 31 14.5
           C32.8 15.5 33.4 38 33.4 38"
        stroke="#F5F0EB" stroke-width="3.2"
        fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        
  <!-- 三色装饰簇（0修改） -->
  <circle cx="37" cy="14" r="4" fill="#FF6B6B" opacity="0.8"/>
  <circle cx="31" cy="9" r="2.6" fill="#7EC8E3" opacity="0.7"/>
  <rect x="34" y="7" width="4" height="4" rx="0.8"
        fill="#F9D56E" opacity="0.6" transform="rotate(18 36 9)"/>`;

const replacementBlock = `  <g transform="translate(${translateX} ${translateY})">
    <!-- 猫耳 M：纯程序计算 X轴横向缩放 115%，100%保留了 Claude 原有的平滑度和垂直腿部 -->
    <path d="M12.7 38 C12.7 38 12.7 18 15 14.5
             C16.7 13 17.8 13.5 23 25
             C23 25 23.9 27 24.7 25
             C25.5 23 29.3 13.5 31 14.5
             C32.8 15.5 33.4 38 33.4 38"
          stroke="#F5F0EB" stroke-width="3.2"
          fill="none" stroke-linecap="round" stroke-linejoin="round"/>
          
    <!-- 三色装饰簇（0修改） -->
    <circle cx="37" cy="14" r="4" fill="#FF6B6B" opacity="0.8"/>
    <circle cx="31" cy="9" r="2.6" fill="#7EC8E3" opacity="0.7"/>
    <rect x="34" y="7" width="4" height="4" rx="0.8"
          fill="#F9D56E" opacity="0.6" transform="rotate(18 36 9)"/>
  </g>`;

const groupedBlockPattern = /  <g transform="translate\([^)]+\)">[\s\S]*?  <\/g>/;

const nextSource = groupedBlockPattern.test(source)
  ? source.replace(groupedBlockPattern, replacementBlock)
  : source.replace(targetBlock, replacementBlock);

if (nextSource === source) {
  throw new Error("没有找到可替换的品牌元素区块，请检查 SVG 结构是否变更。");
}

fs.writeFileSync(filePath, nextSource, "utf8");

console.log(`已更新 ${filePath}`);
console.log(`当前平移量：x=${translateX}, y=${translateY}`);
