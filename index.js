import Waterfall from "./src/waterfall.vue";

Waterfall.install = (Vue) => {
  Vue.component(Waterfall.name, Waterfall);
};

export default Waterfall;
