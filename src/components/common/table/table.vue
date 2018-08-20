<template>
  <div class="el-table salary-ihr-v-table"
    :class="[{
      'el-table--fit': fit,
      'el-table--striped': stripe,
      'el-table--border': border || isGroup,
      'el-table--hidden': isHidden,
      'el-table--group': isGroup,
      'el-table--fluid-height': maxHeight,
      'el-table--scrollable-x': layout.scrollX,
      'el-table--scrollable-y': layout.scrollY,
      'el-table--enable-row-hover': !store.states.isComplex,
      'el-table--enable-row-transition': (store.states.data || []).length !== 0 && (store.states.data || []).length < 100
    }, tableSize ? `el-table--${ tableSize }` : '']"
    @mouseleave="handleMouseLeave($event)">
    <div class="hidden-columns" ref="hiddenColumns"><slot></slot></div>
    <div
      v-if="showHeader"
      v-mousewheel="handleHeaderFooterMousewheel"
      class="el-table__header-wrapper"
      ref="headerWrapper">
      <table-header
        ref="tableHeader"
        :store="store"
        :border="border"
        :default-sort="defaultSort"
        :style="{
          width: layout.bodyWidth ? layout.bodyWidth + 'px' : ''
        }">
      </table-header>
    </div>
    <div
      class="el-table__body-wrapper"
      ref="bodyWrapper"
      :class="[layout.scrollX ? `is-scrolling-${scrollPosition}` : 'is-scrolling-none']"
      :style="[bodyHeight]">
      <table-body
        :context="context"
        :store="store"
        :stripe="stripe"
        :row-class-name="rowClassName"
        :row-style="rowStyle"
        :highlight="highlightCurrentRow"
        :style="{
           width: bodyWidth
        }">
      </table-body>
      <div
        v-if="!data || data.length === 0"
        class="el-table__empty-block"
        ref="emptyBlock"
        :style="{
          width: bodyWidth
        }">
        <span class="el-table__empty-text">
          <slot name="empty">{{ emptyText || t('el.table.emptyText') }}</slot>
        </span>
      </div>
      <div
        v-if="$slots.append"
        class="el-table__append-wrapper"
        ref="appendWrapper">
        <slot name="append"></slot>
      </div>
    </div>
    <div
      v-if="showSummary"
      v-show="data && data.length > 0"
      v-mousewheel="handleHeaderFooterMousewheel"
      class="el-table__footer-wrapper"
      ref="footerWrapper">
      <table-footer
        :store="store"
        :border="border"
        :sum-text="sumText || t('el.table.sumText')"
        :summary-method="summaryMethod"
        :default-sort="defaultSort"
        :style="{
          width: layout.bodyWidth ? layout.bodyWidth + 'px' : ''
        }">
      </table-footer>
    </div>
    <div
      v-if="fixedColumns.length > 0"
      v-mousewheel="handleFixedMousewheel"
      class="el-table__fixed"
      ref="fixedWrapper"
      :style="[{
        width: layout.fixedWidth ? layout.fixedWidth + 'px' : ''
      },
      fixedHeight]">
      <div
        v-if="showHeader"
        class="el-table__fixed-header-wrapper"
        ref="fixedHeaderWrapper" >
        <table-header
          ref="fixedTableHeader"
          fixed="left"
          :border="border"
          :store="store"
          :style="{
            width: bodyWidth
          }"></table-header>
      </div>
      <div
        class="el-table__fixed-body-wrapper"
        ref="fixedBodyWrapper"
        :style="[{
          top: layout.headerHeight + 'px'
        },
        fixedBodyHeight]">
        <table-body
          fixed="left"
          :store="store"
          :stripe="stripe"
          :highlight="highlightCurrentRow"
          :row-class-name="rowClassName"
          :row-style="rowStyle"
          :style="{
            width: bodyWidth
          }">
        </table-body>
        <div
          v-if="$slots.append"
          class="el-table__append-gutter"
          :style="{
            height: layout.appendHeight + 'px'
          }"></div>
      </div>
      <div
        v-if="showSummary"
        v-show="data && data.length > 0"
        class="el-table__fixed-footer-wrapper"
        ref="fixedFooterWrapper">
        <table-footer
          fixed="left"
          :border="border"
          :sum-text="sumText || t('el.table.sumText')"
          :summary-method="summaryMethod"
          :store="store"
          :style="{
            width: bodyWidth
          }"></table-footer>
      </div>
    </div>
    <div
      v-if="rightFixedColumns.length > 0"
      v-mousewheel="handleFixedMousewheel"
      class="el-table__fixed-right"
      ref="rightFixedWrapper"
      :style="[{
        width: layout.rightFixedWidth ? layout.rightFixedWidth + 'px' : '',
        right: layout.scrollY ? (border ? layout.gutterWidth : (layout.gutterWidth || 0)) + 'px' : ''
      },
      fixedHeight]">
      <div v-if="showHeader"
        class="el-table__fixed-header-wrapper"
        ref="rightFixedHeaderWrapper">
        <table-header
          ref="rightFixedTableHeader"
          fixed="right"
          :border="border"
          :store="store"
          :style="{
            width: bodyWidth
          }"></table-header>
      </div>
      <div
        class="el-table__fixed-body-wrapper"
        ref="rightFixedBodyWrapper"
        :style="[{
          top: layout.headerHeight + 'px'
        },
        fixedBodyHeight]">
        <table-body
          fixed="right"
          :store="store"
          :stripe="stripe"
          :row-class-name="rowClassName"
          :row-style="rowStyle"
          :highlight="highlightCurrentRow"
          :style="{
            width: bodyWidth
          }">
        </table-body>
      </div>
      <div
        v-if="showSummary"
        v-show="data && data.length > 0"
        class="el-table__fixed-footer-wrapper"
        ref="rightFixedFooterWrapper">
        <table-footer
          fixed="right"
          :border="border"
          :sum-text="sumText || t('el.table.sumText')"
          :summary-method="summaryMethod"
          :store="store"
          :style="{
            width: bodyWidth
          }"></table-footer>
      </div>
    </div>
    <div
      v-if="rightFixedColumns.length > 0"
      class="el-table__fixed-right-patch"
      ref="rightFixedPatch"
      :style="{
        width: layout.scrollY ? layout.gutterWidth + 'px' : '0',
        height: layout.headerHeight + 'px'
      }"></div>
    <div class="el-table__column-resize-proxy" ref="resizeProxy" v-show="resizeProxyVisible"></div>
  </div>
