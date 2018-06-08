//
//

var productSalesPaging;


function dashboard() {
  console.log('--->>> Initializing Dashboard');
  $('.mainContainer .dashboard .header').html('Dashboard<span class="sub-text">View all Sales</span>');
  $('.mainContainer .menus .menu .text i.active').removeClass('active');
  $('[data-id=dashboard] i').addClass('active');
  loader('s', 'Please wait while dashboard is loading data...');
  execute('getDashboardData', {
    "cux": "verizon"
  }, function (data) {
    if (data) {
      var _d = processData(data);
      _g._d = _d;
      render('.dashboard', 'dashboard', _d);
      renderCharts();
      bindDownloads();

      bind('.mainContainer .dashboard .sales .usersContainer .ucHeader .filter.week', function () {
        $('.mainContainer .dashboard .sales .usersContainer .ucHeader .filter').removeClass('selected');
        $(this).addClass('selected');
        _g.susers = _g._d.users.tw;
        renderUsers(_g._d.users.tw);
      })

      bind('.mainContainer .dashboard .sales .usersContainer .ucHeader .filter.month', function () {
        $('.mainContainer .dashboard .sales .usersContainer .ucHeader .filter').removeClass('selected');
        $(this).addClass('selected');
        _g.susers = _g._d.users.tm;
        renderUsers(_g._d.users.tm);
      });

      bind('.mainContainer .dashboard .header .sub-text', function () {
        sales();
      })

      $('.mainContainer .dashboard .sales .usersContainer .ucHeader .filter.week').trigger(eventToUse);

      // start searching
      $('.mainContainer .dashboard .sales .usersContainer .ucHeader .search').keyup(function () {
        try {
          var val = $(this).val().trim().toLowerCase();
          if (val == '') {
            renderUsers(_g.susers)
          } else {
            var t = _g.susers.filter(function (el) {
              return el.name.toLowerCase().includes(val) || el.phone.includes(val);
            });

            if (t == undefined)
              t = [];
            renderUsers(t);
          }
        } catch (err) {
          renderUsers(_g.susers)
        }
      })
    } else {
      loader('e', 'Can not connect to server');
    }
  })

}

function bindDownloads() {
  bind('.mainContainer .dashboard .reports .report .buttons .button.download', function () {
    var type = $(this).parent().data('id');
    switch (type) {
      case 'mts':
        window.open(appUrl + 'api/get_sales/downloadCSV/{month}?nMonth=' + parseInt(moment().format('YYYYMM')) + '&access_token=' + access_token);
        break;
      case 'qts':
        window.open(appUrl + 'api/get_sales/downloadCSV/{month}?nMonth=' + 0 + '&access_token=' + access_token);
        break;
      case 'ats':
        window.open(appUrl + 'api/get_sales/downloadAccessorySales/{month}?nMonth=' + parseInt(moment().format('YYYYMM')) + '&access_token=' + access_token);
        break
      case 'qas':
        window.open(appUrl + 'api/get_sales/downloadAccessorySales/{month}?nMonth=' + 0 + '&access_token=' + access_token);
        break;
    }
  })

  bind('.mainContainer .dashboard .reports .report .buttons .button.email', function () {
    var type = $(this).parent().data('id');
  });


  bind('.mainContainer .dashboard .reports .downloadAll', function () {
    $.notify('Please wait...', 'info');
    $.notify('Allow Pop Ups to download multiple request', 'info');
    setTimeout(function () {
      window.open(appUrl + 'api/get_sales/downloadCSV/{month}?nMonth=' + parseInt(moment().format('YYYYMM')) + '&access_token=' + access_token);
      setTimeout(function () {
        window.open(appUrl + 'api/get_sales/downloadCSV/{month}?nMonth=' + 0 + '&access_token=' + access_token);
      }, 500)
      setTimeout(function () {
        window.open(appUrl + 'api/get_sales/downloadCSV/{month}?nMonth=' + parseInt(moment().format('YYYYMM')) + '&access_token=' + access_token);
      }, 1000)
      setTimeout(function () {
        window.open(appUrl + 'api/get_sales/downloadCSV/{month}?nMonth=' + 0 + '?access_token=' + access_token);
      }, 1500)
    }, 5000);
  });

  bind('.mainContainer .dashboard .reports .report .reportHeader .reportAction', function () {
    var type = $(this).data('id');
    switch (type) {
      case 'total':
      window.open(appUrl + 'api/get_sales/downloadCSV/{month}?nMonth=' + 1 + '&access_token=' + access_token);      
        break;
      case 'total-q1':
      window.open(appUrl + 'api/get_sales/downloadCSV/{month}?nMonth=' + 0 + '&access_token=' + access_token);      
        break;
      case 'accessory':
      window.open(appUrl + 'api/get_sales/downloadAccessorySales/{month}?nMonth=' + 1 + '&access_token=' + access_token);      
        break;
      case 'accessory-q1':
      window.open(appUrl + 'api/get_sales/downloadAccessorySales/{month}?nMonth=' + 0 + '&access_token=' + access_token);      
        break;
    }
  })
}

