<template>
    <div class="demand-form">
        <demand-crumbs :data="crumbsData"/>
        <!--    需求反馈页-->
        <div v-if="isFeedBack === true" class="demand-feedback">
            <div class="demand-tip">
                需求反馈
                <span>（此部分请产品经理填写，请务必对上述需求背景做充分的分析与思考）</span>
            </div>
            <a-steps class="step" v-model="currentStep">
                <a-step :status="index === currentStep ? 'process' : index < currentProgress ? 'finish' : 'wait'" :disabled="index > currentProgress"  v-for="(item, index) in progressData" :key="item.rank" :title="item.name"/>
            </a-steps>
            <a-form v-bind="{labelCol: {span: 5}, wrapperCol: {span: 14}}" style="padding: 0 200px"
                    v-if="currentStep < 4" v-for="(item, index) in progressData" :form="item" ref="agentsForm" class="agentsForm">
                <template v-if="currentStep === index" class="step-status">
                    <a-form-item v-if="currentStep === 0 || currentStep === 2 || currentStep === 3" :label="currentRadioCon[currentStep]" prop="radio">
                        <a-radio-group :disabled="feedBackDisabled" v-model="radioVal">
                            <a-radio v-if="currentStep === 0"  value="待处理">
                                已接待排期
                            </a-radio>
                            <a-radio v-if="currentStep === 0" value="有存疑">
                                需求存疑挂起待定
                            </a-radio>
                            <a-radio v-if="currentStep === 2" value="开发中">
                                是
                            </a-radio>
                            <a-radio v-if="currentStep === 3" value="已上线">
                                是
                            </a-radio>
                        </a-radio-group>
                    </a-form-item>
                </template>
                <template class="steps-content"
                     v-if="currentStep === index"
                     v-for="(v, k) in  $_.find(item['stages'], e => e.name == radioVal) ? $_.find(item['stages'], e => e.name == radioVal)['fields'] : []"
                >
                    <a-form-item v-if="v.style === 'input'" :label="`${v.key}:`" prop="input">
                        <a-input v-if="!feedBackDisabled" v-model="v.actualValue" :placeholder="v.defaults">
                            <span slot="suffix">{{v.actualValue ? v.actualValue.length : 0}}/{{v.length}}</span>
                        </a-input>
                        <div class="disabled" v-else>{{v.actualValue}}</div>
                    </a-form-item>
                    <a-form-item v-if="v.style === 'inputNumber'" :label="`${v.key}:`" prop="inputNumber">
                        <a-input-number v-if="!feedBackDisabled" v-model="v.actualValue" :min="0" />
                        <span class="disabled" v-else>{{v.actualValue}}</span>
                        <span style="color: rgba(0, 0, 0, 0.7); margin-left: 8px;">{{v.defaults}}</span>
                    </a-form-item>
                    <a-form-item v-if="v.style === 'textarea'" :label="`${v.key}:`" prop="textarea">
                        <a-textarea style="min-height: 106px;" v-if="!feedBackDisabled" v-model="v.actualValue" :placeholder="v.defaults"
                                  :maxLength="v.length" >
                        </a-textarea>
                        <div class="disabled" v-else>{{v.actualValue}}</div>
                        <span v-if="!feedBackDisabled" class="textarea-suffix">{{v.actualValue ? v.actualValue.length : 0}}/{{v.length}}</span>
                    </a-form-item>
                    <a-form-item v-if="v.style === 'select'" :label="`${v.key}:`" prop="select">
                        <a-select v-if="!feedBackDisabled" style="width: 350px;" v-model="v.actualValue" :placeholder="v.defaults" allowClear>
                            <a-select-option v-for="option in v.option" :value="option">{{option}}</a-select-option>
                        </a-select>
                        <div class="disabled" v-else>{{v.actualValue}}</div>
                    </a-form-item>
                    <a-form-item v-if="v.style === 'date'" :label="`${v.key}:`" prop="date">
                        <a-date-picker v-if="!feedBackDisabled" style="width: 350px" type="date"
                             :placeholder="v.defaults" v-model="v.actualValue" :format="'YYYY年MM月DD日'" :showToday="false"></a-date-picker>
                        <div class="disabled" v-else>{{v.actualValue}}</div>
                    </a-form-item>
                </template>
                <div v-if="currentStep === index" style="margin-left: 160px">
                    <a-button v-if="feedBackDisabled" @click="editFeedBack" >编辑</a-button>
                    <a-button v-else :disabled="isFeedBackDisabled(item)" @click="submit2(item)" type="primary" >{{radioVal !== '有存疑' ? '完成并继续' : '完成'}}</a-button>
                </div>
            </a-form>
            <a-form v-bind="{labelCol: {span: 5}, wrapperCol: {span: 14}}" style="padding: 0 200px"  v-if="currentStep === 4"
                    :model="effectForm" class="effectForm">
                <a-form-item label="背景与目标:" prop="textarea">
                    <a-textarea style="min-height: 64px" v-if="!effectDisabled" v-model="effectForm.backGroundAim" placeholder="请详细描述需求背景和详细量化指标"
                             :maxLength="300">
                    </a-textarea>
                    <div class="disabled" v-else>{{effectForm.backGroundAim}}</div>
                    <span v-if="!effectDisabled" class="textarea-suffix">{{effectForm.backGroundAim.length}}/{{300}}</span>
                </a-form-item>
                <a-form-item label="上线后效果评估:" prop="textarea">
                    <a-textarea style="min-height: 64px;" v-if="!effectDisabled" v-model="effectForm.effectEvaluation" placeholder="请从客观数据表现和主观体验或评价角度进行评估"
                             :maxLength="500">
                    </a-textarea>
                    <div class="disabled" v-else>{{effectForm.effectEvaluation}}</div>
                    <span v-if="!effectDisabled" class="textarea-suffix">{{effectForm.effectEvaluation.length}}/{{500}}</span>
                </a-form-item>
                <a-form-item label="" prop="upload">
                    <a-upload
                            style="width: 350px; margin-left: 160px;"
                            class="upload"
                            accept=".pdf"
                            action="/api/file/upload"
                            :beforeUpload="beforeUpload"
                            :file-list="effectForm.url"
                            @preview="handlePreview"
                            @change="handleChange"
                            :disabled="effectDisabled"
                    >
                        <a-button :disabled="effectDisabled" icon="upload">上传文件</a-button>
                        <div style="margin-top: 8px; line-height: 22px">支持扩展名：.pdf文件 且最多3个</div>
                    </a-upload>
                </a-form-item>
                <div style="margin-left: 160px">
                    <a-button v-if="effectDisabled" @click="editEffect" >编辑</a-button>
                    <a-button v-else :disabled="$_.isEmpty(effectForm.backGroundAim) || $_.isEmpty(effectForm.effectEvaluation) || $_.isEmpty(effectUrl)" @click="submit3" type="primary" >完成</a-button>
                </div>
            </a-form>
        </div>

        <!--    结果页-->
        <result v-if="isResult === true" :type="typeCon" :identity="identity" :toEdit="toEdit" :currentProgress="currentProgress"/>

        <!--    需求描述页-->
        <div v-if="isDescription === true" class="demand-descritpion">
            <div class="demand-tip">
                需求描述
                <span v-if="identity == 1">（请对“需求名称-需求对接人”部分进行填写，然后邀请业务老师完善需求详情）</span>
                <span v-else>（此部分邀请业务老师填写，请务必对加*部分进行认真思考与填写）</span>
            </div>
            <a-form v-bind="{labelCol: {span: 4}, wrapperCol: {span: 14}}" :form="demandForm" ref="demandForm" style="padding-left: 200px" class="demandForm">
              <a-form-item label="需求名称:" prop="cardName">
                  <a-input v-if="isDisable === false" style="width: 600px;" v-model="demandForm.cardName" placeholder="请直白概括" :maxLength="20">
                      <span slot="suffix">{{demandForm.cardName.length}}/{{20}}</span>
                  </a-input>
                  <div class="disabled" v-else>{{demandForm.cardName}}</div>
              </a-form-item>
              <a-form-item label="提需人所属部门:" prop="businessSide">
                  <a-select v-if="isDisable === false" style="width: 224px;" v-model="demandForm.businessSide" placeholder="请选择提需业务方" :defaultActiveFirstOption="false" showSearch allowClear>
                      <template v-for="group in businessSide">
                          <a-select-opt-group
                                  v-if="group.level != '总部'"
                                  :key="group.level"
                                  :label="group.level"
                          >
                              <a-select-option
                                      v-for="item in group.cityList"
                                      :key="item.id"
                                      :value="item.id"
                              >
                                  {{item.name}}
                              </a-select-option>
                          </a-select-opt-group>
                          <a-select-option style="padding-left: 19px" :key="group.cityList[0].id" :value="group.cityList[0].id" v-else>{{group.cityList[0].name}}</a-select-option>
                      </template>
                  </a-select>
                  <span class="disabled" v-else>{{demandForm.businessSide}}</span>
                  <a-input v-if="isDisable === false" style="width: 376px;" v-model="demandForm.businessSideAdd" placeholder="您是代表什么组织/项目进行提需？" :maxLength="20">
                      <span slot="suffix">{{demandForm.businessSideAdd.length}}/{{20}}</span>
                  </a-input>
                  <span style="margin-left: 10px" class="disabled" v-else>{{demandForm.businessSideAdd}}</span>
              </a-form-item>
              <a-form-item label="提需代表人:" prop="requester">
                  <a-select v-if="isDisable === false" style="width: 600px;" v-model="demandForm.requester" mode="multiple"  @search="searchRequester"
                            optionFilterProp="children" placeholder="请填写需求方的对接人">
                      <a-select-option v-for="v in requesterList" :key="v.workcode" :value="v.workcode" >{{`${v.name} ${v.workcode}`}}</a-select-option>
                  </a-select>
                  <span class="disabled" v-for="(v, a) in requesterList" v-else>{{a != requesterList.length - 1 ? `${v.name}、` : v.name}}</span>
              </a-form-item>
              <a-form-item label="对接产品经理:" prop="dockingPM">
                  <a-select v-if="isDisable === false" style="width: 600px;" v-model="demandForm.dockingPM" mode="multiple"  @search="searchDockingPM"
                            optionFilterProp="children"  placeholder="哪位产品经理在对接这个需求">
                      <a-select-option v-for="v in dockingPMList" :value="v.workcode" :key="v.workcode" >{{`${v.name} ${v.workcode}`}}</a-select-option>
                  </a-select>
                  <span class="disabled" v-for="(v, b) in dockingPMList" v-else>{{b != dockingPMList.length - 1 ? `${v.name}、` : v.name}}</span>
              </a-form-item>
              <a-form-item prop="solveUserProblem" >
                  <template slot="label"><span style="color: #E02727;">*</span>背景与目标</template>
                  <a-textarea v-if="isDisable === false" style="width: 600px; min-height: 64px;" v-model="demandForm.solveUserProblem"
                            placeholder="请填写这个需求如果实现，对用户的价值是什么？" :maxLength="300">
                  </a-textarea>
                  <div style="min-height: 64px;" class="disabled" v-else>{{demandForm.solveUserProblem}}</div>
                  <span v-if="isDisable === false" class="textarea-suffix">{{demandForm.solveUserProblem.length}}/{{300}}</span>
              </a-form-item>
              <a-form-item prop="solveBusProblem">
                  <template slot="label"><span style="color: #E02727;">*</span>解决业务什么问题</template>
                  <a-textarea v-if="isDisable === false" style="width: 600px; min-height: 64px;" v-model="demandForm.solveBusProblem"
                            placeholder="请填写这个需求对业务或组织的价值是什么？" :maxLength="300">
                  </a-textarea>
                  <div style="min-height: 64px;" class="disabled" v-else>{{demandForm.solveBusProblem}}</div>
                  <span v-if="isDisable === false" class="textarea-suffix">{{demandForm.solveBusProblem.length}}/{{300}}</span>
              </a-form-item>
              <a-form-item prop="effectMethod">
                  <template slot="label"><span style="color: #E02727;">*</span>如何评估效果</template>
                  <a-textarea v-if="isDisable === false" style="width: 600px; min-height: 64px;" v-model="demandForm.effectMethod"
                            placeholder="请填写如果需求实现，通过什么数据 或 其他方式考量效果，效果目标是什么？" :maxLength="300">
                  </a-textarea>
                  <div style="min-height: 64px;" class="disabled" v-else>{{demandForm.effectMethod}}</div>
                  <span v-if="isDisable === false" class="textarea-suffix">{{demandForm.effectMethod.length}}/{{300}}</span>
              </a-form-item>
              <a-form-item prop="alterNatives">
                  <template slot="label"><span style="color: #E02727;">*</span>如果没有这个功能打算怎么做</template>
                  <a-textarea v-if="isDisable === false" style="width: 600px; min-height: 64px;" v-model="demandForm.alterNatives"
                            placeholder="可以填写当下已有的非技术化解决手段" :maxLength="300">
                  </a-textarea>
                  <div style="min-height: 64px;" class="disabled" v-else>{{demandForm.alterNatives}}</div>
                  <span v-if="isDisable === false" class="textarea-suffix">{{demandForm.alterNatives.length}}/{{300}}</span>
              </a-form-item>
              <a-form-item style="padding-left: 160px">
                  <div v-if="isDisable === false">
                      <a-button v-if="identity == 1 && currentProgress < 0" :disabled="$_.isEmpty(demandForm.cardName)
                  ||  $_.isEmpty(demandForm.businessSide) ||  $_.isEmpty(demandForm.businessSideAdd)
                  ||  $_.isEmpty(demandForm.requester) ||  $_.isEmpty(demandForm.dockingPM)
                  ? true : false" type="primary" style="margin-right: 14px" @click="save">邀请提需代表人完善</a-button>
                      <a-button v-if="isDisable === false" :disabled="$_.isEmpty(demandForm.solveUserProblem)
                  || $_.isEmpty(demandForm.effectMethod) || $_.isEmpty(demandForm.alterNatives) || $_.isEmpty(demandForm.solveBusProblem)
                  || $_.isEmpty(demandForm.cardName) ||  $_.isEmpty(demandForm.businessSide) ||  $_.isEmpty(demandForm.businessSideAdd)
                  ||  $_.isEmpty(demandForm.requester) ||  $_.isEmpty(demandForm.dockingPM)
                  ? true : false" @click="submit">提交 </a-button>
                  </div>
                  <a-button v-else @click="editDescription">编辑</a-button>
                  <a-modal
                          v-model="inviteVisible"
                          title="邀请业务老师补充"
                          :centered="true"
                          okText="立即邀请"
                          cancelText="取消"
                          @ok="handleInvite"
                  >
                      <div class="invite-modal">
                          <div class="invite-modal-title">点击下方邀请按钮，请<span v-for="(v, k) in demandForm.requester">{{k !== demandForm.requester.length - 1 ? `${v.name}、` : v.name}}</span>针对以下4个问题进行填写或补充：
                          </div>
                          <p>1. 解决用户什么问题？</p>
                          <p>2. 解决业务什么问题？</p>
                          <p>3. 如何评估效果？</p>
                          <p>4. 如果没有这个功能，打算怎么做？</p>
                      </div>
                  </a-modal>
              </a-form-item>
            </a-form>
        </div>
    </div>
