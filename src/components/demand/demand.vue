<template>
  <div class="warp">
    <div class="todo commonBorder">
      <span class="title">我的待办</span>
      <a-badge
        :count="myAgentsList.length"
        :number-style="{
          marginBottom: '3px',
          marginLeft: '6px',
      }"
      />
      <div class="divide"></div>
      <span style="color: rgba(0, 0, 0, 0.7);">{{myAgentsList.length > 0 ? myAgentsList[0].tip : '暂无代办'}}</span>
      <span
        class="all"
        @mouseover="allHoverMouseOver"
        @mouseout="allHoverMouseOut"
        @click="toAgents"
      >
        <span>查看全部</span>
        <img v-show="!isallHover" src="./image/up.png" alt />
        <img class="hover-icon" v-show="isallHover" src="./image/up-active.png" alt />
      </span>
    </div>
    <div class="createDemandBox commonBorder">
      <!-- 时间筛选 -->
      <div class="selDate">
        <ul>
          <li
            v-for="(itemc,index) in selectCardTagList[0]"
            :key="index"
            :class="currentSelDate == index ? 'active2' : '' "
            @click="handleCurrentSelDate(index)"
          >{{itemc}}</li>
        </ul>
      </div>
      <div class="btn" @click="handleCreateDemand">
        <span class="btnText">发起需求</span>
      </div>
      <my-agents ref="myAgents" :agents="myAgentsList" />
    </div>

    <demand-total style="background:#f8f9fa" :isNeedUpdate="isTotalNeedUpdate" :currentDate="currentSelDate" />

    <div style="height: 16px;">
      <div class="marginTopDiv" ref="testFixed" :class="{fixedMargin : fixedFlag}"></div>
    </div>

    <div class="demandDetail">
      <div style="background: #f8f9fa;" class="fixedTab">
        <div class="fixedTopBox commonBorderTop">
          <p class="titleText">需求看板</p>
          <div class="tab">
            <!-- 类型筛选 -->
            <div class="sel">
              <ul>
                <li
                  :class="currentSelType == index ? 'active' : '' "
                  v-for="(item,index) in selectCardTagList[1]"
                  :key="index"
                  @click="handleCurrentSelType(index)"
                >
                  {{item}}
                  <div>{{count[index]}}</div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- 卡片 -->
      <div class="content">
        <div class="cardTagBox">
          <div class="cardTag" v-for="(item,index) in currentDemandList" :key="item.id">
            <img style="width: 30px;margin-left: -4px" :src="imgUrlList[index]" alt />
            <span class="demandStatus">{{item.columnName}}</span>
            <span class="demandStatusNum">{{item.cards.length}}</span>
            <div class="sort" @click="changeSort(index)" v-if="index != 0 && index != 1">
              <span>{{selectCardTagList[3][index - 2]}}</span>
              <div class="sort-icon-box">
                <a-icon
                  :class="!cardSort[index - 2] ? 'active' : '' "
                  class="icon-up"
                  type="caret-up"
                />
                <a-icon
                  :class="cardSort[index - 2] ? 'active' : '' "
                  class="icon-down"
                  type="caret-down"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="cardFlexBox">
          <div class="cardBox" v-for="(item,index) in currentDemandList" :key="index">
            <demand-card
              class="card"
              :cardInfoList="itemCard"
              :cardDropdownShow="iscardDropdownShow"
              v-for="(itemCard,index) in item.cards"
              :key="index"
            />
            <!-- <draggable v-model="item.cards" group="card" @start="start" @add="add" @clone="clone" @remove="remove" @end="end" @unchoose="unchoose" :move="onMove">
          <transition-group>
            <demand-card
              :cardInfoList="itemCard"
              v-for="itemCard in item.cards "
              :key="itemCard.cardId"
            />
          </transition-group>
            </draggable>-->
          </div>
        </div>
        <span class="cardListLoadFlag" ref="cardLoad"></span>
      </div>
    </div>

    <blank-page v-show="false" />
  </div>
</template>
<script>
import DemandCard from "./demandCard.vue";
import BlankPage from "./blankPage.vue";
import DemandTotal from "./demandTotal.vue";
import MyAgents from "./myAgents";
import { getDemandList, getTodoList, getMyAgents } from "@/api/communication";
import img0 from "./image/demand-status-0.png";
import img1 from "./image/demand-status-1.png";
import img2 from "./image/demand-status-2.png";
import img3 from "./image/demand-status-3.png";
import img4 from "./image/demand-status-4.png";
import { template } from "@antv/g2plot/lib/utils";

