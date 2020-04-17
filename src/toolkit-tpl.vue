<template>
  <div>
    <div id="ele-cloud-spreadjs-toolkit" style="width: 100%; height: 100%;position: relative">
      <!--撤销，重做-->
      <ButtonGroup>
        <Button type="default" @click="undoCommand" size="small">
          <Tooltip content="撤销" :delay="tipsDelay">
            <i class="spreadfont spreadchexiao"></i>
          </Tooltip>
        </Button>
        <Button type="default" @click="redoCommand" size="small">
          <Tooltip content="恢复" :delay="tipsDelay">
            <i class="spreadfont spreadhuifu"></i>
          </Tooltip>
        </Button>
      </ButtonGroup>

      <!--格式刷-->
      <Button :type="formatPainter.isPainting ? 'primary' : 'default'" size="small" @click="painterCopy">
        <Tooltip content="格式刷" :delay="tipsDelay">
          <i class="spreadfont spreadpainter"></i>
        </Tooltip>
      </Button>

      <!--字体-->
      <div class="toolkit-select">
        <Tooltip content="字体" :delay="tipsDelay" :disabled="tooltip.cellFont">
          <Select size="default" v-model="cellStyle.cellFont" @on-select="setFont" placeholder="字体：" @on-open-change="bool => tooltip.cellFont = bool">
            <Option v-for="item in fontOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Tooltip>
      </div>

      <!--字体大小-->
      <div class="toolkit-select">
        <Tooltip content="字体大小" :delay="tipsDelay" :disabled="tooltip.cellFontSize">
          <Select size="default" v-model="cellStyle.cellFontsize" @on-select="setFontsize" placeholder="大小：" @on-open-change="bool => tooltip.cellFontSize = bool">
            <Option v-for="item in fontsizeOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Tooltip>
      </div>

      <!--格式-->
      <div class="toolkit-select">
        <Tooltip content="格式" :delay="tipsDelay" :disabled="tooltip.cellFormatter">
          <Select size="default" v-model="cellStyle.cellFormatter" @on-select="setFormatter" placeholder="格式：" @on-open-change="bool => tooltip.cellFormatter = bool">
            <Option v-for="item in formatterOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Tooltip>
      </div>

      <!--B I U-->
      <ButtonGroup>
        <Button :type="cellStyle.cellBold ? 'primary' : 'default'" @click="boldCell" size="small">
          <Tooltip content="加粗" :delay="tipsDelay">
            <i class="spreadfont spreadjiacu"></i>
          </Tooltip>
        </Button>
        <Button :type="cellStyle.cellItalic ? 'primary' : 'default'" @click="italicCell" size="small">
          <Tooltip content="斜体" :delay="tipsDelay">
            <i class="spreadfont spreadxieti"></i>
          </Tooltip>
        </Button>
        <Button :type="cellStyle.cellUnderline ? 'primary' : 'default'" @click="underlineCell" size="small">
          <Tooltip content="下划线" :delay="tipsDelay">
            <i class="spreadfont spreadUnderline"></i>
          </Tooltip>
        </Button>
      </ButtonGroup>

      <!--字体/背景颜色-->
      <div style="position: relative;display: inline-block">
        <ButtonGroup>
          <Button size="small" @click.stop="cellColorFunc">
            <Tooltip content="字体颜色" :delay="tipsDelay">
              <i class="spreadfont spreadzitiyanse"></i>
              <Icon type="ios-arrow-down"></Icon>
            </Tooltip>
          </Button>
          <Button size="small" @click.stop="cellColorBgFunc">
            <Tooltip content="背景颜色" :delay="tipsDelay">
              <i class="spreadfont spreadbeijingyanse"></i>
              <Icon type="ios-arrow-down"></Icon>
            </Tooltip>
          </Button>
        </ButtonGroup>
        <ColorPicker ref="cellColorPicker" v-model="cellStyle.cellColor" @on-change="setFontColor"
                     class="toolkit-color-picker"/>
        <ColorPicker ref="cellBgColorPicker" v-model="cellStyle.cellBgColor" @on-change="setBgColor"
                     class="toolkit-color-picker--bg"/>
      </div>

      <!--边框-->
      <Dropdown trigger="click" @on-click="borderFunc">
        <Button size="small">
          <Tooltip content="添加边框" :delay="tipsDelay">
            <i class="spreadfont spreadjurassic_border-bottom"></i>
            <Icon type="ios-arrow-down"></Icon>
          </Tooltip>
        </Button>
        <DropdownMenu slot="list">
          <DropdownItem name="addBorder">所有框线</DropdownItem>
          <DropdownItem name="delBorder">无框线</DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <!--水平对齐-->
      <ButtonGroup>
        <Button :type="cellStyle.cellLeft ? 'primary' : 'default'" @click="hAlignCell('left')" size="small">
          <Tooltip content="左对齐" :delay="tipsDelay">
            <i class="spreadfont spreadzuoduiqi"></i>
          </Tooltip>
        </Button>
        <Button :type="cellStyle.cellCenter ? 'primary' : 'default'" @click="hAlignCell('center')" size="small">
          <Tooltip content="居中对齐" :delay="tipsDelay">
            <i class="spreadfont spreadjuzhong"></i>
          </Tooltip>
        </Button>
        <Button :type="cellStyle.cellRight ? 'primary' : 'default'" @click="hAlignCell('right')" size="small">
          <Tooltip content="右对齐" :delay="tipsDelay">
            <i class="spreadfont spreadyouduiqi"></i>
          </Tooltip>
        </Button>
      </ButtonGroup>

      <!--垂直对齐-->
      <ButtonGroup>
        <Button :type="cellStyle.cellTop ? 'primary' : 'default'" @click="vAlignCell('top')" size="small">
          <Tooltip content="上对齐" :delay="tipsDelay">
            <i class="spreadfont spreadshangduiqi"></i>
          </Tooltip>
        </Button>
        <Button :type="cellStyle.cellMiddle ? 'primary' : 'default'" @click="vAlignCell('center')" size="small">
          <Tooltip content="居中对齐" :delay="tipsDelay">
            <i class="spreadfont spreadshuipingjuzhong"></i>
          </Tooltip>
        </Button>
        <Button :type="cellStyle.cellBottom ? 'primary' : 'default'" @click="vAlignCell('bottom')" size="small">
          <Tooltip content="下对齐" :delay="tipsDelay">
            <i class="spreadfont spreadxiaduiqi"></i>
          </Tooltip>
        </Button>
      </ButtonGroup>

      <!--合并/取消合并单元格-->
      <Dropdown trigger="click" @on-click="mergeFunc">
        <Button size="small">
          <Tooltip content="合并单元格" :delay="tipsDelay">
            <i class="spreadfont spreadhebingdanyuange"> </i>
            <Icon type="ios-arrow-down"></Icon>
          </Tooltip>
        </Button>
        <DropdownMenu slot="list">
          <DropdownItem name="mergeCell">合并单元格</DropdownItem>
          <DropdownItem name="unmergeCell">取消合并单元格</DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <!--下拉列表-->
      <Dropdown trigger="custom" :visible="listValidatorVisible">
        <Button size="small" @click="listValidatorVisible = !listValidatorVisible">
          <Tooltip content="下拉列表" :delay="tipsDelay">
            <i class="spreadfont spreadxialaxuanxiang"></i>
            <Icon type="ios-arrow-down"></Icon>
          </Tooltip>
        </Button>
        <DropdownMenu slot="list">
          <Input class="toolkit-list-validator-input" v-model="listOptions" placeholder='eg: 1,2,3,4,5,...' />
          <Button type="primary" @click="setListValidator(listOptions)">确定</Button>
        </DropdownMenu>
      </Dropdown>

      <!--解锁-->
      <Button type="default" @click="unlock" size="small">
        <Tooltip content="解锁" :delay="tipsDelay">
          <i class="spreadfont spreadjiesuo"></i>
        </Tooltip>
      </Button>
    </div>
  </div>
