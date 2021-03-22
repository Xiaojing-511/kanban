<template>
  <div class="container" v-show="modalVisible">
    <div class="demand-detail">
      <div class="head">
        <span>需求详情</span>
        <Dropdown :demandId="cardInfoList.id" class="dropdown" />
        <img src="./image/close.png" @click="handleCancel" alt />
      </div>
      <div class="content">
        <div>
          <div class="part-box">
            <p class="head-title">产品对接人</p>
            <div class="info" v-for="(item,index) in cardInfoList.dockingPM" :key="index">
              <div class="photo">
                <img :src="item.avatar" alt />
              </div>
              <span class="name">{{item.userName}}</span>
              <span class="duty">{{item.job}}</span>
            </div>
          </div>
        </div>

        <div>
          <div class="part-box box-width">
            <p class="head-title">提需代表人</p>
            <p class="detail" v-for="(item,index) in cardInfoList.requester" :key="index">
              <span>{{item.name}}</span>
              <span v-if="cardInfoList.businessSide">·{{cardInfoList.businessSide.name}}</span>
              <span v-if="cardInfoList.businessSideAdd">·{{cardInfoList.businessSideAdd}}</span>
            </p>
          </div>
        </div>

        <div>
          <div class="part-box box-width">
            <p class="head-title">需求名称</p>
            <p class="detail">{{cardInfoList.cardName}}</p>
          </div>
        </div>

        <div>
          <div class="part-box box-width">
            <p class="head-title">需求描述</p>
            <p class="detail">
              {{cardInfoList.solveUserProblem}}
              <br />
              {{cardInfoList.solveBusProblem}}
              <br />
              {{cardInfoList.effectMethod}}
              <br />
              {{cardInfoList.alterNatives}}
            </p>
          </div>
        </div>

        <div v-if="demandStatus!=0">
          <div class="part-box box-width">
            <p class="head-title">产品经理反馈</p>
            <p class="detail">{{demandExplain}}</p>
          </div>
          <div style="margin-top: 16px;">
            <p
              class="hint-text"
            >产品经理：{{cardInfoList.requester[0].name}}({{cardInfoList.requester[0].workcode}})</p>
            <p class="hint-text">2020.12.21</p>
          </div>
        </div>
      </div>

      <div class="footer">
        <div
          style="margin-right: 40px;"
          class="btn"
          :class="isLikeHover || isLike ? 'btn-active' : '' "
          @mouseover="handleMouseOverLike"
          @mousedown="handleMoseDownLike"
          @mouseup="handleMouseUpLike"
          @mouseout="handleMouseOutLike"
        >
          <img
            v-show="!isLikeHover && !isLike"
            style="width: 16px;"
            src="./image/modal-like.png"
            alt
          />
          <img
            v-show="isLikeHover || isLike"
            style="width: 16px;"
            src="./image/modal-like-active.png"
            alt
          />
          <span class="btn-text" :class="isLikeHover|| isLike ? 'btn-text-active' : '' ">给产品老师点赞</span>
          <span
            class="btn-number"
            :class="isLikeHover|| isLike ? 'btn-number-active' : '' "
          >{{likeCount}}</span>
        </div>
        <div
          class="btn"
          :class="isHopeHover ? 'btn-active' : '' "
          @mouseover="handleMouseOverHope"
          @mousedown="handleMoseDownHope"
          @mouseup="handleMouseUpHope"
          @mouseout="handleMouseOutHope"
        >
          <img v-show="!isHopeHover" style="width: 16px;" src="./image/modal-hope.png" alt />
          <img v-show="isHopeHover" style="width: 16px;" src="./image/modal-hope-active.png" alt />
          <span class="btn-text" :class="isHopeHover ? 'btn-text-active' : '' ">期待此需求</span>
          <span class="btn-number" :class="isHopeHover ? 'btn-number-active' : '' ">{{hopeCount}}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Dropdown from "@/components/demand/dropdown";
