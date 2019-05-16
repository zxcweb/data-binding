/**
 * 1.实现一个监听器Observer，用来劫持并监听所有属性，如果有变动的，就通知订阅者。
 * 2.实现一个订阅者Watcher，可以收到属性的变化通知并执行相应的函数，从而更新视图。
 * 3.实现一个解析器Compile，可以扫描和解析每个节点的相关指令，并根据初始化模板数据以及初始化相应的订阅器。
*/

export default class MyVue{
    constructor(options){
        this.el = document.querySelector(options.el);
        this.data = options.data || {};
        this._sub = {};
        this._observer(this.data);
        this._complie(this.el);

    }
    _observer(data) {
        //监听
        const that = this
        let handler = {
            get(target, property) {
                return target[property]
            },
            set(target, property, value) {
                // 给定一个目标对象target，及属性和值，赋值给该对象的属性，若成功返回true
                let res = Reflect.set(target, property, value)
                that._sub[property].map(item => {
                    item.update()
                })
                return res;
            }
        }
        this.$data = new Proxy(data, handler)
    }
    _complie(el){
        let nodes = [].slice.call(el.children);
        nodes.map(node=>{
            // 该节点下还存在子节点，继续递归遍历下面节点
            if(node.children.length && node.children.length>0){
                this._complie(node)
            }
            // v-model属性判定
            if(node.hasAttribute('v-model') && (node.tagName === "INPUT")){
                
                let inputVal = node.getAttribute("v-model");
                if(!this._sub[inputVal]){
                    node.value = this.data[inputVal];
                    this._sub[inputVal] = []
                }
                
                this._sub[inputVal].push(new _Watcher(
                    node,
                    this.$data,
                    inputVal,
                    'value'
                ))
                node.addEventListener("input",()=>{
                    this.$data[inputVal] = node.value;
                })
            }
            // 如果文本节点符合{{}}形式，则添加订阅监听
            if(node.childNodes[0] && node.childNodes[0].nodeType == 3 && new RegExp(/\{\{(.*)\}\}/).test(node.childNodes[0].textContent)){
                let elkey = new RegExp(/\{\{(.*)\}\}/).exec(node.childNodes[0].textContent)[1];
                if(!this._sub[elkey]){
                    node.innerHTML = this.data[elkey];
                    this._sub[elkey] = []
                }
                this._sub[elkey].push(new _Watcher(
                    node,
                    this.$data,
                    elkey,
                    'innerHTML'
                ))
            }
        })
    }
}

class _Watcher{
    constructor(el,data,key,attr){
        this.el = el;
        this.data = data;
        this.key = key;
        this.attr = attr;
    }
    update(){
        this.el[this.attr] = this.$data[this.key];
    }
}


