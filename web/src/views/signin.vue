<style scoped>
  .wrapper {
    margin: 90px auto;
  }
  .logo {
    width: 100%;
    height: 120px;
    margin-top: 10px;
    margin-bottom: 20px;
  }
</style>
<template>
  <Row><Col :xs="{span: 24}" :md="{span: 6, push: 9}">
    <Card class="wrapper">
      <img class="logo" src="src/styles/images/logo.svg" alt="logo">
      <Form ref="form" label-position="top" :model="form" :rules="rules">
        <FormItem prop="username">
          <Input v-model="form.username" placeholder="请输入用户名称...">
            <Icon type="ios-person-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>

        <FormItem prop="password">
          <Input v-model="form.password" type="password" placeholder="请输入账户密码...">
            <Icon type="ios-locked-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>

        <FormItem>
          <Button style="width: 100%;" type="primary" @click="login">立即登录</Button>
        </FormItem>
      </Form>
    </Card>
  </Col></Row>
</template>
<script>
  import Util from '../libs/util';

  export default {
    data() {
      return {
        form: {},
        rules: {
          username: [{
            required: true,
            message: '请填写用户名称!',
            trigger: 'blur'
          }],
          password: [{
            required: true,
            message: '请填写用户密码',
            trigger: 'blur'
          }]
        }
      };
    },
    methods: {
      login: function() {
        const that = this;

        this.$refs.form.validate(valid => {
          if (valid) {
            Util.ajax.post('/signin', that.form).then(({data}) => {
              if (data.status !== 'ACTIVE') {
                sessionStorage.clear();
                return this.$Message.error('账户已停用请联系管理员!');
              }

              sessionStorage.account_id = data._id;
              sessionStorage.username = data.username;
              sessionStorage.role = data.role;

              this.$Message.success('登录成功.');
              this.$router.push({name: 'otherRouter'});
            }).catch(err => {
              this.$Message.error('用户名或密码错误!');
            });
          }
        });
      }
    }
  }
</script>