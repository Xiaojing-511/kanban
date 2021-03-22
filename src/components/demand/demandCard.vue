<template>
  <div>
    <div class="card-box" @click="showDemandDetailModal">
      <div class="card">
        <Dropdown :demandId="cardInfoList.id" class="dropdown" />
        <div class="info-photo" >
          <img v-if="cardInfoList.dockingPM[0]" :src="cardInfoList.dockingPM[0].avatar" alt />
        </div>
        <span class="info-name" v-if="cardInfoList.dockingPM[0]">{{cardInfoList.dockingPM[0].userName}}</span>
        <span class="info-work" v-if="cardInfoList.dockingPM[0]">{{cardInfoList.dockingPM[0].job}}</span>
        <p class="info-demand-title">{{cardInfoList.cardName}}</p>
        <div style="margin-bottom:10px;">
          <div class="info-createdemand">
            <div>
              <span>提需</span>
            </div>
            <span>{{cardInfoList.requester[0].name}}</span>
            <span v-if="cardInfoList.businessSide">·{{cardInfoList.businessSide.name | ellipsisBuinessSideName}}</span>
          </div>
          <div class="info-createdemand">
            <div>
              <span style=" color: #36B8E0;">对接</span>
            </div>
            <span v-if="cardInfoList.dockingPM[0]">{{cardInfoList.dockingPM[0].userName}}</span>
          </div>
          <div class="info-createdemand" v-if="demandStatus!=0 && demandStatus!=1">
            <div>
              <span style=" color: #00A74A;">投入</span>
            </div>
            <span>{{cardInfoList.pd}}人/天</span>
          </div>
        </div>


        <p
          class="info-schedule"
          v-if="demandStatus == 2"
        >预计排期 {{cardInfoList.estimatedFlightTime}}</p>
        <p
          class="info-schedule"
          v-if="demandStatus == 3"
        >预计上线 {{cardInfoList.enterDevTime}}</p>
        <p
          class="info-schedule"
          v-if="demandStatus == 4"
        >实际上线 {{cardInfoList.onlineDate}}</p>

        <p class="info-demand-detail">{{demandExplain | ellipsis}}</p>

        <div class="hopeBox">
          <span
            v-if="cardInfoList.sameEffectVO && demandStatus == 4"
            class="result-show"
            @mouseover="resultShowMouseOver"
            @mouseout="resultShowMouseOut"
            @click.stop="showResultShowModal"
            :class="canResultShowHover ? 'result-show-hover' : '' "
          >
            效果通晒
            <a-icon type="right" />
          </span>
          <div style="display: inline-block; float:right">
            <img class="hope" src="./image/card-hope.png" alt />
            <span>3</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 传卡片列表 -->
    <demand-detail-modal
      v-if="demandDetailVisible"
      :visible="demandDetailVisible"
      @close="demandDetailVisible = false"
      :cardInfoList="cardInfoList"
      :demandStatus="demandStatus"
      :demandExplain="demandExplain"
    />
    <!-- 传卡片列表 -->
    <result-show-modal
      v-if="resultShowVisible"
      :visible="resultShowVisible"
      @close="resultShowVisible = false"
      :cardInfoList="cardInfoList"
    />
  </div>
