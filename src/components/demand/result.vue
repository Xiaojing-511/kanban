<template>
    <a-result
            class="result"
            status="success"
            :title="'您已完成' + type + '的填写'"
    >
        <template #extra>
            <a-button @click="toEdit" v-if="identity == 1 && currentProgress == -1" type="primary">
                填写需求反馈
            </a-button>
            <a-button @click="toDemand" v-if="identity != 1 || (currentProgress > -1 && identity == 1)" type="primary">
                返回需求全景
            </a-button>
            <a-button @click="toDemand" v-else>
                返回需求全景
            </a-button>
        </template>
    </a-result>
</template>

<script>
    export default {
        name: "result",
        props: {
            type: {
                type: String,
                default: () => ''
            },
            identity: {
                type: Number,
                default: () => 1
            },
            currentProgress: {
                type: Number,
                default: () => -1
            },
            toEdit: {
                type: Function,
                default: () => {}
            }
        },
        methods: {
            toDemand() {
                this.$router.push('/demand')
            }
        }
    }
</script>

<style scoped lang="scss">
    .result {
        background: #FFFFFF;
        border-radius: 8px;
        margin-bottom: 24px;
    }
</style>