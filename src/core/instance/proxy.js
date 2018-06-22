/* not type checking this file because flow doesn't play well with Proxy */

import config from 'core/config'
import { warn, makeMap } from '../util/index'

let initProxy

if (process.env.NODE_ENV !== 'production') {
  const allowedGlobals = makeMap(
    'Infinity,undefined,NaN,isFinite,isNaN,' +
    'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
    'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
    'require' // for Webpack/Browserify
  )
  
  const warnNonPresent = (target, key) => {
    warn(
      `Property or method "${key}" is not defined on the instance but ` +
      'referenced during render. Make sure that this property is reactive, ' +
      'either in the data option, or for class-based components, by ' +
      'initializing the property. ' +
      'See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.',
      target
    )
  }
  
  const hasProxy =
    typeof Proxy !== 'undefined' &&
    Proxy.toString().match(/native code/)

  if (hasProxy) {
    // isBuiltInModifier 函数用来检测是否是内置的修饰符
    const isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact')
    //为config.keyCodes添加一个Proxy代理
    //当为config.keyCodes设置值的时候，
    //如果当前的key是内置的修饰符，则提示无效
    //防止内置的修饰符被修改
    config.keyCodes = new Proxy(config.keyCodes, {
      set (target, key, value) {
        if (isBuiltInModifier(key)) {
          warn(`Avoid overwriting built-in modifier in config.keyCodes: .${key}`)
          return false
        } else {
          target[key] = value
          return true
        }
      }
    })
  }

  const hasHandler = {
    //has方法用来拦截HasProperty操作，即判断对象是否具有某个属性时，这个方法会生效。典型的操作就是in运算符。
    has (target, key) {
      //判断当前访问的key是否存在
      const has = key in target
      //判断当前访问的key是否是全局的JS API
      const isAllowed = allowedGlobals(key) || key.charAt(0) === '_'
      //需要两个条件满足，才会提示访问的当前的key不存在，会展示出错误提示
      //1.当前访问的key没有在Vue中定义
      //2.当前访问的key也不是原生JS自带的全局API
      if (!has && !isAllowed) {
        //错误提示：访问的key不存在
        warnNonPresent(target, key)
      }
      return has || !isAllowed
    }
  }

  const getHandler = {
    get (target, key) {
      if (typeof key === 'string' && !(key in target)) {
        warnNonPresent(target, key)
      }
      return target[key]
    }
  }

  initProxy = function initProxy (vm) {
    if (hasProxy) {
      // determine which proxy handler to use
      const options = vm.$options
      const handlers = options.render && options.render._withStripped
        ? getHandler
        : hasHandler
      //简单备注一下Proxy的用法：
      //Proxy是ES6新增的API，用来对对象增加拦截操作，属于一种元编程
      //第一个参数是要操作的目标对象
      //第二个参数是handler，为一个对象，里面有多个操作，如get set 等等
      //对 new Proxy 的实例执行对应的操作才会触发拦截，直接对目标对象操作不会触发
      vm._renderProxy = new Proxy(vm, handlers)
    } else {
      vm._renderProxy = vm
    }
  }
}

export { initProxy }
