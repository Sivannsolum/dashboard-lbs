<template>
  <v-dialog
    :key="dialog_popupLabel"
    v-model="dialog_popupLabel"
    @click:outside="closeModal"
    width="1110"
  >
    <v-card class="popup esl-detail">
      <div class="popup-titbox">
        <h3 class="page-title-bar"><i class="ico ico-label"></i>{{ $t('Label Detail Cloud') }}</h3>
      </div>
      <div class="lable-detail-box">
        <div class="infoBox leftBox">
          <!-- tab 추가 -->
          <v-tabs height="35"
            v-model="tabs"
            :hide-slider="true"
            active-class="selected"
            class="tab-group"
          >
            <v-tab>Current</v-tab>
            <v-tab>Previous</v-tab>
          </v-tabs>
          <v-tabs-items v-model="tabs">
            <!-- current -->
            <v-tab-item
              :transition="false"
              :reverse-transition="false"
              class="tab-cont"
            >
              <div v-if="currentImages.length">
                <div class="img-box">
                  <img :src="`${topImage}`" class="img-label">
                </div>
                <div class="labelInfo">
                  <v-text-field
                    :value="labelStatus"
                    :label="$t('Status')"
                    class="form-input form-status"
                    style="width:110px"
                    outlined dense hide-details disabled readonly
                  ></v-text-field>
                  <v-text-field
                    :value="processUpdateTime"
                    :label="$t('Requested Date')"
                    class="form-input ml-4"
                    outlined dense hide-details disabled readonly
                  ></v-text-field>
                  <v-text-field
                    :value="statusUpdateTime"
                    :label="$t('Completed Date')"
                    class="form-input ml-2"
                    outlined dense hide-details disabled readonly
                  ></v-text-field>
                </div>
                <div class="c-pagenation">
                  <v-btn
                    @click="forwardBtn()"
                    class="btn-page-prev"
                    tile
                    depressed
                  >
                    <i class="ico-prev"></i>
                  </v-btn>
                  <v-btn
                    v-for="(value, name) in imagePageOption"
                    :ref="`labelPageBtn${name}`"
                    :key="name"
                    @click="clickImagePageBtn(name)"
                    :input-value="value.selected"
                    :disabled="value.disabled"
                    class="btn-page"
                    tile
                    depressed
                  >{{ name }}
                  </v-btn>
                  <v-btn
                    @click="backwardBtn()"
                    class="btn-page-next"
                    tile
                    depressed
                  >
                    <i class="ico-next"></i>
                  </v-btn>
                </div>
              </div>
            </v-tab-item>

            <!-- previous -->
            <v-tab-item
              :transition="false"
              :reverse-transition="false"
              class="tab-cont"
            >
              <div v-if="previousImages.length">
                <div class="img-box">
                  <img :src="`${topPreviousImage}`" class="img-label">
                </div>
                <div class="labelInfo">
                  <v-text-field
                    :value="previousLabelStatus"
                    :label="$t('Status')"
                    class="form-input form-status"
                    style="width:110px"
                    outlined dense hide-details disabled readonly
                  ></v-text-field>
                  <v-text-field
                    :value="previousProcessUpdateTime"
                    :label="$t('Requested Date')"
                    class="form-input ml-4"
                    outlined dense hide-details disabled readonly
                  ></v-text-field>
                  <v-text-field
                    :value="previousStatusUpdateTime"
                    :label="$t('Completed Date')"
                    class="form-input ml-2"
                    outlined dense hide-details disabled readonly
                  ></v-text-field>
                </div>
                <div class="c-pagenation">
                  <v-btn
                    @click="forwardPreviousBtn()"
                    class="btn-page-prev"
                    tile
                    depressed
                  >
                    <i class="ico-prev"></i>
                  </v-btn>
                  <v-btn
                    v-for="(value, name) in imagePreviousPageOption"
                    :ref="`labelPageBtn${name}`"
                    :key="name"
                    @click="clickPreviousImagePageBtn(name)"
                    :input-value="value.selected"
                    :disabled="value.disabled"
                    class="btn-page"
                    tile
                    depressed
                  >{{ name }}
                  </v-btn>
                  <v-btn
                    @click="backwardPreviousBtn()"
                    class="btn-page-next"
                    tile
                    depressed
                  >
                    <i class="ico-next"></i>
                  </v-btn>
                </div>
              </div>
            </v-tab-item>
          </v-tabs-items>
        </div>
        <div class="infoBox rightBox">
          <div class="d-flex">
            <v-text-field
              :value="labelId"
              :label="$t('Label ID')"
              :placeholder="$t('Input the label ID')"
              class="form-input"
              outlined
              dense
              hide-details
              disabled
              readonly
            ></v-text-field>
            <v-text-field
              :value="gateway"
              :label="$t('Linked Gateway')"
              class="form-input ml-3"
              outlined
              dense
              hide-details
              disabled
              readonly
            ></v-text-field>
          </div>
          <div class="d-flex mt-8">
            <v-text-field
              :value="type"
              :label="$t('Type')"
              class="form-input"
              outlined
              dense
              hide-details
              disabled
              readonly
            ></v-text-field>
            <v-text-field
              :value="firmware"
              :label="$t('Firmware')"
              class="form-input ml-3"
              outlined
              dense
              hide-details
              disabled
              readonly
              clearable
            ></v-text-field>
          </div>
          <div class="mt-8">
            <p class="tit-label">{{ $t('Assign Info') }}</p>
            <div class="assignInfo">
              <div class="assignBox">
                <div
                  v-if="btnAssignTxt === assignType.unassign"
                  class="d-flex justify-space-between form-add-btn"
                >
                  <p class="list_label">{{ $t('Product ID') }}</p>
                  <v-list dense class="overflow-y-auto">
                      <v-list-item
                        v-for="(item, i) in articleList"
                        :key="i"
                        :value="item"
                        @dblclick="copyToClipBoard(item)"
                        width="400"
                        ref="article"
                      >
                        <v-list-item-content>
                          <v-list-item-title
                            :id="item"
                            v-text="item"
                          ></v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                  </v-list>
                </div>
                <div v-else-if="btnAssignTxt === assignType.assign">
                  <div class="d-flex justify-space-between form-add-btn">
                    <p class="list_label">{{ $t('Product ID') }}</p>
                    <v-list dense class="overflow-y-auto">
                        <v-list-item
                          v-for="(item, i) in assigneArticleList"
                          :key="i"
                          :value="item"
                          width="400"
                        >
                          <v-text-field
                            v-model="assigneArticleList[i]"
                            placeholder="Input the Product ID"
                            class="form-input"
                            dense hide-details solo
                            clearable
                          ></v-text-field>
                        </v-list-item>
                        <v-list-item>
                          <v-list-item-content>
                            <v-btn
                              @click="clickAddArticle"
                              :ripple="false"
                              text
                            >
                              <img src="@/assets/img/ico-add.jpg" alt="Product ID input box add button"/>
                            </v-btn>
                          </v-list-item-content>
                        </v-list-item>
                    </v-list>
                  </div>
                </div>
              </div>
              <v-btn
                text
                @click="clickAssign"
                class="btn-assign ml-3"
                v-customDisabled="labelUnassignDisabled"
              >{{ $t(btnAssignTxt) }}
              </v-btn>
            </div>
          </div>
          <div class="mt-8">
            <p class="tit-label">{{ $t('Schedule') }}</p>
            <div class="schedule-info">
              <v-data-table
                :headers="scheduleHeaders"
                :items="scheduleList"
                item-key="id"
                :page.sync="page"
                :hide-default-footer="true"
                fixed-header
                height="120"
                class="tbl-type01"
              >
              <template slot="no-data">
                <p>{{ $t('No data available') }}</p>
              </template>
              </v-data-table>
            </div>
          </div>
          <!-- admin 계정일때만 노출 -->
          <div v-if="accessLevel === '1'" class="mt-8">
            <h4>{{$t('Individual ESL Image Update')}}</h4>
            <v-row>
              <v-col cols="6">
                <v-file-input
                  v-model="inputImage"
                  @change="handleChange"
                  class="form-file"
                  :label="$t('Image')"
                  :placeholder="$t('Input the image')"
                  type="file"
                  outlined
                  dense
                  hide-details
                  prepend-icon
                >
                  <template v-slot:append>
                    <img
                      width="24"
                      height="24"
                      src="@/assets/img/ico-upload-file.gif"
                    />
                  </template>
                </v-file-input>
                <v-select
                  v-model="inputPage"
                  :label="$t('Page')"
                  :placeholder="$t('Input the page')"
                  :items="['1', '2', '3', '4', '5', '6', '7']"
                  class="form-select mt-3"
                  outlined
                  dense
                  hide-details
                  clearable
                ></v-select>
                <v-btn
                  @click="saveImage"
                  text
                  icon
                  class="btn btn-update mt-8"
                >{{ $t('Image Update') }}
                </v-btn >
              </v-col>
              <v-col cols="6">
                <p class="tit-preview mb-1">{{ $t('Preview') }}</p>
                <div class="preview">
                  <img :src="`data:image/jpeg;base64,${encodedImage}`" class="img-label">
                </div>
              </v-col>
            </v-row>
          </div>
        </div>
      </div>
      <div style="padding:50px;">
        <v-card-actions class="d-flex justify-center mt-0">
          <v-btn text icon @click="closeModal" class="btn">{{ $t('Close') }}</v-btn>
        </v-card-actions>
      </div>
    </v-card>
  </v-dialog>
