<template>
	<el-dialog
		:visible="true"
		top="25vh"
		:close-on-press-escape="false"
		:close-on-click-modal="false"
		:showClose="false"
		custom-class="dialogMy"
	>
		<div class="dialog-close" @click="isShowFuc">
			<img src="~@a/icon-close.png"/>
		</div>
		<div class="dialog-top">
			<img :src="item.icon" />
			{{ item.title }}
		</div>
		<div class="dialog-con">
			<div class="con-half">
				<div class="con-div" v-if="item.core_func.length > 0">
					<div class="title">产品核心功能</div>
					<div class="con-li little" v-for="(sub, index) in item.core_func" :key="index">
						<span></span> {{ sub }}
					</div>
				</div>
				<div class="con-div" v-if="item.product_update.length > 0">
					<div class="title">产品最近更新</div>
					<div class="con-li" v-for="(sub, index) in item.product_update" :key="index">
						{{ sub }}
					</div>
				</div>
			</div>
			<div class="con-half">
				<div class="con-div" v-if="item.producter != ''">
					<div class="title">产品联系人</div>
					<div class="con-li">{{ item.producter }}</div>
				</div>
				<div class="con-div" v-if="item.permission_apply.length > 0">
					<div class="title">权限申请</div>
					<div class="con-li" v-for="(sub, index) in item.permission_apply" :key="index">
						{{ sub }}
					</div>
				</div>
			</div>
		</div>
		<div class="dialog-bottom">
			<div class="bottom-con" v-if="item.site_url != ''">
				<div class="con-title">在线网址</div>
				<div class="con-right">
					<a class="con-href" :href="item.site_url" target="_blank">
						{{ item.site_url}}
					</a>
					<div class="con-msg">*请使用Chrome浏览器打开</div>
				</div>
			</div>
			<div class="flex-con" v-else>
				<div class="flex-title">下载方式</div>
				<div v-for="(button, index) in item.buttonGroups" :key="index">
					<a v-if="button.downloadType === 'url'"
						class="flex-button"
						:href="button.url"
						target="_blank">
						{{ button.name }}
					</a>
					<el-tooltip v-else popper-class="tipwarp" placement="top">
						<div class="tipcss" slot="content">
							<div class="tipmsg">手机扫描下方二维码下载</div>
							<div class="tipcode">
								<img :src="button.url" />
							</div>
						</div>
						<div class="flex-button">{{ button.name }}</div>
					</el-tooltip>
				</div>
			</div>
		</div>
	</el-dialog>
</template>

<script>
export default {
  props: {
    isShowFuc: {
      type: Function,
      default: () => {}
    },
    item: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {}
  },
  methods: {}
}
</script>

<style lang="scss">
.el-popup-parent--hidden > .tipwarp {
	padding: 8px 0 16px 0;
	border-radius: 8px;
}
</style>


<style scoped lang="scss">
.tipcss {
	width: 164px;
}
.tipmsg {
	text-align: center;
	padding-bottom: 8px;
	color: #fff;
	font-size: 12px;
}
.tipcode {
	width: 132px;
	height: 132px;
	margin: 0 auto;
	background: #fff;
	overflow: hidden;
	img {
		width: 132px;
		height: 132px;
		display: block;
	}
}
::v-deep .dialogMy {
  width: 600px;
  .el-dialog__body {
    padding: 0;
  }
	.dialog-close {
		padding: 10px;
		position: absolute;
		top: 14px;
		right: 14px;
		cursor: pointer;
		img {
			width: 12px;
			height: 12px;
			opacity: 0.5;
		}
	}
  .dialog-top {
    padding: 0 0 16px 24px;
    height: 60px;
    overflow: hidden;
    font-weight: bold;
    font-size: 20px;
    line-height: 45px;
    color: rgba(0, 0, 0, 0.8);
    img {
		width: 58px;
		height: 58px;
		border-radius: 16px;
		border: 1px solid #f0f0f0;
		overflow: hidden;
		display: block;
		float: left;
		margin-right: 16px;
    }
  }
	.dialog-con::-webkit-scrollbar{
		display: none;
	}
  .dialog-con {
    overflow: hidden;
	height: 224px;
	padding: 20px 24px 10px 24px;
	overflow-y: auto;
	display: flex;
	justify-content: space-between;
	.con-half {
		width: 260px;
	}
	.con-li {
		font-size: 12px;
		line-height: 18px;
		color: rgba(0, 0, 0, 0.4);
		margin-top: 8px;
		span {
			position: absolute;
			display: block;
			border-radius: 50%;
			width: 4px;
			height: 4px;
			top: 7px;
			left: 0;
			background: rgba(0, 0, 0, 0.2);
		}
	}
	.con-li.little {
		overflow: hidden;
		position: relative;
		padding-left: 10px;
	}
	.title {
		font-size: 14px;
		font-weight: bold;
		line-height: 20px;
		color: rgba(0, 0, 0, 0.8);
	}
	.con-div {
		margin-bottom: 35px;
	}
	.con-div:last-child {
		margin: 0;
	}
  }
  .dialog-bottom {
    overflow: hidden;
		height: 80px;
		background: #fafafa;
		.bottom-con {
			overflow: hidden;
			.con-title {
				width: 80px;
				margin-right: 12px;
				margin-top: 20px;
				font-size: 14px;
				font-weight: bold;
				color: rgba(0, 0, 0, 0.8);
				text-align: right;
				float: left;
			}
			.con-right {
				float: left;
				margin-top: 20px;
			}
			.con-href {
				display: block;
				width: 490px;
				font-size: 14px;
				line-height: 20px;
				color: #2553c5;
				font-weight: bold;
				text-overflow: ellipsis;
				white-space: nowrap;
				overflow: hidden;
				text-decoration: none;
				cursor: pointer;
			}
			.con-msg {
				font-size: 12px;
				color: rgba(0, 0, 0, 0.4);
				line-height: 20px;
			}
		}
		.flex-con {
			display: flex;
			align-items: center;
			padding-left: 24px;
			height: 80px;
			.flex-title {
				font-size: 14px;
				font-weight: bold;
				color: rgba(0, 0, 0, 0.8);
			}
			.flex-button {
				display: block;
				background: #3159f6;
				border-radius: 8px;
				width: 112px;
				height: 36px;
				margin-left: 12px;
				text-align: center;
				line-height: 36px;
				cursor: pointer;
				font-size: 14px;
				color: #fff;
				font-weight: bold;
				text-decoration: none;
			}
			.flex-button:hover {
				background: #3385fe;
			}
			.flex-button:active {
				background: #294acc;
			}
		}
  }
}
</style>
