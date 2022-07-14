Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show:{
      type:Boolean,
      value:false
    },
    title:{
      type:String,
      value:''
    },
    content:{
      type:String,
      value:''
    },
    showCancel:{
      type:Boolean,
      value:false
    },
    cancelText:{
      type:String,
      value:'取消'
    },
    cancelColor:{
      type:String,
      value:'#576B95'
    },
    confirmText:{
      type:String,
      value:'确定'
    },
    confirmColor:{
      type:String,
      value:'#000000'
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    richcontent:{},
    showStatus:false,
    extraClasses:'',
    confirm: null,
    cancel: null,
    openurl: null,
  },

  lifetimes:{
  },
  observers:{
    'show':function(res){
      if(res !== this.data.showStatus){ //开始切换显示状态 使用动画方式展示
        if(res){ //显示
          this.setData({
            extraClasses: 'diymodal_box-show',
            showStatus: true,
          })
        }else{ //隐藏
          this.setData({
            extraClasses: 'diymodal_box-hide',
          })
          this.data.openurl = null;
          this.data.cancel = null;
          this.data.confirm = null;
          setTimeout(()=>{
            this.setData({
              showStatus: false,
            })
          },188)
        }
      }

    },
    'content':function(content){
      this.renderContent(content)
    }

  },

  /**
   * 组件的方法列表
   */
  methods: {
    renderContent(xml){
      const nodes = [];
      let index = 0; // 字符串指针
      while (true) {
        const node = this.privateGetNode(xml, index);
        if (node === null) {
          break;
        }
        index = node.end;
        nodes.push(node);
      }
      const richcontent = { nodes : [] }
      richcontent.nodes = nodes;
      this.setData({
        richcontent,
      });
    },
    privateGetNode(str, startIndex) {
      if (startIndex === str.length) return null;
      const i = str.indexOf('<a', startIndex);

      if (i === startIndex) {
        const tempI = str.indexOf('>', startIndex + 2);
        if (tempI === -1) {
          // 不完整的标签
          return {
            end: startIndex + 2,
            type: 'string',
            value: '<a',
          };
        }
        // 搜索右标签
        const tempR = str.indexOf('</a>', tempI + 1);
        if (tempR === -1) {
          // 不完整的标签
          return {
            end: startIndex + 2,
            type: 'string',
            value: '<a',
          };
        }

        // 标签完整
        // 属性解析
        let tempHref = '';
        const tempHrefStart = str.indexOf('href="', i + 2);
        if (tempHrefStart !== -1) {
          // 设置属性
          const tempHrefEnd = str.indexOf('"', tempHrefStart + 6);
          if (tempHrefEnd !== -1) {
            tempHref = str.substring(tempHrefStart + 6, tempHrefEnd);
          }
        }
        // 内容解析
        const tempContent = str.substring(tempI + 1, tempR);
        return {
          end: tempR + 4,
          type: 'a',
          value: tempContent,
          href: tempHref,
        };
      }
      if (i !== -1) {
        return {
          end: i,
          type: 'string',
          value: str.substring(startIndex, i),
        };
      }

      return {
        end: str.length,
        type: 'string',
        value: str.substring(startIndex),
      };
    },
    onConfirmTap(){
      this.triggerEvent('confrim');
      if(this.data.confirm && typeof this.data.confirm === 'function'){
        this.data.confirm();
      }
      this.setData({
        show:false,
      })
    },
    onCancelTap(){
      this.triggerEvent('cancel');
      if(this.data.cancel && typeof this.data.cancel === 'function'){
        this.data.cancel();
      }
      this.setData({
        show:false,
      })
    },
    clicka(res){
      const url = res.currentTarget.dataset.url;
      this.triggerEvent('openurl',{url});
      if(this.data.openurl && typeof this.data.openurl === 'function'){
        this.data.openurl(url);
      }
    },
    hideModal(){
      this.setData({
        show:false,
      })
    },
    showModal(opt){
        const keys = ['title','content','showCancel','cancelText','cancelColor','confirmText','confirmColor'];
        let _opt = {
          show:true,
        };
        keys.forEach((value)=>{
          if(value in opt){
            _opt[value] = opt[value];
          }
        })
        const callbackkeys = ['confirm','cancel','openurl'];
        callbackkeys.forEach(value => {
          if(value in opt && typeof opt[value] === 'function'){
            this.data[value] = opt[value];
          }
        })
        this.setData(_opt)
    },
  },
})