</template>
<script>
import EventBus from '@/plugins/eventBus'
import commons from '@/plugins/commons'
import codes from '@/plugins/codes'

export default {
  directives: {
    customDisabled: {
      inserted: function (el, binding) {
        if (binding.value) {
          el.classList.add('disabled')
        }
      }
    }
  },
  props: {
    item: {},
    labelDetailDisabled: {
      default: false,
      required: true
    }
  },
  data () {
    return {
      tabs: null,
      productionType: process.env.VUE_APP_PRODUCTION_TYPE,
      dialog_popupLabel: false,
      accessLevel: null,
      plusFlag: false,
      activePage: null,
      activePreviousPage: null,
      imagePageOption: {
        1: {
          selected: false,
          disabled: true
        },
        2: {
          selected: false,
          disabled: true
        },
        3: {
          selected: false,
          disabled: true
        },
        4: {
          selected: false,
          disabled: true
        },
        5: {
          selected: false,
          disabled: true
        },
        6: {
          selected: false,
          disabled: true
        },
        7: {
          selected: false,
          disabled: true
        }
      },
      imagePreviousPageOption: {
        1: {
          selected: false,
          disabled: true
        },
        2: {
          selected: false,
          disabled: true
        },
        3: {
          selected: false,
          disabled: true
        },
        4: {
          selected: false,
          disabled: true
        },
        5: {
          selected: false,
          disabled: true
        },
        6: {
          selected: false,
          disabled: true
        },
        7: {
          selected: false,
          disabled: true
        }
      },

      imageLength: 7,
      page: 1,
      // 09.24 아이템 리스트 아이템 추가
      labelSourceId: null,
      store: 'Store1',
      currentImages: [],
      previousImages: [],
      labelId: null,
      status: null,
      type: null,
      gateway: null,
      firmware: null,
      articleList: [],
      assigneArticleList: [],
      btnAssignTxt: null,
      inputPage: null,
      inputImage: null,
      encodedImage: '',
      preview: '',
      rules: {
        required: (value) => !!value || 'Required.'
      },
      scheduleList: [],
      assignType: codes.assignType,
      labelUnassignDisabled: false
    }
  },
  computed: {
    scheduleHeaders () {
      return [
        { text: this.$t('Start Time'), sortable: false, value: 'startTime', width: '25%' },
        { text: this.$t('End Time'), sortable: false, value: 'endTime', width: '25%' },
        { text: this.$t('Display Page'), sortable: false, value: 'displayPage', width: '25%' },
        { text: this.$t('State'), sortable: false, value: 'state', width: '25%' }
      ]
    },
    selectedStore () {
      return this.$store.getters['dataStore/GET_SELECTED_STORE'].code
    },
    topImage () {
      var image = ''
      this.currentImages.forEach(element => {
        if (element.index === this.activePage) {
          image = element.content
          this.labelStatus = element.state
          this.processUpdateTime = commons.convertDate(element.processUpdateTime)
          this.statusUpdateTime = commons.isNull(element.statusUpdateTime) ? '-' : commons.convertDate(element.statusUpdateTime)
        }
      })
      return image
    },
    topPreviousImage () {
      var image = ''
      this.previousImages.forEach(element => {
        if (element.index === this.activePreviousPage) {
          image = element.content
          this.previousLabelStatus = element.state
          this.previousProcessUpdateTime = commons.convertDate(element.processUpdateTime)
          this.previousStatusUpdateTime = commons.isNull(element.statusUpdateTime) ? '-' : commons.convertDate(element.statusUpdateTime)
        }
      })

      return image
    }
  },
  mounted () {
    EventBus.$on('getLabelDetailPopupDataValuesCloud', async (item) => {
      this.initData(item.id)
      if (item.status !== codes.labelStatus.UNASSIGNED && item.status !== codes.labelStatus.UNASSIGNING) {
        const scheduleList = await this.getScheduleList(item.id)
        this.showScheduleList(scheduleList)
      }
      this.getCurrentImage(item.id)
      this.getLabelInfo(item.id)
    })
    EventBus.$on('openLabelDetailCloud', () => {
      if (this.labelDetailDisabled) return
      this.dialog_popupLabel = true
    })
    this.$store.dispatch('auth/getDisabledBtn', '2100').then((flag) => {
      this.labelUnassignDisabled = flag
    })
  },
  beforeDestroy () {
    EventBus.$off('getLabelDetailPopupDataValuesCloud')
    EventBus.$off('openLabelDetailCloud')
  },
  methods: {
    getScheduledPage (scheduleList) {
      const now = new Date()
      for (const schedule in scheduleList) {
        const Start = new Date(scheduleList[schedule].startTime)
        const End = new Date(scheduleList[schedule].endTime)
        if (now >= Start && now < End) {
          return scheduleList[schedule].displayPage
        }
      }
      return codes.ACTIVE_PAGE
    },
    async showScheduleList (scheduleList) {
      if (!commons.isValidStr(scheduleList)) {
        scheduleList = []
      }
      this.scheduleList = scheduleList
    },
    getScheduleList (labelId) {
      const config = {
        params: {
          company: this.$store.state.auth.user.company,
          store: this.selectedStore,
          label: labelId
        }
      }
      return this.$utils.callAxios(codes.requests.getScheduleList.method, codes.requests.getScheduleList.url, config)
        .then(res => {
          // state 값을 row에 추가
          return res.data.scheduleList.map((row) => {
            row.state = res.data.state
            return row
          })
        })
        .catch(error => {
          console.debug(`Selected label has no schduled page. error: ${error}`)
        })
    },
    resetLabelDetail () {
      this.tabs = 0

      this.currentImages = []
      this.labelStatus = ''
      this.processUpdateTime = ''
      this.statusUpdateTime = ''

      this.previousImages = []
      this.previousLabelStatus = ''
      this.previousProcessUpdateTime = ''
      this.previousStatusUpdateTime = ''

      this.labelId = ''
      this.gateway = ''
      this.type = ''
      this.firmware = ''
      this.articleList = []
      this.assigneArticleList = []
      this.scheduleList = ''
      this.inputImage = ''
      this.inputPage = 0
      this.encodedImage = ''
      this.$forceUpdate()
    },
    closeModal () {
      this.resetLabelDetail()
      this.$emit('updateLabelList')
      this.dialog_popupLabel = false
    },
    getCurrentImage (labelId) {
      Object.values(this.imagePageOption).forEach(x => {
        x.selected = false
        x.disabled = true
      })
      Object.values(this.imagePreviousPageOption).forEach(x => {
        x.selected = false
        x.disabled = true
      })
      const url = '/api/common/labels/detail'
      const config = {
        params: {
          company: this.$store.state.auth.user.company,
          store: this.selectedStore,
          label: labelId
        }
      }
      this.$utils.callAxios('get', url, config).then((res) => {
        this.currentImages = res.data.currentImage
        // currentImage
        res.data.currentImage.forEach(x => {
          this.imagePageOption[x.index].disabled = false
        })

        if (res.data.currentImage.length) {
          this.imagePageOption[res.data.currentImage.map(x => x.index)[0]].selected = true
          this.activePage = res.data.currentImage.map(x => x.index)[0]
        }

        // previousImage
        this.previousImages = res.data.previousImage

        res.data.previousImage.forEach(x => {
          this.imagePreviousPageOption[x.index].disabled = false
        })

        if (res.data.previousImage.length) {
          this.imagePreviousPageOption[res.data.previousImage.map(x => x.index)[0]].selected = true
          this.activePreviousPage = res.data.previousImage.map(x => x.index)[0]
        }
        // Scheduled
        const scheduledPage = this.getScheduledPage(this.scheduleList)
        if (scheduledPage !== codes.ACTIVE_PAGE) {
          this.activePage = scheduledPage
        }

        this.clickImagePageBtn(this.activePage)
      })
    },
    getLabelInfo (labelId) {
      const url = '/api/common/labels'
      const config = {
        params: {
          company: this.$store.state.auth.user.company,
          store: this.selectedStore,
          label: labelId
        }
      }
      this.$utils.callAxios('get', url, config).then((res) => {
        if (res.data) {
          this.labelId = res.data.labelList[0].labelCode
          this.status = res.data.labelList[0].updateStatus
          if (res.data.labelList[0].updateStatus === codes.labelStatus.UNASSIGNED) {
            this.btnAssignTxt = codes.assignType.assign
          } else {
            this.btnAssignTxt = codes.assignType.unassign
          }
          this.type = res.data.labelList[0].type
          if (res.data.labelList[0].gateway) {
            this.gateway = res.data.labelList[0].gateway.name
          } else this.gateway = null
          this.firmware = res.data.labelList[0].firmwareVersion
          this.articleList = res.data.labelList[0].articleList.map(element => element.articleId) || []
          this.$forceUpdate()
        }
      })
    },
    clickAssign () {
      if (this.btnAssignTxt === codes.assignType.assign) {
        const url = '/api/common/labels/link'
        const config = {
          params: {
            company: this.$store.state.auth.user.company,
            store: this.selectedStore,
            validateStatus: false,
            responseType: 'application/json'
          }
        }
        const body = {
          assignList: [
            {
              articleIdList: this.assigneArticleList.filter((el) => el !== ''),
              labelCode: this.labelId
            }
          ]
        }
        this.$utils.callAxiosWithBody('post', url, body, config).then((res) => {
          if (res.status === 200) {
            EventBus.$emit('messageAlert', this.$t(res.data.responseMessage))
            setTimeout(this.closeModal, 500)
          } else {
            EventBus.$emit('messageAlert', 'error')
          }
        }).catch((error) => {
          EventBus.$emit('messageAlert', this.$t(error.response.data.responseMessage))
        })
      } else if (this.btnAssignTxt === codes.assignType.unassign) {
        if (this.labelUnassignDisabled) return
        const url = '/api/common/labels/unlink'
        const config = {
          params: {
            company: this.$store.state.auth.user.company,
            store: this.selectedStore
          }
        }
        const body = {
          unAssignList: [this.labelId]
        }
        this.$utils.callAxiosWithBody('post', url, body, config)
          .then(res => {
            if (res.status === 200) {
              const msg = res.data.responseMessage.split(' ')
              const labelId = msg.pop()
              EventBus.$emit('messageAlert', `${this.$t(msg.join(' '))} ${labelId}`)
            } else {
              EventBus.$emit('messageAlert', this.$t(res.data.responseMessage))
            }
            setTimeout(this.closeModal, 500)
          })
      }
    },
    // 이미지 인코딩
    encodeBase64ImageFile (image) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(image)
        reader.onload = (event) => {
          resolve(event.target.result)
        }
        reader.onerror = (error) => {
          reject(error)
        }
      })
    },
    handleChange: function () {
      this.encodedImage = ''
      var file = this.inputImage

      if (file && file.type.match(/^image\/(png|jpeg|jpg|bmp)$/)) {
        this.encodeBase64ImageFile(file).then(data => {
          this.encodedImage = data.split(',').slice(1).join()
        })
      }
    },
    saveImage () {
      if (this.inputPage && this.encodedImage) {
        const url = '/api/common/labels/image'
        const config = {
          params: {
            company: this.$store.state.auth.user.company,
            store: this.selectedStore
          }
        }
        const body = {
          labelCode: this.labelId,
          page: this.inputPage,
          image: this.encodedImage
        }
        this.$utils.callAxiosWithBody('post', url, body, config).then((res) => {
          EventBus.$emit('messageAlert', this.$t('Success.'))
          this.getCurrentImage(this.labelId)
          this.closeModal()
        }).catch((error) => {
          console.log(error)
          EventBus.$emit('messageAlert', this.$t('Fail.'))
        })
      } else {
        if (!this.encodedImage) {
          EventBus.$emit('messageAlert', this.$t('Select the image to update'))
        } else if (!this.inputPage) {
          EventBus.$emit('messageAlert', this.$t('Select the page to update'))
        } else EventBus.$emit('messageAlert', this.$t('Error.'))
      }
    },
    clickAddArticle () {
      this.assigneArticleList.push('')
    },
    initData (labelId) {
      this.labelSourceId = labelId
      this.assigneArticleList = []
      this.inputPage = null
      this.inputImage = null
      this.encodedImage = ''
      this.accessLevel = this.$store.state.auth.user.accountInfo.accessLevel + ''
      this.scheduleList = []
    },
    forwardBtn () {
      var current = Object.keys(this.imagePageOption).filter(x => this.imagePageOption[x].selected)[0]
      var selectable = Object.keys(this.imagePageOption).filter(x => !this.imagePageOption[x].disabled)
      var currentIndex = selectable.indexOf(current)
      if (currentIndex !== 0) {
        currentIndex -= 1
      }
      this.clickImagePageBtn(selectable[currentIndex])
    },
    backwardBtn () {
      var current = Object.keys(this.imagePageOption).filter(x => this.imagePageOption[x].selected)[0]
      var selectable = Object.keys(this.imagePageOption).filter(x => !this.imagePageOption[x].disabled)
      var currentIndex = selectable.indexOf(current)
      if (currentIndex !== (selectable.length - 1)) {
        currentIndex += 1
      }
      this.clickImagePageBtn(selectable[currentIndex])
    },
    clickImagePageBtn (value) {
      if (commons.isNull(this.imagePageOption[value])) return
      this.activePage = value * 1
      Object.keys(this.imagePageOption).forEach((x) => {
        this.imagePageOption[x].selected = false
      })
      this.imagePageOption[value].selected = true
    },
    forwardPreviousBtn () {
      var current = Object.keys(this.imagePreviousPageOption).filter(x => this.imagePreviousPageOption[x].selected)[0]
      var selectable = Object.keys(this.imagePreviousPageOption).filter(x => !this.imagePreviousPageOption[x].disabled)
      var currentIndex = selectable.indexOf(current)
      if (currentIndex !== 0) {
        currentIndex -= 1
      }
      this.clickImagePreviousPageBtn(selectable[currentIndex])
    },
    backwardPreviousBtn () {
      var current = Object.keys(this.imagePreviousPageOption).filter(x => this.imagePreviousPageOption[x].selected)[0]
      var selectable = Object.keys(this.imagePreviousPageOption).filter(x => !this.imagePreviousPageOption[x].disabled)
      var currentIndex = selectable.indexOf(current)
      if (currentIndex !== (selectable.length - 1)) {
        currentIndex += 1
      }
      this.clickImagePreviousPageBtn(selectable[currentIndex])
    },
    clickImagePreviousPageBtn (value) {
      if (commons.isNull(this.imagePreviousPageOption[value])) return
      this.activePreviousPage = value * 1
      Object.keys(this.imagePreviousPageOption).forEach((x) => {
        this.imagePreviousPageOption[x].selected = false
      })
      this.imagePreviousPageOption[value].selected = true
    },
    clickPreviousImagePageBtn (value) {
      if (commons.isNull(this.imagePreviousPageOption[value])) return
      this.activePreviousPage = value * 1
      Object.keys(this.imagePreviousPageOption).forEach((x) => {
        this.imagePreviousPageOption[x].selected = false
      })
      this.imagePreviousPageOption[value].selected = true
    }
  }
}
</script>

