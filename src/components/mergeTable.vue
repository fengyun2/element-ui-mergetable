<template>
  <div class="box">
    <v-table :data="tableData6" :span-method="objectSpanMethod" border style="100%" ref="table" :row-key="getRowKeys" @selection-change="handleSelectionChange" @select-all="handleSelectAll" @select="handleChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="id" label="ID" width="180">
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="180">
      </el-table-column>
      <el-table-column label="麦芽糖" align="center">
        <el-table-column prop="amount1" label="数值 1（元）">
        </el-table-column>
      </el-table-column>
      <el-table-column label="配送信息" align="center" fixed="right">
        <el-table-column prop="amount1" label="数值 1（元）" fixed="right">
        </el-table-column>
        <el-table-column prop="amount2" label="数值 2（元）" fixed="right">
        </el-table-column>
        <el-table-column prop="amount3" label="数值 3（元）" fixed="right">
        </el-table-column>
        <el-table-column prop="amount4" label="数值 4（元）" fixed="right">
        </el-table-column>
        <el-table-column prop="amount5" label="数值 5（元）" fixed="right">
        </el-table-column>
        <el-table-column prop="amount6" label="数值 6（元）" fixed="right">
        </el-table-column>
        <el-table-column prop="amount7" label="数值 7（元）" fixed="right">
        </el-table-column>
        <el-table-column prop="amount8" label="数值 8（元）" fixed="right">
        </el-table-column>
        <el-table-column prop="amount9" label="数值 9（元）" fixed="right">
        </el-table-column>
        <el-table-column prop="amount10" label="数值 10（元）" fixed="right">
        </el-table-column>
      </el-table-column>

    </v-table>
  </div>
</template>

<script>
import VTable from './common/table/table.vue';
export default {
  components: {
    [VTable.name]: VTable
  },
  data () {
    return {
      tableData6: [
        {
          id: '12987122',
          name: '王小虎1',
          amount1: '234',
          amount2: '3.2',
          amount3: 10,
          amount4: 11,
          amount5: 12,
          amount6: 14,
          amount7: 15,
          amount8: 16,
          amount9: 17,
          amount10: 18
        },
        {
          id: '12987123',
          name: '王小虎1',
          amount1: '165',
          amount2: '4.43',
          amount3: 12,
          amount4: 11,
          amount5: 12,
          amount6: 14,
          amount7: 15,
          amount8: 16,
          amount9: 17,
          amount10: 18

        },
        {
          id: '12987124',
          name: '王小虎3',
          amount1: '324',
          amount2: '1.9',
          amount3: 9,
          amount4: 11,
          amount5: 12,
          amount6: 14,
          amount7: 15,
          amount8: 16,
          amount9: 17,
          amount10: 18
        },
        {
          id: '12987125',
          name: '王小虎',
          amount1: '621',
          amount2: '2.2',
          amount3: 17,
          amount4: 11,
          amount5: 12,
          amount6: 14,
          amount7: 15,
          amount8: 16,
          amount9: 17,
          amount10: 18
        },
        {
          id: '12987126',
          name: '王小虎',
          amount1: '539',
          amount2: '4.1',
          amount3: 15,
          amount4: 11,
          amount5: 12,
          amount6: 14,
          amount7: 15,
          amount8: 16,
          amount9: 17,
          amount10: 18
        }
      ],
      pos: 0,
      spanArr: []
    };
  },
  created () {
    this.getSpanArr(this.tableData6);
  },
  methods: {
    getSpanArr (data) {
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr.push(1);
          this.pos = 0;
        } else {
          // 判断当前元素与上一个元素是否相同
          if (data[i].name === data[i - 1].name) {
            this.spanArr[this.pos] += 1;
            this.spanArr.push(0);
          } else {
            this.spanArr.push(1);
            this.pos = i;
          }
        }
      }
    },
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 2) {
        // console.log('column: ', column)
        // console.log('columnIndex ', this.spanArr);
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row, // 合并的行数
          colspan: _col // 合并的列数, 设为０则直接不显示
        };
      }

      // if (columnIndex === 1) {
      //   if (rowIndex % 2 === 0) {
      //     return {
      //       rowspan: 2,
      //       colspan: 1
      //     };
      //   } else {
      //     return {
      //       rowspan: 0,
      //       colspan: 0
      //     };
      //   }
      // }

      // if (columnIndex === 1) {
      //   if (rowIndex % 3 === 0) {
      //     return {
      //       rowspan: 3,
      //       colspan: 1
      //     };
      //   } else {
      //     return {
      //       rowspan: 0,
      //       colspan: 0
      //     };
      //   }
      // }
    },
    handleSelectAll (rows) {
      console.log('handleSelectAll - ', rows);
    },
    handleSelectionChange (rows) {
      console.log('handleSelectionChange - ', rows);
    },
    handleChange (selection, row) {
      console.log('handleChange - ', selection, row);
    },
    // 获取row的key值
    getRowKeys (row) {
      return row.id;
    }
  }
};
</script>

<style>
</style>
