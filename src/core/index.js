import Vue from './instance/index'
import { initGlobalAPI } from './global-api/index'
import { isServerRendering } from 'core/util/env'

/**
 * Vue.config = {}
 * Vue.util = {
    warn,
    extend,
    mergeOptions,
    defineReactive
  }
 * Vue.set = function(){}
 * Vue.delete = function(){}
 * Vue.nextTick = function(){}
 * Vue.options.components = {}
 * Vue.options.directives = {}
 * Vue.options.filters = {}
 * Vue.options.components = {
 *    KeepAlive
 * }
 * 
 * Vue.options._base = 
 * Vue.use = function(){}
 * Vue.mixin = function(){}
 * Vue.cid = 
 * Vue.extend = function(){}
 * Vue.component = function(){}
 * Vue.directive = function(){}
 * Vue.filter = function(){}
 * 
*/
initGlobalAPI(Vue)

/**
 * Vue.prototype.$isServer =  function(){}
 * 初步猜测是服务端渲染SSR相关的配置
*/
Object.defineProperty(Vue.prototype, '$isServer', {
  get: isServerRendering
})

/**
 * Vue.prototype.$ssrContext =  {}
 * 初步猜测是服务端渲染SSR相关的配置
*/
Object.defineProperty(Vue.prototype, '$ssrContext', {
  get () {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext
  }
})

//挂载Vue的版本号
Vue.version = '__VERSION__'

export default Vue
