<template>
    <a-drawer
        class="myAgents"
        :visible="showAgents"
        title="我的代办"
        :keyboard="true"
        @close="closeAgents"
    >
        <a-list v-if="!$_.isEmpty(agents)" item-layout="horizontal" :data-source="agents">
            <a-list-item @click="toEdit(item.id)" class="list-item" slot="renderItem" slot-scope="item">
                {{item.upComing}}
                <img class="nav-logo" src="~@a/myAgents-right.png" />
            </a-list-item>
        </a-list>
        <a-empty v-else description="您已完成所有待办" />
    </a-drawer>
</template>

<script>
    import {mapActions, mapState} from "vuex";
    export default {
        name: "myAgents",
        data() {
            return {
                activeList: [],
                showAgents: false
            }
        },
        props: {
            agents: {
                type: Array,
                default: () => []
            }
        },
        created() {},
        methods: {
            //父组件调用
            showAgentsDrawer() {
                this.showAgents = true
            },
            closeAgents() {
                this.showAgents = false
            },
            toEdit(id) {
                this.$router.push(`/demand/demandEdit/edit/${id}`)
            }
        }
    }
</script>

<style>
    .ant-drawer-content-wrapper {
        width: 520px !important;
    }
    .ant-drawer-body {
        padding: 0;
        max-height: calc(100vh - 55px);
        overflow-y: auto;
    }
    .ant-drawer-body::-webkit-scrollbar{
        display: none;
    }
</style>
<style scoped lang="scss">
    .list-item {
        padding: 12px 24px;
        display: flex;
        justify-content: space-between;
        font-family: PingFang SC;
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.85);
        cursor: pointer;
    }
    .ant-list-split .ant-list-item {
        border-bottom: 0.5px solid rgba(0, 0, 0, 0.1);
    }
    .ant-empty {
        margin-top: calc((100vh - 185px)/2)
    }
</style>