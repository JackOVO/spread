function initAddressCascade($prov, $city, $region, addr_arr) {

  //什么都没选，空初始化
  function addrEmptyInit() {
    var prov_html = '<option value="">- 省/自治区/直辖市 -</option>',
        provinces = [];
    provinces = addr_arr[0];
    for (var i = 0; i < provinces.length; i++) {
        prov_html += '<option value="' + provinces[i][0] + '">' + provinces[i][1] + '</option>';
    }
    $prov.html(prov_html);
  }

  //工具函数，通过省份名省获取到省份id
  function getProvIdByName(prov_name) {
      var provinces = [];
      provinces = addr_arr[0];
      prov_name = $.trim(prov_name);
      for (var i = 0; i < provinces.length; i++) {
          if (prov_name == provinces[i][1]) {
              return provinces[i][0];
          }
      }
      return -1;
  }

  //工具函数，通过城市id获取到省份id
  function getProvIdByCityId(city_id) {
      for (var i = 1; i < 36; i++) {
          for (var j = 0; j < addr_arr[i].length; j++) {
              if (addr_arr[i][j][0] == city_id) {
                  return i;
              }
          }
      }
      return -1;
  }

  $prov.change(function () {//绑定选择省份触发
      var prov_id = $(this).val(),
          city_html = '<option value="">- 市 -</option>',
          citys = [];
      citys = addr_arr[prov_id];
      try {
          for (var i = 0; i < citys.length; i++) {
              city_html += '<option value="' + citys[i][0] + '">' + citys[i][1] + '</option>';
          }
      }
      catch (e) { }
      $city.html(city_html);
      $region.html('<option value="">- 区/县 -</option>');
  });

  $city.change(function () {//绑定选择城市触发
      var city_id = $(this).val(),
          region_html = '<option value="">- 区/县 -</option>',
          areas = [];
      areas = addr_arr[city_id];
      for (var i = 0; i < areas.length; i++) {
          region_html += '<option value="' + areas[i][0] + '">' + areas[i][1] + '</option>';
      }
      $region.html(region_html);
  });

  addrEmptyInit();
}




        // function addrInit(prov_id, city_id, area_id) {//工具函数，通过固定的省份id,城市id,地区id来初始化
        //     var prov_html = "",
        //         provinces = [];
        //     provinces = addr_arr[0];
        //     for (var i = 0; i < provinces.length; i++) {
        //         if (provinces[i][0] != prov_id) {
        //             prov_html += '<option value="' + provinces[i][0] + '">' + provinces[i][1] + '</option>';
        //         } else {
        //             prov_html += '<option value="' + provinces[i][0] + '" selected="selected">' + provinces[i][1] + '</option>';
        //         }
        //     }
        //     $prov.html(prov_html);
        //     $prov.trigger("change");
        //     $city.find('option[value="' + city_id + '"]').attr("selected", true).trigger("change");
        //     $region.find('option[value="' + area_id + '"]').attr("selected", true);
        // }
