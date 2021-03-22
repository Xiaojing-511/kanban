<template>
  <div class="carItem">
    <div class="carcon">
      <img class="carlogo" :src="item.icon" />
      <div class="cartitle oneline">{{ item.title }}</div>
    </div>
    <el-tooltip placement="bottom">
      <div class="tipcss" slot="content">
        <div class="carpeople">
          适用人群：{{ item.applied_users }}
        </div>
        <div class="carword">
          {{ item.description }}
        </div>
      </div>
      <div>
        <div class="carpeople oneline">
          适用人群：{{ item.applied_users }}
        </div>
        <div class="carword moreline">
          {{ item.description }}
        </div>
      </div>
    </el-tooltip>
  </div>
</template>

<script lang="ts">
export default {
  name: "car",
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {}
  }
}
</script>
<style scoped lang="scss">
.tipcss {
  width: 225px;
  word-wrap: break-word;
  word-break: break-all;
  .carpeople,
  .carword {
    color: #fff !important;
  }
  .carpeople {
    margin: 0;
  }
}
.oneline {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.moreline {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.carItem {
  cursor: pointer;
  width: 234px;
  height: 110px;
  background: #f7f7f7;
  border-radius: 8px;
  overflow: hidden;
  padding: 16px 20px;
}
.carItem:hover {
  background: #edeff7;
  .cartitle {
    color: #3159f6;
  }
}
.carcon {
  display: flex;
  align-items: center;
  .carlogo {
    width: 38px;
    height: 38px;
    border: 1px solid #f0f0f0;
    border-radius: 8px;
    overflow: hidden;
    margin-right: 12px;
  }
  .cartitle {
    flex: 1;
    font-size: 18px;
    font-weight: bold;
    color: rgba(0, 0, 0, 0.8);
  }
}
.carpeople {
  font-size: 12px;
  line-height: 18px;
  color: rgba(0, 0, 0, 0.8);
  margin-top: 12px;
}
.carword {
  font-size: 12px;
  line-height: 18px;
  color: rgba(0, 0, 0, 0.4);
  margin-top: 4px;
}
</style>
