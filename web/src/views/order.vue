<template>
  <div>
    <Spin fix v-if="exportIng"></Spin>
    <Row>
      <Col span="4">
        <Select
          v-model="selectedAccountId"
          @on-change="loadData"
          placeholder="筛选分享账户">
          <Option value="" key="">全部</Option>
          <Option v-for="item in accounts" :value="item._id" :key="item._id">
            {{ item.name }}
            <span style="float:right;color:#ccc;weigth:bold;">{{ item.alias }}</span>
          </Option>
        </Select>
      </Col>
      <Col span="20" class="text-right">
        <Button type="success" @click="handleExport">导出Excel</Button>
      </Col>
      <Col span="24" style="margin-top: 20px">
        <Table
          border
          stripe
          :loading="loading"
          :columns="columns"
          :data="filterData" />
      </Col>
      <Col span="24" class="text-right" style="margin-top: 20px">
        <Page 
          :total="page.total"
          :page-size="page.size"
          :current="page.current"
          :page-size-opts="page.sizeOpts"
          @on-change="handePageChange"
          @on-page-size-change="handePageSizeChange"
          show-total show-sizer></Page>
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
  </div>
</template>

<script>
  import XLSX from 'xlsx';
  import moment from 'moment';
  import Util from '../libs/util';

   export default {
     data() {
       return {
         loading: false,
         exportIng: false,
         columns: [
           {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            key: 'customerName',
            width: 100,
            title: '客户姓名'
          },
          {
            key: 'customerPhone',
            width: 120,
            title: '客户电话'
          },
          {
            key: 'customerAddress',
            title: '地址信息',
            render: (h, {row}) => row.customerAddress.join('/')
          },
          {
            key: 'product',
            title: '商品',
            render: (h, {row}) => `${row.product.name}`
          },
          {
            key: 'model',
            title: '型号'
          },
          {
            key: 'status',
            width: 80,
            title: '状态'
          },
          {
            key: 'account',
            title: '分享账户',
            render: (h, {row}) => `${row.account.name}(${row.account.alias})`
          },
          {
            key: 'created',
            title: '创建时间',
            width: 150,
            render: (h, {row}) => Util.formatDate(row.created)
          }
         ],
        page: {
          current: 1,
          total: 0,
          size: 100,
          sizeOpts: [50, 100]
        },
         data: [],
         selectedAccountId: '',
         accounts: [],
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
        Util.ajax.get('/order/full', {
          params: {
            offset: (this.page.current - 1) * this.page.size,
            size: this.page.size,
            account: this.selectedAccountId
          }
        }).then(({data: { orders, total }}) => {
          this.data = orders;
          this.page.total = total;
          this.loading = false;
        }).catch(err => {
          this.$Message.error(err);
          this.loading = false;
        });
      },
      loadAccounts: function() {
        Util.ajax.get('/account', {}).then(({data}) => {
          this.accounts = data;
        }).catch(err => {
          this.$Message.error(err);
        });
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
      },
      handePageChange: function(current) {
        this.page.current = current;
        this.loadData();
      },
      handePageSizeChange: function(size) {
        this.page.size = size;
        this.loadData();
      },
      handleExport: function() {
        this.exportIng = true;
        Util.ajax.get('/order/full', {
          // params: { account: this.selectedAccountId }
        }).then(({data: { orders, total }}) => {
          const cols = [];
          const keys = [
            'customerName',
            'customerPhone',
            'customerAddress',
            'expressNumber',
            'product',
            'model',
            'created',
            'status',
            'account',
          ];
          const title = {
            customerName: '顾客姓名',
            customerPhone: '顾客电话',
            customerAddress: '地址信息',
            expressNumber: '快递编号',
            product: '商品名称',
            model: '商品型号',
            account: '分享账户',
            created: '创建时间',
            status: '订单状态'
          }

          const jsonSheet = [title];
          orders.forEach(item => {
            let o = {
              customerName: item.customerName,
              customerPhone: item.customerPhone,
              customerAddress: item.customerAddress.join('/'),
              expressNumber: item.expressNumber,
              product: item.product.name,
              model: item.model,
              created: Util.formatDate(item.created),
              status: item.status,
              account: `${item.account.name}(${item.account.alias})`,
            };

            jsonSheet.push(o);
            keys.forEach((key, idx) => {
              const len = `${o[key]}`.replace(/[\u4e00-\u9fa5]/g, (m) => '01').length;
              cols[idx] = cols[idx] || { wch: 11 };
              cols[idx].wch = len > cols[idx].wch ? len : cols[idx].wch;
            })
          });

          const wb = XLSX.utils.book_new();
          const ws = XLSX.utils.json_to_sheet(jsonSheet);
          ws['!cols'] = cols;

          XLSX.utils.book_append_sheet(wb, ws, 'SheetJS');
          XLSX.writeFile(wb, `${moment().format('YYYY-MM-DD')}订单.xlsx`);
          this.exportIng = false;
        }).catch(err => {
          console.info(err);
          this.$Message.error(err);
          this.exportIng = false;
        });
      }
    },
    created() {
      this.loadData();
      this.loadAccounts();
    }
   }
</script>