export default {
  components: {
    DemandCard,
    BlankPage,
    DemandTotal,
    MyAgents,
  },
  // draggable,
  // import SelectCard from "./selectCard.vue";
  // import echartStyles from "./echarts.json";
  // import MyAgents from "./myAgents";
  // export default {
  //   components: {
  //     SelectCard,
  //     MyAgents
  //   },
  data() {
    return {
      isallHover: false,
      isTotalNeedUpdate: true,
      marginOffsetTop: "",
      fixedFlag: false,
      currentSelType: 0,
      currentSelDate: 0,
      selectCardTagList: [
        ["近1个月", "近3个月", "近6个月", "近1年"],
        ["全部", "我发起的", "指派我的"],
        ["待处理", "有存疑", "待排期", "开发中", "已上线"],
        ["排期时间", "预计上线时间", "上线时间"],
      ],
      imgUrlList: [img0, img1, img2, img3, img4],
      portParamsList: [
        ["all", "initiate", "assign"],
        [1, 3, 6, 12],
      ],
      demandListTemp: [{}, {}, {}, {}],
      // 当前显示的需求列表
      currentDemandList: [],
      // 当前type数量
      count: [0, 0, 0],
      // 卡片排序标志(0为升序)
      cardSort: [0, 0, 0],
      // 是否第一次点击 （首次点击请求接口）
      isFirstClickFlag: [{}, {}, {}, {}],
      // 当前页数
      demandListPageNum: [{}, {}, {}, {}],
      iscardDropdownShow: true,
      showAgents: false,
      myAgentsList: []
    };
  },
  computed: {
    updateDemandListFlag: {
      get() {
        return this.$store.getters.updateDemandListFlag;
      },
      set(val) {
        this.$store.dispatch("setUpdateDemandListFlag", val);
      },
    },
  },
  watch: {
    // 整体更新
    updateDemandListFlag() {
      this.currentSelType = this.currentSelDate = 0;
      this.isTotalNeedUpdate = !this.isTotalNeedUpdate;
      this.isFirstClickFlag = [{}, {}, {}, {}];
      this.demandListTemp = [{}, {}, {}, {}];
      // 卡片排序样式初始化
      this.cardSort = [0, 0, 0];
      this.isGetDemandList();
      //
      // this.currentDemandList =
      //   !this.demandListTemp[this.currentSelDate] ||
      //   !this.demandListTemp[this.currentSelDate][
      //     this.portParamsList[0][this.currentSelType]
      //   ]
      //     ? []
      //     : this.demandListTemp[this.currentSelDate][
      //         this.portParamsList[0][this.currentSelType]
      //       ];
    },
  },
  created() {
    this.isGetDemandList();
      //   this.$store.dispatch("setUpdateDemandListFlag", !this.$store.getters.updateDemandListFlag)
    //获取我的代办
    this.getMyAgents();
  },
  mounted() {
    // console.log('----当前需求列表',this.currentDemandList);
    this.$nextTick(() => {
      this.marginOffsetTop = document.querySelector(".marginTopDiv").offsetTop;
      window.addEventListener("scroll", this.handleScroll);
    });
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll); // 离开页面 关闭监听 不然会报错
  },
  methods: {
    testHandle() {},
    //我的代办数据
    getMyAgents() {
      getMyAgents().then(res => {
          if (res.code === 200) {
            this.myAgentsList = res.data
          }
      })
    },
    allHoverMouseOver(){
      this.isallHover = true;
    },
    allHoverMouseOut() {
      this.isallHover = false;
    },
    // 判断dom元素是否在可视区域
    isElementNotInViewport(el) {
      let rect = el.getBoundingClientRect();
      return (
        rect.top <=
        (window.innerHeight || document.documentElement.clientHeight)
      );
    },
    // 监听scroll tab置顶 卡片列表懒加载
    handleScroll() {
      var scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;

      if (scrollTop >= this.marginOffsetTop - 80) {
        this.fixedFlag = true;
        document.querySelector(".fixedTab").style.position = "fixed";
        document.querySelector(".fixedTab").style.top =
          document.querySelector(".marginTopDiv").offsetTop +
          document.querySelector(".marginTopDiv").offsetHeight;

        // 80为导航栏高度 30为marginTop高度
        document.querySelector(".fixedTab").style.marginTop =
          80 + document.querySelector(".marginTopDiv").offsetHeight + "px";

        // document.querySelector(".cardTagBox").style.top =
        // document.querySelector(".marginTopDiv").offsetTop +
        //   document.querySelector(".marginTopDiv").offsetHeight +
        //   document.querySelector(".fixedTopBox").offsetHeight +
        //   "px";
        document.querySelector(".cardTagBox").style.position = "fixed";
        document.querySelector(".cardTagBox").style.top =
          80 +
          document.querySelector(".marginTopDiv").offsetHeight +
          document.querySelector(".fixedTopBox").offsetHeight +
          "px";
        document.querySelector(".content").style.marginTop =
          document.querySelector(".fixedTopBox").offsetHeight + "px";
        document.querySelector(".content").style.paddingTop =
          document.querySelector(".cardTag").offsetHeight + "px";
      } else {
        this.fixedFlag = false;
        document.querySelector(".fixedTab").style.marginTop = "0px";
        document.querySelector(".fixedTab").style.position = "static";
        document.querySelector(".fixedTab").style.top = "0px";
        document.querySelector(".cardTagBox").style.position = "static";
        document.querySelector(".cardTagBox").style.top = "0px";

        document.querySelector(".content").style.marginTop = "0px";
        document.querySelector(".content").style.paddingTop = "0px";
      }

      // 触底加载列表
      // if (this.isElementNotInViewport(this.$refs.cardLoad)) {
      //   console.log(
      //     "is can see....",
      //     this.isElementNotInViewport(this.$refs.cardLoad)
      //   );
      // }
    },
    handleCreateDemand() {
     

      this.$router.push("/demand/demandEdit/create/new");
    },
    toAgents() {
      this.$refs.myAgents.showAgentsDrawer()
    },
    handleCurrentSelType(index) {
      this.currentSelType = index;
      this.isGetDemandList();
    },
    handleCurrentSelDate(index) {
      this.currentSelDate = index;
      this.isGetDemandList();
    },
    // 是否通过接口获取数据
    isGetDemandList() {
      if (
        !this.isFirstClickFlag[this.currentSelDate] ||
        !this.isFirstClickFlag[this.currentSelDate][this.currentSelType]
      ) {
        // 接口获取数据
        getDemandList({
          type: this.portParamsList[0][this.currentSelType],
          month: this.portParamsList[1][this.currentSelDate],
        }).then((res) => {
          let list = res.data.columnInfos;
          let arr = [
            res.data.allCount,
            res.data.initiateCount,
            res.data.assignCount,
          ];
          this.demandListTemp[this.currentSelDate][
            this.portParamsList[0][this.currentSelType]
          ] = list;
          this.demandListTemp[this.currentSelDate]["typeNum"] = arr;
          this.currentDemandList =
            !this.demandListTemp[this.currentSelDate] ||
            !this.demandListTemp[this.currentSelDate][
              this.portParamsList[0][this.currentSelType]
            ]
              ? []
              : this.demandListTemp[this.currentSelDate][
                  this.portParamsList[0][this.currentSelType]
                ];
          this.count = this.demandListTemp[this.currentSelDate]["typeNum"];
          this.isFirstClickFlag[this.currentSelDate][this.currentSelType] = 1;

        });

      } else {
        this.currentDemandList =
          !this.demandListTemp[this.currentSelDate] ||
          !this.demandListTemp[this.currentSelDate][
            this.portParamsList[0][this.currentSelType]
          ]
            ? []
            : this.demandListTemp[this.currentSelDate][
                this.portParamsList[0][this.currentSelType]
              ];
        this.count = this.demandListTemp[this.currentSelDate]["typeNum"];
      }
    },
    // 改变卡片排序方式
    changeSort(index) {
      this.$set(this.cardSort, index - 2, this.cardSort[index - 2] ^ 1);
      // 翻转对应数组
      this.$set(
        this.currentDemandList[index].cards,
        this.currentDemandList[index].cards.reverse()
      );

    },
  },
};
</script>
<style lang="scss">
.ant-badge-count {
  min-width: 17px;
  height: 17px;
  line-height: 17px;
  padding: 1px;
  font-size: 12px;
}
</style>
<style lang="scss" scoped>
.warp {
  width: 1240px;
  margin: 22px auto 20px auto;
  background: #f8f9fa;
  .todo,
  .createDemandBox {
    margin-bottom: 16px;
    padding-left: 10px;
    // .topBtn {
    //   display: flex;
    // }

    // .titleText {
    //   font-size: 18px;
    //   margin: 10px 0;
  }
  .todo {
    width: 100%;
    height: 64px;
    line-height: 64px;
    background-color: pink;
    position: relative;
    .title {
      display: inline-block;
      font-weight: 600;
      font-size: 16px;
      margin-left: 30px;
    }
    .divide {
      display: inline-block;
      background: rgba(0, 0, 0, 0.25);
      width: 1px;
      height: 14px;
      margin: 0 12px;
      transform: translateY(2px);
    }
    .all {
      cursor: pointer;
      position: absolute;
      // top: 28px;
      right: 32px;
      color: rgba(0, 0, 0, 0.7);
      > span {
        vertical-align: middle;
      }
      > img {
        width: 10px;
        margin-left: 3px;
        transform: translateY(-1px) rotate(90deg);
      }
      &:hover {
        color: #36b8e0;
      }
    }
  }
  .createDemandBox {
    display: flex;
    justify-content: space-between;
    .selDate {
      height: 65px;
      line-height: 65px;
      margin-left: 26px;
      li {
        color: rgba(0, 0, 0, 0.5);
        cursor: pointer;
        width: 100px;
        list-style-type: none;
        display: inline-block;
        margin: 0 20px 0 0;
      }
      .active2 {
        color: #36b8e0;
      }
    }
  }
  .commonBorder {
    border-radius: 8px;
    background-color: #fff;
  }
  .commonBorderTop {
    border-radius: 8px 8px 0 0;
    background-color: #fff;
  }

  .btn {
    width: 88px;
    height: 32px;
    background: #36b8e0;
    border-radius: 4px;
    margin: 17px 32px 0 0;
    display: inline-block;
    font-size: 14px;
    text-align: center;

    cursor: pointer;
    .btnText {
      font-size: 14px;
      line-height: 32px;
      color: #fff;
      display: inline-block;
    }
  }

  .marginTopDiv {
    width: 100%;
    height: 16px;
    background-color: #f8f9fa;
    z-index: 3;
  }
  .fixedMargin {
    position: fixed;
    top: 80px;
  }

  .demandDetail {
    box-sizing: border-box;
    .fixedTab {
      z-index: 2;
    }
    .fixedTopBox {
      width: 1240px;
      height: 116px;
      box-sizing: border-box;
      padding: 20px 36px 0;
      .titleText {
        margin: 10px 0;
        font-weight: 600;
        font-size: 16px;
        line-height: 24px;
      }
      .tab {
        margin: 0 0 10px;
        .sel {
          margin: 24px 0 0;
          li {
            cursor: pointer;
            color: rgba(0, 0, 0, 0.85);
            list-style-type: none;
            display: inline-block;
            margin: 0 32px 0 0;
            padding-bottom: 13px;
            line-height: 22px;
            // vertical-align: bottom;

            > div {
              width: 30px;
              height: 20px;
              font-size: 12px;
              line-height: 20px;
              color: rgba(0, 0, 0, 0.45);
              display: inline-block;
              background: #f0f0f0;
              border-radius: 10px;
              margin-left: 4px;
              text-align: center;
            }
          }
          .active {
            border-bottom: 2px solid #36b8e0;
            color: #36b8e0;
            > div {
              background: rgba(54, 184, 224, 0.1);
              color: #36b8e0;
            }
          }
        }
      }
    }

    .content {

      padding: 0 36px 20px;
      background-color: #fff;
      .cardTagBox {
        width: 1168px;
        background-color: #fff;

        display: flex;
        justify-content: space-between;
        z-index: 2;
        .cardTag {
          width: 218px;
          padding: 22px 0 7px;
          .demandStatus {
            font-weight: 600;
            font-size: 16px;
            line-height: 24px;
            color: rgba(0, 0, 0, 0.8);
            margin: 0 12px 0 3px;
            vertical-align: middle;
          }
          .demandStatusNum {
            line-height: 22px;
            color: rgba(0, 0, 0, 0.5);
            vertical-align: middle;
          }
          .sort {
            height: 25px;
            float: right;
            cursor: pointer;
            > span {
              -moz-user-select: none; /*火狐*/
              -webkit-user-select: none; /*webkit浏览器*/
              -ms-user-select: none; /*IE10*/
              -khtml-user-select: none; /*早期浏览器*/
              user-select: none;
              transform: translateY(-17px);
              display: inline-block;
              font-size: 12px;
              line-height: 17px;
              color: rgba(0, 0, 0, 0.5);
              margin-right: 4px;
            }
            .sort-icon-box {
              display: inline-block;
              width: 7px;

              .icon-up,
              .icon-down {
                font-size: 9px;
                color: #aeaeaf;
              }
              .active {
                color: #36b8e0;
              }
              .icon-down {
                transform: translateY(-15px);
              }
            }
          }
        }
      }
      .cardFlexBox {
        display: flex;
        justify-content: space-between;
        .cardBox {
          width: 218px;
          .card {
            margin: 12px 0 0;
          }
        }
      }
    }
  }
}
</style>