</template>

<script>
    import DemandCrumbs from './demandCrumbs'
    import Result from './result'
    import { searchUser, createDemand, getEditdemand, editDemandDescription,
        editDemandFeedBack, getEffect, createEffect, editEffect, getBusinessSide
    } from "../../api/communication";
    import {mapActions} from "vuex";

    export default {
        name: "demand",
        components: {
            DemandCrumbs,
            Result
        },
        data() {
            return {
                user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : '',
                demandForm: {
                    cardName: '',
                    businessSide: undefined,
                    businessSideAdd: '',
                    requester: [],
                    dockingPM: [],
                    solveUserProblem: '',
                    effectMethod: '',
                    alterNatives: '',
                    solveBusProblem: '',
                },
                effectForm: {
                    backGroundAim: '',
                    effectEvaluation: '',
                    url: []
                },
                effectUrl: [],
                progressData: [],
                currentProgress: -1,
                currentStep: 0,
                currentRadioCon: ["需求接待状态", "", "是否已进入研发", "是否已上线", ""],
                radioKey: ["cardReceptionStatus", "", "isDev", "isOnline", ""],
                radioVal: '',
                demandId: '',
                crumbsData: [
                    {url: '/demand', text: '需求全景'},
                    {url: '', text: this.$route.params.type === 'create' ? '新建需求' : '编辑需求'},
                ],
                typeCon: '需求描述',
                identity: 1, //1:产品   2:业务
                isEdit: false, //是否是新建需求
                isResult: false, //是否展示结果页
                isDescription: true, //是否展示需求描述页
                isFeedBack: false, //是否展示需求反馈页
                inviteVisible: false, //邀请弹窗
                submitVisible: false, //提交需求弹窗
                requesterList: [],
                dockingPMList: [],
                isDisable: false,
                feedBackDisabled: false,
                effectDisabled: false,
                isEffect: false,
                effectId: '',
                effectCount: 0,
                demandCount: 0,
                progressCount: 0,
                businessSide: [],
            }
        },
        watch: {
              currentStep (newVal) {
                  if (newVal == 4) { //效果通晒
                      this.effectDisabled = this.isEffect
                  }
                  else if (newVal < this.currentProgress) {
                      this.feedBackDisabled = true
                  }
                  else {
                      this.feedBackDisabled = false
                  }
                  if (newVal < 4 && this.progressData[newVal]) {
                      let data = this.progressData[newVal].stages
                      this.radioVal = this.$_.find(data, v => v.choose === true).name
                  }
              },
              effectForm: {
                  handler(newVal) {
                      if (newVal) {
                          this.effectCount ++
                      }
                  },
                  deep: true
              },
            demandForm: {
                handler(newVal) {
                    if (newVal) {
                        this.demandCount ++
                    }
                },
                deep: true
            },
            progressData: {
                handler(newVal) {
                    if (newVal) {
                        this.progressCount ++
                    }
                },
                deep: true
            },
        },
        created() {
            this.effectCount = 0;
            this.demandCount = 0;
            this.progressCount = 0;
            if (this.$route.params.type === 'create') {
                let userCode = JSON.parse(localStorage.getItem('user'))['workCode']
                this.isEdit = false
                //对接产品经理一栏默认填入创建者
                if (userCode) {
                    searchUser(userCode).then(res => {
                        if (!this.$_.isEmpty(res.data)) {
                            this.dockingPMList = this.dockingPMList.concat(res.data)
                            this.demandForm.dockingPM = this.demandForm.dockingPM.concat(res.data[0].workcode)
                        }
                    })
                }
            }
            else if (this.$route.params.type === 'edit') {
                this.isEdit = true
                this.getDemandFeedBackData()
                this.getDemandEffectData()
            }
            else {
                this.$router.push('/demand')
            }
            getBusinessSide().then(res => {
                if (res.code === 200) {
                    this.businessSide = res.data
                }
            })
        },
        beforeRouteLeave (to, from, next) {
            if (this.effectCount > 1 || this.demandCount > 1 || this.progressCount > 1) {
                this.$confirm({
                    title: `返回后已填写内容将不做保存，确认返回?`,
                    okText: '确认',
                    cancelText: '取消',
                    centered: true,
                    onOk: () => {
                        next()
                    },
                    onCancel: () => {
                        this.setCurrentRouter(from.fullPath)
                        next(false)
                    }
                })
            } else {
                next()
            }
        },
        methods: {
            ...mapActions([
                "setCurrentRouter"
            ]),
            //打开邀请提示弹窗
            save() {
                this.inviteVisible = true
            },
            //获取需求反馈数据
            getDemandFeedBackData() {
                let id = this.$route.params.id
                getEditdemand(id).then(res => {
                    if (res.code === 200) {
                        const {id, cardName, businessSide, businessSideAdd, requester, dockingPM,
                            solveUserProblem, effectMethod, alterNatives, solveBusProblem
                        } = res.data
                        this.demandForm = {
                            cardName,
                            businessSide,
                            businessSideAdd,
                            requester: this.splitData(requester),
                            dockingPM: this.splitData(dockingPM),
                            solveUserProblem,
                            effectMethod,
                            alterNatives,
                            solveBusProblem,
                        },
                        this.demandId = id
                        this.requesterList = requester
                        this.dockingPMList = dockingPM
                        requester.forEach((v, k) => {
                            if (v.workcode === this.user.workCode) {
                                this.identity = 2
                            }
                        })
                        if (res.data.currentProgress > 0) {
                            this.isFeedBack = true
                            this.isDisable = true
                            this.currentProgress = res.data.currentProgress - 1
                            this.currentStep = res.data.currentProgress - 1
                            this.progressData = res.data.progresses
                            if (res.data.currentProgress < 5) {
                                this.radioVal = this.$_.find(res.data.progresses[res.data.currentProgress - 1]['stages'], v => v.choose === true)
                                    ? this.$_.find(res.data.progresses[res.data.currentProgress - 1]['stages'], v => v.choose === true).name
                                    : ''
                            }
                        }
                        else {
                            this.isFeedBack = false
                            this.isDisable = false
                        }
                    }
                })
            },
            //获取效果通晒数据
            getDemandEffectData() {
                let id = this.$route.params.id
                getEffect(id).then(res => {
                    if (res.data !== null) {
                        let list = []
                        res.data.url.map((v, k) => {
                           list.push({
                               uid: k,
                               name: v.name,
                               url: v.url
                           })
                        })
                        this.effectForm = {
                            backGroundAim: res.data.backGroundAim,
                            effectEvaluation: res.data.effectEvaluation,
                            url: list
                        }
                        this.effectUrl = res.data.url
                        this.effectId = res.data.id
                        this.isEffect = true
                        this.effectDisabled = true
                    }
                    else {
                        this.isEffect = false
                        this.effectDisabled = false
                    }
                })
            },
            //保存并邀请业务老师填写
            handleInvite() {
                let body = this.$_.cloneDeep(this.demandForm)
                body.type = 0
                body.requester = this.splicingData(this.requesterList, this.demandForm.requester)
                body.dockingPM = this.splicingData(this.dockingPMList, this.demandForm.dockingPM)
                if (this.isEdit) {
                    body.id = this.demandId
                    //编辑需求描述
                    editDemandDescription(body).then(res => {
                        if (res.code === 200) {
                            this.inviteVisible = false
                            this.$message.success('邀请已发送')
                        }
                    })
                }
                else {
                    createDemand(body).then(res => {
                        if (res.code === 200) {
                            this.$router.push(`/demand/demandEdit/edit/${res.data}`)
                            this.inviteVisible = false
                            this.$message.success('邀请已发送')
                            this.effectCount = 0;
                            this.demandCount = 0;
                            this.progressCount = 0;
                            this.crumbsData[1].text = '编辑需求'
                            this.isEdit = true
                        }
                    })
                }
            },
            //拆解数据
            splitData(list) {
                let ary = []
                list.forEach((v, k) => {
                    ary.push(v.workcode)
                })
                return ary
            },
            //组装数据
            splicingData(list, list2) {
                let ary = []
                list.forEach((v, k) => {
                    if (this.$_.find(list2, e => e == v.workcode)) {
                        ary.push({
                            name: v.name,
                            workcode: v.workcode
                        })
                    }
                })
                return ary
            },
            //搜索提需人
            searchRequester(value) {
              if (this.$_.isEmpty(value)) {
                return
              }
              searchUser(value).then(res => {
                if (!this.$_.isEmpty(res.data)) {
                  let list = this.$_.cloneDeep(this.requesterList)
                  res.data.forEach((v, k) => {
                        if (this.$_.every(list, a => a.workcode != v.workcode)) {
                          list.push(v)
                      }
                  })
                  this.requesterList = list
                }
              })
            },
            //搜索产品经理
            searchDockingPM(value) {
              if (this.$_.isEmpty(value)) {
                return
              }
              searchUser(value).then(res => {
                if (!this.$_.isEmpty(res.data)) {
                    let list = this.$_.cloneDeep(this.dockingPMList)
                    res.data.forEach((v, k) => {
                        if (this.$_.every(list, a => a.workcode != v.workcode)) {
                            list.push(v)
                        }
                    })
                    this.dockingPMList = list
                }
              })
            },
            //提交需求描述
            submit() {
                  if (this.currentProgress < 0) {
                      this.$confirm({
                          title: '提交后，仅产品经理可进行修改，业务老师无法修改，确认提交？',
                          okText: '确认',
                          cancelText: '取消',
                          centered: true,
                          onOk: () => {
                              let body = this.$_.cloneDeep(this.demandForm)
                              body.type = 1
                              body.requester = this.splicingData(this.requesterList, this.demandForm.requester)
                              body.dockingPM = this.splicingData(this.dockingPMList, this.demandForm.dockingPM)
                              if (this.isEdit) {
                                  body.id = this.$route.params.id
                                  //编辑需求描述
                                  editDemandDescription(body).then(res => {
                                      if (res.code === 200) {
                                          this.isResult = true
                                          this.isDescription = false
                                          this.demandId = res.data.id
                                          this.isEdit = true
                                          res.data.requester.forEach((v, k) => {
                                              if (v.workcode === this.user.workCode) {
                                                  this.identity = 2
                                              }
                                              else {
                                                  this.identity = 1
                                              }
                                          })
                                      }
                                  })
                              }
                              else {
                                  createDemand(body).then(res => {
                                      if (res.code === 200) {
                                          this.isResult = true
                                          this.isDescription = false
                                          this.demandId = res.data
                                          this.isEdit = true
                                      }
                                  })
                              }
                          },
                          onCancel: () => {},
                      })
                  }
                  else {
                      let body = this.$_.cloneDeep(this.demandForm)
                      body.type = 1
                      body.id = this.demandId
                      body.requester = this.splicingData(this.requesterList, this.demandForm.requester)
                      body.dockingPM = this.splicingData(this.dockingPMList, this.demandForm.dockingPM)
                      //编辑需求描述
                      editDemandDescription(body).then(res => {
                          if (res.code === 200) {
                              const {id, cardName, businessSide, businessSideAdd, requester, dockingPM,
                                  solveUserProblem, effectMethod, alterNatives, solveBusProblem
                              } = res.data
                              this.demandForm = {
                                  cardName,
                                  businessSide,
                                  businessSideAdd,
                                  requester: this.splitData(requester),
                                  dockingPM: this.splitData(dockingPM),
                                  solveUserProblem,
                                  effectMethod,
                                  alterNatives,
                                  solveBusProblem,
                              },
                              this.demandId = id
                              this.requesterList = requester
                              this.dockingPMList = dockingPM
                              requester.forEach((v, k) => {
                                  if (v.workcode === this.user.workCode) {
                                      this.identity = 2
                                  }
                              })
                              this.isFeedBack = true
                              this.isDisable = true
                          }
                      })
                  }
            this.effectCount = 0;
            this.demandCount = 0;
            this.progressCount = 0;
            },
            //提交需求反馈
            submit2(data) {
                let body = {
                    id: this.demandId,
                    stage: this.radioVal,
                    field: []
                }
                let newData = this.$_.find(data.stages, v => v.name == this.radioVal).fields
                newData.forEach((v, k) => {
                    body.field.push({
                        key: v.value,
                        value: v.style === 'date' ? this.$moment(v.actualValue).format("YYYY-MM-DD") : v.actualValue,
                        type: v.style
                    })
                })
                editDemandFeedBack(body).then(res => {
                    if (res.code === 200) {
                        this.currentProgress = res.data.currentProgress - 1
                        this.currentStep = res.data.currentProgress - 1
                        this.radioVal = res.data.progresses[res.data.currentProgress - 1]['stages'][0].name
                        this.progressData = res.data.progresses
                    }
                })
                this.effectCount = 0;
                this.demandCount = 0;
                this.progressCount = 0;
            },
            //提交需求效果通晒
            submit3() {
                const { backGroundAim, effectEvaluation } = this.effectForm
                let list = []
                this.effectUrl.forEach((v, k) => {
                    list.push(v.url)
                })
                let body = {
                    demandId: this.$route.params.id,
                    backGroundAim,
                    effectEvaluation,
                    url: list,
                }
                if (this.isEffect) {
                    body.id = this.effectId
                    editEffect(body).then(res => {
                        if (res.code === 200) {
                            this.isResult = true
                            this.isFeedBack = false
                            this.typeCon = '需求反馈'
                        }
                    })
                }
                else {
                    createEffect(body).then(res => {
                        if (res.code === 200) {
                            this.isResult = true
                            this.isFeedBack = false
                            this.typeCon = '需求反馈'
                        }
                    })
                }
                this.effectCount = 0;
                this.demandCount = 0;
                this.progressCount = 0;
            },
            //文件上传之前的钩子
            beforeUpload(file) {
            },
            //文件列表禁止点击文件
            handlePreview(info) {
                return false
            },
            //文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
            handleChange(info) {
                const status = info.file.status
                if (info.fileList.length > 3) {
                    this.$message.warning('最多限制上传3个文件')
                    return
                }
                if (status !== 'uploading') {
                }
                if (status === 'done' || status === 'removed') {
                    let list = []
                    info.fileList.forEach((v, k) => {
                        if (v.response && v.response.code === 200) {
                            list.push(v.response.data)
                        }
                        else {
                            list.push({
                                name: v.name,
                                url: v.url
                            })
                        }
                    })
                    this.effectUrl = list
                }
                this.effectForm.url = [...info.fileList]
            },
            //跳转需求编辑
            toEdit() {
                this.$router.push(`/demand/demandEdit/edit/${this.demandId}`)
                this.getDemandFeedBackData()
                this.isFeedBack = true
                this.isDescription = true
                this.isDisable = true
                this.isResult = false
            },
            //点击可编辑需求描述
            editDescription() {
                this.isFeedBack = false
                this.isDisable = false
                this.isResult = false
            },
            //点击可编辑需求反馈
            editFeedBack() {
                this.feedBackDisabled = false
            },
            //点击可编辑需求效果通晒
            editEffect() {
                this.effectDisabled = false
            },
            //是否填写所有
            isFeedBackDisabled(data) {
                let flag = false
                let currentData = this.$_.find(data.stages, v => v.name == this.radioVal).fields
                currentData.map((v, k) => {
                    if (v.style === 'inputNumber') {
                        if (v.actualValue == null) {
                            flag = true
                        }
                    }
                    else if (this.$_.isEmpty(v.actualValue)) {
                        flag = true
                    }
                })
                return flag
            }
        }
    }
