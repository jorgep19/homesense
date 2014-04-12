/**
*  Handles the magic of fplot.
*
*  @see https://github.com/flot/flot/blob/master/API.md
*  @see http://people.iola.dk/olau/flot/examples/
*
*  @author Andrei Sura
*  
*/




Date.prototype.mmdd = function() {
  //var yyyy = this.getFullYear().toString();
  var mm = (this.getMonth()+1).toString();
  var dd  = this.getDate().toString();
  return (mm[1]?mm:"0"+mm[0]) + "/" + (dd[1]?dd:"0"+dd[0]);
};

function getIP() {
   var ip = 'unknown';
   $.getJSON('get_ip.php', function(data) {
      ip = data.ip;
   });
   return ip;
}

function formatMoney(num) {
   num = num.toString().replace(/\$|\,/g, '');
   if (isNaN(num)) num = "0";
   sign = (num == (num = Math.abs(num)));
   num = Math.floor(num * 100 + 0.50000000001);
   cents = num % 100;
   num = Math.floor(num / 100).toString();
   if (cents < 10) cents = "0" + cents;
   for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
   num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
   return (((sign) ? '' : '-') + '$' + num + '.' + cents);
}

function formatMon(num) {
   num = isNaN(num) || num === '' || num === null ? 0.00 : num;
   var fixed = parseFloat(num).toFixed(2);
   var numParts = fixed.split('.');
   num = numParts[1] === '00' ? numParts[0] : fixed;
   return num;
}


function Conf() {
   this.name = 'config';
}

Conf.prototype = {
   init: function() {
      console.log('conf->init()');
      this.initListeners();
      this.bindShowData(); // to create an html table
      this.initPlot();
   },

   initListeners: function() {


   },

   bindShowData: function() {


   },


   initPlot: function() {
      var self = this;

      $("#doSubmit").click( function(e) {
         e.preventDefault();

      });
   },

};

$(document).ready(
   function () {
      var c = new Conf();
      c.init();
   }
);


