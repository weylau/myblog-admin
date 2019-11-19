<template>
  <div class="app-container">
    <router-link :to="'/article/create'">
      <el-button type="primary" size="small" icon="caret-bottom" style="margin-bottom: 20px">
        添加
      </el-button>
    </router-link>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.article_id }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="200px" label="标题">
        <template slot-scope="{row}">
          <router-link :to="'/article/edit/'+row.article_id" class="link-type">
            <span>{{ row.title }}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column align="center" label="显示状态" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.status == 1 ? "公开" : "私密" }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="发布时间">
        <template slot-scope="scope">
          <span>{{ scope.row.modify_time}}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="作者">
        <template slot-scope="scope">
          <span>{{ scope.row.op_user }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="220">
        <template slot-scope="scope">
          <router-link :to="'/article/edit/'+scope.row.article_id">
            <el-button type="primary" size="small" icon="el-icon-edit">
              编辑
            </el-button>
          </router-link>
        <br/>
            <el-button type="primary" size="small" icon="el-icon-delete" @click="handleDelete(scope.row.article_id)">
              删除
            </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.page_size" @pagination="getList" />
  </div>
</template>

<script>
import { fetchList, deleteArticle} from '@/api/article'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'ArticleList',
  components: { Pagination },
  inject:['reload'],
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      isRouterAlive:true,
      listQuery: {
        page: 1,
        page_size: 20
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        console.log('list-response:', response)
        this.list = response.data.datalist
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleDelete(article_id) {
      this.$confirm('确定删除此条记录?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
      .then(async() => {
        await deleteArticle(article_id)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.reload()
      })
      .catch(err => { console.error(err) })
    },
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
