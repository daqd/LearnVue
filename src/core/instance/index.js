import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'

//Vue框架的起点，从package.json文件一路追寻到这里，使用Vue框架也是从 new Vue()开始
function Vue (options) {
  //判断当前环境，非生产环境下，需要判断当前实例是否是Vue构造的实例，
  //也就是通过new Vue()生成的，如果不是，直接提示：
  //Vue is a constructor and should be called with the `new` keyword
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  //这是Vue实例调用的第一个方法，该实例方法在initMixin方法挂载；
  this._init(options)
}

/**
 * Vue.prototype._init = function(){} 执行才会有以下原型属性或方法
 * Vue.prototype._uid = 
 * Vue.prototype._isVue = 
 * Vue.prototype.$options = 
 * Vue.prototype._renderProxy = 
 * Vue.prototype._self = 
 * **/
initMixin(Vue)

/**
 * Vue.prototype.$data = 
 * Vue.prototype.$props = 
 * Vue.prototype.$watch = 
 * 
*/
stateMixin(Vue)

/**
 * Vue.prototype.$on = function(){}
 * Vue.prototype.$once = function(){}
 * Vue.prototype.$off  = function(){}
 * Vue.prototype.$emit  = function(){}
 * 
*/
eventsMixin(Vue)

/**
 * Vue.prototype._update = function(){}
 * Vue.prototype.$forceUpdate = function(){}
 * Vue.prototype.$destroy = function(){}
 * **/
lifecycleMixin(Vue)

/**
 * Vue.prototype.$nextTick = function(){}
 * Vue.prototype._render = function(){}
 * **/
renderMixin(Vue)

export default Vue
