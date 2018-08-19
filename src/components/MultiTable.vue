<template>
<!--https://www.cnblogs.com/wanglu/p/9160416.html-->
  <div class="box">
    <div class="table-box">
      <el-table :data="tableData" border style="100%" ref="table" :row-key="getRowKeys" @selection-change="handleSelectionChange" @select-all="handleSelectAll">
        <el-table-column
          type="selection"
          :reserve-selection="true"
          width="55">
        </el-table-column>
        <el-table-column prop="jobNumber" label="工号" width="150" fixed="left" align="center"></el-table-column>
        <el-table-column prop="name" label="姓名" width="120" fixed="left" align="center"></el-table-column>
        <el-table-column prop="date" label="发放工资日期" width="150" fixed="left" align="center"></el-table-column>
        <el-table-column label="非统计项目" align="center">
          <el-table-column prop="monthlySalary" label="月薪标准" width="150" align="center"></el-table-column>
        </el-table-column>
        <el-table-column label="固薪" align="center">
          <el-table-column prop="normalSalary" label="正常工作时间工资" width="150" align="center"></el-table-column>
          <el-table-column prop="weekendSalary" label="周末加班工资" width="150" align="center"></el-table-column>
          <el-table-column prop="jobAllowance" label="职位津贴" width="150" align="center"></el-table-column>
          <el-table-column prop="holidaysSalary" label="周末加班工资" width="150" align="center"></el-table-column>
          <el-table-column prop="sickSalary" label="病假工资" width="150" align="center"></el-table-column>
          <el-table-column prop="accumulationFund" label="法定节假日加班工资" width="150" align="center"></el-table-column>
          <el-table-column prop="province" label="省份" width="120" align="center"></el-table-column>
          <el-table-column prop="city" label="市区" width="120" align="center"></el-table-column>      
          <el-table-column prop="address" label="地址" width="300" align="center"></el-table-column>  
          <el-table-column prop="zip" label="邮编" width="120" align="center"></el-table-column>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-box">
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageInfo.page" :page-sizes="[1, 5, 10, 20, 30]" :page-size="pageInfo.pageSize" :total="pageInfo.total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    </div>
  </div>
</template>

