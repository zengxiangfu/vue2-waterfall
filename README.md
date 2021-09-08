## Waterfall

瀑布流组件

### 使用指南

```javascript
import { Waterfall } from "vue2-waterfall";
Vue.use(Waterfall);
```

### 代码演示

#### 基础用法

```html
<Waterfall
  :pageData="pageData"
  :col="2"
  :colStyle="{display:'flex',flexDirection:'column',alignItems:'center'}"
  @wfLoad="onLoad"
>
  <template #default="{ item, col, index}">
    <!--  slot 内容  good-card：事例组件 -->
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
    }
  }
}
```

### API

| 参数           | 说明                                        | 类型             | 默认值  | 版本 |
| -------------- | ------------------------------------------- | ---------------- | ------- | ---- |
| col            | 列数                                        | `Number`         | 2       | -    |
| pageData       | 当前 pageIndex 请求的数据（非多页累加数据） | `Array`          | []      | -    |
| resetSign      | 重置数据（清空每列数据）                    | `Boolean`        | `false` | -    |
| immediateCheck | 立即检查                                    | `Boolean`        | `true`  | -    |
| offset         | 底部到视口触底距离                          | `String｜Number` | `300`   | -    |
| colStyle       | 每列的样式                                  | `Object`         | `{}`    | -    |

### Event

| 事件名 | 说明                                 | 参数 |
| ------ | ------------------------------------ | ---- |
| wfLoad | 滚动条与底部距离小于 `offset` 时触发 | -    |

### Slot

| 名称    | 说明                 |
| ------- | -------------------- |
| default | 插槽内容             |
| col     | 当前内容所在的列     |
| item    | 单条数据             |
| index   | 当前数据所在列的下标 |

### 源码地址

源码地址请参见 <a href="" target="_blank">github</a>
