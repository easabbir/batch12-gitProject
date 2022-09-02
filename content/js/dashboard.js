/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 98.83333333333333, "KoPercent": 1.1666666666666667};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8755952380952381, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.715, 500, 1500, "getAccountsSearch"], "isController": false}, {"data": [0.9, 500, 1500, "Add others information"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "Logout  Request"], "isController": false}, {"data": [0.6528571428571428, 500, 1500, "Submit Applicant"], "isController": false}, {"data": [0.9257142857142857, 500, 1500, "getLov"], "isController": false}, {"data": [0.9571428571428572, 500, 1500, "getLoanDisbursementStatus"], "isController": false}, {"data": [0.9921428571428571, 500, 1500, "getAllFiles"], "isController": false}, {"data": [0.9664285714285714, 500, 1500, "GetCRMStatus"], "isController": false}, {"data": [0.9471428571428572, 500, 1500, "GetAssetOperationQueries"], "isController": false}, {"data": [0.5728571428571428, 500, 1500, "get ApplicationById"], "isController": false}, {"data": [0.96, 500, 1500, "Login Request"], "isController": false}, {"data": [0.9892857142857143, 500, 1500, "GetVRMQueries"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 8400, 98, 1.1666666666666667, 390.77440476190543, 6, 30545, 98.0, 783.0, 1018.0, 3802.99, 83.23259546976873, 89.12546051963398, 66.15567940154278], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["getAccountsSearch", 700, 49, 7.0, 444.1585714285718, 6, 1606, 359.0, 982.9, 1089.85, 1346.98, 6.963095593355217, 9.089035144981597, 5.397147073634736], "isController": false}, {"data": ["Add others information", 700, 0, 0.0, 345.40285714285693, 17, 25040, 192.5, 655.4999999999999, 920.9499999999999, 1397.0, 6.967808723696522, 2.960667419646234, 8.454465758819255], "isController": false}, {"data": ["Logout  Request", 700, 49, 7.0, 59.38428571428567, 9, 635, 44.0, 111.0, 150.8499999999998, 287.9000000000001, 6.968363629123778, 1.6083426555936051, 1.5219477789585283], "isController": false}, {"data": ["Submit Applicant", 700, 0, 0.0, 668.5614285714291, 60, 6242, 603.0, 1036.0, 1222.0499999999988, 1753.98, 6.964966219913833, 2.8781304258330596, 10.40704708441539], "isController": false}, {"data": ["getLov", 700, 0, 0.0, 313.8542857142857, 20, 25816, 174.5, 584.4999999999999, 818.8499999999998, 3019.95, 6.967808723696522, 38.745993509983876, 5.478031338963986], "isController": false}, {"data": ["getLoanDisbursementStatus", 700, 0, 0.0, 141.60999999999999, 11, 1635, 25.5, 442.69999999999993, 596.9499999999999, 1052.7300000000002, 6.968432998516719, 2.7362862638497605, 5.376445483211054], "isController": false}, {"data": ["getAllFiles", 700, 0, 0.0, 103.90857142857142, 12, 1059, 31.0, 322.0, 406.5499999999994, 589.5900000000004, 6.969265538973128, 2.7359714751695026, 6.186992705916906], "isController": false}, {"data": ["GetCRMStatus", 700, 0, 0.0, 146.56285714285735, 11, 3820, 24.0, 297.9, 503.29999999999905, 3806.99, 6.968988003384937, 2.7362416932151925, 5.376873693314749], "isController": false}, {"data": ["GetAssetOperationQueries", 700, 0, 0.0, 212.94428571428566, 11, 3822, 23.0, 406.9, 660.8999999999999, 3811.99, 6.968641114982578, 2.7357068970881033, 5.397021994773519], "isController": false}, {"data": ["get ApplicationById", 700, 0, 0.0, 1801.6499999999985, 89, 30545, 722.5, 1331.9, 4534.6499999999205, 25833.99, 6.958181330205465, 9.224550684759595, 5.456872167026173], "isController": false}, {"data": ["Login Request", 700, 0, 0.0, 360.66999999999933, 13, 11993, 105.5, 268.9, 383.94999999999857, 10592.320000000003, 6.9652434352580626, 11.32429256136877, 2.0170443238241176], "isController": false}, {"data": ["GetVRMQueries", 700, 0, 0.0, 90.58571428571413, 12, 3802, 27.0, 261.4999999999999, 409.89999999999986, 653.97, 6.969126768415918, 2.7363253443495315, 5.37698075649871], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500\/Internal Server Error", 49, 50.0, 0.5833333333333334], "isController": false}, {"data": ["401\/Unauthorized", 49, 50.0, 0.5833333333333334], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 8400, 98, "500\/Internal Server Error", 49, "401\/Unauthorized", 49, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["getAccountsSearch", 700, 49, "401\/Unauthorized", 49, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Logout  Request", 700, 49, "500\/Internal Server Error", 49, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
