<style scoped>
.logo {
  width: 100%;
  height: 120px;
  margin-top: -75px;
  margin-bottom: 15px;
}
.ivu-layout-sider-collapsed {
  .logo {
    height: 50px;
    margin-top: 7px;
    margin-bottom: 5px;
  }
}
.ivu-layout-header {
  padding: 0 50px;
  height: 59px;
  line-height: 59px;
}
.menu-item span {
  display: inline-block;
  overflow: hidden;
  width: 69px;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
  transition: width .2s ease .2s;
}
.menu-item i {
  transform: translateX(0px);
  transition: font-size .2s ease, transform .2s ease;
  vertical-align: middle;
  font-size: 16px;
}
.collapsed-menu span {
  width: 0px;
  transition: width .2s ease;
}
.collapsed-menu i {
  transform: translateX(5px);
  transition: font-size .2s ease .2s, transform .2s ease .2s;
  vertical-align: middle;
  font-size: 22px;
}
.ivu-menu-horizontal .ivu-menu-submenu {
  float: right;
}
</style>
<template>
  <div class="layout">
    <Layout :style="{minHeight: '100vh'}">
      <Sider collapsible :collapsed-width="80" width="180" v-model="isCollapsed">
        <img class="logo" src="src/styles/images/sider-logo.svg" alt="logo">
        <Menu active-name="1-2" theme="dark" width="auto" :class="menuitemClasses">
          <MenuItem name="1-1">
            <Icon type="ios-people"></Icon>
            <span>账户管理</span>
          </MenuItem>
          <MenuItem name="1-3">
            <Icon type="at"></Icon>
            <span>链接管理</span>
          </MenuItem>
          <MenuItem name="1-2">
            <Icon type="image"></Icon>
            <span>商品管理</span>
          </MenuItem>
          <MenuItem name="1-4">
            <Icon type="bonfire"></Icon>
            <span>订单管理</span>
          </MenuItem>
        </Menu>
      </Sider>
      <Layout>
        <Header
          :style="{background: '#fff', boxShadow: '0 2px 3px 2px rgba(0,0,0,.1)'}">
          <Menu mode="horizontal">
            <Submenu name="3">
              <template slot="title">
                <Icon type="person"></Icon>
                wx6(admin)
              </template>
              <MenuItem name="1-2">修改密码</MenuItem>
              <MenuItem name="1-1">退出</MenuItem>
            </Submenu>
          </Menu>
        </Header>
        <Content :style="{padding: '0 16px 16px'}">
          <Breadcrumb :style="{margin: '16px 0'}">
            <BreadcrumbItem>Home</BreadcrumbItem>
          </Breadcrumb>
          <Card>
            <div style="height: 600px">Content</div>
          </Card>
        </Content>
      </Layout>
    </Layout>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        isCollapsed: false
      };
    },
    computed: {
      menuitemClasses: function () {
        return [
          'menu-item',
          this.isCollapsed ? 'collapsed-menu' : ''
        ]
      }
    }
  }
</script>