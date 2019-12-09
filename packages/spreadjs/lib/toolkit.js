import Vue from 'vue';
import { Button } from 'element-ui';
import { GC, workbook } from './init';
import 'element-ui/lib/theme-chalk/index.css';

/**
 * method toolkit for spreadjs.
 * @param {Object} dom The dom that toolkit will be rendered.
 */
export default function toolkit(dom) {
  new Vue({
    el: dom,
    render: function (h) {
      return (
        <div>
          <span>Hello</span> world!
        </div>
      );
    },
  });
}
