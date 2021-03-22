<template>
    <div class="crumbs">
        <label v-for="(item, index) in data" :key='index' >
            <span v-if="index === data.length-1">{{item.text}}</span>
            <span v-else>
                <span class="active" @click="to(item.url)">{{item.text}}</span>
                <span class="crumbs-divider">/</span>
            </span>
        </label>
    </div>
</template>

<script>
    export default {
        name: "demandCrumbs",
        props: {
            data: {
                type: Array,
                default: () => []
            },
        },
        methods: {
            to(path) {
                this.$router.push(path)
            }
        }
    }
</script>

<style scoped lang="scss">
    .crumbs {
        margin: 16px 0;

        .crumbs-divider {
            font-size: 16px;
            margin: 0 5px;
        }

        .active {
            color: rgba(0, 0, 0, 0.5);
            cursor: pointer;
        }
    }
</style>