</template>
<script>
import demandDetailModal from "@/components/demand/demandDetailModal";
import resultShowModal from "@/components/demand/resultShowModal";
import Dropdown from "@/components/demand/dropdown";
export default {
  components: { demandDetailModal, Dropdown, resultShowModal },
  name: "demandCard",
  props: {
    cardInfoList: {
      type: Object,
      default: () => {},
    },
    cardDropdownShow: {
      type: Boolean,
      default: () => {},
    },
  },
  data() {
    return {
      // 接口获取 是否填写效果通晒
      hasResultShow: true,
      canResultShowHover: false,
      isdropdownHover: false,
      demandExplain:
        "",
      demandDetailVisible: false,
      resultShowVisible: false,
      // demandDetailList: '',
      // resultShowList: '',
      demandStatusName: ["待处理", "有存疑", "待排期", "开发中", "已上线"],
      demandStatus: "",
    };
  },
  filters: {
    //超过20位显示 ...
    ellipsis: function (value) {
      if (!value) return "";
      if (value.length > 28) {
        return value.slice(0, 28) + "...";
      }
      return value;
    },
    ellipsisBuinessSideName: function (value) {
      if (!value) return "";
      if (value.length > 4) {
        return value.slice(0, 4) + "...";
      }
      return value;
    },
  },
  mounted() {

    // 处理需求类别
    // let cardType = "已上线";
    let cardType = this.cardInfoList.stage;
    this.demandStatusName.forEach((item, index) => {
      if (item == cardType) {
        this.demandStatus = index;
        return;
      }
    });
    // 处理需求描述
    switch(this.demandStatus){
      case 1: this.demandExplain = this.cardInfoList.doubtfulExplain;break;
      case 2: this.demandExplain = this.cardInfoList.pendingInstructions;break;
      case 3: this.demandExplain = this.cardInfoList.devInstructions;break;
      case 4: this.demandExplain = this.cardInfoList.onLineInstructions;break;
    }
    // console.log('需求状态',this.demandStatus);
  },
  methods: {
    resultShowMouseOver() {
      if (this.hasResultShow) {
        this.canResultShowHover = true;
      }
    },
    resultShowMouseOut() {
      this.canResultShowHover = false;
    },
    showDemandDetailModal() {
      this.demandDetailVisible = true;
    },
    showResultShowModal() {
      if (this.hasResultShow) {
        this.resultShowVisible = true;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.card-box {
  width: 100%;
  box-sizing: border-box;
  background-color: #f8f9fa;
  position: relative;
  padding: 16px;
  .card {
    // background-color: #f8f9fa;
    border-radius: 8px;
    width: 100%;
    // box-sizing: border-box;
    // padding: 16px;
    // position: relative;
    color: #000;
    .dropdown {
      position: absolute;
      top: 9px;
      right: 9px;
    }
    .info-photo {
      width: 71px;
      height: 71px;
      line-height: 71px;
      // background-color: pink;
      display: inline-block;
      > img {
        margin: 10px 0 10px;
        width: 62px;
        border-radius: 50%;
      }
    }
    .info-name {
      position: absolute;
      top: 35px;
      left: 95px;
      color: rgba(0, 0, 0, 0.9);
      font-size: 14px;
    }
    .info-work {
      position: absolute;
      top: 60px;
      left: 95px;
      color: rgba(0, 0, 0, 0.5);
      font-size: 11px;
    }
    .info-demand-title {
      margin: 10px 0 16px 0;
      color: rgba(0, 0, 0, 0.9);
    }
    .info-createdemand {
      height: 20px;
      // background-color: pink;
      > div {
        width: 23px;
        height: 14px;
        line-height: 10px;
        background-color: #fff;
        color: #fa9e00;
        text-align: center;
        margin: 0 4px 0 0;
        display: inline-block;
        > span {
          width: 210px;
          height: 100px;
          font-size: 90px;
          transform: scale(0.1) translate(-930px, -380px);
          display: inline-block;
          // background-color: pink;
          // position: absolute;
          // left: 0px;
        }
      }
      > span {
        color: rgba(0, 0, 0, 0.5);
        font-size: 12px;
        display: inline-block;
        // background-color: pink;
        transform: translateY(-22px);
      }
    }
    .info-schedule {
      font-size: 12px;
      line-height: 13px;
      color: rgba(0, 0, 0, 0.5);
      margin: 0 0 10px;
      // background-color: pink;
    }
    .info-demand-detail {
      // background-color: pink;
      width: 100%;
      font-size: 12px;
      line-height: 14px;
      color: rgba(0, 0, 0, 0.5);
      margin: 0 0 16px 0;
      padding-bottom: 12px;
      border-bottom: 0.5px solid rgba(0, 0, 0, 0.1);
    }
    .hopeBox {
      width: 100%;
      height: 20px;
      .result-show {
        display: inline-block;
        margin-right: 2px;
      }
      .result-show-hover {
        color: #36b8e0;
        cursor: pointer;
      }
      .hope {
        width: 16px;
        margin-right: 5px;
      }
      span {
        color: rgba(0, 0, 0, 0.5);
        font-size: 12px;
        vertical-align: bottom;
      }
    }
  }
}
.card-box:hover {
  background: #edeff7;
  cursor: pointer;
}
</style>