</template>

<script>
  import {GC, workbook} from './init';

  export default {
    name: 'Toolkit',
    props: {
      GC: Object,
      workbook: Object,
      formatterOptions: Array,
      fontOptions: Array,
      fontsizeOptions: Array,
    },
    data() {
      return {
        worksheet: null,
        // 格式刷
        formatPainter: {
          isPainting: false,
          fromSheet: null,
          fromRange: null,
        },
        // 单元格样式
        cellStyle: {
          cellBold: false,
          cellItalic: false,
          cellUnderline: false,
          cellLeft: false,
          cellCenter: false,
          cellRight: false,
          cellTop: false,
          cellMiddle: false,
          cellBottom: false,
          cellFormatter: 'normal',
          cellFont: 'SimSun',
          cellFontsize: '12px',
          cellMicrometerOperator: false,
          cellColor: '',
          cellBgColor: '',
        },
        tooltip: {
          cellFont: false,
          cellFontSize: false,
          cellFormatter: false,
        },
        clickCell: {},
        visibleCellColorPicker: false,
        visibleCellBgColorPicker: false,
        tipsDelay: 1200,
        listOptions: '',
        listValidatorVisible: false
      }
    },
    methods: {
      /**
       * method cell changed event.
       */
      bindEvent() {
        this.workbook.bind(this.GC.Spread.Sheets.Events.CellClick, (e, args) => {
          this.clickCell.row = args.row;
          this.clickCell.col = args.col;

          this.painterPaste();

          Object.assign(this.cellStyle, this.getCellStyle());
        });

        this.workbook.bind(this.GC.Spread.Sheets.Events.ActiveSheetChanged, (e, args) => {
          this.syncSpread();
          Object.assign(this.cellStyle, this.getCellStyle());
        });

        // 由于存在代码主动切换sheet页的情况，而ActiveSheetChanged不会触发，所以我们只能通过轮循来同步样式
        setInterval(() => {
          this.syncSpread();
          Object.assign(this.cellStyle, this.getCellStyle());
        }, 500);
      },
      /**
       * method update spread current status.
       */
      syncSpread() {
        this.worksheet = this.workbook.getActiveSheet();
        this.clickCell.row = this.worksheet.getActiveRowIndex();
        this.clickCell.col = this.worksheet.getActiveColumnIndex();
      },
      /**
       * method get current checked cell style.
       */
      getCellStyle() {
        const sheet = this.worksheet;
        const sel = sheet.getSelections();
        if (sel.length > 0) {
          const style = sheet.getStyle(sel[0].row, sel[0].col) || new this.GC.Spread.Sheets.Style();
          if (!style) {
            return;
          }

          // 粗体
          this.cellStyle.cellBold = !!((style.font && style.font.indexOf('bold') > -1));

          // 倾斜
          this.cellStyle.cellItalic = !!((style.font && style.font.indexOf('italic') > -1));

          // 下划线
          this.cellStyle.cellUnderline = style.textDecoration === this.GC.Spread.Sheets.TextDecorationType.underline;

          // 水平对齐方式
          this.cellStyle.cellLeft = style.hAlign === this.GC.Spread.Sheets.HorizontalAlign.left;
          this.cellStyle.cellCenter = style.hAlign === this.GC.Spread.Sheets.HorizontalAlign.center;
          this.cellStyle.cellRight = style.hAlign === this.GC.Spread.Sheets.HorizontalAlign.right;

          // 垂直对齐方式
          this.cellStyle.cellTop = style.vAlign === this.GC.Spread.Sheets.VerticalAlign.top;
          this.cellStyle.cellMiddle = style.vAlign === this.GC.Spread.Sheets.VerticalAlign.center;
          this.cellStyle.cellBottom = style.vAlign === this.GC.Spread.Sheets.VerticalAlign.bottom;

          // 单元格格式
          this.cellStyle.cellFormatter = !style.formatter ? 'normal' : style.formatter;

          // 字体
          if (style.font) {
            const fontArray = style.font.split(' ');
            for (const [index, elem] of fontArray.entries()) {
              if (elem.indexOf('px') > -1) {
                this.cellStyle.cellFont = fontArray[index + 1];
                break;
              } else {
                this.cellStyle.cellFont = '';
              }
            }
          } else {
            this.cellStyle.cellFont = '';
          }

          // 字体大小
          if (style.font) {
            const fontArray = style.font.split(' ');
            for (const [index, elem] of fontArray.entries()) {
              if (elem.indexOf('px') > -1) {
                this.cellStyle.cellFontsize = elem.match(/(\S*)px/)[0];
                break;
              } else {
                this.cellStyle.cellFontsize = '';
              }
            }
          } else {
            this.cellStyle.cellFontsize = '';
          }

          this.cellStyle.cellColor = style.foreColor || '#000000';
          this.cellStyle.cellBgColor = style.backColor || '#ffffff';

          // this.updateCellStyle();
          return this.cellStyle;
        }
      },

      /**
       * method change checked or unchecked color.
       * @param {String} toolItem Tool item etc: painter.
       * @param {Boolean} checked Wheather checked.
       */
      checked(toolItem, checked) {
        this.status[toolItem] = checked ? 'primary' : 'text';
      },

      /**
       * method painter copy.
       */
      painterCopy() {
        this.formatPainter.fromRange = this.worksheet.getSelections()[0];
        this.formatPainter.fromSheet = this.worksheet;
        this.formatPainter.isPainting = true;
      },

      /**
       * method painter paste.
       */
      painterPaste() {
        if (!this.formatPainter.isPainting) {
          return;
        }
        this.formatPainter.isPainting = false;
        const sheet = this.worksheet;
        sheet.suspendPaint();
        const toRange = sheet.getSelections()[0];
        const fromRange = this.formatPainter.fromRange;
        const fromSheet = this.formatPainter.fromSheet;
        // toRange biger than fromRange
        if (fromRange.rowCount > toRange.rowCount) {
          toRange.rowCount = fromRange.rowCount;
        }
        if (fromRange.colCount > toRange.colCount) {
          toRange.colCount = fromRange.colCount;
        }
        // toRange must in Sheet
        if (toRange.row + toRange.rowCount > sheet.getRowCount()) {
          toRange.rowCount = sheet.getRowCount() - toRange.row;
        }
        if (toRange.col + toRange.colCount > sheet.getColumnCount()) {
          toRange.colCount = sheet.getColumnCount() - toRange.col;
        }
        const rowStep = fromRange.rowCount;
        const colStep = fromRange.colCount;
        const endRow = toRange.row + toRange.rowCount - 1;
        const endCol = toRange.col + toRange.colCount - 1;

        // if toRange bigger than fromRange, repeat paint
        for (let startRow = toRange.row; startRow <= endRow; startRow += rowStep) {
          for (let startCol = toRange.col; startCol <= endCol; startCol += colStep) {
            const rowCount = startRow + rowStep > endRow + 1 ? endRow - startRow + 1 : rowStep;
            const colCount = startCol + colStep > endCol + 1 ? endCol - startCol + 1 : colStep;
            const fromRanges = new this.GC.Spread.Sheets.Range(fromRange.row, fromRange.col, rowCount, colCount);
            const pastedRange = new this.GC.Spread.Sheets.Range(startRow, startCol, rowCount, colCount);
            this.workbook.commandManager()
              .execute({
                cmd: 'clipboardPaste',
                sheetName: sheet.name(),
                fromSheet,
                fromRanges: [fromRanges],
                pastedRanges: [pastedRange],
                isCutting: false,
                clipboardText: '',
                pasteOption: this.GC.Spread.Sheets.ClipboardPasteOptions.formatting,
              });
          }
        }
        sheet.resumePaint();
      },

      /**
       * method bold.
       */
      boldCell() {
        const sheet = this.worksheet;
        const sel = sheet.getSelections();
        sheet.suspendPaint();
        if (sel.length > 0) {
          const range = sheet.getRange(sel[0].row, sel[0].col, sel[0].rowCount, sel[0].colCount);
          for (let row = range.row; row < (range.row + range.rowCount); row++) {
            for (let col = range.col; col < (range.col + range.colCount); col++) {
              const style = sheet.getStyle(row, col) || new this.GC.Spread.Sheets.Style();
              if (!style.font) {
                style.font = 'normal normal 12px 宋体';
              }
              const fontArray = style.font.split(' ');
              if (this.cellStyle.cellBold) {
                for (const [index, elem] of fontArray.entries()) {
                  if (elem === 'bold') {
                    fontArray[index] = 'normal';
                    break;
                  }
                }
              } else if (!this.cellStyle.cellBold && fontArray.length >= 4) {
                for (const [index, elem] of fontArray.entries()) {
                  if (elem === 'normal' && index <= 1) {
                    fontArray[index] = 'bold';
                    break;
                  }
                }
              } else {
                fontArray.unshift('bold');
              }
              const newFont = fontArray.join(' ');
              sheet.getCell(row, col).font(newFont);
            }
          }
          this.cellStyle.cellBold = !this.cellStyle.cellBold;
        }
        sheet.resumePaint();
      },

      /**
       * method italic.
       */
      italicCell() {
        const sheet = this.worksheet;
        const sel = sheet.getSelections();
        sheet.suspendPaint();
        if (sel.length > 0) {
          const range = sheet.getRange(sel[0].row, sel[0].col, sel[0].rowCount, sel[0].colCount);
          for (let row = range.row; row < (range.row + range.rowCount); row++) {
            for (let col = range.col; col < (range.col + range.colCount); col++) {
              const style = sheet.getStyle(row, col) || new this.GC.Spread.Sheets.Style();
              if (!style.font) {
                style.font = 'normal normal 12px 宋体';
              }
              const fontArray = style.font.split(' ');
              if (this.cellStyle.cellItalic) {
                for (const [index, elem] of fontArray.entries()) {
                  if (elem === 'italic') {
                    fontArray[index] = 'normal';
                    break;
                  }
                }
              } else if (!this.cellStyle.cellItalic && fontArray.length >= 4) {
                for (const [index, elem] of fontArray.entries()) {
                  if (elem === 'normal' && index <= 1) {
                    fontArray[index] = 'italic';
                    break;
                  }
                }
              } else {
                fontArray.unshift('italic');
              }
              const newFont = fontArray.join(' ');
              sheet.getCell(row, col).font(newFont);
            }
          }
          this.cellStyle.cellItalic = !this.cellStyle.cellItalic;
        }
        sheet.resumePaint();
      },

      /**
       * method underline.
       */
      underlineCell() {
        const sheet = this.worksheet;
        const sel = sheet.getSelections();
        sheet.suspendPaint();
        if (sel.length > 0) {
          const range = sheet.getRange(sel[0].row, sel[0].col, sel[0].rowCount, sel[0].colCount);
          for (let row = range.row; row < (range.row + range.rowCount); row++) {
            for (let col = range.col; col < (range.col + range.colCount); col++) {
              if (this.cellStyle.cellUnderline) {
                sheet.getCell(row, col).textDecoration(undefined);
              } else {
                sheet.getCell(row, col).textDecoration(this.GC.Spread.Sheets.TextDecorationType.underline);
              }
            }
          }
          this.cellStyle.cellUnderline = !this.cellStyle.cellUnderline;
        }
        sheet.resumePaint();
      },

      /**
       * method set font.
       * @param {Object | String} e Selected font.
       */
      setFont(e) {
        let value;
        if (typeof e === 'object') {
          value = e.target.value;
        } else {
          value = e;
        }
        const sheet = this.worksheet;
        const sel = sheet.getSelections();
        sheet.suspendPaint();
        if (sel.length > 0) {
          const range = sheet.getRange(sel[0].row, sel[0].col, sel[0].rowCount, sel[0].colCount);
          for (let row = range.row; row < (range.row + range.rowCount); row++) {
            for (let col = range.col; col < (range.col + range.colCount); col++) {
              const style = sheet.getStyle(row, col) || new GC.Spread.Sheets.Style();
              if (!style.font) {
                style.font = 'normal normal 12px 宋体';
              }
              const fontArray = style.font.split(' ');
              for (const [index, elem] of fontArray.entries()) {
                if (elem.indexOf('px') > -1) {
                  fontArray[index + 1] = value;
                  break;
                }
              }
              const newFont = fontArray.join(' ');
              sheet.getCell(row, col).font(newFont);
            }
          }
          this.cellStyle.cellFont = value;
        }
        sheet.resumePaint();
      },

      /**
       * method set font size.
       * @param {Object | String} e Selected font size.
       */
      setFontsize(e) {
        let value;
        if (typeof e === 'object') {
          value = e.target.value;
        } else {
          value = e;
        }
        const sheet = this.worksheet;
        const sel = sheet.getSelections();
        sheet.suspendPaint();
        if (sel.length > 0) {
          const range = sheet.getRange(sel[0].row, sel[0].col, sel[0].rowCount, sel[0].colCount);
          for (let row = range.row; row < (range.row + range.rowCount); row++) {
            for (let col = range.col; col < (range.col + range.colCount); col++) {
              const style = sheet.getStyle(row, col) || new this.GC.Spread.Sheets.Style();
              if (!style.font) {
                style.font = 'normal normal 12px 宋体';
              }
              const fontArray = style.font.split(' ');
              for (const [index, elem] of fontArray.entries()) {
                if (elem.indexOf('px') > -1) {
                  fontArray[index] = value;
                  break;
                }
              }
              const newFont = fontArray.join(' ');
              sheet.getCell(row, col).font(newFont);
            }
          }
          this.cellStyle.cellFontsize = value;
        }
        sheet.resumePaint();
      },

      /**
       * method Horizontal alignment.
       * @param {String} align Align the direction.
       */
      hAlignCell(align = 'center') {
        this.cellStyle.cellLeft = false;
        this.cellStyle.cellRight = false;
        this.cellStyle.cellCenter = false;
        const sheet = this.worksheet;
        const sel = sheet.getSelections();
        sheet.suspendPaint();
        if (sel.length > 0) {
          const range = sheet.getRange(sel[0].row, sel[0].col, sel[0].rowCount, sel[0].colCount);
          for (let row = range.row; row < (range.row + range.rowCount); row++) {
            for (let col = range.col; col < (range.col + range.colCount); col++) {
              sheet.getCell(row, col).hAlign(this.GC.Spread.Sheets.HorizontalAlign[align]);
            }
          }
        }
        switch (align) {
          case 'center':
            this.cellStyle.cellCenter = true;
            break;
          case 'left':
            this.cellStyle.cellLeft = true;
            break;
          case 'right':
            this.cellStyle.cellRight = true;
            break;
        }
        sheet.resumePaint();
      },

      /**
       * method Vertical alignment.
       * @param {String} align Align the direction.
       */
      vAlignCell(align = 'center') {
        this.cellStyle.cellTop = false;
        this.cellStyle.cellMiddle = false;
        this.cellStyle.cellBottom = false;
        const sheet = this.worksheet;
        const sel = sheet.getSelections();
        sheet.suspendPaint();
        if (sel.length > 0) {
          const range = sheet.getRange(sel[0].row, sel[0].col, sel[0].rowCount, sel[0].colCount);
          for (let row = range.row; row < (range.row + range.rowCount); row++) {
            for (let col = range.col; col < (range.col + range.colCount); col++) {
              sheet.getCell(row, col).vAlign(GC.Spread.Sheets.VerticalAlign[align]);
            }
          }
        }
        switch (align) {
          case 'center':
            this.cellStyle.cellMiddle = true;
            break;
          case 'top':
            this.cellStyle.cellTop = true;
            break;
          case 'bottom':
            this.cellStyle.cellBottom = true;
            break;
        }
        sheet.resumePaint();
      },

      /**
       * method get cell range.
       */
      getActualCellRange(cellRange, rowCount, columnCount) {
        const spreadNS = this.GC.Spread.Sheets;
        if (cellRange.row === -1 && cellRange.col === -1) {
          return new spreadNS.Range(0, 0, rowCount, columnCount);
        }
        if (cellRange.row === -1) {
          return new spreadNS.Range(0, cellRange.col, rowCount, cellRange.colCount);
        }
        if (cellRange.col === -1) {
          return new spreadNS.Range(cellRange.row, 0, cellRange.rowCount, columnCount);
        }

        return cellRange;
      },

      mergeFunc(value) {
        this[value]();
      },
      /**
       * method merge cell.
       */
      mergeCell() {
        const sheet = this.worksheet;
        sheet.suspendPaint();
        sheet.options.allowCellOverflow = true;
        let sel = sheet.getSelections();
        if (sel.length > 0) {
          sel = this.getActualCellRange(sel[sel.length - 1], sheet.getRowCount(), sheet.getColumnCount());
          sheet.addSpan(sel.row, sel.col, sel.rowCount, sel.colCount);
        }
        sheet.resumePaint();
      },

      /**
       * method unmerge cell.
       */
      unmergeCell() {
        const sheet = this.worksheet;
        sheet.suspendPaint();
        sheet.options.allowCellOverflow = true;
        let sel = sheet.getSelections();
        if (sel.length > 0) {
          sel = this.getActualCellRange(sel[sel.length - 1], sheet.getRowCount(), sheet.getColumnCount());
          for (let i = 0; i < sel.rowCount; i++) {
            for (let j = 0; j < sel.colCount; j++) {
              sheet.removeSpan(i + sel.row, j + sel.col);
            }
          }
        }
        sheet.resumePaint();
      },

      borderFunc(value) {
        this[value]();
      },

      /**
       * method add border.
       */
      addBorder() {
        const sheet = this.worksheet;
        const sel = sheet.getSelections();
        sheet.suspendPaint();
        if (sel.length > 0) {
          const range = sheet.getRange(sel[0].row, sel[0].col, sel[0].rowCount, sel[0].colCount);
          const lineBorder = new this.GC.Spread.Sheets.LineBorder('black', this.GC.Spread.Sheets.LineStyle.thin);
          range.setBorder(lineBorder, {all: true});
        }
        sheet.resumePaint();
      },

      /**
       * method delete border.
       */
      delBorder() {
        const sheet = this.worksheet;
        const sel = sheet.getSelections();
        sheet.suspendPaint();
        if (sel.length > 0) {
          const range = sheet.getRange(sel[0].row, sel[0].col, sel[0].rowCount, sel[0].colCount);
          range.setBorder(null, {all: true});
        }
        sheet.resumePaint();
      },

      /**
       * method set cell formatter.
       * @param {String} e Will be set type.
       */
      setFormatter(e) {
        let value;
        if (typeof e === 'object') {
          value = e.target.value;
        } else {
          value = e;
        }
        const sheet = this.worksheet;
        const sel = sheet.getSelections();
        sheet.suspendPaint();
        if (sel.length > 0) {
          const range = sheet.getRange(sel[0].row, sel[0].col, sel[0].rowCount, sel[0].colCount);
          for (let row = range.row; row < (range.row + range.rowCount); row++) {
            for (let col = range.col; col < (range.col + range.colCount); col++) {
              if (value === 'normal') {
                sheet.getCell(row, col).formatter(undefined);
              } else if (value === '#,##0.00') { // 千分符
                if (this.cellStyle.cellMicrometerOperator) {
                  value = 'normal';
                  sheet.getCell(row, col).formatter(undefined);
                } else {
                  sheet.getCell(row, col).formatter(value);
                }
              } else {
                sheet.getCell(row, col).formatter(value);
              }
            }
          }
          this.cellStyle.cellMicrometerOperator = !this.cellStyle.cellMicrometerOperator;
        }
        sheet.resumePaint();
        this.cellStyle.cellFormatter = value;
      },

      /**
       * method unlock.
       */
      unlock() {
        const sheet = this.worksheet;
        const sel = sheet.getSelections();
        sheet.suspendPaint();
        if (sel.length > 0) {
          sheet.getRange(sel[0].row, sel[0].col, sel[0].rowCount, sel[0].colCount).locked(false);
        }
        sheet.resumePaint();
      },

      cellColorFunc(e) {
        this.visibleCellColorPicker = !this.visibleCellColorPicker;
      },

      cellColorBgFunc(e) {
        this.visibleCellBgColorPicker = !this.visibleCellBgColorPicker;
      },

      /**
       * method set cell font color.
       * @param {String} value Color value.
       */
      setFontColor(value) {
        const sheet = this.worksheet;
        const sel = sheet.getSelections();
        sheet.suspendPaint();
        if (sel.length > 0) {
          const range = sheet.getRange(sel[0].row, sel[0].col, sel[0].rowCount, sel[0].colCount);
          range.foreColor(value);
        }
        sheet.resumePaint();
        this.cellStyle.cellColor = value;
      },

      /**
       * method set cell background color.
       * @param {String} value Color value.
       */
      setBgColor(value) {
        const sheet = this.worksheet;
        const sel = sheet.getSelections();
        sheet.suspendPaint();
        if (sel.length > 0) {
          const range = sheet.getRange(sel[0].row, sel[0].col, sel[0].rowCount, sel[0].colCount);
          range.backColor(value);
        }
        sheet.resumePaint();
        this.cellStyle.cellColor = value;
      },

      /**
       * method undo action.
       */
      undoCommand() {
        this.workbook.undoManager().undo();
      },

      /**
       * method redo action.
       */
      redoCommand() {
        this.workbook.undoManager().redo();
      },

      /**
       * method list validator.
       * @param {String} valueList The value that will be set, eg: 1,2,3.
       */
      setListValidator(valueList) {
        valueList = valueList.replace(/，/g, ',');
        const sheet = this.worksheet;
        const spreadNS = this.GC.Spread.Sheets;

        const gcdv = spreadNS.DataValidation;
        let ddv = null;
        ddv = gcdv.createListValidator(valueList);
        ddv.inCellDropdown(true);

        if (ddv != null) {
          ddv.errorMessage('数据有误!');
          ddv.errorStyle('0');
          ddv.showErrorMessage(true);
          ddv.ignoreBlank(true);
          ddv.showInputMessage(false);

          sheet.suspendPaint();
          const sels = sheet.getSelections();
          for (let i = 0; i < sels.length; i++) {
            const sel = sels[i];
            sheet.setDataValidator(sel.row, sel.col, sel.rowCount, sel.colCount, ddv);
          }

          sheet.resumePaint();
        }

        this.listOptions = '';
        this.listValidatorVisible = false;
      }
    },
    mounted() {
      this.syncSpread();
      this.bindEvent();
      Object.assign(this.cellStyle, this.getCellStyle());
    },
    beforeDestroy() {

    },
    watch: {
      visibleCellColorPicker: function (newVal) {
        this.$refs.cellColorPicker.$el.children[0].click()
      },
      visibleCellBgColorPicker: function (newVal) {
        this.$refs.cellBgColorPicker.$el.children[0].click()
      },
    }
  }
</script>
<style>
  @import "../style/font/iconfont.css";
  /*@import "../style/iviewfont/ionicons.css";*/

  #ele-cloud-spreadjs-toolkit {
    line-height: 3;
  }

  .toolkit-select {
    display: inline-block;
    /*width: 80px;*/
  }

  .toolkit-list-validator-input {
    margin-right: 5px;
    width: 150px !important;
  }

  .ivu-select-single .ivu-select-selection {
    height: 29.4px !important;
  }

  .ivu-select-single .ivu-select-selection .ivu-select-placeholder, .ivu-select-single .ivu-select-selection .ivu-select-selected-value {
    height: 29.4px !important;
    line-height: 29.4px !important;
  }

  .ivu-color-picker-rel {
    visibility: hidden !important;
    width: 0 !important;
    height: 0 !important;
  }

  .ivu-input-icon-validate {
    display: none !important;
  }

  .toolkit-color-picker {
    position: relative;
    left: -76px;
    top: 10px;
  }

  .toolkit-color-picker--bg {
    position: relative;
    left: -32px;
    top: 10px;
  }
</style>
