<template>
  <Row>
    <Col span="24" class-name="text-right">
      <Button  @click="handleDomainUpdate">编辑</Button>
      <Button type="primary" @click="handleDomainCreate">创建域名</Button>
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
        :title="modal.title"
        ok-text="保存"
        v-model="modal.value"
        :loading="modal.loading"
        @on-ok="handleMondalOK">

        <Form ref="form" label-position="top" :model="form" :rules="rules">
          <FormItem prop="name">
            <Input v-model="form.name" placeholder="请输入域名别称..." />
          </FormItem>

          <FormItem prop="value">
            <Input
              v-model="form.value"
              :disabled="!!form._id"
              placeholder="请输入域名值..." />
          </FormItem>
          <FormItem prop="status">
            <Select v-model="form.status" placeholder="请选择域名状态...">
              <Option value="DISABLE">停用(未设置或被封锁)</Option>
              <Option value="GATE">入口(分享访问域名)</Option>
              <Option value="TARGET">目标(实际访问域名)</Option>
              <Option value="RESOURCE">资源(微信名片域名)</Option>
            </Select>
          </FormItem>

          <FormItem prop="source">
            <Input v-model="form.source" placeholder="请输入域名来源..." />
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
       return {
         loading: false,
         columns: [
           {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            key: 'name',
            title: '名称'
          },
          {
            key: 'value',
            title: '值'
          },
          {
            key: 'source',
            title: '来源'
          },
          {
            key: 'status',
            width: 100,
            title: '状态',
            align: 'center',
            render: (h, {row}) => {
              const map = {
                DISABLE: { text: '停用', color: 'red' },
                GATE: { text: '入口', color: 'green' },
                TARGET: { text: '目标', color: 'green' },
                RESOURCE: { text: '资源', color: 'blue' }
              }[row.status];
              
              return h('Tag', {props: {color: map.color}}, map.text);
            }
          },
          {
            key: 'created',
            width: 160,
            title: '创建时间',
            render: (h, {row}) => Util.formatDate(row.created)
          },
          {
            key: 'changed',
            width: 160,
            title: '变更时间',
            render: (h, {row}) => Util.formatDate(row.changed)
          }
         ],
         data: [],
         form: {
           status: 'DISABLE'
         },
         rules: {
           name: [{
            required: true,
            message: '请填写域名别名!',
            trigger: 'blur'
          }],
          value: [{
            required: true,
            message: '请填写域名值!',
            trigger: 'blur'
          }, {
            pattern: /^www\.[\d\w\.]+\.[a-z]{2,}$/,
            message: '以 www., 中间可包含字母, 数字, ".", "-", .小写字母结尾',
            trigger: 'blur'
          }]
         },
         modal: {
           value: false,
           title: "标题",
           loading: true
         }
       };
     },
     computed: {
      filterData: function() {
        return this.data;
      }
    },
    methods: {
      changeLoading() {
        this.modal.loading = false;
        this.$nextTick(() => {
          this.modal.loading = true;
        });
      },
      loadData: function() {
        this.loading = true;
        Util.ajax.get('/domain', {}).then(({data}) => {
          this.data = data;
          this.loading = false;
        }).catch(err => {
          this.$Message.error(err);
          this.loading = false;
        });
      },
      handleMondalOK: function() {
        this.$refs.form.validate(valid => {
           if(!valid) {
            return this.changeLoading();
          }

          let path = '/domain';
          let action = 'post';
          let data = {
            value: this.form.value,
            name: this.form.name,
            status: this.form.status,
            source: this.form.source || '',
          };

          // 编辑
          if (this.form._id) {
            action = 'put';
            path = `/domain/${this.form.value}`;
            delete(data.value);
          }

          Util.ajax[action](path, data).then(({data}) => {
            this.changeLoading();
            this.modal.value = false;
            this.loadData();
            this.$Message.success(data.msg);
          }).catch(err => {
            this.changeLoading();
            this.modal.value = false;
            this.$Message.err(err.msg);
          });
        });
      },
      handleTableSelect: function(selection, row) {
        this.selectedRow = row;
      },
      handleDomainCreate: function() {
        this.modal.value = true;
        this.modal.title = '创建域名';
        this.form = { status: 'DISABLE' };
      },
      handleDomainUpdate: function() {
        if (this.selectedRow) {
          this.modal.value = true;
          this.modal.title = '编辑域名';
          this.form = this.selectedRow;
        } else {
          this.$Message.info('请选择一项域名');
        }
      }
    },
    created() {
      this.loadData();
    }
   }
</script>