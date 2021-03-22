<template>
  <div class="container" v-show="modalVisible">
    <div class="result-show">
      <div class="head">
        <span>效果通晒</span>
        <img src="./image/close.png" @click="handleCancel" alt />
      </div>

      <div class="content">
        <div>
          <div class="part-box">
            <p class="head-title">需求背景与目标</p>
            <p class="detail">{{cardInfoList.sameEffectVO.backGroundAim}}</p>
          </div>
        </div>

        <div>
          <div class="part-box">
            <p class="head-title">上线后效果评估</p>
            <p class="detail">{{cardInfoList.sameEffectVO.effectEvaluation}}</p>
          </div>
        </div>

        <div>
          <div class="part-box">
            <p class="pdf" v-for="(item,index) in cardInfoList.sameEffectVO.url" :key="index">
              <img style="width: 16px" src="./image/modal-pdf.png" alt />
              <span class="pdf-text" @click="saveFile(item.url)">{{item.name}}</span>
            </p>
          </div>
        </div>
        <div style="margin-top: 16px;">
          <p
            class="hint-text"
          >产品经理：{{cardInfoList.requester[0].name}}({{cardInfoList.requester[0].workcode}})</p>
          <p class="hint-text">2020.12.21</p>
        </div>
      </div>

      <div class="footer-box">
        <div class="footer">
          <div
            class="btn"
            :class="isLikeHover ? 'btn-active' : '' "
            @mouseover="handleMouseOverLike"
            @mousedown="handleMoseDownLike"
            @mouseup="handleMouseUpLike"
            @mouseout="handleMouseOutLike"
          >
            <img v-show="!isLikeHover" style="width: 16px;" src="./image/modal-like.png" alt />
            <img v-show="isLikeHover" style="width: 16px;" src="./image/modal-like-active.png" alt />
            <span class="btn-text" :class="isLikeHover ? 'btn-text-active' : '' ">超赞</span>
            <span class="btn-number" :class="isLikeHover ? 'btn-number-active' : '' ">{{likeCount}}</span>
          </div>
        </div>
        <div class="like-info">
          <img src="./image/modal-result-like.png" style="width: 15px;" alt />
          <span class="like-user">{{testLongText | ellipsis}}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { resultShowLike, getUser } from "@/api/communication";
