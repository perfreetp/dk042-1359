export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/verify/index',
    'pages/report/index',
    'pages/mine/index',
    'pages/detail/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#165DFF',
    navigationBarTitleText: '航材寿命核验',
    navigationBarTextStyle: 'white',
    backgroundColor: '#F5F6F7'
  },
  tabBar: {
    color: '#86909C',
    selectedColor: '#165DFF',
    backgroundColor: '#FFFFFF',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页'
      },
      {
        pagePath: 'pages/verify/index',
        text: '核验'
      },
      {
        pagePath: 'pages/report/index',
        text: '上报'
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的'
      }
    ]
  }
})
