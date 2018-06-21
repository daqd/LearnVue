import { inBrowser } from './env'

export let mark
export let measure
//判断当前必须在非生产环境下才可进行
if (process.env.NODE_ENV !== 'production') {
  //判断当前的宿主环境必须是在浏览器中，并且当前的浏览器支持performance
  const perf = inBrowser && window.performance
  /* istanbul ignore if */
  if (
    perf &&
    perf.mark &&
    perf.measure &&
    perf.clearMarks &&
    perf.clearMeasures
  ) {
    //相当于performance.mark，用于打标标记
    mark = tag => perf.mark(tag)
    measure = (name, startTag, endTag) => {
      perf.measure(name, startTag, endTag)
      perf.clearMarks(startTag)
      perf.clearMarks(endTag)
      perf.clearMeasures(name)
    }
  }
}
