<template>
  <a-dropdown class="dropdown" >
    <a
      class="ant-dropdown-link"
      @click="e => e.preventDefault()"
      @mouseover="dropdownHover"
      @mouseout="dropdownUnhover"
    >
      <div class="moreBox" :class="[isdropdownHover ? 'moreBox-hover' : '']">
        <div class="more" :class="[isdropdownHover ? 'more-hover' : '']"></div>
      </div>
    </a>
    <a-menu slot="overlay" @click="onClick" @mouseover="dropdownHover" @mouseout="dropdownUnhover">
      <a-menu-item key="1">
          <span>编辑</span>
      </a-menu-item>
      <a-menu-item key="2">
        <span>邀请提需代表人完善</span>
      </a-menu-item>
    </a-menu>
  </a-dropdown>
</template>
<script>
export default {
    props: {
      demandId: {
        type: String, default: () => ''
      }
    },
  data() {
    return {
      isdropdownHover: false,
    };
  },
  methods: {
    dropdownHover() {
      this.isdropdownHover = true;
    },
    dropdownUnhover() {
      this.isdropdownHover = false;
    },
    onClick({key}){
      if(key == '1'){
        this.$router.push(`/demand/demandEdit/edit/${this.demandId}`)
      }else if(key == '2'){
        // 邀请提需代表人
      }
        // console.log(`Click on item ${key}`)
    }
  },
};
</script>
<style lang="scss">
  .ant-dropdown-menu-item {
  &:hover {
    background: #EBF8FC;
  }
}
</style>
<style lang="scss" scoped>
.dropdown {
  .moreBox {
    width: 29px;
    height: 19px;
    .more {
      width: 15px;
      height: 3px;
      position: absolute;
      top: 9px;
      right: 9px;
      background-size: 15px;
      background-image: url("./image/more.png");
    }
    .more-hover {
      background-image: url("./image/more-hover.png");
    }
  }
  .moreBox-hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
}
</style>