</template>

<script type="text/babel">
  import ElCheckbox from 'element-ui/packages/checkbox';
  import debounce from 'throttle-debounce/debounce';
  import { addResizeListener, removeResizeListener } from 'element-ui/src/utils/resize-event';
  import Mousewheel from './directives/mousewheel';
  import Locale from 'element-ui/src/mixins/locale';
  import TableStore from './table-store';
  import TableLayout from './table-layout';
  import TableBody from './table-body';
  import TableHeader from './table-header';
  import TableFooter from 'element-ui/packages/table/src/table-footer';
  // import TableFooter from './table-footer';
  let tableIdSeed = 1;
  export default {
    name: 'VTable',
    mixins: [Locale],
    directives: {
      Mousewheel
    },
    props: {
      data: {
        type: Array,
        default: function() {
          return [];
        }
      },
      size: String,
      width: [String, Number],
      height: [String, Number],
      maxHeight: [String, Number],
      fit: {
        type: Boolean,
        default: true
      },
      stripe: Boolean,
      border: Boolean,
      rowKey: [String, Function],
      context: {},
      showHeader: {
        type: Boolean,
        default: true
      },
      showSummary: Boolean,
      sumText: String,
      summaryMethod: Function,
      rowClassName: [String, Function],
      rowStyle: [Object, Function],
      cellClassName: [String, Function],
      cellStyle: [Object, Function],
      headerRowClassName: [String, Function],
      headerRowStyle: [Object, Function],
      headerCellClassName: [String, Function],
      headerCellStyle: [Object, Function],
      highlightCurrentRow: Boolean,
      currentRowKey: [String, Number],
      emptyText: String,
      expandRowKeys: Array,
      defaultExpandAll: Boolean,
      defaultSort: Object,
      tooltipEffect: String,
      spanMethod: Function,
      selectOnIndeterminate: {
        type: Boolean,
        default: true
      }
    },
    components: {
      TableHeader,
      TableFooter,
      TableBody,
      ElCheckbox
    },
    methods: {
      getMigratingConfig() {
        return {
          events: {
            expand: 'expand is renamed to expand-change'
          }
        };
      },
      setCurrentRow(row) {
        this.store.commit('setCurrentRow', row);
      },
      toggleRowSelection(row, selected) {
        this.store.toggleRowSelection(row, selected);
        this.store.updateAllSelected();
      },
      toggleRowExpansion(row, expanded) {
        this.store.toggleRowExpansion(row, expanded);
      },
      clearSelection() {
        this.store.clearSelection();
      },
      clearFilter() {
        this.store.clearFilter();
      },
      clearSort() {
        this.store.clearSort();
      },
      handleMouseLeave() {
        this.store.commit('setHoverRow', null);
        if (this.hoverState) this.hoverState = null;
      },
      updateScrollY() {
        this.layout.updateScrollY();
        this.layout.updateColumnsWidth();
      },
      handleFixedMousewheel(event, data) {
        const bodyWrapper = this.bodyWrapper;
        if (Math.abs(data.spinY) > 0) {
          const currentScrollTop = bodyWrapper.scrollTop;
          if (data.pixelY < 0 && currentScrollTop !== 0) {
            event.preventDefault();
          }
          if (data.pixelY > 0 && bodyWrapper.scrollHeight - bodyWrapper.clientHeight > currentScrollTop) {
            event.preventDefault();
          }
          bodyWrapper.scrollTop += Math.ceil(data.pixelY / 5);
        } else {
          bodyWrapper.scrollLeft += Math.ceil(data.pixelX / 5);
        }
      },
      handleHeaderFooterMousewheel(event, data) {
        const { pixelX, pixelY } = data;
        if (Math.abs(pixelX) >= Math.abs(pixelY)) {
          event.preventDefault();
          this.bodyWrapper.scrollLeft += data.pixelX / 5;
        }
      },
      bindEvents() {
        const { headerWrapper, footerWrapper } = this.$refs;
        const refs = this.$refs;
        let self = this;
        this.bodyWrapper.addEventListener('scroll', function() {
          if (headerWrapper) headerWrapper.scrollLeft = this.scrollLeft;
          if (footerWrapper) footerWrapper.scrollLeft = this.scrollLeft;
          if (refs.fixedBodyWrapper) refs.fixedBodyWrapper.scrollTop = this.scrollTop;
          if (refs.rightFixedBodyWrapper) refs.rightFixedBodyWrapper.scrollTop = this.scrollTop;
          const maxScrollLeftPosition = this.scrollWidth - this.offsetWidth - 1;
          const scrollLeft = this.scrollLeft;
          console.log(' ================== bindEvents start ====================')
          console.log('scrollLeft: ', scrollLeft)
          console.log('maxScrollLeftPosition: ', maxScrollLeftPosition)
          console.log(' ================== bindEvents end ====================')
          if (scrollLeft >= maxScrollLeftPosition) {
            self.scrollPosition = 'right';
          } else if (scrollLeft === 0) {
            self.scrollPosition = 'left';
          } else {
            self.scrollPosition = 'middle';
          }
        });
        if (this.fit) {
          addResizeListener(this.$el, this.resizeListener);
        }
      },
      resizeListener() {
        if (!this.$ready) return;
        let shouldUpdateLayout = false;
        const el = this.$el;
        const { width: oldWidth, height: oldHeight } = this.resizeState;
        const width = el.offsetWidth;
        if (oldWidth !== width) {
          shouldUpdateLayout = true;
        }
        const height = el.offsetHeight;
        if ((this.height || this.shouldUpdateHeight) && oldHeight !== height) {
          shouldUpdateLayout = true;
        }
        if (shouldUpdateLayout) {
          this.resizeState.width = width;
          this.resizeState.height = height;
          this.doLayout();
        }
      },
      doLayout() {
        this.layout.updateColumnsWidth();
        if (this.shouldUpdateHeight) {
          this.layout.updateElsHeight();
        }
      },
      sort(prop, order) {
        this.store.commit('sort', { prop, order });
      },
      toggleAllSelection() {
        this.store.commit('toggleAllSelection');
      }
    },
    created() {
      this.tableId = 'el-table_' + tableIdSeed++;
      this.debouncedUpdateLayout = debounce(50, () => this.doLayout());
    },
    computed: {
      tableSize() {
        return this.size || (this.$ELEMENT || {}).size;
      },
      bodyWrapper() {
        return this.$refs.bodyWrapper;
      },
      shouldUpdateHeight() {
        return this.height ||
          this.maxHeight ||
          this.fixedColumns.length > 0 ||
          this.rightFixedColumns.length > 0;
      },
      selection() {
        return this.store.states.selection;
      },
      columns() {
        return this.store.states.columns;
      },
      tableData() {
        return this.store.states.data;
      },
      fixedColumns() {
        return this.store.states.fixedColumns;
      },
      rightFixedColumns() {
        return this.store.states.rightFixedColumns;
      },
      bodyWidth() {
        const { bodyWidth, scrollY, gutterWidth } = this.layout;
        return bodyWidth ? bodyWidth - (scrollY ? gutterWidth : 0) + 'px' : '';
      },
      bodyHeight() {
        if (this.height) {
          return {
            height: this.layout.bodyHeight ? this.layout.bodyHeight + 'px' : ''
          };
        } else if (this.maxHeight) {
          return {
            'max-height': (this.showHeader
              ? this.maxHeight - this.layout.headerHeight - this.layout.footerHeight
              : this.maxHeight - this.layout.footerHeight) + 'px'
          };
        }
        return {};
      },
      fixedBodyHeight() {
        if (this.height) {
          return {
            height: this.layout.fixedBodyHeight ? this.layout.fixedBodyHeight + 'px' : ''
          };
        } else if (this.maxHeight) {
          let maxHeight = this.layout.scrollX ? this.maxHeight - this.layout.gutterWidth : this.maxHeight;
          if (this.showHeader) {
            maxHeight -= this.layout.headerHeight;
          }
          maxHeight -= this.layout.footerHeight;
          return {
            'max-height': maxHeight + 'px'
          };
        }
        return {};
      },
      fixedHeight() {
        if (this.maxHeight) {
          if (this.showSummary) {
            return {
              bottom: 0
            };
          }
          return {
            bottom: (this.layout.scrollX && this.data.length) ? this.layout.gutterWidth + 'px' : ''
          };
        } else {
          if (this.showSummary) {
            return {
              height: this.layout.tableHeight ? this.layout.tableHeight + 'px' : ''
            };
          }
          return {
            height: this.layout.viewportHeight ? this.layout.viewportHeight + 'px' : ''
          };
        }
      }
    },
    watch: {
      height: {
        immediate: true,
        handler(value) {
          this.layout.setHeight(value);
        }
      },
      maxHeight: {
        immediate: true,
        handler(value) {
          this.layout.setMaxHeight(value);
        }
      },
      currentRowKey(newVal) {
        this.store.setCurrentRowKey(newVal);
      },
      data: {
        immediate: true,
        handler(value) {
          this.store.commit('setData', value);
          if (this.$ready) {
            this.$nextTick(() => {
              this.doLayout();
            });
          }
        }
      },
      expandRowKeys: {
        immediate: true,
        handler(newVal) {
          if (newVal) {
            this.store.setExpandRowKeys(newVal);
          }
        }
      },
      'layout.scrollX': {
        immediate: true,
        handler(value) {
          console.log('layout.scrollX =================> ', value)
        }
    }
    },
    destroyed() {
      if (this.resizeListener) removeResizeListener(this.$el, this.resizeListener);
    },
    mounted() {
      this.bindEvents();
      this.store.updateColumns();
      this.doLayout();
      this.resizeState = {
        width: this.$el.offsetWidth,
        height: this.$el.offsetHeight
      };
      // init filters
      this.store.states.columns.forEach(column => {
        if (column.filteredValue && column.filteredValue.length) {
          this.store.commit('filterChange', {
            column,
            values: column.filteredValue,
            silent: true
          });
        }
      });
      this.$ready = true;
    },
    data() {
      const store = new TableStore(this, {
        rowKey: this.rowKey,
        defaultExpandAll: this.defaultExpandAll,
        selectOnIndeterminate: this.selectOnIndeterminate
      });
      const layout = new TableLayout({
        store,
        table: this,
        fit: this.fit,
        showHeader: this.showHeader
      });
      return {
        layout,
        store,
        isHidden: false,
        renderExpanded: null,
        resizeProxyVisible: false,
        resizeState: {
          width: null,
          height: null
        },
        // 是否拥有多级表头
        isGroup: false,
        scrollPosition: 'left'
      };
    }
  };
