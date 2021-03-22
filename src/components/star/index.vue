<template>
    <div style="padding-top: 88px">
        <div class="menu">
            <div class="menu-con">
                <div
                    :class="[active == index ? 'navli active' : 'navli']"
                    v-for="(item, index) in data"
                    :key="index"
                    @click="clickTab(index)"
                >
                    {{item.name}}
                </div>
            </div>
        </div>
        <div ref="star_wrapper" class="part-wrapper">
            <div class="part" v-for="(item, key) in data" :key="key" :id="'star' + key">
                <div class="part-title">{{ item.name}}</div>
                <div class="part-ul">
                    <div
                            class="part-li"
                            v-for="(sub, key) in item.omoKanBanDtoList"
                            :key="key"
                            @click="openInfo(sub)"
                    >
                        <card :item="sub"/>
                    </div>
                </div>
            </div>
        </div>
        <info ref="starInfo" :data="infoItem" />
    </div>
</template>

<script>
    import Card from "./card";
    import Info from "./info"
    import { getStarList } from "@/api/communication"

    export default {
        name: "index",
        components: {Card, Info},
        data() {
            return {
                active: 0,
                data: [],
                isShow: false,
                infoItem: {}
            }
        },
        created() {
            getStarList().then(res => {
                this.data = res.data
            })
        },
        mounted() {
            //scoll滚动事件监听
            window.addEventListener("scroll", this.handleScroll);
        },
        destroyed() {
          window.removeEventListener('scroll', this.handleScroll)
        },
        methods: {
            clickTab(index) {
                if (index === this.active) {
                    return
                }
                let scrollElement = window || document.documentElement || document.body
                let _article = document.querySelectorAll(".part")
                let h = 0
                _article.forEach((v, k) => {
                    if (k < index) {
                        h += v.offsetHeight + 24
                    }
                })
                scrollElement.scrollTo({
                    left: 0,
                    top: h,
                    behavior: "smooth"
                })
            },
            handleScroll() {
                let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
                let _article = document.querySelectorAll(".part")
                if(scrollTop <= (_article[0].offsetTop - 168)){
                    this.active = 0
                }
                _article.forEach((item, index) => {
                    if (scrollTop >= (item.offsetTop - 168)) {
                        this.active = index
                    }
                })
            },
            // 打开弹窗
            openInfo(sub) {
                this.infoItem = sub
                this.$refs.starInfo.showStarDraawer()
            },
        }
    }
</script>

<style scoped lang="scss">
    .menu {
        min-width: 1240px;
        padding: 24px 0;
        margin: 0 auto;
        position: fixed;
        top: 80px;
        left: 0;
        right: 0;
        background: #f8f9fa;
        z-index: 99;

        .menu-con {
            margin: 0 3px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
        }

        .navli {
            margin: 0 20px;
            padding: 0 15px;
            height: 40px;
            line-height: 40px;
            font-size: 14px;
            font-weight: bold;
            color: rgba(0, 0, 0, 0.4);
        }

        .navli:hover {
            color: #36B8E0;
        }

        .active {
            background: #fff;
            border-radius: 8px;
            color: #36B8E0;
        }
    }

    .part-wrapper {
        animation: show 1.2s;
    }

    .part-wrapper::-webkit-scrollbar {
        display: none;
    }

    .part {
        width: 1240px;
        height: auto;
        margin: 0 auto 24px auto;
        background: #fff;
        border-radius: 8px;
        padding: 0 24px 12px 24px;

        .part-title {
            padding-left: 12px;
            height: 60px;
            font-weight: bold;
            line-height: 60px;
        }

        .part-ul {
            overflow: hidden;
        }

        .part-li {
            display: block;
            float: left;
            margin: 0 12px 20px 12px;
        }
    }
</style>