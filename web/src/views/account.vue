<template>
  <Row>
    <Col span="4">
      <Input
        v-model="keyword"
        icon="search"
        placeholder="账户名称搜索..." />
    </Col>
    <Col span="20" class-name="text-right">
      <Button type="primary" @click="modal = true">创建用户</Button>
      <!-- <Button>重置密码</Button> -->
    </Col>
    <Col span="24" style="height: 20px;"></Col>
    <Col span="24">
      <Table
        border
        stripe
        :loading="loading"
        :columns="columns"
        :data="filterData"
        @on-select="handleTableSelect" />
    </Col>
    <Col>
      <Modal
        width="380px"
        title="普通账户创建"
        ok-text="保存"
        v-model="modal"
        :loading="modalLoading"
        @on-ok="handleAccountCreate">
        
        <Form ref="form" label-position="top" :model="form" :rules="rules">
          <FormItem prop="name">
            <Input v-model="form.name" placeholder="请输入账户名称...">
              <Icon type="ios-person-outline" slot="prepend"></Icon>
            </Input>
          </FormItem>

           <FormItem prop="alias">
            <Input v-model="form.alias" placeholder="请输入用户姓名...">姓名
              <Icon type="ios-person-outline" slot="prepend"></Icon>
            </Input>
          </FormItem>

          <FormItem prop="password">
            <Input v-model="form.password" type="password" placeholder="请输入账户密码...">
              <Icon type="ios-locked-outline" slot="prepend"></Icon>
            </Input>
          </FormItem>

          <FormItem prop="passwdCheck">
            <Input v-model="form.passwdCheck" type="password" placeholder="请输入确认账户密码...">
              <Icon type="ios-locked-outline" slot="prepend"></Icon>
            </Input>
          </FormItem>

          <FormItem prop="phone">
            <Input v-model="form.phone" placeholder="请输入电话号码...">
              <Icon type="iphone" slot="prepend"></Icon>
            </Input>
          </FormItem>
        </Form>
      </Modal>
    </Col>
  </Row>
</template>
<script>
  import Util from '../libs/util';

  export default {
    data() {
      const  validatePassCheck = (rule, value, cb, source, options) => {
        if (value !== this.form.password) {
          cb(new Error('两次密码输入不匹配'));
        } else {
          cb();
        }
      }

      return {
        modal: false,
        modalLoading: true,
        loading: false,
        keyword: '',
        form: {},
        rules: {
          name: [{
            required: true,
            message: '请填写账户名称!',
            trigger: 'blur'
          }, {
            pattern: /^[a-z]\w{3,12}$/,
            message: '以小写字母开头, 长度在4~12之间, 只能包含字母、数字和下划线!',
            trigger: 'blur'
          }],
          alias: [{
            required: true,
            message: '请填写姓名!',
          }],
          password: [{
            required: true,
            message: '请填写账户密码!',
            trigger: 'blur'
          }, {
            pattern: /^[a-zA-Z]\w{5,17}$/,
            message: '以字母开头, 长度在6~18之间, 只能包含字母、数字和下划线!',
            trigger: 'blur'
          }],
          passwdCheck: [{
            required: true,
            message: '请确认账户密码!',
            trigger: 'blur'
          }, {
            validator: validatePassCheck,
            trigger: 'blur'
          }],
          phone: [{
            required: true,
            message: '请填写手机号码!',
            trigger: 'blur'
          }, {
            pattern: /^1[0-9]{10}$|^[569][0-9]{7}$/,
            message: '请有效的手机号码!'
          }]
        },
        columns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          }, {
            key: 'name',
            title: '账户名称'
          }, {
            key: 'alias',
            title: '姓名'
          }, {
            key: 'phone',
            width: 120,
            title: '联系方式'
          }, {
            key: 'role',
            width: 100,
            title: '角色'
          }, {
            key: 'created',
            title: '创建时间',
            render: (h, {row}) => Util.formatDate(row.created)
          }, {
            key: 'status',
            title: '状态',
            width: 110,
            align: 'center',
            render: (h, {row: {name, status}}) => {
              return h('i-switch', {
                  props: {
                    size: 'large',
                    value: status === 'ACTIVE'
                  },
                  on: {
                    'on-change': val => {
                      this.updateAccountStatus(name, val ? 'ACTIVE' : 'DISABLED')
                    }
                  },
                  scopedSlots: {
                    open:  (props) => h('span', '启用'),
                    close: (props) => h('span', '禁用')
                  }
              });
            }
          }
        ],
        data: []
      };
    },
    computed: {
      filterData: function() {
        return this.data.filter(account =>
          account.name.indexOf(this.keyword) >= 0);
      }
    },
    methods: {
      changeLoading() {
        this.modalLoading = false;
        this.$nextTick(() => {
          this.modalLoading = true;
        });
      },
      loadData: function() {
        this.loading = true;
        Util.ajax.get('/account', {}).then(({data}) => {
          this.data = data;
          this.loading = false;
        }).catch(err => {
          this.$Message.error(err);
          this.loading = false;
        });
      },
      handleAccountCreate: function() {
        this.$refs.form.validate(valid => {
          if(!valid) {
            return this.changeLoading();
          }

          Util.ajax.post('/account', {
            name: this.form.name,
            alias: this.form.alias,
            phone: this.form.phone,
            password: this.form.password
          }).then(({data}) => {
            this.changeLoading();
            this.modal = false;
            this.loadData();
            this.$Message.success(data.msg);
          }).catch(err => {
            this.changeLoading();
            this.modal = false;
            this.$Message.err(err.msg);
          });
        });
      },
      updateAccountStatus: function(name, status) {
        Util.ajax.put(`/account/${name}`, {status}).then(({data}) => {
          this.$Message.success(data.msg);
          this.loadData();
        }).catch(err => {
          this.$Message.err(err);
        });
      },
      handleTableSelect: function(selection, row) {
        console.info(selection, row);
      }
    },
    created() {
      this.loadData();
    }
  }
</script>