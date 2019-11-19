<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <sticky :z-index="10" :class-name="'sub-navbar '+postForm.page_status">
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">
          发布
        </el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-row>

          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px;" prop="title">
              <MDinput v-model="postForm.title" :maxlength="100" name="name" required>
                标题
              </MDinput>
            </el-form-item>


            <div class="postInfo-container">
              <el-row>

                <el-col :span="8">
                  <el-form-item label-width="100px" label="所属分类:" class="postInfo-container-item">
                    <el-select v-model="postForm.cate_id" placeholder="请选择分类">
                      <el-option v-for="(item,index) in cateListOptions" :key="index" :label="item.cate_name" :value="item.cate_id" />
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="10">
                  <el-form-item label-width="120px" label="发布时间:" class="postInfo-container-item">
                    <el-date-picker v-model="postForm.publish_time" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择时间" />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>

        <el-form-item label-width="100px" label="显示状态:" class="article-status-swich">
          <el-switch v-model="postForm.status_switch" active-text="私密" inactive-text="公开"/>
        </el-form-item>

        <el-form-item style="margin-bottom: 40px;" label-width="100px" label="简介:">
          <el-input v-model="postForm.description" :rows="1" type="textarea" class="article-textarea" autosize placeholder="请输入内容" />
          <span v-show="contentShortLength" class="word-counter">{{ contentShortLength }}字符</span>
        </el-form-item>

        <el-form-item style="margin-bottom: 40px;" label-width="100px" label="关键词:">
          <el-input v-model="postForm.keywords" :rows="1" type="textarea" class="article-textarea" autosize placeholder="请输入内容" />
          <span v-show="contentShortLength" class="word-counter">{{ contentShortLength }}words</span>
        </el-form-item>

          <el-form-item label-width="100px" label="文本格式:" class="postInfo-container-item">
              <el-select v-model="postForm.show_type" placeholder="请选择">
                  <el-option v-for="(item,index) in showType" :key="index" :label="item.name" :value="item.id" />
              </el-select>
          </el-form-item>

        <el-form-item v-if="postForm.show_type == 1" prop="content" style="margin-bottom: 30px;">
          <Tinymce ref="editor" v-model="postForm.contents" :height="400" />
        </el-form-item>
          <el-form-item v-if="postForm.show_type == 2" style="margin-bottom: 30px;">
              <MarkdownEditor v-model="postForm.contents" :height="markdownEditor.height" :language="markdownEditor.language"/>
          </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import Upload from '@/components/Upload/SingleImage3'
import MarkdownEditor from '@/components/MarkdownEditor'
import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky' // 粘性header组件
import { validURL } from '@/utils/validate'
import { fetchArticle } from '@/api/article'
import { searchUser } from '@/api/remote-search'
import Warning from './Warning'
import { CommentDropdown, PlatformDropdown, SourceUrlDropdown } from './Dropdown'