<script>
import { getTopics } from '../api/index';
export default {
  data() {
    return {
      allTableDatas: [],
      tableData: [],
      multipleSelectionAll: [], // 所有选中的数据包含跨页数据
      multipleSelection: [], // 当前页选中的数据
      idKey: 'jobNumber', // 标识列表数据中每一行的唯一键的名称(需要按自己的数据改一下)
      select_order_number: 0, // 选中的条数
      select_orderId: [], // 选中的ID
      pageInfo: {
        page: 1,
        pageSize: 10,
        total: 1000
      }
    };
  },
  created() {
    // this.initData();
    // this.getData();
    this.getTopics();
  },
  methods: {
    initData() {
      for (let i = 1; i < 31; i++) {
        const date = i < 10 ? '2018-08-0' + i : '2018-08-' + i;
        const item = {
          jobNumber: 1000 + i,
          date: date,
          name: '王小虎',
          monthlySalary: 50000,
          normalSalary: 20000,
          weekendSalary: 3000,
          jobAllowance: 10000,
          holidaysSalary: 1000,
          sickSalary: 2000,
          accumulationFund: 1000,
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        };
        this.allTableDatas.push(item);
        this.pageInfo.total = this.allTableDatas.length;
      }
    },
    async getTopics(params = {}) {
      const { data: topics } = await getTopics(params);
      console.log('topics: ', topics);
      topics.forEach((topic, i) => {
        topic.jobNumber =  this.pageInfo.page +'000' + i
        topic.date= topic.create_at
        topic.name= '王小虎'
        topic.monthlySalary= 50000
        topic.normalSalary= 20000
        topic.weekendSalary= 3000
        topic.jobAllowance= 10000
        topic.holidaysSalary= 1000
        topic.sickSalary= 2000
        topic.accumulationFund= 1000
        topic.province= '上海'
        topic.city= '普陀区'
        topic.address= '上海市普陀区金沙江路 1518 弄'
        topic.zip= 200333
      })
      this.tableData = topics;
    },
    getData() {
      // 分页查询数据方法，在成功返回数据方法里调用setSelectRow方法，使每次分页查询都能勾选中
      this.tableData = this.allTableDatas.slice(
        (this.pageInfo.page - 1) * this.pageInfo.pageSize,
        this.pageInfo.page * this.pageInfo.pageSize
      );
      this.$nextTick(() => {
        // this.setSelectRow();
      });
    },
    handleSizeChange(val) {
      // 改变每页显示条数的时候调用一次
      // this.changePageCoreRecordData();

      this.pageInfo.page = 1;
      this.pageInfo.pageSize = val;
      // this.getData();
      this.getTopics({ page: this.pageInfo.page });
    },
    handleCurrentChange(val) {
      // 改变页的时候调用一次
      // this.changePageCoreRecordData();

      // console.log('pageInfo - page: ', this.pageInfo.page);
      // this.getData();
      this.getTopics({ page: this.pageInfo.page });
    },
    handleSelectionChange(rows) {
      this.multipleSelection = rows;
      this.select_order_number = this.multipleSelection.length;

      this.select_orderId = [];
      if (rows) {
        rows.forEach(row => {
          if (row) {
            this.select_orderId.push(row.jobNumber);
          }
        });
      }
      console.log('multipleSelection: ', this.multipleSelection);
      console.log('select_orderId: ', this.select_orderId);
    },
    handleSelectAll() {},
    // 获取row的key值
    getRowKeys(row) {
      return row.jobNumber;
    },
    // 设置选中的方法
    setSelectRow() {
      if (!this.multipleSelectionAll || this.multipleSelectionAll.length <= 0) {
        return;
      }
      // 标识当前行的唯一键的名称
      let idKey = this.idKey;
      let selectAllIds = [];
      let that = this;
      this.multipleSelectionAll.forEach(row => {
        selectAllIds.push(row[idKey]);
      });
      this.$refs.table.clearSelection();
      for (var i = 0; i < this.tableData.length; i++) {
        if (selectAllIds.indexOf(this.tableData[i][idKey]) >= 0) {
          // 设置选中，记住table组件需要使用ref="table"
          this.$refs.table.toggleRowSelection(this.tableData[i], true);
        }
      }
    },
    // 记忆选择核心方法
    changePageCoreRecordData() {
      // 标识当前行的唯一键的名称
      let idKey = this.idKey;
      let that = this;
      // 如果总记忆中还没有选择的数据，那么就直接取当前页选中的数据，不需要后面一系列计算
      if (this.multipleSelectionAll.length <= 0) {
        this.multipleSelectionAll = this.multipleSelection;
        return;
      }
      // 总选择里面的key集合
      let selectAllIds = [];
      this.multipleSelectionAll.forEach(row => {
        selectAllIds.push(row[idKey]);
      });
      let selectIds = [];
      // 获取当前页选中的id
      this.multipleSelection.forEach(row => {
        selectIds.push(row[idKey]);
        // 如果总选择里面不包含当前页选中的数据，那么就加入到总选择集合里
        if (selectAllIds.indexOf(row[idKey]) < 0) {
          that.multipleSelectionAll.push(row);
        }
      });
      let noSelectIds = [];
      // 得到当前页没有选中的id
      this.tableData.forEach(row => {
        if (selectIds.indexOf(row[idKey]) < 0) {
          noSelectIds.push(row[idKey]);
        }
      });
      noSelectIds.forEach(id => {
        if (selectAllIds.indexOf(id) >= 0) {
          for (let i = 0; i < that.multipleSelectionAll.length; i++) {
            if (that.multipleSelectionAll[i][idKey] == id) {
              // 如果总选择中有未被选中的，那么就删除这条
              that.multipleSelectionAll.splice(i, 1);
              break;
            }
          }
        }
      });
    }
  }
};
</script>

<style>
</style>
