/* @flow */

import config from '../config'
import { initProxy } from './proxy'
import { initState } from './state'
import { initRender } from './render'
import { initEvents } from './events'
import { mark, measure } from '../util/perf'
import { initLifecycle, callHook } from './lifecycle'
import { initProvide, initInjections } from './inject'
import { extend, mergeOptions, formatComponentName } from '../util/index'

//定义一个变量，后边会将该变量挂载到实例上，以保证每次生成一个实例都有一个唯一的标识
let uid = 0

//接受Vue构造方法
export function initMixin (Vue: Class<Component>) {

  //在Vue构造方法的原型上挂载_init方法，这也是在new Vue()执行的第一个实例方法
  //该方法接受实例化Vue传入的参数，是一个对象，对象内包含:data,computed,components等等
  Vue.prototype._init = function (options?: Object) {
    //定义一个常量vm，代表的是当前的实例
    const vm: Component = this
    // a uid
    //每个Vue实例设置唯一id
    vm._uid = uid++

    //定义两个标记变量，用于在支持performance的浏览器上测试性能
    //回头单独写篇博客介绍这个
    let startTag, endTag
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      startTag = `vue-perf-start:${vm._uid}`
      endTag = `vue-perf-end:${vm._uid}`
      //利用performance打上开始标记，相当于 performance.mark
      //详见until下的per.js文件中的描述
      mark(startTag)
    }

    //
    // a flag to avoid this being observed
    vm._isVue = true
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options)
    } else {
      //合并策略，用于合并构造方法上的options选项和实例化时传入的options,
      //构造方法不一定只是Vue，也可能是Vue构造方法的子类，例如：
      //let Child = Vue.extend({})
      //也可以通过 let child = new Child({})创建一个实例
      //这里会传入三个参数：
      //第一个是挂载在构造函数上的options对象，静态属性
      //第二个是实例化构造方法的时候传入的参数
      //第三个参数是当前的实例对象vm
      //最终会将所有的options合并，并且挂载上不同的options参数相对应的策略方法并返回
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      )
    }
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      initProxy(vm)
    } else {
      //生产环境下会在当前实例下挂载一个名为_renderProxy的属性，其值指向当前的vue实例本身
      vm._renderProxy = vm
    }
    // expose real self
    //在当前实例下挂载一个名为_self的属性，其值指向当前的vue实例本身
    vm._self = vm
    //挂载基本的生命周期所需的参数，除此之外还有$parent,$children,$refs
    initLifecycle(vm)
    //除了设置一些初始化的操作，似乎还调用一些类似于父级的事件方法，暂时留个疑问：vm.$options._parentListeners ?????
    initEvents(vm)
    //
    initRender(vm)
    //执行了beforeCreate的生命周期方法，目前理解到的是执行到挂载在$options下的对应的生命周期方法的策略方法
    callHook(vm, 'beforeCreate')
    //
    initInjections(vm) // resolve injections before data/props
    
    //初始化props,methods,data，computed，watch
    initState(vm)
    
    initProvide(vm) // resolve provide after data/props
    callHook(vm, 'created')

    /* istanbul ignore if */
    //这里,跟上面开始打上开始标记相对应
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      vm._name = formatComponentName(vm, false)
      mark(endTag)
      measure(`vue ${vm._name} init`, startTag, endTag)
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }
}

function initInternalComponent (vm: Component, options: InternalComponentOptions) {
  const opts = vm.$options = Object.create(vm.constructor.options)
  // doing this because it's faster than dynamic enumeration.
  opts.parent = options.parent
  opts.propsData = options.propsData
  opts._parentVnode = options._parentVnode
  opts._parentListeners = options._parentListeners
  opts._renderChildren = options._renderChildren
  opts._componentTag = options._componentTag
  opts._parentElm = options._parentElm
  opts._refElm = options._refElm
  if (options.render) {
    opts.render = options.render
    opts.staticRenderFns = options.staticRenderFns
  }
}

export function resolveConstructorOptions (Ctor: Class<Component>) {
  let options = Ctor.options
  if (Ctor.super) {
    const superOptions = resolveConstructorOptions(Ctor.super)
    const cachedSuperOptions = Ctor.superOptions
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions
      // check if there are any late-modified/attached options (#4976)
      const modifiedOptions = resolveModifiedOptions(Ctor)
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions)
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions)
      if (options.name) {
        options.components[options.name] = Ctor
      }
    }
  }
  return options
}

function resolveModifiedOptions (Ctor: Class<Component>): ?Object {
  let modified
  const latest = Ctor.options
  const extended = Ctor.extendOptions
  const sealed = Ctor.sealedOptions
  for (const key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) modified = {}
      modified[key] = dedupe(latest[key], extended[key], sealed[key])
    }
  }
  return modified
}

function dedupe (latest, extended, sealed) {
  // compare latest and sealed to ensure lifecycle hooks won't be duplicated
  // between merges
  if (Array.isArray(latest)) {
    const res = []
    sealed = Array.isArray(sealed) ? sealed : [sealed]
    extended = Array.isArray(extended) ? extended : [extended]
    for (let i = 0; i < latest.length; i++) {
      // push original options and not sealed options to exclude duplicated options
      if (extended.indexOf(latest[i]) >= 0 || sealed.indexOf(latest[i]) < 0) {
        res.push(latest[i])
      }
    }
    return res
  } else {
    return latest
  }
}
