<template>
  <div>
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
    name: 'more-middle',
    inject: [
      'tipsDelay',
      'cellStyle',
      'lock',
      'frozen',
      'setListValidatorVisible',
    ]
  }
</script>

<style scoped>

</style>
