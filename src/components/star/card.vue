<template>
    <div class="card-wrapper">
        <div class="card-title">
            <h3>{{item.name}}</h3>
            <img class="card-star" v-for="v in item.star" src="~@a/star-star.png" />
        </div>
        <a-tooltip placement="bottomLeft">
            <template v-if="item.description" slot="title">
                <span>{{item.description}}</span>
            </template>
            <p class="card-description">{{item.description}}</p>
        </a-tooltip>
        <span class="card-tip" v-if="item.state === 'startUp'">已启动</span>
        <span class="card-tip" v-else-if="item.state === 'noStart'" >未启动</span>
        <span class="card-tip" v-else-if="item.state === 'finish'" >已完成</span>
        <span class="card-tip" v-if="item.risk === true">风险</span>
        <span class="card-tip" v-else>无风险</span>
        <div class="card-bottom">
            <span>
                <a-tooltip v-for="v in item.principal" placement="bottom">
                    <template v-if="v.name" slot="title">
                        <span>{{v.name}}</span>
                    </template>
                    <a-avatar style="width: 40px; height: 40px" :src="v.avatar" class="card-principals"></a-avatar>
                </a-tooltip>
            </span>
            <span class="card-btn">查看里程碑 ></span>
        </div>
    </div>
</template>

<script>
    export default {
        name: "card",
        props: {
            item: {
                type: Object,
                default: () => {}
            }
        },
        data() {
            return {

            }
        }
    }
</script>

<style>
    .el-rate__icon {
        width: 12px;
        height: 12px;
        margin-right: 3px;
    }
</style>
<style scoped lang="scss">
 .card-wrapper {
     width: 373px;
     height: 213px;
     padding: 20px;
     background: #F7F7F7;
     border-radius: 8px;
     cursor: pointer;

     .card-title {
         margin-bottom: 8px;

         h3 {
             font-family: PingFang SC;
             font-style: normal;
             font-weight: 600;
             font-size: 18px;
             line-height: 20px;
             color: rgba(0, 0, 0, 0.9);
             margin-bottom: 0;
         }

         .card-star {
             width: 12px;
             height: 12px;
             margin-right: 3px
         }
     }

     .card-tip {
         display: inline-block;
         width: 45px;
         height: 18px;
         line-height: 18px;
         text-align: center;
         background: rgba(237, 237, 237, 0.8);
         border-radius: 2px;
         margin-right: 10px;
         font-family: PingFang SC;
         font-style: normal;
         font-weight: normal;
         font-size: 11px;
         color: rgba(0, 0, 0, 0.5);
     }

     .card-description {
         font-family: PingFang SC;
         font-style: normal;
         font-weight: normal;
         font-size: 12px;
         line-height: 17px;
         min-height: 34px;
         margin-bottom: 8px;
         overflow: hidden;
         display: -webkit-box;
         -webkit-box-orient: vertical;
         -webkit-line-clamp: 2;
     }

     .card-bottom {
         display: flex;
         justify-content: space-between;
         margin-top: 22px;
         height: 40px;
         line-height: 40px;
         font-family: PingFang SC;
         font-style: normal;
         font-weight: normal;

         .card-principals {
             margin-right: 5px;
         }

         .card-btn {
             font-size: 12px;
             color: rgba(0, 0, 0, 0.5);
         }

         .card-btn:hover {
             color: #76CFEA;
         }
     }
 }

 .card-wrapper:hover {
     background: #EDEFF7;
 }
</style>