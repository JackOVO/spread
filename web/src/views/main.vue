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
        <img class="logo" src="/src/styles/images/sider-logo.svg" alt="logo">
        <Menu
          width="auto"
          theme="dark"
          :active-name="$route.name"
          :class="menuitemClasses"
          @on-select="hanldeMenuSelectChange">

          <MenuItem name="account_index" v-if="role === 'ADMIN'">
            <Icon type="ios-people"></Icon>
            <span>账户管理</span>
          </MenuItem>
          <MenuItem name="qr_index">
            <Icon type="qr-scanner"></Icon>
            <span>二维码啊</span>
          </MenuItem>
          <MenuItem name="access_index">
            <Icon type="paper-airplane"></Icon>
            <span>访问信息</span>
          </MenuItem>
          <MenuItem name="resource_index">
            <Icon type="images"></Icon>
            <span>资源管理</span>
          </MenuItem>
           <MenuItem name="order_index" v-if="role === 'ADMIN'">
            <Icon type="clipboard"></Icon>
            <span>订单管理</span>
          </MenuItem>
          <MenuItem name="domain_index" v-if="role === 'ADMIN'">
            <Icon type="network"></Icon>
            <span>域名管理</span>
          </MenuItem>
          <MenuItem name="linkTemplate_index" v-if="role === 'ADMIN'">
            <Icon type="at"></Icon>
            <span>链接模板</span>
          </MenuItem>
          <MenuItem name="product_index" v-if="role === 'ADMIN'">
            <Icon type="tshirt"></Icon>
            <span>产品管理</span>
          </MenuItem>
        </Menu>
      </Sider>
      <Layout>
        <Header
          :style="{background: '#fff', boxShadow: '0 2px 3px 2px rgba(0,0,0,.1)'}">
          <Menu mode="horizontal">
            <Submenu name="user-sub">
              <template slot="title">
                <Icon type="person"></Icon>
                <span v-html="name"></span>
                [<span v-html="role"></span>]
              </template>
              <MenuItem name="modify">修改密码</MenuItem>
              <MenuItem name="exit"><div @click="handleExit">退出</div></MenuItem>
            </Submenu>
          </Menu>
        </Header>
        <Content :style="{padding: '0 16px 16px'}">
          <Breadcrumb :style="{margin: '16px 0'}">
            <BreadcrumbItem></BreadcrumbItem>
          </Breadcrumb>
          <Card>
            <div>
              <router-view></router-view>
            </div>
          </Card>
        </Content>
      </Layout>
    </Layout>
  </div>
</template>
<script>
  import Util from '../libs/util';

  export default {
    data () {
      return {
        role: sessionStorage.role,
        name: sessionStorage.name,
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
    },
    methods: {
      handleExit() {
        Util.ajax.get('/logout', {}).then(() => {
          sessionStorage.clear();
          location.href = '/signin';
        }).catch(err => {
          console.error(err);
          sessionStorage.clear();
          location.href = '/signin';
        });
      },
      hanldeMenuSelectChange(name) {
        this.$router.push({ name });
      }
    }
  }
</script>