</script>

<style>
    .ant-input {
        font-size: 16px;
        color: rgba(0, 0, 0, 0.7);
        border-radius: 2px;
    }
    .ant-input::-webkit-scrollbar {
        display: none;
    }

    .ant-select-dropdown-menu::-webkit-scrollbar {
        display: none;
    }

    .ant-input:hover {
        border-color: #36B8E0;
    }

    .ant-input:focus {
        border-color: #36B8E0;
        box-shadow: none;
    }

    .ant-input-affix-wrapper:hover .ant-input:not(.ant-input-disabled) {
        border-color: #36B8E0;
    }

    .ant-input-affix-wrapper .ant-input-prefix, .ant-input-affix-wrapper .ant-input-suffix {
        color: rgba(0, 0, 0, 0.25) !important;
        font-size: 14px;
    }

    .ant-form-item-children {
        display: flex;
        align-items: center;
    }

    .ant-form-item-label {
        line-height: 32px;
        padding-right: 8px;
        white-space: normal;
        width: 160px;
    }

    .ant-form-item label {
        line-height: 32px;
        font-size: 16px;
        color: rgba(0, 0, 0, 0.9);
    }

    .ant-form-item-control-wrapper {
        width: 600px;
    }

    .ant-form-item-control-wrapper {
        line-height: 32px !important;
    }

    .ant-form-item-control {
        line-height: 32px !important;
        position: relative;
    }

    .ant-select-selection__placeholder  {
        font-size: 16px;
    }

    .ant-select-dropdown-menu-item-selected {
        background: #EBF8FC !important;
        color: #36B8E0;
    }

    .ant-select-dropdown-menu-item:hover:not(.ant-select-dropdown-menu-item-disabled) {
        background: #EBF8FC !important;
    }

    .ant-select-focused .ant-select-selection, .ant-select-selection:focus, .ant-select-selection:active {
        border-color: #36B8E0;
    }

    .ant-select-dropdown-menu-item {
        padding-left: 20px;
    }

    .ant-select-open .ant-select-selection {
        border-color: #36B8E0;
    }

    .ant-select-selection {
        border-radius: 2px;
    }

    .ant-select-selection:hover {
        border-color: #36B8E0;
    }

    .ant-input-number:hover {
        border-color: #36B8E0;
    }

    .ant-input-number:focus {
        border-color: #36B8E0;
    }

    .ant-calendar-picker:hover .ant-calendar-picker-input:not(.ant-input-disabled) {
        border-color: #36B8E0;
    }

    .ant-steps .ant-steps-item:not(.ant-steps-item-active):not(.ant-steps-item-process) > .ant-steps-item-container[role='button']:hover .ant-steps-item-icon {
        border-color: #36B8E0;
    }

    .ant-steps .ant-steps-item:not(.ant-steps-item-active):not(.ant-steps-item-process) > .ant-steps-item-container[role='button']:hover .ant-steps-item-icon .ant-steps-icon {
        color: #36B8E0;
    }

    .ant-btn-primary-disabled, .ant-btn-primary.disabled, .ant-btn-primary[disabled],
    .ant-btn-primary-disabled:hover, .ant-btn-primary.disabled:hover, .ant-btn-primary[disabled]:hover,
    .ant-btn-primary-disabled:focus, .ant-btn-primary.disabled:focus, .ant-btn-primary[disabled]:focus,
    .ant-btn-primary-disabled:active, .ant-btn-primary.disabled:active, .ant-btn-primary[disabled]:active,
    .ant-btn-primary-disabled.active, .ant-btn-primary.disabled.active, .ant-btn-primary[disabled].active {
        background: #F5F5F5 !important;
        color: rgba(0, 0, 0, 0.25) !important;
        border-color: #D9D9D9 !important;
    }

    .ant-btn-primary {
        border: 1px solid #36B8E0;
        background-color: #36B8E0;
        color: #FFFFFF;
    }

    .ant-btn-primary:hover, .ant-btn-primary:focus {
        border: 1px solid rgba(49, 183, 223, 0.7) !important;
        background: rgba(49, 183, 223, 0.7) !important;
        color: #FFFFFF !important;
    }

    .ant-btn:hover, .ant-btn:focus {
        background: #FFFFFF;
        border: 1px solid #36B8E0;
        color: #36B8E0;
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

    .ant-steps-item-wait .ant-steps-item-icon {

    }

    .ant-steps-item-title {
        color: rgba(0, 0, 0, 0.85) !important;
        font-weight: normal !important;
        line-height: 30px;
    }

    .ant-steps-item-wait > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-title {
        color: rgba(0, 0, 0, 0.45) !important;
    }

    .ant-steps-item-finish > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-title::after {
        background-color: #36B8E0 !important;
    }

    .ant-calendar-today .ant-calendar-date {
        border-color: #E9FAFF !important;
        background: #E9FAFF !important;
        color: #36B8E0 !important;
    }

    .ant-calendar-selected-day .ant-calendar-date {
        background-color: #36B8E0 !important;
        color: #ffffff !important;
    }

    .ant-radio-checked .ant-radio-inner {
        border-color: #36B8E0 !important;
    }

    .ant-radio-inner::after {
        background-color: #36B8E0 !important;
    }

    .ant-radio:hover .ant-radio-inner {
        border-color: #36B8E0 !important;
    }

    .ant-upload-list-item-name {
        color: rgba(0, 0, 0, 0.7);
    }

    .ant-upload-list-item-name:hover {
        color: rgba(0, 0, 0, 0.7);
    }

    .ant-select-dropdown-menu-item-group-title {
        font-size: 14px;
    }
</style>
<style scoped lang="scss">
    .demand-form {
        width: 1240px;
        margin: 0 auto 24px;
        border-radius: 8px;

        .demand-descritpion {
            background: #fff;
            padding: 20px 16px 20px 36px;
            border-radius: 10px;
        }

        .demand-feedback {
            background: #fff;
            padding: 20px 16px 20px 36px;
            border-radius: 10px;
            margin-bottom: 24px;
        }

        .demand-analysis {
            background: #fff;
            padding: 24px;
            border-radius: 8px;
        }

        .demand-tip {
            font-family: PingFang SC;
            font-style: normal;
            font-weight: 600;
            font-size: 16px;
            padding: 0px 0 40px;
            color: rgba(0, 0, 0, 0.9);

            span {
                font-size: 14px;
                font-weight: 400;
                color: rgba(0, 0, 0, 0.5);
            }
        }
    }

    .textarea-suffix {
        position: absolute;
        right: 12px;
        bottom: 8px;
        line-height: 22px;
        color: rgba(0, 0, 0, 0.25);
    }

    .step {
      padding: 0 174px 40px;
    }

    .disabled {
        font-family: PingFang SC;
        font-style: normal;
        font-weight: normal;
        font-size: 16px;
        line-height: 32px;
        color: rgba(0, 0, 0, 0.7);
    }

    .invite-modal {

        .invite-modal-title {
            font-family: PingFang SC;
            font-style: normal;
            font-weight: 500;
            font-size: 14px;
            line-height: 20px;
            margin-bottom: 16px;
            color: rgba(0, 0, 0, 0.9);
        }

        p {
            font-family: PingFang SC;
            font-style: normal;
            font-weight: normal;
            font-size: 14px;
            line-height: 20px;
            color: rgba(0, 0, 0, 0.5);
            margin-bottom: 2px;
        }
    }

    .el-select {
        width: 100%;
    }
</style>