<template>
  <div class="demandTotal commonBorder">
    <div class="businessOptions commonBorder">
      <p class="hintText">提需业务方分布</p>
      <div class="box">
        <div id="columnar" ref="col"></div>
      </div>
    </div>
    <div class="demandStatus commonBorder">
      <p class="hintText">需求状态分布</p>
      <div class="container">
        <a-tree-select
          class="dropdown"
          v-model="defaultTreeValue"
          tree-checkable
          :tree-data="treeData"
          :show-checked-strategy="SHOW_PARENT"
          :maxTagPlaceholder="setMaxTagPlaceholder"
          :maxTagCount="1"
          @change="treeSelectChange"
        ></a-tree-select>
      </div>
      <div class="box">
        <div id="pie" ref="pie"></div>
      </div>
    </div>
  </div>
</template>
<script>
import { getDemandTotalList, getBusinessSide } from "@/api/communication.ts";
import { Pie, measureTextWidth, Column } from "@antv/g2plot";

export default {
  props: {
    currentDate: {
      type: Number,
      default: () => {},
    },
    isNeedUpdate: {
      type: Boolean,
      default: () => {},
    },
  },
  data() {
    return {
      // 选择项是否禁用标志
      isDisabled: true,
      // 初始选择
      defaultTreeValue: "全部",
      // 当前选择的id列表
      currentBusinessList: [],
      // 业务方id-value列表
      businessSideIdValueList: [],
      // 业务方id列表  用于全选
      businessSideIdList: [],
      // 业务方value列表  用于选择框中展示
      businessSideValueList: [],
      // 选择方式（父/子）
      SHOW_PARENT: this.$SHOW_PARENT,
      portParamsList: [[1, 3, 6, 12], ["all"]],
      treeData: [
        {
          title: "乌鲁木齐分校",
          value: "乌鲁木齐分校",
          key: "乌鲁木齐分校",
        },
        {
          title: "总部",
          value: "总部",
          key: "总部",
        },
        {
          title: "T1分校",
          value: "T1分校",
          key: "T1分校",
          children: [
            {
              title: "北京分校",
              value: "北京分校",
              key: "北京分校",
            },
            {
              title: "上海分校",
              value: "上海分校",
              key: "上海分校",
            },
          ],
        },
        {
          title: "T2分校",
          value: "T2分校",
          key: "T2分校",
          children: [
            {
              title: "杭州分校",
              value: "杭州分校",
              key: "杭州分校",
            },
            {
              title: "深圳分校",
              value: "深圳分校",
              key: "深圳分校",
            },
          ],
        },
      ],
      currentBusiness: 0,
      isdropdownHover: false,
      // 需求状态列表
      demandStateDataList: [],
      businessDataList: [],
      configPie: {
        autoFit: true,
        //   appendPadding: -10,
        padding: [0, 180, 0, 0],
        color: ["#ED7D62", "#36B8E0", "#77DFD5", "#7E9BE8", "#F6C535"],
        data: [
          { type: "待处理", value: 0 },
          { type: "存疑需求", value: 0 },
          { type: "已接需求", value: 0 },
          { type: "开发中", value: 0 },
          { type: "已上线", value: 0 },
        ],
        angleField: "value",
        colorField: "type",
        radius: 1,
        pieStyle: {
          lineWidth: 3,
        },
        innerRadius: 0.7,

        label: {
          type: "inner",
          offset: "-50%",
          content: "",
          style: {
            textAlign: "center",
            fontSize: 14,
          },
        },

        legend: {
          position: "right",
          itemHeight: 20,
          itemWidth: 110,
          itemName: {
            style: {
              color: "red",
            },
            formatter: "",
          },
          itemValue: {
            alignRight: true,

            formatter: (text, item, index) => {
              return this.configPie.data[index].value;
            },
          },
        },
        statistic: {
          title: {
            style: {
              fontSize: 11,
              height: "40px",
            },
            formatter: () => "总需求数",
          },
          content: {
            style: {
              fontWeight: "normal",
            },
            formatter: "",
          },
        },
        interactions: [
          { type: "element-selected" },
          { type: "element-active" },
        ],
      },
      configCol: {
        autoFit: true,
        xField: "type",
        yField: "value",
        color: "#36B8E0",
        columnWidthRatio: 0.4,
        data: [
          {
            type: "总部教学",
            value: 0,
          },
          {
            type: "总部学科",
            value: 0,
          },
          {
            type: "总部教研",
            value: 0,
          },
          {
            type: "T分校",
            value: 0,
          },
          {
            type: "L分校",
            value: 0,
          },
          {
            type: "L1分校",
            value: 0,
          },
          {
            type: "L2分校",
            value: 0,
          },
          {
            type: "其他",
            value: 0,
          },
        ],
        tooltip: {
          showTitle: false,
          formatter: (datum) => {
            return { name: datum.type, value: datum.value };
          },
        },
        xAxis: {
          label: {
            autoHide: true,
            autoRotate: false,
          },
          tickLine: null,
        },
        yAxis: {
          grid: {
            line: {
              style: {
                lineDash: [4],
                stroke: "rgba(0, 0, 0, 0.1)",
              },
            },
          },
        },
        meta: {
          type: {
            alias: "类别",
          },
          value: {
            alias: "数量",
          },
        },
      },
      colPlot: "",
      piePlot: "",
    };
  },
  watch: {
    currentDate() {
      // 更新数据
      this.updatePieData(this.currentBusinessList);
    },
    isNeedUpdate() {
      // 更新数据
      this.updatePieData(this.currentBusinessList);
    },
  },
  mounted() {
    let pie = this.$refs.pie;
    if (pie) {
      this.piePlot = new Pie("pie", this.configPie);
      this.piePlot.render();
    }
    let col = this.$refs.col;
    if (col) {
      this.colPlot = new Column("columnar", this.configCol);
      this.colPlot.render();
    }
    // 初始化
    this.getBusinessData();
  },
  destroyed() {
    this.piePlot.destroy();
    this.colPlot.destroy();
  },
  methods: {
    setMaxTagPlaceholder(omittedValues) {
      return `+${omittedValues.length}`;
    },
    // 业务方全部id 及 name(value) 用于多选
    businessIdValueFormatter() {
      this.businessSideIdValueList.forEach((item) => {
        this.businessSideIdList.push(item.id);
        this.businessSideValueList.push(item.name);
      });
      // this.currentBusinessList = this.businessSideIdList;
      // console.log("全部业务方id数目", this.businessSideIdList.length);
    },
    // 禁用
    isDisabledHandle(flag) {
      this.treeData.forEach((item, index) => {
        if (index != 0) {
          item.disabled = flag;
        }
      });
    },
    // 业务方选择改变
    treeSelectChange(value) {
      // 全选
      if (
        value.indexOf("全部") != -1 &&
        value.length <= this.businessSideValueList.length
      ) {
        this.defaultTreeValue = "全部";
        this.isDisabledHandle(true);
        value = this.businessSideIdList;
        this.currentBusinessList = value;
        // console.log("---全选", this.currentBusinessList);
        this.updatePieData(this.currentBusinessList);
        // 选择部分
      } else if (value.indexOf("全部") == -1 && value.length != 0) {
        this.isDisabledHandle(false);
        let businessSideArr = value;
        let businessSideIdArr = [];
        this.businessSideIdValueList.forEach((item) => {
          if (businessSideArr.indexOf(item.name) != -1) {
            businessSideIdArr.push(item.id);
          }
        });
        this.currentBusinessList = businessSideIdArr;
        this.updatePieData(this.currentBusinessList);
        // console.log("---部分.", this.currentBusinessList);
      }
      // 空的
      else if (value.length == 0) {
        this.isDisabledHandle(false);
        this.currentBusinessList = [];
        this.updatePieData(this.currentBusinessList);
        // console.log("空的....", this.currentBusinessList);
      }
    },
    dropdownHover() {
      this.isdropdownHover = true;
    },
    dropdownUnhover() {
      this.isdropdownHover = false;
    },
    // 取业务方名称数据及初始化
    getBusinessData() {
      getBusinessSide().then((res) => {
        let list = res.data;
        this.treeData = this.dataFormatterBusiness(list);
        this.treeSelectChange(["全部"]);
      });
    },
    // 业务方数据格式化
    dataFormatterBusiness(list) {
      let business = [];
      let obj = {};
      obj["title"] = obj["value"] = obj["key"] = "全部";
      business.push(obj);
      list.forEach((item, index) => {
        obj = {};
        if (item.level == "总部") {
          obj["title"] = obj["key"] = item.level;
          obj["value"] = "zongbu";
          obj["disabled"] = this.isDisabled;
        } else {
          obj["title"] = obj["value"] = obj["key"] = item.level;
          obj["disabled"] = this.isDisabled;
        }
        let cityArr = [];
        let cityObj = {};
        let idObj = {};
        item.cityList.forEach((subItem, index) => {
          cityObj = {};
          idObj = {};
          cityObj["title"] = cityObj["value"] = cityObj["key"] = subItem.name;
          cityArr.push(cityObj);
          idObj["name"] = subItem.name;
          idObj["id"] = subItem.id;
          this.businessSideIdValueList.push(idObj);
        });
        obj["children"] = cityArr;
        business.push(obj);
      });
      // 存储全部业务方id及name  用于全选
      this.businessIdValueFormatter();
      this.currentBusinessList = this.businessSideIdList;

      return business;
    },
    // 图数据格式化
    dataFormatter(dataArr) {
      let result = {};
      result.arr = [];
      result.totalCount = 0;
      dataArr.forEach((item, index) => {
        let obj = {
          type: item.name,
          value: item.count,
        };
        result.totalCount += item.count;
        result.arr.push(obj);
      });
      return result;
    },
    //  调接口 更新数据
    updatePieData(businessSideList) {
      getDemandTotalList({
        businessSide: businessSideList,
        month: this.portParamsList[0][this.currentDate],
      }).then((res) => {
        // console.log(
        //   "res...",
        //   res.data,
        //   res.data.stage.slice(0, res.data.stage.length - 1)
        // );
        // 处理数据
        this.demandStateDataList = this.dataFormatter(
          res.data.stage.slice(0, res.data.stage.length - 1)
        ).arr;
        this.businessDataList = this.dataFormatter(res.data.businessSide).arr;
        // console.log(this.demandStateDataList, this.businessDataList);
        let demandTotal = this.dataFormatter(res.data.stage).totalCount;

        //  填入数据
        this.$set(this.configPie, "data", this.demandStateDataList);
        //  填入总数
        this.$set(
          this.configPie.statistic.content,
          "formatter",
          this.getDemandTotal(demandTotal)
        );

        //  填入饼图legend
        this.$set(
          this.configPie.legend.itemValue,
          "formatter",
          (text, item, index) => {
            return this.demandStateDataList[index].value;
          }
        );
        // 更新饼图
        // console.log(this.configPie);
        this.piePlot.update(this.configPie);

        // 更新柱状图
        this.colPlot.changeData(this.businessDataList);
      });
    },
    getDemandTotal(val) {
      // 接口 动态获取总数
      return () => {
        return `<div style="margin-left:13px;" "><span style="color: rgba(0, 0, 0, 0.9);font-size: 29px;line-height: 29px;display:inline-block;margin-right:4px;transform:translateY(2px);">${val}</span><span style="color: rgba(0, 0, 0, 0.2);font-size: 16px;line-height: 22px;">个</span> 
      </div>`;
      };
    },
    renderStatistic(containerWidth, text, style) {
      const { width: textWidth, height: textHeight } = measureTextWidth(
        text,
        style
      );
      const R = containerWidth / 2;
      // r^2 = (w / 2)^2 + (h - offsetY)^2
      let scale = 1;
      if (containerWidth < textWidth) {
        scale = Math.min(
          Math.sqrt(
            Math.abs(
              Math.pow(R, 2) /
                (Math.pow(textWidth / 2, 2) + Math.pow(textHeight, 2))
            )
          ),
          1
        );
      }
      const textStyleStr = `width:${containerWidth}px;`;
      return `<div style="${textStyleStr};font-size:${scale}em;line-height:${
        scale < 1 ? 1 : "inherit"
      };">${text}</div>`;
    },
  },
};
</script>
<style>
.ant-select-dropdown {
  max-height: 300px !important;
  z-index: 2;
}
.ant-select-selection--multiple {
  overflow-x: auto;
  overflow-y: hidden;
  max-height: 33px;
}
.ant-select-selection--multiple .ant-select-selection__rendered {
  white-space: nowrap;
  display: inline-flex;
}
.ant-select-tree-checkbox-checked .ant-select-tree-checkbox-inner {
  background-color: #36b8e0;
  border-color: #36b8e0;
}
.ant-select-selection--multiple::-webkit-scrollbar,
.ant-select-dropdown::-webkit-scrollbar {
  /*滚动条整体样式*/
  height: 5px;
}
.ant-select-selection--multiple::-webkit-scrollbar-thumb,
.ant-select-dropdown::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: lightskyblue;
}
.ant-select-selection--multiple::-webkit-scrollbar-track,
.ant-select-dropdown::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  background: #ededed;
}
</style>
<style lang="scss" scoped>
.commonBorder {
  border-radius: 8px;
  //   background-color: #fff;
}
.demandTotal {
  width: 100%;
  height: 388px;

  .businessOptions,
  .demandStatus {
    background-color: #fff;
    display: inline-block;
    height: 388px;
    .hintText {
      height: 50px;
      line-height: 50px;
      border-bottom: 0.5px solid rgba(0, 0, 0, 0.1);
      padding-left: 36px;
      font-weight: 600;
    }
    .box {
      width: 100%;
      height: 324px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .businessOptions {
    width: 664px;
    margin-right: 24px;
    #columnar {
      width: 560px;
      height: 230px;
    }
  }
  .demandStatus {
    width: 552px;
    position: relative;
    #pie {
      width: 450px;
      height: 230px;
    }
  }
  .dropdown {
    position: absolute;
    top: 15px;
    right: 30px;
    color: rgba(0, 0, 0, 0.85);
    z-index: 2;
    width: 165px;

    // .select-group {
    // }
    // .active {
    //   color: #36b8e0;
    // }
  }
  .dropdown:hover {
    color: #36b8e0;
  }
}
</style>