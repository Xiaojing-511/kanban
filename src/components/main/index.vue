<template>
  <div class="warp container" v-if="loading">
    <!-- {{ this.$route.path }} -->
    <div class="move" v-if="bannerList.length > 0">
      <el-carousel class="carousel" trigger="click" height="240px">
        <el-carousel-item v-for="item in bannerList" :key="item.id">
          <el-image
            class="moveImg"
            :src="item.banner"
            fit="cover"
            @click="setactiveHtml(item.content)"
          ></el-image>
        </el-carousel-item>
      </el-carousel>
    </div>

    <div
      class="menu"
      v-if="current == 0"
      :style="{top: bannerList.length > 0 ? '435px': '195px' }"
    >
      <div class="menu-con">
        <div class="menu-title">本页目录</div>
        <div
          v-for="(item, index) in toolsGroup"
          :key="item"
          class="anchors"
          :class="{active:index==point}"
          @click="tabclick(index)"
        >
          <div v-if="index==point" class="line"></div>
          {{item}}
        </div>
      </div>
    </div>

    <div class="nav">
      <div
        :class="[current == 0 ? 'navli active' : 'navli']"
        @click="selectFuc(0)"
      >
        全部
      </div>
      <div
        :class="[current == item.rolemd5 ? 'navli active' : 'navli']"
        v-for="item in role"
        :key="item.role"
        @click="selectFuc(item.rolemd5)"
      >
        {{ item.role }}
      </div>
    </div>

    <div class="part" v-for="(item, key) in mytools" :key="key" :id="'div' + key">
      <div class="part-title">{{ item[0].group }}</div>
      <div class="part-ul">
        <div
          class="part-li"
          v-for="(sub, key) in item"
          :key="key"
          @click="openInfo(sub)"
        >
          <car :item="sub"/>
        </div>
      </div>
    </div>

    <info v-if="isShow" :item="infoItem" :isShowFuc="isShowFuc" />

  </div>
</template>

<script>
import car from "./car.vue"
import info from "./info.vue"
import { getInfo, getGroupTools } from "@/api/communication"
export default {
  name: "index",
  components: {
    car,
    info
  },
  data() {
    return {
      htmlCon: "",
      loading: false,
      isShow: false,
      point: 0,
      current: "0",
      bannerList: [],
      role: [],
      knowledge: [],
      groupTools: [],
      mytools: [],
      toolsGroup: [],
      infoItem: {}
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    //scoll滚动事件监听
    window.addEventListener("scroll", this.handleScroll);
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    setactiveHtml(con) {
      localStorage.setItem("activeHtml", con)
      this.$router.push("/active")
    },
    // 筛选
    selectFuc(rolemd) {
      this.current = rolemd
      if(rolemd === 0){
        this.mytools = this.groupTools;
      }else{
        getGroupTools({
          role:rolemd
        })
          .then((res) => {
            if (res.errcode === 0) {
              this.mytools = res.res
            } else {
              this.$message.warning(res.errmsg)
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }
    },
    // 锚点
    tabclick(index) {
      this.point = index
      let anchorElement = document.getElementById("div" + index)
      if(anchorElement) {
        anchorElement.scrollIntoView()
      }
    },
    handleScroll() {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      let _article = document.querySelectorAll(".part")
      if(scrollTop < _article[0].offsetTop){
        this.point = 0
      }
      _article.forEach((item, index) => {
        if (scrollTop > item.offsetTop) {
          this.point = index
        }
      })
    },
    // 关闭弹窗
    isShowFuc() {
      this.$nextTick(() => {
        this.isShow = false
      })
    },
    // 打开弹窗
    openInfo(sub) {
      this.infoItem = sub
      this.isShow = true
    },
    // 获取数据
    getList() {
      getInfo()
        .then((res) => {
          if (res.errcode === 0) {
            this.bannerList = res.res.bannerList
            this.role = res.res.role
            this.groupTools = res.res.groupTools
            this.knowledge = res.res.knowledge
            this.toolsGroup = res.res.toolsGroup
            this.mytools = this.groupTools
            this.loading = true
          } else {
            this.$message.warning(res.errmsg)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }
}
</script>

<style lang="scss">
.carousel .el-carousel__button {
	width: 8px;
	height: 8px;
	border-radius: 50%;
	background: #000;
	opacity: 0.1;
}
.carousel .el-carousel__indicator.is-active button {
	border-radius: 90px;
	width: 20px;
	background: #000;
	opacity: 0.1;
}
.carousel .el-carousel__arrow {
	height: 56px;
	i {
		display: none;
	}
}
.carousel .el-carousel__arrow--left, .carousel .el-carousel__arrow--left:hover {
	background: url('~@a/icon-l.png') no-repeat transparent center center;
	height: 56px;
	background-size: auto 56px;
}
.carousel .el-carousel__arrow--right, .carousel .el-carousel__arrow--right:hover {
	background: url('~@a/icon-r.png') no-repeat transparent center center;
	height: 56px;
	background-size: auto 56px;
}
</style>

<style scoped lang="scss">
.orange{
  color: #f97910;
}
.warp {
  min-width: 1240px;
  margin: 0 auto 0 auto;
  overflow: hidden;
  padding-bottom: 36px;
}
.move {
  width: 1240px;
  margin: 24px auto 0 auto;
  background: rgb(206, 126, 126);
  border-radius: 8px;
  overflow: hidden;
  .moveImg {
    width: 1240px;
    height: 240px;
    cursor: pointer;
  }
}
.menu {
  position: fixed;
  top: 195px;
  right: 40px;
  background: #fff;
  width: 160px;
  height: 295px;
  border-radius: 8px;
  z-index: 99;
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.08);
  .line {
    position: absolute;
    width: 2px;
    height: 20px;
    top: 50%;
    margin-top: -10px;
    left: -2px;
    background: #3159f6;
  }
  .menu-con {
    width: 110px;
    height: 250px;
    border-left: 2px solid #fafafa;
    margin: 24px 0 0 24px;
    text-align: center;
  }
  .menu-title {
    font-size: 14px;
    font-weight: bold;
    color: rgba(0, 0, 0, 0.8);
    margin-bottom: 12px;
  }
  .anchors {
    margin-bottom: 15px;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.4);
    position: relative;
    cursor: pointer;
  }
  .anchors:hover {
    color: #3159f6;
    font-weight: bold;
  }
  .anchors.active {
    color: #3159F6;
    font-weight: bold;
  }
}
.nav {
  width: 1240px;
  margin: 24px auto;
  display: flex;
  align-items: center;
  justify-content: center;
  .navli {
    margin: 0 3px;
    padding: 0 15px;
    line-height: 40px;
    height: 40px;
    font-size: 14px;
    font-weight: bold;
    color: rgba(0, 0, 0, 0.4);
    cursor: pointer;
  }
  .navli:hover {
    color: #3159f6;
  }
  .navli.active {
    background: #fff;
    border-radius: 8px;
    color: #3159f6;
  }
}
.part {
  width: 1192px;
  margin: 0 auto 24px auto;
  background: #fff;
  border-radius: 8px;
  padding: 0 24px 12px 24px;
  .part-title {
    padding-left: 12px;
    height: 60px;
    font-weight: bold;
    line-height: 60px;
  }
  .part-ul {
    overflow: hidden;
  }
  .part-li {
    display: block;
    float: left;
    margin: 0 12px 20px 12px;
  }
}
</style>
