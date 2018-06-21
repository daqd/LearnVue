/* @flow */

import config from '../config'
import { initUse } from './use'
import { initMixin } from './mixin'
import { initExtend } from './extend'
import { initAssetRegisters } from './assets'
import { set, del } from '../observer/index'
import { ASSET_TYPES } from 'shared/constants'
import builtInComponents from '../components/index'

import {
  warn,
  extend,
  nextTick,
  mergeOptions,
  defineReactive
} from '../util/index'

/**
* 传入Vue构造函数，挂载静态方法和静态属性
**/
export function initGlobalAPI (Vue: GlobalAPI) {
  // config
  const configDef = {}
  configDef.get = () => config
  //非生产环境下，config为只读状态
  if (process.env.NODE_ENV !== 'production') {
    configDef.set = () => {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      )
    }
  }
  //在Vue构造方法上挂载config
  Object.defineProperty(Vue, 'config', configDef)

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn,
    extend,
    mergeOptions,
    defineReactive
  }
  //挂载静态方法
  Vue.set = set
  Vue.delete = del
  Vue.nextTick = nextTick
  
  //在Vue中component、directive、filter被称为静态资源
  Vue.options = Object.create(null)
  ASSET_TYPES.forEach(type => {
    Vue.options[type + 's'] = Object.create(null)
  })

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue
  
  //extend方法详见shared目录下，简单讲copy一个对象到两一个对象上
  //将builtInComponents复制到Vue.options.components上
  //所以当前 builtInComponents 仅仅代表的是内置组件keep-live
  // Vue.options.components = {
  //    KeepAlive
  // }
  extend(Vue.options.components, builtInComponents)

  //挂载静态方法use，Vue.use就是安装Vue插件的内置方法
  initUse(Vue)
  
  //挂载mixin方法
  initMixin(Vue)
  
  //挂载extend方法
  initExtend(Vue)

  //挂载全局component，directive，filter静态方法
  initAssetRegisters(Vue)
}