</script>

<style lang="less">
  .salary-ihr-v-table {
    .el-table__body-wrapper {
      overflow: hidden;
      position: relative;
    }
    &.el-table--scrollable-x .el-table__body-wrapper {
      overflow-x: auto;
    }
    &.el-table--scrollable-y .el-table__body-wrapper {
      overflow-y: auto;
    }
    .el-table__fixed,
    .el-table__fixed-right {
      position: absolute;
      top: 0;
      left: 0;
      overflow-x: hidden;
      overflow-y: hidden;
    }
  }

</style>


<!-- <template>
  <div class="el-table"
    :class="{
      'el-table--fit': fit,
      'el-table--striped': stripe,
      'el-table--border': border,
      'el-table--fluid-height': maxHeight,
      'el-table--scrollable-x': layout.scrollX,
      'el-table--scrollable-y': layout.scrollY,
      'el-table--enable-row-hover': !store.states.isComplex,
      'el-table--enable-row-transition': (store.states.data || []).length !== 0 && (store.states.data || []).length < 100
    }"
    @mouseleave="handleMouseLeave($event)">
    <div class="hidden-columns" ref="hiddenColumns"><slot></slot></div>
    <div class="el-table__header-wrapper" ref="headerWrapper" v-if="showHeader">
      <table-header
        :store="store"
        :layout="layout"
        :border="border"
        :default-sort="defaultSort"
        :style="{ width: layout.bodyWidth ? layout.bodyWidth + 'px' : '' }">
      </table-header>
    </div>
    <div
      class="el-table__body-wrapper"
      ref="bodyWrapper"
      :style="[bodyHeight]">
      <table-body
        :context="context"
        :store="store"
        :stripe="stripe"
        :layout="layout"
        :row-class-name="rowClassName"
        :row-style="rowStyle"
        :highlight="highlightCurrentRow"
        :style="{ width: bodyWidth }">
      </table-body>
      <div :style="{ width: bodyWidth }" class="el-table__empty-block" v-if="!data || data.length === 0">
        <span class="el-table__empty-text"><slot name="empty">{{ emptyText || t('el.table.emptyText') }}</slot></span>
      </div>
    </div>
    <div class="el-table__footer-wrapper" ref="footerWrapper" v-if="showSummary" v-show="data && data.length > 0">
      <table-footer
        :store="store"
        :layout="layout"
        :border="border"
        :sum-text="sumText || t('el.table.sumText')"
        :summary-method="summaryMethod"
        :default-sort="defaultSort"
        :style="{ width: layout.bodyWidth ? layout.bodyWidth + 'px' : '' }">
      </table-footer>
    </div>
    <div class="el-table__fixed" ref="fixedWrapper"
      v-if="fixedColumns.length > 0"
      :style="[
        { width: layout.fixedWidth ? layout.fixedWidth + 'px' : '' },
        fixedHeight
      ]">
      <div class="el-table__fixed-header-wrapper" ref="fixedHeaderWrapper" v-if="showHeader">
        <table-header
          fixed="left"
          :border="border"
          :store="store"
          :layout="layout"
          :style="{ width: layout.fixedWidth ? layout.fixedWidth + 'px' : '' }"></table-header>
      </div>
      <div class="el-table__fixed-body-wrapper" ref="fixedBodyWrapper"
        :style="[
          { top: layout.headerHeight + 'px' },
          fixedBodyHeight
        ]">
        <table-body
          fixed="left"
          :store="store"
          :stripe="stripe"
          :layout="layout"
          :highlight="highlightCurrentRow"
          :row-class-name="rowClassName"
          :row-style="rowStyle"
          :style="{ width: layout.fixedWidth ? layout.fixedWidth + 'px' : '' }">
        </table-body>
      </div>
      <div class="el-table__fixed-footer-wrapper" ref="fixedFooterWrapper" v-if="showSummary" v-show="data && data.length > 0">
        <table-footer
          fixed="left"
          :border="border"
          :sum-text="sumText || t('el.table.sumText')"
          :summary-method="summaryMethod"
          :store="store"
          :layout="layout"
          :style="{ width: layout.fixedWidth ? layout.fixedWidth + 'px' : '' }"></table-footer>
      </div>
    </div>
    <div class="el-table__fixed-right" ref="rightFixedWrapper"
      v-if="rightFixedColumns.length > 0"
      :style="[
        { width: layout.rightFixedWidth ? layout.rightFixedWidth + 'px' : '' },
        { right: layout.scrollY ? (border ? layout.gutterWidth : (layout.gutterWidth || 1)) + 'px' : '' },
        fixedHeight
      ]">
      <div class="el-table__fixed-header-wrapper" ref="rightFixedHeaderWrapper" v-if="showHeader">
        <table-header
          fixed="right"
          :border="border"
          :store="store"
          :layout="layout"
          :style="{ width: layout.rightFixedWidth ? layout.rightFixedWidth + 'px' : '' }"></table-header>
      </div>
      <div class="el-table__fixed-body-wrapper" ref="rightFixedBodyWrapper"
        :style="[
          { top: layout.headerHeight + 'px' },
          fixedBodyHeight
        ]">
        <table-body
          fixed="right"
          :store="store"
          :stripe="stripe"
          :layout="layout"
          :row-class-name="rowClassName"
          :row-style="rowStyle"
          :highlight="highlightCurrentRow"
          :style="{ width: layout.rightFixedWidth ? layout.rightFixedWidth + 'px' : '' }">
        </table-body>
      </div>
      <div class="el-table__fixed-footer-wrapper" ref="rightFixedFooterWrapper" v-if="showSummary" v-show="data && data.length > 0">
        <table-footer
          fixed="right"
          :border="border"
          :sum-text="sumText || t('el.table.sumText')"
          :summary-method="summaryMethod"
          :store="store"
          :layout="layout"
          :style="{ width: layout.rightFixedWidth ? layout.rightFixedWidth + 'px' : '' }"></table-footer>
      </div>
    </div>
    <div class="el-table__fixed-right-patch"
      v-if="rightFixedColumns.length > 0"
      :style="{ width: layout.scrollY ? layout.gutterWidth + 'px' : '0', height: layout.headerHeight + 'px' }"></div>
    <div class="el-table__column-resize-proxy" ref="resizeProxy" v-show="resizeProxyVisible"></div>
  </div>
