---
title: 1.5.3
---

# Cloudberry Database v1.5.3 发版说明

版本号: v1.5.3

Cloudberry Database v1.5.3 是一个小版本更新，包含了一些提升改进、 bug 修复和文档更新。

快速试用: [v1.5.3](https://github.com/cloudberrydb/cloudberrydb/releases/tag/1.5.3)

完整更新日志: [https://github.com/cloudberrydb/cloudberrydb/compare/1.5.2...1.5.3](https://github.com/cloudberrydb/cloudberrydb/compare/1.5.2...1.5.3)

## 提升改进

- 在默认 build 中支持 `postgres_fdw` [#400](https://github.com/cloudberrydb/cloudberrydb/pull/400) by @[smartyhero](https://github.com/smartyhero)

- `gpconfig` 不再转义 '$' 字符 [#403](https://github.com/cloudberrydb/cloudberrydb/pull/403) by @[Ray-Eldath](https://github.com/Ray-Eldath)

- 访问方法 flags 现在可以指示是否支持自定义表的列定向扫描 [#407](https://github.com/cloudberrydb/cloudberrydb/pull/407) by @[gongxun0928](https://github.com/gongxun0928)

- 添加 GUC `gp_random_insert_segments` 以控制用于随机分布表插入的 segments [#406](https://github.com/cloudberrydb/cloudberrydb/pull/406) by @[foreyes](https://github.com/foreyes)

- 支持目录表 [#390](https://github.com/cloudberrydb/cloudberrydb/pull/390) by @[wenchaozhang-123](https://github.com/wenchaozhang-123)

- 禁用在 `pg_dump` 中导出 pax 表 [#412](https://github.com/cloudberrydb/cloudberrydb/pull/412) by @[jiaqizho](https://github.com/jiaqizho)

- 更新 `googletest` 模块 URL [#429](https://github.com/cloudberrydb/cloudberrydb/pull/429) by @[tuhaihe](https://github.com/tuhaihe)

## Bug 修复

- 提升调用 `EVP_DecryptUpdate` 时的出站数据缓冲区 (#479) [#408](https://github.com/cloudberrydb/cloudberrydb/pull/408) by @[kongfanshen-0801](https://github.com/kongfanshen-0801) 

- 添加 pgrx 在数值变化接口后找不到的方程 [#410](https://github.com/cloudberrydb/cloudberrydb/pull/410) by @[jiaqizho](https://github.com/jiaqizho)

- 修复从目录表复制的问题 在 [#416](https://github.com/cloudberrydb/cloudberrydb/pull/416) by @[wenchaozhang-123](https://github.com/wenchaozhang-123)

- 修复 UPDATE 时唯一性检查的 visimap 查询 [#423](https://github.com/cloudberrydb/cloudberrydb/pull/423) by @[lss602726449](https://github.com/lss602726449) 

- 修复目录表 CI 管道存在的问题 [#414](https://github.com/cloudberrydb/cloudberrydb/pull/414) by @[wenchaozhang-123](https://github.com/wenchaozhang-123)

- 修复删除目录权限检查问题 [#425](https://github.com/cloudberrydb/cloudberrydb/pull/425) by @[wenchaozhang-123](https://github.com/wenchaozhang-123) 

## 文档更新

- 更新 README.md 文件 [#411](https://github.com/cloudberrydb/cloudberrydb/pull/411) by @[tuhaihe](https://github.com/tuhaihe)

- 更新部署的 README.md [#409](https://github.com/cloudberrydb/cloudberrydb/pull/409)
 by @[Zhangbaowen-Hashdata](https://github.com/Zhangbaowen-Hashdata)

## 🙌🏻️ 新贡献者

- @[kongfanshen-0801](https://github.com/kongfanshen-0801) 在 [#408](https://github.com/cloudberrydb/cloudberrydb/pull/408) 做出了他的首次贡献。

- @[foreyes](https://github.com/foreyes) 在 [#406](https://github.com/cloudberrydb/cloudberrydb/pull/406) 做出了他的首次贡献。

## 🧑🏻‍💻 贡献者列表

感谢所有贡献者使此版本发布成为可能: @[smartyhero](https://github.com/smartyhero), @[Ray-Eldath](https://github.com/Ray-Eldath), @[gongxun0928](https://github.com/gongxun0928), @[kongfanshen-0801](https://github.com/kongfanshen-0801), @[foreyes](https://github.com/foreyes), @[tuhaihe](https://github.com/tuhaihe), @[Zhangbaowen-Hashdata](https://github.com/Zhangbaowen-Hashdata), @[jiaqizho](https://github.com/jiaqizho), @[wenchaozhang-123](https://github.com/wenchaozhang-123), @[lss602726449](https://github.com/lss602726449), @[soumyadeep2007](https://github.com/soumyadeep2007), @[ashwinstar](https://github.com/ashwinstar) 👍
