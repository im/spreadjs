<template>
  <div>
    <div class="format-precision-part">
      <label>小数位数：</label>
      <InputNumber size="small" :max="16" :min="0" v-model="decimalDigits"></InputNumber>
    </div>
    <div class="format-thousandth-part">
      <Checkbox v-model="micrometerSymbol">使用千分位分隔符（ , ）</Checkbox>
    </div>
    <div class="format-negative-part">
      <div class="part-title">负数</div>
      <ul class="format-negative-list">
        <li class="selected text-red">(1234)</li>
        <li class="">(1234)</li>
        <li class="text-red">1234</li>
        <li class="">-1234</li>
        <li class="text-red">-1234</li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'number',
    data() {
      return {
        decimalDigits: 0,
        micrometerSymbol: false,
      }
    }
  }
</script>

<style scoped>
  .format-precision-part {
    display: flex;
    align-items: center;
    margin-top: 15px;
  }

  .format-precision-part label {
    width: 62px;
    font-weight: 400;
    vertical-align: top;
  }

  .format-thousandth-part {
    height: 14px;
    line-height: 14px;
    margin-top: 12px;
  }

  .format-negative-part {
    margin-top: 15px;
  }

  .format-negative-part .format-negative-list {
    background-color: #fff;
    border: 1px solid #ececed;
    border-radius: 2px;
    padding: 5px 0;
    height: 176px;
  }

  .format-negative-part .format-negative-list li {
    height: 26px;
    line-height: 26px;
    padding-left: 9px;
    cursor: pointer;
  }

  .format-negative-part .format-negative-list li.text-red {
    color: #e95555;
  }

  .format-negative-part .format-negative-list li.selected {
    background-color: #f7f7f7;
  }
</style>