<style scoped>
.esl-detail {
  padding: 0;
}
.esl-detail .popup-titbox {
  padding: 40px 50px 0;
}
.esl-detail .box {
  padding: 20px 50px;
}
.esl-detail .box + .box {
  border-top: 1px solid #808495;
}
.esl-detail .preview {
  display:flex;
  justify-content: center;
  align-items: center;
  width:245px;
  height:200px;
  background:#fafafa;
  overflow: hidden;
}
.esl-detail .preview .img-label {
  border: 1px solid rgba(0, 0, 0, 0.38);
  max-width:100%;
  max-height:100%;
}
.esl-detail .tit-preview {
  font-size: var(--font14);
  color: rgba(0, 0, 0, 0.6);
}
.esl-detail .form-add-btn {
  width: 100%;
  border: 1px solid rgba(0, 0, 0, 0.38);
  border-radius: 5px;
  overflow: hidden;
}
.esl-detail .form-add-btn .v-list {
  width: calc(100% - 70px);
  height: 120px;
  padding: 0;
  padding-right:10px;
}
.esl-detail .form-add-btn .v-list .v-list-item {
  min-height: auto;
  padding: 0 5px;
  height: 40px;
}
.esl-detail .form-add-btn .v-list .v-list-item:before {
  background-color: #001e38;
}
.esl-detail .form-add-btn .v-list .v-list-item + .v-list-item {
  border-top: 1px solid rgba(0, 0, 0, 0.38);
}
.esl-detail .form-add-btn .v-list .v-list-item__content {
  padding: 0;
}
.esl-detail .form-add-btn .list_label {
  height: 40px;
  line-height: 40px;
  padding: 0 10px;
  font-size: var(--font12);
  color: rgba(0, 0, 0, 0.6);
}
.esl-detail .tit-label {
  margin-bottom: 3px;
  font-size: var(--font14);
  line-height: 1.5;
  color:#001e38;
}
.esl-detail .form-add-btn .v-list .form-input{
  font-size:12px;
  border-bottom:0;
}
.esl-detail .lable-detail-box{display:flex; padding:0 50px;}
.esl-detail .lable-detail-box .infoBox+.infoBox{flex:1; margin-left:50px; padding-left:50px; border-left:2px solid #bfc1ca;}
.esl-detail .lable-detail-box .leftBox{width:380px;}
.esl-detail .lable-detail-box .rightBox{max-height:520px; padding-right:20px; overflow:hidden; overflow-y:auto;}
.esl-detail .lable-detail-box .rightBox::-webkit-scrollbar {width: 5px;}
.esl-detail .lable-detail-box .rightBox::-webkit-scrollbar-track {background: transparent;}
.esl-detail .lable-detail-box .rightBox::-webkit-scrollbar-thumb {background: #818181; border-radius:5px;}
.esl-detail .lable-detail-box .rightBox::-webkit-scrollbar-thumb:hover {background: #555;}
.esl-detail .leftBox .img-box{display:flex; justify-content:center; align-items:center; width:100%; height:340px; margin:0 auto; background:#fafafa;}
.esl-detail .leftBox .img-box img{max-width:100%; max-height:100%; border:1px solid rgba(0, 0, 0, 0.38);}
.esl-detail>>>.form-input.v-text-field--outlined .v-label{color:#001e38;}
.labelInfo{display:flex; margin:20px 0;}
.esl-detail .labelInfo>>>.form-input .v-input__slot{min-height:30px !important;}
.esl-detail .labelInfo>>>.form-input.form-status input{color:#e27070;}
.esl-detail .assignInfo{display:flex;}
.esl-detail .assignInfo .assignBox{width:100%;}
.esl-detail .assignInfo .btn-assign{width:90px; height:auto; font-size:var(--font12); background:#001e38; color:#fff;}
.esl-detail .schedule-info{width:100%; padding:0 15px 0 20px; border:1px solid rgba(0, 0, 0, 0.38); border-radius:5px; overflow:hidden;}
.esl-detail .schedule-info>>>.tbl-type01 thead th{height:35px !important; padding-left:0 !important; border-bottom:1px solid rgba(0, 0, 0, 0.12) !important; background:#fff; font-weight:400; font-size:var(--font16) !important;}
.esl-detail .schedule-info>>>.tbl-type01 tbody td{height:30px !important; padding-left:0 !important; background:#fff;}
.esl-detail>>>.v-btn.btn-update .v-btn__content{line-height:40px; font-size:var(--font14);}
.v-btn.btn-page{min-width:35px !important; height:35px !important; padding:0 !important; border:1px solid #e8e9ec; border-radius:3px; background:#fff !important;}
.v-btn.btn-page:before{background:transparent !important;}
.c-pagenation>>>.v-btn.v-btn--disabled.btn-page .v-btn__content{background:transparent !important;}
.theme--light.v-btn.v-btn--disabled:not(.v-btn--flat):not(.v-btn--text):not(.v-btn--outlined).btn-page{background:#fff !important;}
.v-btn.v-btn--active.btn-page{background:#001e38 !important; color:#fff;}
.btn-page-prev, .btn-page-next{position:relative; min-width:35px !important; height:35px !important; padding:0 !important; border:1px solid #e8e9ec; border-radius:3px; background:#fff !important;}
.btn-page-prev .v-btn__content, .btn-page-next .v-btn__content{position:absolute !important; top:0; left:0; width:100%; height:100%;}
.ico-prev, .ico-next{display:inline-flex;}
.ico-prev:before{content:"\F141"; display:inline-block; font:normal normal normal 24px/1 "Material Design Icons"; color:#8e91a0; font-size:var(--font24);}
.ico-next:before{content:"\F142"; display:inline-block; font:normal normal normal 24px/1 "Material Design Icons"; color:#8e91a0; font-size:var(--font24);}
.c-pagenation{display:flex; justify-content: space-between; align-items:center; margin-top:20px;}
.disabled { background: #ededf0 !important; pointer-events: none; border: 1px solid #a2a1af; }
.tab-group .v-tab{height:35px;}
.tab-cont{border:0;}
</style>