function renderUsers(d) {
  render('.mainContainer .dashboard .sales .usersContainer .users', 'user', d);
}

function renderCharts() {
  Chart.defaults.global.elements.line.fill = false;

  Chart.Scale.prototype.buildYLabels = function () {
    this.yLabelWidth = 0;
  };

  var bar_ctx = document.getElementById("first").getContext('2d');
  var gradient = bar_ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, '#4e0308');
  gradient.addColorStop(1, '#91050f');

  try {
    new Chart(document.getElementById("first"), {
      type: 'line',
      data: {
        labels: _g._d.totalSales.w.slice(0).slice(-8),
        datasets: [{
          data: _g._d.totalSales.cd.slice(0).slice(-8),
          backgroundColor: gradient,
          fill: 'start'
        }]
      },
      options: {
        responsive: false,
        scales: {
          xAxes: [{
            display: true,
            gridLines: {
              display: false,
              drawBorder: true,
              color: "white"
            },
            scaleLabel: {
              display: true,
              labelString: 'Weeks',
              fontColor: "white"
            },
            ticks: {
              fontColor: "white",
              fontSize: 10
            }
          }],
          yAxes: [{
            type: 'linear',
            display: true,
            gridLines: {
              display: false,
              drawBorder: true,
              color: 'white'
            },
            scaleLabel: {
              display: true,
              labelString: 'Sales',
              fontColor: "white"
            },
            position: 'left',
            ticks: {
              beginAtZero: true,
              stepSize: 1000,
              userCallback: function (tick) {
                return '$ ' + parseInt(tick).toString();
              },
              fontColor: "white",
              fontSize: 10
            }
          }]
        },
        plugins: {
          filler: {
            propagate: false
          }
        },
        legend: {
          display: false
        },
        title: {},
        elements: {
          arc: {},
          point: {
            radius: 0,
            borderWidth: 1
          },
          line: {
            tension: 1,
            borderWidth: 1,
          },
          rectangle: {},
        },
        tooltips: {},
        hover: {},
      }
    });
  } catch (e) {

  }
  try {
    new Chart(document.getElementById("second"), {
      type: 'line',
      data: {
        labels: _g._d.accessorySales.w.slice(0).slice(-8),
        datasets: [{
          data: _g._d.accessorySales.cd.slice(0).slice(-8),
          backgroundColor: gradient,
          fill: 'start'
        }]
      },
      options: {
        responsive: false,
        scales: {
          xAxes: [{
            stacked: false,
            display: true,
            gridLines: {
              display: false,
              drawBorder: true,
              color: "white"
            },
            scaleLabel: {
              display: true,
              labelString: 'Weeks',
              fontColor: "white"
            },
            ticks: {
              fontColor: "white",
              fontSize: 10
            }
          }],
          yAxes: [{
            type: 'linear',
            display: true,
            gridLines: {
              display: false,
              drawBorder: true,
              color: 'white'
            },
            scaleLabel: {
              display: true,
              labelString: 'Sales',
              fontColor: "white"
            },
            position: 'left',
            ticks: {
              beginAtZero: true,
              stepSize: 1000,
              userCallback: function (tick) {
                return '$ ' + parseInt(tick).toString();
              },
              fontColor: "white",
              fontSize: 10
            }
          }]
        },
        plugins: {
          filler: {
            propagate: false
          }
        },
        legend: {
          display: false
        },
        title: {},
        elements: {
          arc: {},
          point: {
            radius: 0,
            borderWidth: 1
          },
          line: {
            tension: 1,
            borderWidth: 1,
          },
          rectangle: {},
        },
        tooltips: {},
        hover: {},
      }
    });
  } catch (e) {

  }

  try {

    new Chart(document.getElementById("third"), {
      type: 'line',
      data: {
        labels: _g._d.devicesales.w.slice(0).slice(-8),
        datasets: [{
          data: _g._d.devicesales.cd.slice(0).slice(-8),
          backgroundColor: gradient,
          fill: 'start'
        }]
      },
      options: {
        responsive: false,
        scales: {
          xAxes: [{
            stacked: false,
            display: true,
            gridLines: {
              display: false,
              drawBorder: true,
              color: "white"
            },
            scaleLabel: {
              display: true,
              labelString: 'Weeks',
              fontColor: "white"
            },
            ticks: {
              fontColor: "white",
              fontSize: 10
            }
          }],
          yAxes: [{
            type: 'linear',
            display: true,
            gridLines: {
              display: false,
              drawBorder: true,
              color: 'white'
            },
            scaleLabel: {
              display: true,
              labelString: 'Sales',
              fontColor: "white"
            },
            position: 'left',
            ticks: {
              beginAtZero: true,
              stepSize: 1000,
              userCallback: function (tick) {
                return '$ ' + parseInt(tick).toString();
              },
              fontColor: "white",
              fontSize: 10
            }
          }]
        },
        plugins: {
          filler: {
            propagate: false
          }
        },
        legend: {
          display: false
        },
        title: {},
        elements: {
          arc: {},
          point: {
            radius: 0,
            borderWidth: 1
          },
          line: {
            tension: 1,
            borderWidth: 1,
          },
          rectangle: {},
        },
        tooltips: {},
        hover: {},
      }
    });
  } catch (e) {

  }

  renderProdcutSalesChart();

  bind('.mainContainer .dashboard .charts .chart .download', function () {
    var id = $(this).data('id');
    switch (id) {
      case 't':
        window.open(appUrl + 'api/get_sales/downloadCSV/{month}?nMonth=' + 1 + '&access_token=' + access_token);
        break;
      case 'a':
        window.open(appUrl + 'api/get_sales/downloadAccessorySales/{month}?nMonth=' + 1 + '&access_token=' + access_token);
        break;
      case 'd':
        window.open(appUrl + 'api/get_sales/downloadDeviceSales/{month}?nMonth=' + 1 + '&access_token=' + access_token);
        break;
    }
  })
}

