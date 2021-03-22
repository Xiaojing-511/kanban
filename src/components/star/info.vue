<template>
    <a-modal
            :visible="showInfo"
            :title="data.name"
            :centered="true"
            width="600px"
            :footer="null"
            @cancel="handleCloseInfo"
    >
        <span class="info-con">{{data.description}}</span>
        <h3 class="info-mile-tip">业务里程碑</h3>
        <div class="milestone-steps">
            <a-steps direction="vertical" size="small">
                <a-step v-for="(item, index) in data.mileStoneRes"  :status="initStatus(item)" :percent="60" :title="item.name" :sub-title="$moment(item.mileStoneDate).format('YYYY-MM-DD')" >
                    <div v-if="item.subMileStoneList" style="display: block" slot="description" v-for="val in initList(item.subMileStoneList)" :name="item.id" >
                        <img :class="[val.finish === 1 ? 'complete show' : 'complete']" class="" src="~@a/star-modal-complete.png" />
                        {{val.name}}{{val.description ? `: ${val.description}` : null}}
                    </div>
                </a-step>
            </a-steps>
        </div>
    </a-modal>
</template>

<script>
    export default {
        name: "info",
        props: {
            data: {
                type: Object,
                default: () => {}
            }
        },
        data() {
            return {
                active: 0,
                showInfo: false,
                customColors: [
                    {color: '#f56c6c', percentage: 20},
                    {color: '#e6a23c', percentage: 40},
                    {color: '#5cb87a', percentage: 60},
                    {color: '#1989fa', percentage: 80},
                    {color: '#6f7ad3', percentage: 100}
                ]
            }
        },
        mounted() {
        },
        methods: {
            //待父组件掉用
            showStarDraawer() {
                this.showInfo = true
            },
            //关闭弹窗时重置里程碑tab的index
            handleCloseInfo() {
                this.active = 0
                this.showInfo = false
            },
            activeStep(index) {
                this.active = index
            },
            format(data) {
                return () => {
                    return `${data}%`
                }
            },
            initStatus(data) {
                let flag = -1
                if (data.subMileStoneList.length > 0) {
                    if (this.$_.find(data.subMileStoneList, v => v.finish === 1)) {
                        flag = 0
                    }
                    if (this.$_.every(data.subMileStoneList, v => v.finish === 1)) {
                        flag = 1
                    }
                }
                else {
                    data.isFinish === 1 ? flag = 1 : -1
                }
                return flag === -1 ? 'wait' : flag === 0 ? 'process' : 'finish'
            },
            //将子里程碑按是否完成排序
            initList(list) {
                let arr = this.$_.sortBy(list, v => -v.finish)
                return arr
            }
        }
    }
</script>

<style>
    .ant-modal {
        padding-bottom: 0 !important;
    }

    .ant-modal-title {
        font-weight: 600;
        color: rgba(0, 0, 0, 0.9);;
    }

    .ant-modal-body {
        height: auto;
    }
    .ant-steps-item-title {
        width: 100%;
        font-family: PingFang SC;
        font-style: normal;
        font-weight: normal;
        font-size: 16px !important;
        line-height: 24px;
        color: rgba(0, 0, 0, 0.9) !important;
    }
    .ant-steps-item-subtitle {
        float: right;
        font-family: PingFang SC;
        font-style: normal;
        font-weight: normal;
        font-size: 12px !important;
        line-height: 24px;
        color: rgba(0, 0, 0, 0.7);
    }
    .ant-steps-item-description {
        font-family: PingFang SC;
        font-style: normal;
        font-weight: normal;
        font-size: 12px !important;
        line-height: 22px;
        color: rgba(0, 0, 0, 0.9) !important;
    }

    .ant-steps-item-finish .ant-steps-item-icon {
        /*background-color: #36B8E0 !important;*/
        border-color: #36B8E0 !important;
    }

    .ant-steps-item-finish .ant-steps-item-icon > .ant-steps-icon {
        color: #36B8E0 !important;
    }

    .ant-steps-item-process .ant-steps-item-icon {
        background-color: #36B8E0 !important;
        border-color: #36B8E0 !important;
    }
    .ant-steps-item-finish > .ant-steps-item-container > .ant-steps-item-tail::after {
        background-color: #36B8E0 !important;
    }
</style>
<style scoped lang="scss">
    .info-con {
        font-family: PingFang SC;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 20px;
        color: rgba(0, 0, 0, 0.9);
        /*min-height: 40px;*/
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
    }

    .info-mile-tip {
        font-family: PingFang SC;
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        line-height: 20px;
        color: rgba(0, 0, 0, 0.9);
        margin-top: 24px;
        margin-bottom: 0;
    }

    .milestone-steps {
        max-height: calc(100vh - 378px);
        margin-top: 24px;
        overflow-x: hidden;
        overflow-y: auto;
    }

    .milestone-steps::-webkit-scrollbar {
        display: none;
    }

    .complete {
        visibility: hidden;
        width: 9px;
        height: 7px;
    }

    .show {
        visibility: visible;
    }
</style>
