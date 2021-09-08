<template>
  <div>
    <div style="width:100%">
      <div
        v-for="i in col"
        :key="i"
        :ref="colNames[i] + tailSign"
        style="float:left;overflow-x:hidden"
        :style="{ width: colWidth, ...colStyle }"
        :id="colNames[i] + tailSign"
      >
        <template v-for="(item, index) in colListData[colNames[i] + tailSign]">
          <slot :item="item" :col="i" :index="index" />
        </template>
      </div>
    </div>
    <div ref="bottom" class="bottom">&nbsp;</div>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: "Waterfall",
  props: {
    // 列数
    col: {
      type: Number,
      default: 2,
    },
    // 每页数据
    pageData: {
      type: Array,
      default: () => [],
    },
    // 重置
    resetSign: {
      type: Boolean,
      default: false,
    },
    // 立即检查
    immediateCheck: {
      type: Boolean,
      default: true,
    },
    // 偏移
    offset: {
      type: [Number, String],
      default: 300,
    },
    // 样式
    colStyle: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      mutationObserve: null,
      // 保存列表数据
      colListData: {},
      // 当前列的名称
      colNames: [
        "col",
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
      ],
      // ref和列表名称后缀
      tailSign: "WfCol",
      // 监视的数据
      observeData: [],
      // 保存当前列表数据的最后 col * 1 个数据，为了防止图片懒加载，出现一列偏差较大
      tmpData: [],
      // 获取父级或以上的滚动元素
      scrollTarget: window,
      time: 0,
      // 绑定滚动事件标识
      onceSign: true,
      // 触底发布信息标识，防止数据持续触底触发发布事件
      emitSign: true,
    };
  },
  computed: {
    colWidth() {
      return 100 / Number(this.col || 2) + "%";
    },
    _offset() {
      return Number(this.offset);
    },
  },
  watch: {
    col: {
      immediate: true,
      handler: function(val) {
        for (let i = 1; i <= val; i++) {
          // 初始化每列数据
          this.$set(this.colListData, this.colNames[i] + this.tailSign, []);
        }
      },
    },
    // 数据改变，重新监听
    pageData(val = []) {
      // 数据更新，修改触发触底标识
      this.emitSign = true;
      if (MutationObserver) {
        if (this.resetSign) {
          // 判断当前是否需要重置
          this.mutationObserve.disconnect();
          Object.keys(this.colListData).forEach((key) => {
            this.addObserveCol(key);
            this.colListData[key] = [];
          });
        }
        this.$nextTick(() => {
          const len = val.length;
          if (len < this.col) {
            this.observeData = [...this.observeData, ...val];
          } else {
            // 新数据切分成两段，切断点,预留col-1个数据做图片加载后修正列高度
            const end = len - this.col + 1;
            this.observeData = val.slice(0, end);
            this.tmpData = val.slice(end);
          }
          this.insetData();
        });
      } else {
        // 当 MutationObserver 不支持，每列数据均匀分配
        while (Array.isArray(val) && val.length) {
          Object.keys(this.colListData).forEach((key) => {
            const item = val.shift();
            item && this.colListData[key].push(item);
          });
        }
        this.observeData = [];
      }
    },
    observeData(val) {
      if (val.length === 0 && this.onceSign) {
        // 监视数组数据分发完了，在进行首次的祖先滚动元素的查找
        this.onceSign = false;
        this.scrollTarget = this.getScrollParentNode(this.$el);
        this.scrollTarget.addEventListener("scroll", this.check);
      }
    },
  },
  created() {
    if (MutationObserver) {
      this.mutationObserve = new MutationObserver((mutationList) => {
        mutationList.forEach((mutation) => {
          const addedNodes = mutation.addedNodes;
          addedNodes.forEach((e) => {
            if (e instanceof HTMLElement) {
              this.insetData();
            }
          });
        });
      });
    }
  },
  mounted() {
    if (this.immediateCheck) {
      this.check();
    }
    if (MutationObserver) {
      Object.keys(this.colListData).forEach((key) => {
        this.addObserveCol(key);
      });
    }
  },
  methods: {
    // 添加监控id
    addObserveCol(key) {
      const dom = document.querySelector("#" + key);
      this.mutationObserve.observe(dom, {
        childList: true, // 观察目标子节点的变化，是否有添加或者删除
      });
    },
    // 获取最小高度最小的标识
    getMinColSign() {
      let minHeight = -1;
      let sign = null;
      Object.keys(this.colListData).forEach((key) => {
        const div = this.$refs[key][0];
        if (div) {
          const height = div.offsetHeight;
          if (minHeight === -1 || minHeight > height) {
            minHeight = height;
            sign = key;
          }
        }
      });
      return sign;
    },
    // 获取滚动的父级元素
    getScrollParentNode(el) {
      let node = el;
      while (
        node.nodeName !== "HTML" &&
        node.nodeName !== "BODY" &&
        node.nodeType === 1
      ) {
        const parentNode = node.parentNode;
        const { overflowY } = window.getComputedStyle(parentNode);
        if (
          (overflowY === "scroll" || overflowY === "auto") &&
          parentNode.clientHeight != parentNode.scrollHeight
        ) {
          return parentNode;
        }
        node = parentNode;
      }
      return window;
    },
    // 滚动检查
    check() {
      // 触底标识为false直接跳过
      if (!this.emitSign) return;
      const { scrollTarget } = this;
      let bounding = {
        top: 0,
        bottom: scrollTarget.innerHeight || 0,
      };
      if (this.$refs.bottom.getBoundingClientRect) {
        bounding = this.$refs.bottom.getBoundingClientRect();
      }
      const placehold = this.$refs.bottom.getBoundingClientRect();
      // 元素所在视口容器的高度
      let height = bounding.bottom - bounding.top;
      if (!height) {
        return;
      }
      const container = scrollTarget.innerHeight || scrollTarget.clientHeight;
      const distance = bounding.bottom - container - this._offset;
      if (distance < 0) {
        if (MutationObserver) {
          // 兜底元素，在img加载过程中，高度不固定的情况下，尽可能的减少每列的差距
          this.observeData = [...this.observeData, ...this.tmpData];
          this.tmpData = [];
          this.insetData();
        }
        // 发布事件
        this.$emit("wfLoad");
        // 发布事件触发修改触底标识
        this.emitSign = false;
      }
    },
    // 插入数据
    insetData() {
      const sign = this.getMinColSign();
      const div = this.observeData.shift();
      if (!div || !sign) {
        return null;
      }
      this.colListData[sign].push(div);
    },
  },
  beforeDestroy() {
    this.scrollTarget.removeEventListener("scroll", this.check);
    this.mutationObserve && this.mutationObserve.disconnect();
    this.mutationObserve = null;
  },
};
</script>
<style scoped>

