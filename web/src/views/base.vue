<template>
  <Row>
    <Col span="24">
      <Table
        border
        stripe
        :loading="loading"
        :columns="columns"
        :data="filterData" />
    </Col>
    <Col>
      <Modal
        width="380px"
        :title="modal.title"
        ok-text="保存"
        :value="modal.value"
        :loading="modal.loading"
        @on-ok="handleMondalOK" />
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
          }
         ],
         data: [],
         form: {},
         rules: {},
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
        // Util.ajax.get('/test', {}).then(({data}) => {
        //   this.data = data;
        //   this.loading = false;
        // }).catch(err => {
        //   this.$Message.error(err);
        //   this.loading = false;
        // });
      },
      handleMondalOK: function() {
        // this.$refs.form.validate(valid => {
        //    if(!valid) {
        //     return this.changeLoading();
        //   }

        //   Util.ajax.post('/product', {
        //     title: this.form.title,
        //     name: this.form.name,
        //     describe: this.form.describe,
        //     introduce: this.form.introduce,
        //     form: this.form.form
        //   }).then(({data}) => {
        //     this.changeLoading();
        //     this.modal.value = false;
        //     this.loadData();
        //     this.$Message.success(data.msg);
        //   }).catch(err => {
        //     this.changeLoading();
        //     this.modal.value = false;
        //     this.$Message.err(err.msg);
        //   });
        // });
      }
    },
    created() {

    }
   }
</script>