function renderProdcutSalesChart() {
  execute('getProductSales', {
    paging: productSalesPaging
  }, function (response) {
    try {
      var products = [];
      var sales = [];
      productSalesPaging = response.paging;
      response.data.forEach(function (el) {
        products.push(el._id);
        sales.push(1 * el.sales.toFixed(2));
      });
      var bar_ctx = document.getElementById("fourth").getContext('2d');
      var gradient1 = bar_ctx.createLinearGradient(0, 0, 0, 100);
      gradient1.addColorStop(0, '#4e0308');
      gradient1.addColorStop(1, '#91050f');

      new Chart(document.getElementById("fourth"), {
        type: 'bar',
        data: {
          labels: products,
          datasets: [{
            data: sales,
            backgroundColor: gradient1,
            hoverBackgroundColor: gradient1,
            fill: 'start'
          }]
        },
        options: {
          responsive: true,
          scaleShowLabels: false,
          scales: {
            xAxes: [{
              stacked: false,
              display: true,
              gridLines: {
                display: false,
                drawBorder: true,
                color: "black",
                offsetGridLines: true
              },
              ticks: {
                userCallback: function (tick) {
                  var xx = tick[0].toUpperCase() + tick.substr(1, tick.length);
                  var temp = xx.split(' ');
                  if (temp.length <= 2) {
                    return xx;
                  } else {
                    return temp[0] + ' ' + temp[1];
                  }
                },
                fontColor: "black",
                fontSize: 10
              }
            }],
            yAxes: [{
              type: 'linear',
              display: true,
              gridLines: {
                display: true,
                drawBorder: true,
                color: 'black'
              },
              ticks: {
                beginAtZero: true,
                stepSize: 1000,
                userCallback: function (tick) {
                  return '$ ' + parseInt(tick).toString();
                },
                fontColor: "black",
                fontSize: 10
              }
            }]
          },
          plugins: {
            datalabels: {
              display: true
            },
          },
          legend: {
            display: false
          },
          title: {},
          elements: {
            arc: {},
            point: {
              radius: 0,
              borderWidth: 0,
            },
            line: {
              tension: 1,
              borderWidth: 5,
            },
            rectangle: {},
          },
          tooltips: {},
          hover: {},
        }
      });
    } catch (e) {
      console.log(e);
    };

    // Binding Next and Previous Buttons for graph
    bind('.mainContainer .dashboard .sales .controls .prodcut-sales-next', function () {
      if ((productSalesPaging.page + 1) > Math.ceil(productSalesPaging.count / 10)) {
        // do nothing
      } else {
        productSalesPaging.page = productSalesPaging.page + 1;
        renderProdcutSalesChart();
      }
    });

    bind('.mainContainer .dashboard .sales .controls .prodcut-sales-prev', function () {
      if (productSalesPaging.page <= 1) {
        // do nothing
      } else {
        productSalesPaging.page = productSalesPaging.page - 1;
        renderProdcutSalesChart();
      }
    })
  })
}


