// --collection=assetinstances --file=assetinstances.json
// --collection=assetpandmattributes --file=assetpandmattributes.json
// --collection=assetpandmattributesgroups --file=assetpandmattributesgroups.json
// --collection=assets --file=assets.json
// --collection=assettypeAttributes --file=assettypeAttributes.json
// --collection=assettypeAttributevalues --file=assettypeAttributevalues.json
// --collection=dataentrygroups --file=dataentrygroups.json
// --collection=locations --file=locations.json
// --collection=modulemasters --file=modulemasters.json
// --collection=modulesinlocations --file=modulesinlocations.json
// --collection=navigationurls --file=navigationurls.json
// --collection=pandmattributes --file=pandmattributes.json
// --collection=unitmasters --file=unitmasters.json
// --collection=usermasters --file=usermasters.json
// --collection=widgetmasters --file=widgetmasters.json
// --collection=datamasters --file=datamasters.json
// --collection=grouppumpingstations --file=grouppumpingstations.json

function(fromDate, toDate, scaleId) {
    var s = (fromDate + 'T00:00:00.000Z');
    var e = (toDate + 'T00:00:00.000Z');
    var start = new Date(s);
    var end = new Date(e);
    var dates1 = [];

    for (var d = start; d <= end; d.setDate(d.getDate() + 1)) {
        dates1.push(new Date(d));
    }

    var locID = [3, 2, 1];
    var moduleID = [23, 17, 9];
    var AssetinstID = [[117, 118, 119, 120], [97, 98, 99, 100], [66, 67, 68, 69]];
    var pumpCapacity = [[33.75, 33.75, 33.75, 33.75], [13.4, 8.9, 8.9, 13.4], [7.8, 7.8, 7.8, 7.8]];
    if (scaleId == 1) {
        var ttlOneLocArr = [];
        var aachilArr = [];
        for (var k = 0; k < dates1.length; k++) {
            var ff = dates1[k];
            var dts = ff.getDate();
            if (dts < 10) { dts = "0" + dts }
            var mon = ff.getMonth();
            var mn = mon + 1;
            if (mn < 10) { mn = "0" + mn }
            var yr = ff.getFullYear();
            var date = [yr, mn, dts].join('-');

            var startdate = (date + 'T00:00:00.000Z');

            var ttlOneLoc = 0;
            var grouptotal = 0;
            for (var n = 0; n < locID.length; n++) {
                var data = db.operationDataAttributesMasterMain.find({
                    "ModuleID": moduleID[n],
                    "LocationID": locID[n],
                    "DataDate": ISODate(startdate),
                    "OperationDataAttributesValues.DataAtrributeId": 33
                },
                    {
                        "AssetInstanceID": 1, "OperationDataAttributesValues.DataAttributeValue": 1,
                        OperationDataAttributesValues: { $elemMatch: { DataAtrributeId: 33 } }
                    }
                )
                var dta = data.toArray();
                var Totalval = 0;
                var TtlEachPumpVal = 0;
                if (dta != null && dta.length > 0) {
                    var asstId = AssetinstID[n];

                    var capacity = 0;
                    var Attvalue = 0;
                    var pcpct = pumpCapacity[n];
                    var EachPumpVal = 0;
                    for (var a = 0; a < dta.length; a++) {
                        var so = dta[a];
                        var instanceID = so.AssetInstanceID;
                        var childarr = so.OperationDataAttributesValues[0];
                        var dataAttvalue = childarr.DataAttributeValue;
                        for (d = 0; d < asstId.length; d++) {
                            if (asstId[d] == instanceID) {
                                capacity = pcpct[d];
                            }
                        }
                        if (dataAttvalue != null && dataAttvalue != "" && dataAttvalue != "NULL") {
                            var pdv = dataAttvalue.replace(':', '.');
                            var pumpHour = pdv;
                            var strVal = pdv.split('.');

                            var strHour = 0;
                            var strMin = 0;
                            if (strVal.length > 1) {
                                strHour = strVal[0];
                                if (strHour == "") { strHour = 0 }

                                strMin = strVal[1];
                                if (strMin == "") { strMin = 0 }

                                var hours = parseInt(strHour);
                                var mt = strMin;
                                var mnt = mt;
                                if (mnt.length <= 1 && mnt[0] != 0) {
                                    mt = mt + "0";
                                }
                                var minutes = parseInt(mt);
                                var hr = minutes / 60;
                                var min = hr / 60;
                                min = min.toFixed(2);
                                hours = parseInt(hours) + parseFloat(hr);
                                pumpHour = hours;
                            }
                            else { pumpHour = strVal + '.' + strMin; }

                            var pdiff = pumpHour;
                            Attvalue = parseFloat(pdiff).toFixed(2);

                        }
                        capct = parseFloat(capacity / 24).toFixed(2);
                        Totalval = Attvalue * capct;
                        ttlOneLoc = ttlOneLoc + Totalval;


                    }
                } if (n == 0) {
                    var srt1 = ttlOneLoc.toFixed(2);
                    grouptotal = srt1;
                }
            }
            var childtotal = 0;
            var srt = ttlOneLoc.toFixed(2);
            childtotal = (srt - grouptotal).toFixed(2);
            ttlOneLocArr.push([date, grouptotal + ':' + childtotal.toString()]);
            ttlOneLoc = 0;

        }
        return ttlOneLocArr;
    }
    else {
        var start = fromDate.split('-');
        var end = toDate.split('-');
        var startYear = parseInt(start[0]);
        var endYear = parseInt(end[0]);
        var dates1 = [];

        for (var i = startYear; i <= endYear; i++) {
            var endMonth = startYear != endYear ? 11 : parseInt(end[1]);
            var startMon = i === startYear ? parseInt(start[1]) - 1 : 0;
            for (var j = startMon; j <= endMonth; j = j > 12 ? j % 12 || 11 : j + 1) {
                var month = j + 1;
                var displayMonth = month < 10 ? '0' + month : month;
                dates1.push([i, displayMonth, '01'].join('-'));
            }
        }
        dates1.pop();

        var k = 0;
        var ttlOneLocArr = [];

        for (var k = 0; k < dates1.length; k++) {
            var z = new Date(toDate);
            var ff = new Date((dates1[k]));
            var gg = z.getDate();
            var dts = ff.getDate();
            if (dts < 10) { dts = "0" + dts }
            var mon = ff.getMonth();
            var mn = mon + 1;
            if (mn < 10) { mn = "0" + mn }
            var yr = ff.getFullYear();
            var ld = new Date(yr, mn, 0).getDate();
            var lastd = [yr, mn, ld].join('-');
            var date = [yr, mn, dts].join('-');
            var edate = [yr, mn, gg].join('-');
            var startdate = (date + 'T00:00:00.000Z');
            //var startdate= (fromDate +'T00:00:00.000Z');
            var enddate = (lastd + 'T00:00:00.000Z');
            //var startdate= (fromDate +'T00:00:00.000Z');
            var grouptotal = 0;
            var ttlOneLoc = 0;
            var childtotal = 0;

            for (var n = 0; n < locID.length; n++) {
                var data = db.operationDataAttributesMasterMain.find({
                    "ModuleID": moduleID[n],
                    "LocationID": locID[n],
                    "DataDate": {
                        $gte: ISODate(startdate),
                        $lte: ISODate(enddate)
                    },
                    "OperationDataAttributesValues.DataAtrributeId": 33
                },
                    { "AssetInstanceID": 1, "DataDate": 1, "OperationDataAttributesValues.DataAttributeValue": 1, OperationDataAttributesValues: { $elemMatch: { DataAtrributeId: 33 } } }
                )
                var dta = data.toArray();
                var Totalval = 0;
                var TtlEachPumpVal = 0;
                var recorddate = 0;
                if (dta != null && dta.length > 0) {
                    var asstId = AssetinstID[n];
                    for (d = 0; d < asstId.length; d++) {
                        var capacity = 0;
                        var Attvalue = 0;
                        var Totalval = 0;
                        var pcpct = pumpCapacity[n];
                        if (asstId[d] != null) {
                            capacity = pcpct[d];

                        }
                        var EachPumpVal = 0;
                        for (var a = 0; a < dta.length; a++) {
                            var so = dta[a];
                            var instanceID = so.AssetInstanceID;
                            var childarr = so.OperationDataAttributesValues[0];
                            var dataAttvalue = childarr.DataAttributeValue;
                            recorddate = so.DataDate;
                            if (asstId[d] == instanceID) {
                                if (dataAttvalue != null && dataAttvalue != "" && dataAttvalue != "NULL") {
                                    var pdv = dataAttvalue.replace(':', '.');
                                    var pumpHour = pdv;
                                    var strVal = pdv.split('.');

                                    var strHour = 0;
                                    var strMin = 0;
                                    if (strVal.length > 1) {
                                        strHour = strVal[0];
                                        if (strHour == "") { strHour = 0 }

                                        strMin = strVal[1];
                                        if (strMin == "") { strMin = 0 }

                                        var hours = parseInt(strHour);
                                        var mt = strMin;
                                        var mnt = mt;
                                        if (mnt.length <= 1 && mnt[0] != 0) {
                                            mt = mt + "0";
                                        }
                                        var minutes = parseInt(mt);
                                        var hr = minutes / 60;
                                        var min = hr / 60;
                                        min = min.toFixed(2);
                                        hours = parseInt(hours) + parseFloat(hr);
                                        pumpHour = hours;
                                    }
                                    else { pumpHour = strVal + '.' + strMin; }

                                    var pdiff = pumpHour;
                                    Attvalue = parseFloat(pdiff).toFixed(2);
                                    var PumpVal = parseFloat(EachPumpVal) + parseFloat(Attvalue);
                                    EachPumpVal = parseFloat(PumpVal).toFixed(2);

                                }
                            }
                        }
                        capct = parseFloat(capacity / 24).toFixed(2);
                        Totalval = EachPumpVal * capct;
                        ttlOneLoc = ttlOneLoc + Totalval;


                    }
                    if (n == 0) {
                        var srt1 = ttlOneLoc.toFixed(2);
                        grouptotal = srt1;
                    }

                }
            }

            var srt = ttlOneLoc.toFixed(2);
            childtotal = (ttlOneLoc - grouptotal).toFixed(2);
            if (childtotal <= 0) {
                childtotal = '0.00';
            }
            ttlOneLocArr.push([dates1[k], grouptotal.toString() + ':' + childtotal.toString()]);
            ttlOneLoc = 0;
            grouptotal = 0; childtotal = 0;
        }

        return ttlOneLocArr;
    }
}

  