export default {
  name: 'ArticleDetail',
  inject:['reload'],
  components: { Tinymce, MarkdownEditor, MDinput, Upload, Sticky, Warning, CommentDropdown, PlatformDropdown, SourceUrlDropdown },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: rule.field + '为必传项',
          type: 'error'
        })
        callback(new Error(rule.field + '为必传项'))
      } else {
        callback()
      }
    }
    const validateSourceUri = (rule, value, callback) => {
      if (value) {
        if (validURL(value)) {
          callback()
        } else {
          this.$message({
            message: '外链url填写不正确',
            type: 'error'
          })
          callback(new Error('外链url填写不正确'))
        }
      } else {
        callback()
      }
    }
    return {
      id:undefined,
      postForm: {
        cate_id: undefined,//所属分类
        title: '', // 文章题目
        contents: '', // 文章内容
        description: '', // 文章摘要
        keywords: '', // 文章关键词
        img_path: '', // 文章图片
        publish_time: undefined, // 前台展示时间
        id: undefined,
        show_type: 1,
        status:1,
        status_switch:false,
      },
      loading: false,
      cateListOptions: [
        {
          cate_id: 1,
          cate_name: 'php',
        },
        {
          cate_id: 2,
          cate_name: 'mysql',
        },
        {
          cate_id: 3,
          cate_name: 'golang',
        },
        {
          cate_id: 4,
          cate_name: 'linux',
        },
        {
          cate_id: 5,
          cate_name: '前端',
        },
        {
          cate_id: 6,
          cate_name: '其他',
        },
      ],
        showType: [
            {
                id: 1,
                name: 'html',
            },
            {
                id: 2,
                name: 'markdown',
            },
        ],
      rules: {
        img_path: [{ validator: validateRequire }],
        title: [{ validator: validateRequire }],
        contents: [{ validator: validateRequire }],
        // source_uri: [{ validator: validateSourceUri, trigger: 'blur' }]
      },
      tempRoute: {},
        markdownEditor : {
          height:"400px",
            language:"zh_CN"
        }
    }
  },
  computed: {
    contentShortLength() {
      return this.postForm.description.length
    },
    lang() {
      return this.$store.getters.language
    },
    displayTime: {
      // set and get is useful when the data
      // returned by the back end api is different from the front end
      // back end return => "2013-06-25 06:59:25"
      // front end need timestamp => 1372114765000
      get() {
        return this.postForm.publish_time
      },
      set(val) {
        this.postForm.publish_time = val
      }
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    }

    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route)
  },
  mounted() {

  },
  methods: {
    fetchData(id) {
      fetchArticle(id).then(response => {
        response.data.status_switch = false
        // this.postForm = Object.assign({}, response.data)
        this.postForm = response.data
        // this.postForm.id = response.data.id
        // this.postForm.cate_id = response.data.cate_id
        // this.postForm.title = response.data.title
        // this.postForm.contents = response.data.contents
        // this.postForm.description = response.data.description
        // this.postForm.keywords = response.data.keywords
        // this.postForm.img_path = response.data.img_path
        // this.postForm.publish_time = response.data.publish_time
        // this.postForm.show_type = response.data.show_type
        // this.postForm.status = response.data.status
        if(this.postForm.status === 1) {
          this.postForm.status_switch = false
        } else {
          this.postForm.status_switch = true
        }
        this.setTagsViewTitle()

        // set page title
        this.setPageTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    setTagsViewTitle() {
      const title = this.lang === 'zh' ? '编辑文章' : 'Edit Article'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.postForm.id}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = 'Edit Article'
      document.title = `${title} - ${this.postForm.id}`
    },
    submitForm() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
            if (this.postForm.status_switch === true) {
              this.postForm.status = 2
            } else {
              this.postForm.status = 1
            }
            this.loading = true
            if (this.isEdit) {
              this.$store.dispatch('article/update',this.postForm)
                      .then(() => {
                        this.loading = false
                        this.$notify({
                          title: '成功',
                          message: '发布文章成功',
                          type: 'success',
                          duration: 2000
                        })
                        this.reload()
                        this.$router.push({ path: '/article/list'})
                      })
                      .catch(() => {
                        this.loading = false
                      })

            } else {
              this.$store.dispatch('article/create', this.postForm)
                      .then(() => {
                        this.loading = false
                        this.$notify({
                          title: '成功',
                          message: '发布文章成功',
                          type: 'success',
                          duration: 2000
                        })
                        this.reload()
                        this.$router.push({ path: '/article/list'})
                      })
                      .catch(() => {
                        this.loading = false
                      })

            }

          this.postForm.page_status = 'published'
          this.loading = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    draftForm() {
      if (this.postForm.content.length === 0 || this.postForm.title.length === 0) {
        this.$message({
          message: '请填写必要的标题和内容',
          type: 'warning'
        })
        return
      }
      this.$message({
        message: '保存成功',
        type: 'success',
        showClose: true,
        duration: 1000
      })
      this.postForm.page_status = 'draft'
    },
    getRemoteUserList(query) {
      searchUser(query).then(response => {
        if (!response.data.items) return
        this.userListOptions = response.data.items.map(v => v.name)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 40px 45px 20px 50px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}

.article-textarea /deep/ {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}
</style>
