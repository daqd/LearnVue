var apiURL = 'https://api.github.com/repos/vuejs/vue/commits?per_page=3&sha='

// var DemoCtr = Vue.extend({
// 	data:function(){
// 		return {
// 			c:1
// 		}
// 	}
// })

// var demo = new DemoCtr();
var demo = new Vue({
  data(){
  	return {
	    a:1
	  }
  },
  el:'#demo',
  propsData: {
    msg: 'hello'
  },
  mounted(){
  	console.log("创建喽！");
  },
  directives: {
	focus: {
	// 指令的定义
	inserted: function (el) {
	  el.focus()
	}
	}
  },
  watch:{
  	watchA(){
  		console.log('watchA');
  	},
  	watchB(){
  		console.log('watchB');
  	}
  },
  methods:{
  	sayHello(){
  		console.log('hello MIFE');
  	}
  },
  provide: {
    foo: 'bar'
  },
  props:['js-bridge','vueprops'],
  // props:{
  // 	'jsbridge':{
  // 		type:String,
  // 		value:'test',
  // 		default:'default value'
  // 	},
  // 	'vue-props':'hehehe'
  // },
  inject:['inject-test1','inject-test2'],
  // inject:{
  // 	'inject-test1':{
  // 		from: 'f_test1'
  // 	},
  // 	'inject-test2':{
  // 		name: 'f_test2'
  // 	}
  // }
})
/**
 * Actual demo
 */

// var demo = new Vue({

//   el: '#demo',

//   data: {
//     branches: ['master', 'dev'],
//     currentBranch: 'master',
//     commits: null
//   },

//   created: function () {
//     this.fetchData()
//   },

//   watch: {
//     currentBranch: 'fetchData'
//   },

//   filters: {
//     truncate: function (v) {
//       var newline = v.indexOf('\n')
//       return newline > 0 ? v.slice(0, newline) : v
//     },
//     formatDate: function (v) {
//       return v.replace(/T|Z/g, ' ')
//     }
//   },

//   methods: {
//     fetchData: function () {
//       var xhr = new XMLHttpRequest()
//       var self = this
//       xhr.open('GET', apiURL + self.currentBranch)
//       xhr.onload = function () {
//         self.commits = JSON.parse(xhr.responseText)
//         console.log(self.commits[0].html_url)
//       }
//       xhr.send()
//     }
//   }
// })
