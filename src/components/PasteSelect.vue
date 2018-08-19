<template>
  <div class="paste-select-box">
      
    <el-popover ref="popover" :width="dialogWidth" v-model="dialogVisible" placement="bottom-end">
      <el-form ref="form-language">
        <el-form-item>
          <el-input type="textarea" v-model="tmpSubContent" :rows="8" placeholder="请输入内容" @change="handleSubContentChange" />
        </el-form-item>
      </el-form>
      <div class="dialog-footer" style="text-align: right;">
        <el-button @click="handleCancel">清 除</el-button>
        <el-button type="primary" @click="dialogEnter">确 定</el-button>
      </div>
    </el-popover>

      <el-form ref="form" slot="reference" class="paste-select-form" :style="[{'width': width + 'px'}]" :model="form" :label-width="innerLabelWidth">
        <el-form-item :label="params.label" :prop="form[params.fieid]"
        :rules="[
        { required: required, message: params.label + '字段必填', trigger: 'blur' }
        ]">
          <div class="el-select__tags" :style="{ 'max-width': inputWidth - 32 + 'px' }">
          <template v-if="!dialogVisible && subContentArr.length > 0">
            <el-tag
              :closable="true"
              :hit="true"
              :size="collapseTagSize"
              type="info"
              @close="deleteTag($event, {})"
              class="el-tag--small"
              disable-transitions>
              <span class="el-select__tags-text">{{ subContentArr[0] }}</span>
            </el-tag>
            <el-tag
              v-if="subContentArr.length > 1"
              :closable="false"
              :size="collapseTagSize"
              type="info"
              class="el-tag--small"
              disable-transitions>
              <span class="el-select__tags-text">+ {{ subContentArr.length - 1 }}</span>
            </el-tag>
          </template>
          </div>
          <el-input ref="reference" :class="{subject: true, 'hide':  !dialogVisible && subContentArr.length > 0 }" :readonly="!dialogVisible && subContentArr.length > 0" v-model.trim="form[params.fieid]" @change="changeInput" :disabled="disabled" :maxlength="maxlength"></el-input>
          <i class="icon el-icon-edit paste-select-icon" @click="openDialog" v-popover:popover></i>
        </el-form-item>
      </el-form>
  </div>
</template>

<script>
import { addResizeListener, removeResizeListener } from 'element-ui/src/utils/resize-event';
import emitter from 'element-ui/src/mixins/emitter';
export default {
  mixins: [emitter],
  props: {
    params: {
      type: Object,
      default: () => {}
    },
    content: {
      type: Array,
      default: () => []
    },
    required: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '222'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    maxlength: {
      type: Number,
      default: 50
    },
    labelWidth: {
      type: String,
      default: '50'
    }
  },
  data() {
    return {
      form: {
        [this.params.fieid]: ''
      },
      fromContentInput: 'input',
      subContent: '',
      subContentArr: [],
      tmpSubContent: '', // 还没确定时的textarea的值（即还没按确定健）
      tmpSubContentArr: '',
      dialogVisible: false,
      isCancelSubContent: false,
      inputWidth: 0
    };
  },
  computed: {
    collapseTagSize() {
      return 'small';
    },
    dialogWidth () {
      return this.inputWidth + Number(this.labelWidth) + 'px'
    },
    innerLabelWidth() {
      return this.labelWidth + 'px'
    }
  },
  mounted() {
    addResizeListener(this.$el, this.handleResize);
    this.$nextTick(() => {
      if (this.$refs.reference && this.$refs.reference.$el) {
        this.inputWidth = this.$refs.reference.$el.getBoundingClientRect().width;
      }
    });
  },
  methods: {
    changeInput() {},
    handleClose() {
      this.dialogVisible = false;
    },
    handleCancel() {
      this.tmpSubContent = ''
      this.tmpSubContentArr = []
      this.isCancelSubContent = true
    },
    
    resetInputWidth() {
      this.inputWidth = this.$refs.reference.$el.getBoundingClientRect().width;
    },
    handleResize() {
      this.resetInputWidth();
    },
    openDialog() {
      this.dialogVisible = true;
      this.isCancelSubContent = false
      if(this.form[this.params.fieid] && (this.fromContentInput === 'input' || !this.subContent)) {
        this.subContentArr = this.tmpSubContentArr = this.form[this.params.fieid].split(',')
        this.subContent = this.tmpSubContent = this.tmpSubContentArr.join('\r\n')
      }
    },
    dialogEnter() {
      this.fromContentInput = 'textarea'
      if(this.isCancelSubContent) {
        this.form[this.params.fieid] = '';
        this.subContent = ''
        this.subContentArr = []
      }
      let tmpSubContentArr = [];
      if (this.tmpSubContent) {
        tmpSubContentArr = this.tmpSubContent.split(/[(\r\n)(\s\n)\r\n]+/);
        tmpSubContentArr = tmpSubContentArr.filter(item => item && item.trim());
      }
      this.subContent = this.tmpSubContent
      this.subContentArr = this.tmpSubContentArr = tmpSubContentArr;
      this.form[this.params.fieid] = tmpSubContentArr.join(',');
      this.dialogVisible = false;
    },
    deleteTag(event, tag) {
      this.fromContentInput = 'input'
      this.form[this.params.fieid] = '';
      this.subContent = '';
      this.subContentArr = [];
      event.stopPropagation();
    },
    handleSubContentChange() {},
    clearEmptyArray(arr) {
      return arr.filter(item => item && item.trim());
    },
    beforeDestroy() {
      if (this.$el && this.handleResize) removeResizeListener(this.$el, this.handleResize);
    }
  }
};
</script>

<style lang="css">
.paste-select-box {
  display: inline-block;
}
.paste-select-box .el-dialog__wrapper {
  position: absolute;
  top: 48px; 
  right: 0; 
  left: 0; 
  overflow: visible; 
  margin: 0; 
}
.paste-select-box .paste-select-icon {
    position: absolute;
    width: 35px;
    height: 100%;
    right: 0;
    top: 0;
    text-align: center;
    color: #bfcbd9;
    transition: all .3s;
}
.paste-select-box .paste-select-icon:before {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
.paste-select-box .paste-select-form {
  display: inline-block;
}
.paste-select-box .paste-select-dialog {
  position: relative;
  width: 100%;
}
.paste-select-dialog .el-form-item{
  margin-bottom: 0;
}
.paste-select-box .el-dialog__header {
  padding: 0;
}
.paste-select-box .el-dialog__body {
  padding: 0;
}
.paste-select-box .el-select__tags {
    position: absolute;
    line-height: normal;
    white-space: normal;
    z-index: 1;
    top: 50%;
    transform: translateY(-50%);
}
.paste-select-box .el-tag--small {
  height: 24px;
  padding: 0 8px;
  line-height: 22px;
  box-sizing: border-box;
  border-color: transparent;
  margin: 2px 0 2px 6px;
  max-width: 75px;
  display: inline-block;
}
.paste-select-box .el-select__tags-text {
  max-width: 50px;
  display: inline-block;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.paste-select-box .hide .el-input__inner {
  color: #fff;
  // text-overflow: ellipsis;
  // white-space: nowrap;
  // overflow: hidden;
}
.paste-select-box .el-input__inner {
  padding-right: 35px;
}
</style>
