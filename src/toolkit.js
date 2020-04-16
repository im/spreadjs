/**
 * @file 工具箱
 * @author Angus Yang
 * @date 2020/2/7
 * @description
 */

import Vue from 'vue/dist/vue.esm.js';
import Toolkit from './toolkit-tpl.vue';
import { Button, Select, Input, Option, Dropdown, DropdownMenu, DropdownItem, Icon, ButtonGroup, ColorPicker, Tooltip } from 'iview';
import 'iview/dist/styles/iview.css'

import { GC, workbook } from './init';
import { formatterOptions, fontOptions, fontsizeOptions } from './options';

/**
 * method toolkit for spreadjs.
 * @param {Object} dom The dom that toolkit will be rendered.
 */
export default function toolkit(dom) {
  Vue.component('Button', Button);
  Vue.component('Select', Select);
  Vue.component('Input', Input);
  Vue.component('Option', Option);
  Vue.component('Dropdown', Dropdown);
  Vue.component('DropdownMenu', DropdownMenu);
  Vue.component('DropdownItem', DropdownItem);
  Vue.component('Icon', Icon);
  Vue.component('ButtonGroup', ButtonGroup);
  Vue.component('ColorPicker', ColorPicker);
  Vue.component('Tooltip', Tooltip);

  const vm = new Vue({
    el: dom,
    template: '<Toolkit :GC="GC" :workbook="workbook" :font-options="fontOptions" :fontsize-options="fontsizeOptions" :formatter-options="formatterOptions"></Toolkit>',
    components: { Toolkit },
    data: {
      GC, workbook, formatterOptions, fontOptions, fontsizeOptions
    }
  });
}
