## Waterfall

瀑布流组件

### 使用指南

```javascript
import { Waterfall } from "waterfall-vue2";
Vue.use(Waterfall);
```

### 代码演示

#### 基础用法

```html
<Waterfall
  :pageData="pageData"
  :columnCount="2"
  :colStyle="{display:'flex',flexDirection:'column',alignItems:'center'}"
  query-sign="#cardItem"
  @wfLoad="onLoad"
  @ObserveDataTotal="ObserveDataTotal"
>
  <template #default="{ item, columnIndex, index}">
    <!--  slot 内容  good-card：事例组件 -->
    <good-card :item="item" id="cardItem" />
  </template>
</Waterfall>
```

```javascript
export default {
  name: 'waterfall-demo',
  data() {
    return {
      pageData: []
    };
  },
  methods: {
    onLoad() {
        // 数据请求
        const data = request(....)
        // 当前页的数据
        this.pageData =data;
    },
     ObserveDataTotal(length) {
      console.log(length);
    }
  }
}
```

### API

| 参数           | 说明                                        | 类型             | 默认值  | 版本 |
| -------------- | ------------------------------------------- | ---------------- | ------- | ---- |
| columnCount            | 列数                                        | `Number`         | 2       | -    |
| pageData       | 当前 pageIndex 请求的数据（非多页累加数据） | `Array`          | []      | -    |
| resetSign      | 重置数据（清空每列数据）                    | `Boolean`        | `false` | -    |
| immediateCheck | 立即检查                                    | `Boolean`        | `true`  | -    |
| offset         | 触发加载的距离阈值，单位为px                          | `String｜Number` | `300`   | -    |
| colStyle       | 每列的样式                                  | `Object`         | `{}`    | -    |
| querySign      | 内容标识（querySelectorAll选择器）            | `String`         | `必须项`    | -    |

### Event

| 事件名 | 说明                                 | 参数 |
| ------ | ------------------------------------ | ---- |
| wfLoad | 滚动条与底部距离小于 `offset` 时触发 | -    |
|ObserveDataTotal| 未渲染的数据总数 | length |

### Slot

| 名称    | 说明                 |
| ------- | -------------------- |
| default | 插槽内容             |
| columnIndex     | 当前内容所在的列     |
| item    | 单条数据             |
| index   | 当前数据所在列的下标 |

### 源码地址

源码地址请参见 <a href="https://github.com/zengxiangfu/vue2-waterfall" target="_blank">github</a>
