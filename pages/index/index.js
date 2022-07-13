Page({
  data: {
    showModel:false,
    content:'',
  },
  onLoad() {
    
  },
  openModel() {
    const content = `这里支持多行，并且支持任意多个「超文本标签」<a href="xxxxx">这是一个超文本标签</a>
    这里是第二行；
    第三行；
    `;
    this.setData({
      showModel:true,
      content,
    })
  },
  yes(){
    console.log('yes')
  },
  no(){
    console.log('no')
  },
  openurl(url){
    console.log(url)
  }
})
