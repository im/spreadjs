<template>
  <div>
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
    name: 'more-large',
    inject: [
      'tipsDelay',
      'cellStyle',
      'lock'
    ]
  }
</script>

<style scoped>

</style>
