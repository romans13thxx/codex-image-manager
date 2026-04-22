# 真人摄影偏好画像

> 个人口味层。稳定规则请迁到 `permanent/style-library/real-human/`。

## 默认审美倾向

- 胶片感：轻微颗粒，避免过度磨皮
- 肤色：warm-yellow 默认偏暖，不允许"奶白塑料脸"
- 光：窗光优先，避免环形灯正打
- 构图：留白 ≥ 20%，主体不居中

## 按子类的默认倾向

| 子类 | 偏好场景 | 偏好气质 | 禁忌 |
| --- | --- | --- | --- |
| home-lifestyle | indoor-home | cute、elegant | 影楼打光 |
| outdoor-street | street / outdoor | cool、energetic | 摆拍感强 |
| studio-portrait | studio | elegant、luxury | 杂乱背景 |
| fashion-editorial | studio / minimal-bg | luxury、cool | 居家感 |
| commercial-headshot | studio | elegant | 过度侧脸 |
| travel-story | outdoor / nature | energetic、cute | 无情境道具 |

## 负面默认项（任何真人图都默认追加）

- 没有变形的手指、耳朵、牙齿
- 没有"AI 塑料光泽"
- 没有衣服与身体错位
- 没有可识别的名人脸

## 候选规则（待验证）

- 尝试：所有 home-lifestyle 默认 "natural window light + handheld feel"
- 尝试：所有 fashion-editorial 默认 "85mm equivalent + studio seamless"

复现 3 次后迁入 `permanent/style-library/real-human/<subcategory>.md`。