</template>

<script type="text/babel">
import ElCheckbox from 'element-ui/packages/checkbox';
import throttle from 'throttle-debounce/throttle';
import debounce from 'throttle-debounce/debounce';
import { addResizeListener, removeResizeListener } from 'element-ui/src/utils/resize-event';
import Locale from 'element-ui/src/mixins/locale';
// import TableStore from 'element-ui/packages/table/src/table-store';
// import TableLayout from 'element-ui/packages/table/src/table-layout';
// import TableBody from 'element-ui/packages/table/src/table-body';
import TableStore from './table-store';
import TableLayout from './table-layout';
import TableBody from './table-body';
import TableHeader from './table-header';
// import TableFooter from './table-footer';
// import TableHeader from 'element-ui/packages/table/src/table-header';
import TableFooter from 'element-ui/packages/table/src/table-footer';
import { mousewheel } from 'element-ui/packages/table/src/util';

let tableIdSeed = 1;

export default {
  name: 'VTable',

  mixins: [Locale],

  props: {
    data: {
      type: Array,
      default: function() {
        return [];
      }
    },

    width: [String, Number],

    height: [String, Number],

    maxHeight: [String, Number],

    fit: {
      type: Boolean,
      default: true
    },

    stripe: Boolean,

    border: Boolean,

    rowKey: [String, Function],

    context: {},

    showHeader: {
      type: Boolean,
      default: true
    },

    showSummary: Boolean,

    sumText: String,

    summaryMethod: Function,

    rowClassName: [String, Function],

    rowStyle: [Object, Function],

    highlightCurrentRow: Boolean,

    currentRowKey: [String, Number],

    emptyText: String,

    expandRowKeys: Array,

    defaultExpandAll: Boolean,

    defaultSort: Object,

    tooltipEffect: String,

    spanMethod: Function
  },

  components: {
    TableHeader,
    TableFooter,
    TableBody,
    ElCheckbox
  },

  methods: {
    setCurrentRow(row) {
      this.store.commit('setCurrentRow', row);
    },

    toggleRowSelection(row, selected) {
      this.store.toggleRowSelection(row, selected);
      this.store.updateAllSelected();
    },

    clearSelection() {
      this.store.clearSelection();
    },

    handleMouseLeave() {
      this.store.commit('setHoverRow', null);
      if (this.hoverState) this.hoverState = null;
    },

    updateScrollY() {
      this.layout.updateScrollY();
      this.layout.updateColumnsWidth();
    },

    bindEvents() {
      const { headerWrapper, footerWrapper } = this.$refs;
      const refs = this.$refs;
      this.bodyWrapper.addEventListener('scroll', function() {
        if (headerWrapper) headerWrapper.scrollLeft = this.scrollLeft;
        if (footerWrapper) footerWrapper.scrollLeft = this.scrollLeft;
        if (refs.fixedBodyWrapper) refs.fixedBodyWrapper.scrollTop = this.scrollTop;
        if (refs.rightFixedBodyWrapper) refs.rightFixedBodyWrapper.scrollTop = this.scrollTop;
      });

      const scrollBodyWrapper = event => {
        const { deltaX, deltaY } = event;

        if (Math.abs(deltaX) < Math.abs(deltaY)) return;

        if (deltaX > 0) {
          this.bodyWrapper.scrollLeft += 10;
        } else if (deltaX < 0) {
          this.bodyWrapper.scrollLeft -= 10;
        }
      };
      if (headerWrapper) {
        mousewheel(headerWrapper, throttle(16, scrollBodyWrapper));
      }
      if (footerWrapper) {
        mousewheel(footerWrapper, throttle(16, scrollBodyWrapper));
      }

      if (this.fit) {
        /*
        this.windowResizeListener = throttle(50, () => {
          if (this.$ready) this.doLayout();
        });
        */
        addResizeListener(this.$el, this.resizeListener);
      }
    },

    resizeListener() {
      if (!this.$ready) return;
      let shouldUpdateLayout = false;
      const el = this.$el;
      const { width: oldWidth, height: oldHeight } = this.resizeState;

      const width = el.offsetWidth;
      if (oldWidth !== width) {
        shouldUpdateLayout = true;
      }

      const height = el.offsetHeight;
      if ((this.height || this.shouldUpdateHeight) && oldHeight !== height) {
        shouldUpdateLayout = true;
      }

      if (shouldUpdateLayout) {
        this.resizeState.width = width;
        this.resizeState.height = height;
        this.doLayout();
      }
    },

    doLayout() {
      // this.store.updateColumns();
      this.layout.updateColumnsWidth();
      if (this.shouldUpdateHeight) {
        this.layout.updateElsHeight();
      }
      /*
      // this.layout.update();
      this.updateScrollY();
      this.$nextTick(() => {
        if (this.height) {
          this.layout.setHeight(this.height);
        } else if (this.maxHeight) {
          this.layout.setMaxHeight(this.maxHeight);
        } else if (this.shouldUpdateHeight) {
          // this.layout.updateHeight();
          this.layout.updateElsHeight();
        }
      });
      */

    }
  },

  created() {
    this.tableId = 'el-table_' + tableIdSeed + '_';
    this.debouncedLayout = debounce(50, () => this.doLayout());
  },

  computed: {
    bodyWrapper() {
      return this.$refs.bodyWrapper;
    },

    shouldUpdateHeight() {
      return this.height ||
        this.maxHeight ||
        this.fixedColumns.length > 0 ||
        this.rightFixedColumns.length > 0;
      /*
      return typeof this.height === 'number' || this.fixedColumns.length > 0 || this.rightFixedColumns.length > 0;
      */
    },

    selection() {
      return this.store.states.selection;
    },

    columns() {
      return this.store.states.columns;
    },

    tableData() {
      return this.store.states.data;
    },

    fixedColumns() {
      return this.store.states.fixedColumns;
    },

    rightFixedColumns() {
      return this.store.states.rightFixedColumns;
    },

    bodyHeight() {
      let style = {};

      if (this.height) {
        style = {
          height: this.layout.bodyHeight ? this.layout.bodyHeight + 'px' : ''
        };
      } else if (this.maxHeight) {
        style = {
          'max-height':
            (this.showHeader
              ? this.maxHeight - this.layout.headerHeight - this.layout.footerHeight
              : this.maxHeight - this.layout.footerHeight) + 'px'
        };
      }

      return style;
    },

    bodyWidth() {
      const { bodyWidth, scrollY, gutterWidth } = this.layout;
      return bodyWidth ? bodyWidth - (scrollY ? gutterWidth : 0) + 'px' : '';
    },

    fixedBodyHeight() {
      let style = {};

      if (this.height) {
        style = {
          height: this.layout.fixedBodyHeight ? this.layout.fixedBodyHeight + 'px' : ''
        };
      } else if (this.maxHeight) {
        let maxHeight = this.layout.scrollX ? this.maxHeight - this.layout.gutterWidth : this.maxHeight;

        if (this.showHeader) {
          maxHeight -= this.layout.headerHeight;
        }

        style = {
          'max-height': maxHeight + 'px'
        };
      }

      return style;
    },

    fixedHeight() {
      let style = {};

      if (this.maxHeight) {
        style = {
          bottom: this.layout.scrollX && this.data.length ? this.layout.gutterWidth + 'px' : ''
        };
      } else {
        style = {
          height: this.layout.viewportHeight ? this.layout.viewportHeight + 'px' : ''
        };
      }

      return style;
    }
  },

  watch: {
    /*
    height(value) {
      this.layout.setHeight(value);
    },
    */

    height: {
      immediate: true,
      handler(value) {
        this.layout.setHeight(value);
      }
    },

    maxHeight: {
      immediate: true,
      handler(value) {
        this.layout.setMaxHeight(value);
      }
    },

    currentRowKey(newVal) {
      this.store.setCurrentRowKey(newVal);
    },

    data: {
      immediate: true,
      handler(val) {
        this.store.commit('setData', val);
        if (this.$ready) {
          this.$nextTick(() => {
            this.doLayout();
          })
        }
      }
    },

    expandRowKeys: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.store.setExpandRowKeys(newVal);
        }
      }
    }
  },

  destroyed() {
    if (this.resizeListener) removeResizeListener(this.$el, this.resizeListener);
  },

  mounted() {
    this.bindEvents();
    this.store.updateColumns();
    this.doLayout();

    this.resizeState = {
      width: this.$el.offsetWidth,
      height: this.$el.offsetHeight
    };

    // init filters
    this.store.states.columns.forEach(column => {
      if (column.filteredValue && column.filteredValue.length) {
        this.store.commit('filterChange', {
          column,
          values: column.filteredValue,
          silent: true
        });
      }
    });

    this.$ready = true;
  },

  data() {
    const store = new TableStore(this, {
      rowKey: this.rowKey,
      defaultExpandAll: this.defaultExpandAll
    });
    const layout = new TableLayout({
      store,
      table: this,
      fit: this.fit,
      showHeader: this.showHeader
    });
    return {
      store,
      layout,
      renderExpanded: null,
      resizeProxyVisible: false,
      resizeState: {
        width: null,
        height: null
      }
    };
  }
};
</script>
 -->