import { downloadIamge } from "@/util/tool";
export default {
  components: {},
  props: {
    visible: { type: Boolean, default: () => {} },
    cardInfoList: { type: Object, default: () => {} },
  },
  data() {
    return {
      // 当前用户名 用于显示点赞列表
      currentUserName: "",
      // 点赞列表
      nameArr: [],
      resultShowInfoList: [],
      isLikeHover: false,
      isLike: false,
      hasMoveLike: false,
      testLongText: "",
      // 接口获取
      likeCount: 0,
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
  watch: {
    isLike() {
      let tempArr = this.nameArr;
      // 取消点赞
      if (!this.isLike && this.nameArr.indexOf(this.currentUserName) != -1) {
        tempArr.splice(this.nameArr.indexOf(this.currentUserName), 1);
        this.showLikeList(tempArr);
      } else if (
        this.isLike &&
        this.nameArr.indexOf(this.currentUserName) == -1
      ) {
        // 点赞
        // let tempArr = this.nameArr;
        tempArr.push(this.currentUserName);
        // console.log("temp", tempArr);
        this.showLikeList(tempArr);
      }
    },
  },
  filters: {
    //超过20位显示 ...
    ellipsis: function (value) {
      if (!value) return "";
      if (value.length > 20) {
        return value.slice(0, 20) + "...";
      }
      return value;
    },
  },
  mounted() {
    document.getElementsByTagName("body")[0].className = "selter-body";
    // 获取当前用户名
    getUser().then((res) => {
      // console.log(res);
      this.currentUserName = res.data.name;
      // console.log("username", this.currentUserName);
      this.isLike = this.cardInfoList.sameEffectVO.like;
      this.isLikeHover = this.isLike;
      // console.log(this.isLike);
      this.likeCount = this.cardInfoList.sameEffectVO.likes
        ? this.cardInfoList.sameEffectVO.likes.length
        : 0;
      // 处理点赞列表
      this.setShowNameList(this.cardInfoList.sameEffectVO.likes);
      // this.showLikeList(this.nameArr);
    });
  },
  methods: {
    // 处理点赞列表
    setShowNameList(Likeist) {
      if (this.likeCount != 0) {
        Likeist.forEach((item, index) => {
          this.nameArr.push(item.name);
        });
        this.showLikeList(this.nameArr);
      }
    },
    // 显示点赞列表
    showLikeList(likeArr) {
      this.testLongText = "";
      if (likeArr.length != 0) {
        this.testLongText += likeArr[0];
      }
      if (likeArr.length > 1) {
        likeArr.forEach((item, index) => {
          if (index != 0) {
            this.testLongText += ",";
            this.testLongText += item;
          }
        });
      }
    },
    // 提交点赞情况
    postResultLikeStatus(flag) {
      resultShowLike({
        choose: flag,
        id: this.cardInfoList.sameEffectVO.id,
        type: "like",
      }).then((res) => {
        // console.log("点赞提交。。", flag, res);
      });
    },
    saveFile(data, filename) {
      var save_link = document.createElement("a");
      save_link.href = data;
      save_link.target = 'blank'
      save_link.download = filename;
      var event = document.createEvent("MouseEvents");
      event.initMouseEvent(
        "click",
        true,
        false,
        window,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null
      );
      save_link.dispatchEvent(event);
    },
    handleCancel() {
      document.body.removeAttribute("class", "selter-body");
      this.$emit("close");
    },
    handleMouseOverLike() {
      if (!this.isLike && !this.isLikeHover) {
        this.isLikeHover = !this.isLikeHover;
      }
    },
    handleMoseDownLike() {
      // 仿点击事件
      document.onmousemove = () => {
        this.hasMoveLike = true;
      };
    },

    handleMouseUpLike() {
      // 点击弹开
      if (!this.hasMoveLike) {
        if (!this.isLike && this.isLikeHover) {
          this.isLike = true;
          ++this.likeCount;
          this.postResultLikeStatus(this.isLike);
        } else if (this.isLike) {
          this.isLike = false;
          --this.likeCount;
          this.postResultLikeStatus(this.isLike);
          this.isLikeHover = false;
        } else if (!this.isLike && !this.isLikeHover) {
          this.isLike = true;
          ++this.likeCount;
          this.postResultLikeStatus(this.isLike);
          this.isLikeHover = true;
        }
      }
      this.hasMoveLike = false;
      document.onmousemove = null;
    },
    handleMouseOutLike() {
      if (!this.isLike && this.isLikeHover) {
        this.isLikeHover = !this.isLikeHover;
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
  .result-show {
    display: inline-block;
    width: 552px;
    min-width: 552px;
    min-height: 547px;
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
        display: inline-block;
        margin-top: 24px;
        .head-title {
          color: rgba(0, 0, 0, 0.9);
          font-weight: 500;
          font-size: 14px;
          margin-bottom: 8px;
        }
        .pdf {
          margin-bottom: 5px;
          .pdf-text {
            color: rgba(0, 0, 0, 0.9);
            font-size: 12px;
            line-height: 18px;
            display: inline-block;
            margin-left: 4px;
            border-bottom: 1px solid #36b8e0;
            cursor: pointer;
          }
          .pdf-text:hover {
            color: #36b8e0;
          }
        }

        .info {
          width: 200px;
          display: inline-block;
          position: relative;
          .photo {
            display: inline-block;
            width: 60px;
            height: 60px;
            background-color: #ccc;
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
          margin: 0;
          color: rgba(0, 0, 0, 0.5);
          line-height: 20px;
        }
      }
      .hint-text {
        font-size: 12px;
        line-height: 17px;
        color: rgba(0, 0, 0, 0.5);
      }
    }
    .footer-box {
      width: 100%;
      height: 132px;
      background: #fafafa;

      position: absolute;
      bottom: 0;
      .footer {
        height: 89px;
        display: flex;
        justify-content: center;
        align-items: center;
        .btn {
          width: 124px;
          height: 48px;
          display: flex;
          justify-content: center;
          align-items: center;
          color: rgba(0, 0, 0, 0.5);
          border: 1px solid #d9d9d9;
          box-sizing: border-box;
          border-radius: 8px;
          margin-top: 7px;
          -moz-user-select: none; /*火狐*/
          -webkit-user-select: none; /*webkit浏览器*/
          -ms-user-select: none; /*IE10*/
          .btn-text {
            font-size: 12px;
            line-height: 17px;
            display: inline-block;
            margin: 0 4px;
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
          cursor: pointer;
        }
        .btn-active {
          border: 1px solid #36b8e0;
        }
      }
      .like-info {
        margin-left: 26px;
        .like-user {
          display: inline-block;
          margin-left: 6px;
          font-size: 12px;
          line-height: 12px;
          color: rgba(0, 0, 0, 0.5);
          vertical-align: middle;
        }
      }
    }
  }
}
</style>