function loader(type, text) {
  if (text == undefined)
    text = 'Please wait while dashboard is loading data...';
  switch (type) {
    case 's':
      render('.dashboard', 'loader', {
        text: text,
        icon: 'pulse.png'
      });
      break;
    case 'h':
      break;
    case 'e':
      render('.dashboard', 'loader', {
        text: text,
        icon: 'icon-nc.png'
      });
      break;
  }
}

function processData(d) {
  var _d = {};
  for (var key in d) {
    switch (key) {
      case 'accessorySales':
        try {
          var t = 0;
          var cd = [];
          var w = [];
          d['totalSales'].forEach(function (el) {
            var temp = d['accessorySales'].find(function (el1) {
              return el1._id == el._id;
            });
            w.push(el._id);
            if (temp) {
              t = t + temp.nrc + temp.rc;
              cd.push(temp.nrc + temp.rc);
            } else {
              cd.push(0);
            }
          })
          // d['accessorySales'].forEach(function (el) {
          //   t = t + el.nrc + el.rc;
          //   w.push(el._id);
          //   cd.push(el.nrc + el.rc);
          // });

          _d['accessorySales'] = {
            t: t.toFixed(2),
            cd: cd,
            w: w
          };
        } catch (e) {
          console.log(e)
          _d['accessorySales'] = {}
        }
        break;
      case 'accressoryST':
        try {
          var diff = 0;
          var tm = 0;
          var lm = 0;
          var _s;
          d['accressoryST'].forEach(function (el) {
            if (el._id.toString().slice(-2) == (new Date().getMonth() + 1)) {
              tm = el.total;
            } else {
              lm = el.total
            }
          });
          diff = Math.abs(tm - lm);
          tm >= lm ? _s = 'up' : _s = 'down';
          var p;
          if (tm == 0 && lm == 0)
            p = 0;
          else
            p = ((tm - lm) / lm) * 100;
          if (p == Infinity)
            p = 100 * tm;
          _d['accressoryST'] = {
            diff: diff,
            tm: tm,
            _s: _s,
            p: p
          }
        } catch (e) {
          _d['accressoryST'] = {}
        }
        break;
      case 'devicesales':
        try {
          var t = 0;
          var cd = [];
          var w = [];
          d['totalSales'].forEach(function (el) {
            var temp = d['devicesales'].find(function (el1) {
              return el1._id == el._id;
            });
            w.push(el._id);
            if (temp) {
              t = t + temp.nrc + temp.rc;
              cd.push(temp.nrc + temp.rc);
            } else {
              cd.push(0);
            }

          })
          // d['devicesales'].forEach(function (el) {
          //   t = t + el.nrc + el.rc;
          //   w.push(el._id);
          //   cd.push(el.nrc + el.rc);
          // });
          // for (var i = 1; i <= weeksInYear(new Date().getFullYear()); i++) {
          //   s = w[i];
          //   cd.push(s == undefined ? 0 : s);
          // }
          _d['devicesales'] = {
            t: t.toFixed(2),
            cd: cd,
            w: w
          };
        } catch (e) {
          console.log(e);
          _d['devicesales'] = {}
        }
        break;
      case 'newST':
        try {
          var diff = 0;
          var tm = 0;
          var lm = 0;
          var _s;
          d['newST'].forEach(function (el) {
            if (el._id.toString().slice(-2) == (new Date().getMonth() + 1)) {
              tm = el.total;
            } else {
              lm = el.total
            }
          });
          diff = Math.abs(tm - lm);
          tm >= lm ? _s = 'up' : _s = 'down';
          var p;
          if (tm == 0 && lm == 0)
            p = 0;
          else
            p = ((tm - lm) / lm) * 100;
          if (p == Infinity)
            p = 100 * tm;
          _d['newST'] = {
            diff: diff,
            tm: tm,
            _s: _s,
            p: p
          }
        } catch (e) {
          _d['newST'] = {}
        }
        break;
      case 'totalSales':
        try {
          var t = 0;
          var cd = [];
          var w = [];
          d['totalSales'].forEach(function (el) {
            t = t + el.nrc + el.rc;
            w.push(el._id);
            cd.push(el.nrc + el.rc);
          });
          // for (var i = 1; i <= weeksInYear(new Date().getFullYear()); i++) {
          //   s = w[i];
          //   cd.push(s == undefined ? 0 : s);
          // }
          _d['totalSales'] = {
            t: t.toFixed(2),
            cd: cd,
            w: w
          };
        } catch (e) {
          console.log(e);
          _d['totalSales'] = {}
        }
        break;
      case 'upgradeST':
        try {
          var diff = 0;
          var tm = 0;
          var lm = 0;
          var _s;
          d['upgradeST'].forEach(function (el) {
            if (el._id.toString().slice(-2) == (new Date().getMonth() + 1)) {
              tm = el.total;
            } else {
              lm = el.total
            }
          });
          diff = Math.abs(tm - lm);
          tm >= lm ? _s = 'up' : _s = 'down';
          var p;
          if (tm == 0 && lm == 0)
            p = 0;
          else
            p = ((tm - lm) / lm) * 100;
          if (p == Infinity)
            p = 100 * tm;
          _d['upgradeST'] = {
            diff: diff,
            tm: tm,
            _s: _s,
            p: p
          }
        } catch (e) {
          _d['upgradeST'] = {}
        }
        break;
      case 'users':
        try {
          var tm = [];
          var tw = [];
          d['users'].forEach(function (el) {
            var u = {};
            u.name = el.requestor;
            u.phone = el._id;
            u.s = 0;
            u.l = u.name.match(/\b(\w)/g).join('')
            el.nrc.forEach(function (el1) {
              u.s = u.s + (1 * el1.toString().replace('$', ''));
            });
            el.rc.forEach(function (el1) {
              u.s = u.s + (1 * el1.toString().replace('$', ''));
            });

            u.s = u.s.toFixed(2);
            if (el.nWeek == (new Date()).getWeek()) {
              tw.push(u);
            }
            tm.push(u);
          });
          _d['users'] = {
            tm: tm,
            tw: tw
          }
        } catch (e) {
          console.log(e);
          _d['users'] = {}
        }
        break;
    }
  };
  return _d;
}

Date.prototype.getWeek = function () {
  return moment(this).isoWeek();
}

function weeksInYear(year) {
  var month = 11,
    day = 31,
    week;
  do {
    d = new Date(year, month, day--);
    week = getWeekNumber(d)[1];
  } while (week == 1);

  return week;
}

function getWeekNumber(d) {
  d = new Date(+d);
  d.setHours(0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  var yearStart = new Date(d.getFullYear(), 0, 1);
  var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
  return [d.getFullYear(), weekNo];
}