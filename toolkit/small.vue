<template>
  <div>
    <!--水平对齐-->
    <Dropdown trigger="click" @on-click="hAlignCell">
      <Button size="small" type="text">
        <Tooltip content="水平对齐" :delay="tipsDelay">
          <i class="spreadfont spreadzuoduiqi"
             v-show="cellStyle.cellLeft || (!cellStyle.cellLeft && !cellStyle.cellCenter && !cellStyle.cellRight)"></i>
          <i class="spreadfont spreadjuzhong" v-show="cellStyle.cellCenter"></i>
          <i class="spreadfont spreadyouduiqi" v-show="cellStyle.cellRight"></i>
          <Icon type="ios-arrow-down"></Icon>
        </Tooltip>
      </Button>
      <DropdownMenu slot="list">
        <DropdownItem name="left">
          <span>
              <i class="spreadfont spreadzuoduiqi"></i>
            </span>
          <Icon type="ios-checkmark" v-show="cellStyle.cellLeft"/>
        </DropdownItem>
        <DropdownItem name="center">
          <span>
              <i class="spreadfont spreadjuzhong"></i>
            </span>
          <Icon type="ios-checkmark" v-show="cellStyle.cellCenter"/>
        </DropdownItem>
        <DropdownItem name="right">
          <span>
              <i class="spreadfont spreadyouduiqi"></i>
            </span>
          <Icon type="ios-checkmark" v-show="cellStyle.cellRight"/>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>

    <!--垂直对齐-->
    <Dropdown trigger="click" @on-click="vAlignCell">
      <Button size="small" type="text">
        <Tooltip content="垂直对齐" :delay="tipsDelay">
          <i class="spreadfont spreadvtop"
             v-show="cellStyle.cellTop || (!cellStyle.cellTop && !cellStyle.cellMiddle && !cellStyle.cellBottom)"></i>
          <i class="spreadfont spreadchuizhiduiqizhongxian" v-show="cellStyle.cellMiddle"></i>
          <i class="spreadfont spreadchuizhiduiqidibu" v-show="cellStyle.cellBottom"></i>
          <Icon type="ios-arrow-down"></Icon>
        </Tooltip>
      </Button>
      <DropdownMenu slot="list">
        <DropdownItem name="top">
          <span>
              <i class="spreadfont spreadvtop"></i>
            </span>
          <Icon type="ios-checkmark" v-show="cellStyle.cellTop"/>
        </DropdownItem>
        <DropdownItem name="center">
          <span>
              <i class="spreadfont spreadchuizhiduiqizhongxian"></i>
            </span>
          <Icon type="ios-checkmark" v-show="cellStyle.cellMiddle"/>
        </DropdownItem>
        <DropdownItem name="bottom">
          <span>
              <i class="spreadfont spreadchuizhiduiqidibu"></i>
            </span>
          <Icon type="ios-checkmark" v-show="cellStyle.cellBottom"/>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>

    <!--合并/取消合并单元格-->
    <Dropdown trigger="click" @on-click="mergeFunc">
      <Button size="small" type="text">
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

    <!--自动换行-->
    <Button :type="cellStyle.wordWrap ? 'primary' : 'text'" size="small" @click="setWordWrap">
      <Tooltip content="自动换行" :delay="tipsDelay">
        <i class="spreadfont spreadwenbenhuanhang"></i>
      </Tooltip>
    </Button>

    <span class="toolkit-divider">
        <i class="spreadfont spreadshuxian"></i>
      </span>

    <!--下拉列表-->
    <Button type="text" size="small" @click="setListValidatorVisible">
      <Tooltip content="下拉列表" :delay="tipsDelay">
        <i class="spreadfont spreadxialaxuanxiang"></i>
      </Tooltip>
    </Button>

    <!--冻结/取消冻结单元格-->
    <Dropdown trigger="click" @on-click="frozen">
      <Button size="small" type="text">
        <Tooltip content="冻结单元格" :delay="tipsDelay">
          <i class="spreadfont spreaddongjiedanyuange"> </i>
          <Icon type="ios-arrow-down"></Icon>
        </Tooltip>
      </Button>
      <DropdownMenu slot="list">
        <DropdownItem name="frozenCell">冻结单元格</DropdownItem>
        <DropdownItem name="removeFrozenCell">取消冻结单元格</DropdownItem>
      </DropdownMenu>
    </Dropdown>

    <span class="toolkit-divider">
        <i class="spreadfont spreadshuxian"></i>
      </span>

    <!--解锁-->
    <Button type="text" @click="lock(true)" size="small" v-show="!cellStyle.isLocked">
      <Tooltip content="解锁" :delay="tipsDelay">
        <i class="spreadfont spreadjiesuo"></i>
      </Tooltip>
    </Button>
    <!-- or -->
    <!--加锁-->
    <Button type="text" @click="lock(false)" size="small" v-show="cellStyle.isLocked">
      <Tooltip content="加锁" :delay="tipsDelay">
        <i class="spreadfont spreadsuo"></i>
      </Tooltip>
    </Button>
  </div>
</template>

<script>
  export default {
    name: 'more-small',
    inject: [
      'tipsDelay',
      'cellStyle',
      'lock',
      'frozen',
      'setListValidatorVisible',
      'setWordWrap',
      'mergeFunc',
      'vAlignCell',
      'hAlignCell',
    ]
  }
</script>

<style scoped>

</style>
