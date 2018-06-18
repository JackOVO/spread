var $ = window.$;
var cookieOptions = { expires: 1 };

function getFormData(id) {
  var data = {};
  $('#' + id)
    .find('input,select')
    .each(function(idx, ele) {
      var name = $(ele).attr('name');
      var value = $(ele).val();

      data[name] = value;
    });

  return data;
}

function packFormData(data) {
  var cityGroup = data.city.split('/');
  cityGroup.push(data.address);

  return {
    yf: data.agree,
    customerName: data.name,
    customerPhone: data.phone,
    customerAddress: cityGroup,
    model: ['充值卡:' + data.refillCard, '款式:' + data.modal],
    account: window.account,
    product: window.product,
    accessLink: location.href
  };
}

function saveOrder(data) {
  return $
    .ajax({
      url: '/order',
      type: 'post',
      data: JSON.stringify(data),
      contentType: 'application/json; charset=utf-8'
    })
    .then(
      function(res) {
        window.weui.toast('恭喜, 提交成功!', 3000);
        $.cookie(
          'successInfo',
          JSON.stringify({
            name: data.customerName,
            phone: data.customerPhone,
            address: data.customerAddress
          }),
          cookieOptions
        );

        pushAccess(res.order._id);
      },
      function() {
        window.weui.alert('抱歉, 请确认您访问页面是否正确!', {
          title: '提交失败'
        });
      }
    );
}

function saveAccessMark() {
  if (!$.cookie('accessStartTime')) {
    $.cookie('accessStartTime', Date.now(), cookieOptions);
  }
}
function pushAccess(orderID) {
  var now = Date.now();
  var accessStartTime = $.cookie('accessStartTime') || now;

  var data = {
    time: accessStartTime,
    shareLink: location.href,
    remain: parseInt((now - accessStartTime) / 1000),
    account: window.account,
    product: window.product,
    clientIP: window.clientIP
  };

  console.info(data);

  if (orderID) {
    data.order = orderID;
    $.post('/access', data);
    return;
  } else {
    if ($.cookie('accessID')) {
      $.ajax({
        url: '/access/' + $.cookie('accessID'),
        type: 'put',
        data: JSON.stringify({ remain: data.remain }),
        contentType: 'application/json; charset=utf-8'
      });
    } else {
      $.post('/access', data).then(function(res) {
        $.cookie('accessID', res.access._id, cookieOptions);
      });
    }
  }
}

window.$(function() {
  saveAccessMark();
  var regexp = {
    NAME: /^[\u4e00-\u9fa5_a-zA-Z_]{1,32}$/,
    PHONE: /[0-9]{11}/,
    ADDRESS: /^[\u4e00-\u9fa5_a-zA-Z0-9_]{2,256}$/
  };

  $('#city-picker').citypicker();
  window.weui.form.checkIfBlur('#form', { regexp: regexp });

  $('#confirm').click(function() {
    window.weui.form.validate(
      '#form',
      function(error) {
        if (error && error.ele.id !== $('#city-picker').attr('id')) {
          window.weui.form.hideErrorTips($('#city-picker')[0]);
        }
        if (error) return;

        var data = getFormData('form');
        var tpData = packFormData(data);
        var successInfo = {};
        if ($.cookie('successInfo')) {
          try {
            successInfo = JSON.parse($.cookie('successInfo'));
          } catch (error) {
            console.error(error);
          }
        }

        if (
          successInfo &&
          successInfo.name === tpData.customerName &&
          successInfo.phone === tpData.customerPhone &&
          (successInfo.address || []).join('/') ===
            (tpData.customerAddress || []).join('/')
        ) {
          window.weui.alert('抱歉, 您今天已经提交成功过了!', {
            title: '提交失败'
          });
          return;
        }

        saveOrder(tpData);
      },
      { regexp: regexp }
    );
  });

  window.history.pushState({ title: 'title', url: '#' }, 'title', '#');
  window.addEventListener(
    'popstate',
    function() {
      //alert("我监听到了浏览器的返回按钮事件啦");//根据自己的需求实现自己的功能
      var ua = navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        window.WeixinJSBridge.call('closeWindow'); //微信
      } else if (ua.indexOf('alipay') != -1) {
        window.AlipayJSBridge.call('closeWebview'); //支付宝
      } else if (ua.indexOf('baidu') != -1) {
        window.BLightApp.closeWindow(); //百度
      } else {
        window.close(); //普通浏览器
      }
    },
    false
  );

  window.onbeforeunload = function() {
    pushAccess();
    window.alert('1');
  };
});