import { demandLike } from "@/api/communication";
export default {
  components: {
    Dropdown,
  },
  props: {
    visible: { type: Boolean, default: () => {} },
    // 需求详情ID
    cardInfoList: { type: Object, default: () => {} },
    demandStatus: { type: Number, default: () => {} },
    demandExplain: { type: String, default: () => {} },
  },
  data() {
    return {
      // demandDetailInfoList: [],
      isdropdownHover: false,

      isLikeHover: false,
      isLike: false,
      hasMoveLike: false,

      isHopeHover: false,
      isHope: false,
      hasMoveHope: false,

      // 接口获取
      likeCount: 30,
      hopeCount: 30,
    };
  },
  computed: {
    modalVisible: {
      get: function () {
        return this.visible;
      },
      set: function () {},
    },
  },
  mounted() {
    document.getElementsByTagName("body")[0].className = "selter-body";
    // 宽度取决产品对接人模块宽度
    // let width = document.querySelector(".info-width").offsetWidth + "px";
    // console.log(typeof(document.getElementsByClassName("part-box")),document.getElementsByClassName("part-box"));
    // document.getElementsByClassName("part-box").forEach((item) => {
    //   console.log(item);
    //   item.style.width = width;
    // });

    // 初始化点赞状态及数量
    this.isLike = this.cardInfoList.like;
    this.isLikeHover = this.isLike;
    this.isHope = this.cardInfoList.except;
    this.isHopeHover = this.isHope;
    this.likeCount = this.cardInfoList.likeCount;
    this.hopeCount = this.cardInfoList.exceptCount;
  },
  methods: {
    // 提交点赞情况
    postLikeStatus(flag, type) {
      demandLike({
        choose: flag,
        id: this.cardInfoList.id,
        type,
      }).then((res) => {
        // console.log("点赞提交。。", flag,type,res);
      });
    },
    handleCancel() {
      document.body.removeAttribute("class", "selter-body");
      this.$emit("close");
    },
    // 鼠标移入
    handleMouseOverLike() {
      if (!this.isLike && !this.isLikeHover) {
        this.isLikeHover = !this.isLikeHover;
      }
    },
    // 鼠标按下
    handleMoseDownLike() {
      // 仿点击事件
      document.onmousemove = () => {
        this.hasMoveLike = true;
      };
    },
    // 鼠标抬起
    handleMouseUpLike() {
      // 点击弹开
      if (!this.hasMoveLike) {
        if (!this.isLike && this.isLikeHover) {
          this.isLike = true;
          this.postLikeStatus(this.isLike, "like");
          ++this.likeCount;
        } else if (this.isLike) {
          this.isLike = false;
          this.postLikeStatus(this.isLike, "like");
          --this.likeCount;
          this.isLikeHover = false;
        } else if (!this.isLike && !this.isLikeHover) {
          this.isLike = true;
          this.postLikeStatus(this.isLike, "like");
          ++this.likeCount;
          this.isLikeHover = true;
        }
      }

      this.hasMoveLike = false;
      document.onmousemove = null;
    },
    // 鼠标滑出
    handleMouseOutLike() {
      if (!this.isLike && this.isLikeHover) {
        this.isLikeHover = !this.isLikeHover;
      }
    },

    handleMouseOverHope() {
      if (!this.isHope && !this.isHopeHover) {
        this.isHopeHover = !this.isHopeHover;
      }
    },
    handleMoseDownHope() {
      // 仿点击事件
      document.onmousemove = () => {
        this.hasMoveHope = true;

      };
    },

    handleMouseUpHope() {
      // 点击弹开
      if (!this.hasMoveHope) {
        if (!this.isHope && this.isHopeHover) {
          this.isHope = true;
          this.postLikeStatus(this.isHope, "except");
          ++this.hopeCount;
        } else if (this.isHope) {
          this.isHope = false;
          this.postLikeStatus(this.isHope, "except");
          --this.hopeCount;
          this.isHopeHover = false;
        } else if (!this.isHope && !this.isHopeHover) {
          this.isHope = true;
          this.postLikeStatus(this.isHope, "except");
          ++this.hopeCount;
          this.isHopeHover = true;
        }
      }
      this.hasMoveHope = false;
      document.onmousemove = null;
    },
    handleMouseOutHope() {
      if (!this.isHope && this.isHopeHover) {
        this.isHopeHover = !this.isHopeHover;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
  z-index: 99;
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  .demand-detail {
    display: inline-block;
    min-width: 552px;
    min-height: 600px;
    max-height: calc(100vh - 200px);
    background-color: #fff;
    z-index: 100;
    position: relative;
    p {
      margin: 0;
      padding: 0;
    }
    .head {
      font-weight: 600;
      font-size: 16px;
      line-height: 24px;
      height: 57px;
      padding: 17px 24px 0;
      border-bottom: 0.5px solid rgba(0, 0, 0, 0.1);
      position: relative;
      > span {
      }
      .dropdown {
        position: absolute;
        top: 18px;
        right: 57px;
      }
      > img {
        width: 12px;
        position: absolute;
        top: 24px;
        right: 24px;
        cursor: pointer;
      }
    }
    .content {
      overflow-y: auto;
      margin-bottom: 87px;
      height: 456px;
      padding: 0 24px 24px;
      .part-box {
        // width: 100%;
        display: inline-block;
        margin-top: 24px;
        .head-title {
          color: rgba(0, 0, 0, 0.9);
          font-weight: 500;
          font-size: 14px;
          margin-bottom: 8px;
        }
        .info {
          width: 200px;
          display: inline-block;
          position: relative;
          .photo {
            display: inline-block;
            width: 60px;
            height: 60px;
            line-height: 60px;
            > img {
              margin: 5px 0 0px;
              width: 53px;
              border-radius: 50%;
            }
          }
          .name {
            position: absolute;
            top: 15px;
            left: 67px;
            line-height: 20px;
          }
          .duty {
            position: absolute;
            top: 40px;
            left: 67px;
            font-size: 11px;
            line-height: 13px;
            color: rgba(0, 0, 0, 0.5);
          }
        }
        .detail {
          color: rgba(0, 0, 0, 0.5);
        }
      }
      .box-width{
        width: 552px;
      }
      .hint-text {
        font-size: 12px;
        line-height: 17px;
        color: rgba(0, 0, 0, 0.5);
      }
    }
    .footer {
      width: 100%;
      height: 87px;
      background: #fafafa;
      position: absolute;
      bottom: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      .btn {
        -moz-user-select: none; /*火狐*/
        -webkit-user-select: none; /*webkit浏览器*/
        -ms-user-select: none; /*IE10*/
        width: 160px;
        height: 48px;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid #d9d9d9;
        box-sizing: border-box;
        border-radius: 8px;
        .btn-text {
          font-size: 12px;
          line-height: 17px;
          display: inline-block;
          margin: 0 4px;
          color: rgba(0, 0, 0, 0.5);
        }
        .btn-number {
          line-height: 16px;
          color: rgba(0, 0, 0, 0.7);
        }
        .btn-text-active,
        .btn-number-active {
          color: #36b8e0;
        }
      }
      .btn:hover {
        color: #36b8e0;
        cursor: pointer;
      }
      .btn-active {
        border: 1px solid #36b8e0;
      }
    }
  }
}
</style>