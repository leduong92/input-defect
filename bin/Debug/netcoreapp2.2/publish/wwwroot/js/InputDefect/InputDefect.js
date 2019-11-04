$(document).ready(function() {
    var txtBarcode = document.getElementById("txtBarcode");
    var storageKey = 'error-list';
    var finished_goods_code; var lot_no; var job_order_no; var line_no; var material_mark1; var rotation; var curing_qty; var cavity_qty;  var operation_sequence;
    // var orderStartDate; 
    // var orderEndDate;  
    // var errorData;
    var curingDate;
    var errorDataNew;
    
    // var errorListString = localStorage.getItem(storageKey);

    // if (typeof variable !== 'undefined') {
    //     txtBarcode.focus();
    // }
    
    // if (errorListString == "undefined" || errorListString == null) {
    //     errorData = [];
    // } else {
    //     errorData = JSON.parse(errorListString);
    // } 

    // $.ajax({
    //     url: 'GetErrorList',
    //     type: "GET",
    //     contentType : "application/json; charset=utf-8",
    //     dataType: "json",
    //     success: function (result) {
    //         //console.log(result)
    //         if (!result.success)
    //         {
    //             alert("KHÔNG CÓ DỮ LIỆU MASTER");
    //             return;
    //         }
    //         localStorage.setItem(storageKey, JSON.stringify(result.data));
    //     },
    //     error: function (errormessage) {
    //         alert(errormessage.responseText);
    //     }
    // });

    document.getElementById("btnSubmit").disabled = true;
    
    function openModal() {
        document.getElementById('model').style.display = 'block';
        document.getElementById('fade').style.display = 'block';
    }

    function closeModal() {
        document.getElementById('model').style.display = 'none';
        document.getElementById('fade').style.display = 'none';
    }

    txtBarcode.addEventListener('change', myFunction);
    //get data by job order no
    function myFunction() {
        var jobOrderNo = $('#txtBarcode').val();
        document.getElementById("btnSubmit").disabled = false; 
        $("#ddlProcess").css("background-color","#fff");
        $("#ddlProcess").css("color","black");
        openModal();
        $.ajax({
            url: 'GetDataByJobNo',
            type: "GET",
            contentType : "application/json; charset=utf-8",
            dataType: "json",
            data: {
                jobOrderNo: jobOrderNo
            },
            success: function (result) {
                if (!result.success)
                {
                    $('.input-width').val('');
                    $('#ddlProcess').empty();
                    $('.fieldset-data').remove();
                    $('#operation-number').val('');
                    $('#div-notfi').val('');
                    $('#txtJobOrderNo').focus();
                    $('#txtNotes').val('');
                    alert("KHÔNG CÓ DỮ LIỆU LỖI [1]");
                    closeModal();
                    return;
                }

                var html = '';
                
                finished_goods_code = result.data[0].finished_goods_code.toString();
                lot_no = result.data[0].lot_no.toString();
                job_order_no = result.data[0].job_order_no.toString();

                $('#txtItem').val(finished_goods_code);
                $('#txtLot').val(lot_no);
                $('#txtJobOrderNo').val(job_order_no);

                line_no = result.data[0].line_no.toString() == null ? "" : result.data[0].line_no.toString();
                material_mark1 = result.data[0].material_mark1.toString() == null ? "" : result.data[0].material_mark1.toString();
                rotation = result.data[0].rotation == null ? 0 : result.data[0].rotation;
                curing_qty = result.data[0].curing_qty == null ? 0 : result.data[0].curing_qty;
                cavity_qty = result.data[0].cavity_qty == null ? 0 : result.data[0].cavity_qty;

                // orderStartDate = result.data[0].order_date == null ? "1900-01-01": result.data[0].order_date;
                // orderEndDate = result.data[0].order_date == null ? "1900-01-01": result.data[0].order_date;
                curingDate  = result.data[0].curing_date == null ? "": result.data[0].curing_date;
                
                $.each(result.data, function(index, item) {
                    html += '<option value = "' + item.operation_code.trim().toString() + '">' + item.operation_name.trim().toString() + '</options>';
                });    
                $('#ddlProcess').html(html);
                $('#txtBarcode').val('');

                if ($("#ddlProcess")[0].selectedIndex == 0)
                {
                    var jobOrderNo = $('#txtJobOrderNo').val();
                    var operationCode = $('#ddlProcess').val();
                    GetDataByOperationCode(jobOrderNo, operationCode);
                }
                closeModal();
                $('#txtQuantity').val('');
                $('#txtQuantity').focus();
                $('#txtNotes').val('');
            },
            error: function (errormessage) {
                alert(errormessage.responseText);
            }
        });
    }

    $("#ddlProcess").on('change', changeSelectedProcess);

    function changeSelectedProcess() {
        var operationCode = $(this).children("option:selected").val();
        var jobOrderNo = $('#txtJobOrderNo').val(); 
        document.getElementById("div-notfi").innerText = "";
        $('#txtQuantity').val('');
        $('#txtNotes').val('');
        $('.fieldset-data').remove();
        $("#ddlProcess").css("background-color","#007bff");
        $("#ddlProcess").css("color","#fff");
        GetDataByOperationCode(jobOrderNo, operationCode);
    }

    //get data error list
    function GetDataByOperationCode(jobOrderNo, operationCode) {
        //check so lan thao tac
        document.getElementById("btnSubmit").disabled = false;

        $.ajax({
            url: 'GetDataByOperationCode',
            type: "GET",
            contentType : "application/json; charset=utf-8",
            dataType: "json",
            data: {
                jobOrderNo: jobOrderNo,
                operationCode: operationCode
            },
            success: function (result) {

                if (result.data.length == 0)
                {
                    alert("KHÔNG CÓ DỮ LIỆU LỖI [2]");
                    return;
                }
                
                errorDataNew = result.data;

                var number = result.operationNumber.length == 0 ? 0 : result.operationNumber[0].operationNumber;
                document.getElementById("operation-number").innerText = number;

                var html = '';
                var receiveStartDate = result.data[0].start_date.toString("yyyy-MM-dd").trim() == "" ? null : result.data[0].start_date.toString("yyyy-MM-dd").trim();
                var receiveEndDate = result.data[0].end_date.toString("yyyy-MM-dd").trim() == "" ? null : result.data[0].end_date.toString("yyyy-MM-dd").trim();

                var startDate = receiveStartDate == null ? "" : receiveStartDate.substring(0, 4) + "-" + receiveStartDate.substring(4, 6) + "-" + receiveStartDate.substring(6, 8);
                var endDate = receiveEndDate == null ? "" : receiveEndDate.substring(0, 4) + "-" + receiveEndDate.substring(4, 6) + "-" + receiveEndDate.substring(6, 8);

                document.getElementById("txtStartDate").value = startDate;
                document.getElementById("txtEndDate").value = endDate;
                operation_sequence = result.data[0].operation_sequence;

                var machine = result.data[0].machine_no == null ? "" : result.data[0].machine_no;
                $('#txtMachineNo').val(machine);

                $.each(result.data, function(key, item) {
                    html += '<fieldset class="fieldset-data">'
                    html += '<legend>'
                    html += key + 1
                    html += '. '
                    html += item.error_name
                    html += '</legend>'
                    html += '<div class="div-data">'
                    html += '<input id="' + item.error_id.trim() + '" class="input-qty" name="input-qty" type="number" >'
                    html += '<input id="P' + item.error_id.trim() + '" class="input-qty-percent" name="input-percent" readonly="readonly" name="input-disable" type="text" disabled>'
                    html += '<input class="input-percent" placeholder="%" readonly="readonly" disabled>'
                    html += '</div>'
                    html += '</fieldset>'
                });

                html += '<fieldset class="fieldset-data">'
                html += '<legend>'
                html += 'TOTAL'
                html += '</legend>'
                html += '<div class="div-data">'
                html += '<input id="total" class="input-qty" readonly="readonly" name="input-disable" type="text" disabled>'
                html += '<input id="Ptotal" class="input-qty-percent"  readonly="readonly" name="input-disable" type="text" disabled >'
                html += '<input class="input-percent" placeholder="%" readonly="readonly" disabled>'
                html += '</div>'
                html += '</fieldset>'

                $('#error-data').html(html);
                
                $('input[name^="input-qty"]').each(function (key, item) {

                    $('#'+ item.id).on('input change', changeEvent);

                    function changeEvent(e) {

                        var showAlert = true;
                        var okQty = document.getElementById("txtQuantity").value;

                        if (showAlert)
                        {
                            if (okQty == "")
                            {
                                alert("BẠN CHƯA NHẬP SỐ LƯỢNG.");
                                $(this).val('');
                                $('#txtQuantity').focus();
                                showAlert = false;
                                return ;
                            }
                        }
                        var targetValue = e.target.value;
                        $('#P'+ item.id).val((targetValue * 100 / $('#txtQuantity').val()).toFixed(2));
                        
                    }
                    $('#'+ item.id).keyup(function(e) {
                            calculateSum();
                    });
                });
            },
            error: function(errormessage) {
                alert(errormessage.responseText);
            }
        });
    }

    function calculateSum() {
		var sum = 0;
        $('input[name^="input-qty"]').each(function (key, item) {
			if(!isNaN(this.value) && this.value.length != 0) {
				sum += parseFloat(this.value);
			}
		});
        $('#total').val(sum);
        $('#Ptotal').val(($('#total').val(sum).val() * 100 / $('#txtQuantity').val()).toFixed(2));
    }
    
    $("#confirmModal").on('shown.bs.modal', function(event) {
        $("#btnSave").focus();
    });

    $("#continueModal").on('shown.bs.modal', function(event) {
        $("#btnContinue").focus();
    });

    $('#btnSubmit').click(function(e) {
        
        var showAlert = true;
        var okQty = document.getElementById("txtQuantity").value;

        if (okQty == "")
        {
            alert("BẠN CHƯA NHẬP SỐ LƯỢNG.");
            return false;
        }

        
        //kiem tra da nhap day du thong tin chua
        $('input[name^="input-qty"]').each(function(key, value) {
            if($('#'+ value.id).val() == null || $('#'+ value.id).val() == "")
            {
                alert("BẠN CHƯA NHẬP ĐẦY ĐỦ THÔNG TIN");
                showAlert = false;
                return false;
            }
        })  

        if($('#016').val() != 0)
        {
            if($('#txtNotes').val() == null || $('#txtNotes').val() == "")
            {
                $('#txtNotes').focus();
                alert("BẠN CHƯA NHẬP NỘI DUNG GHI CHÚ");
                showAlert = false;
                return false;
            }
        }

        if(showAlert == true)
        {
            $('#confirmModal').modal('show');
        }  
    })
    
    $('#btnNoContinue').click(function(e){
        window.location.assign("/Home/Index");
    })

    $('#btnContinue').click(function(e){
        $('#continueModal').modal('hide');
        $('.fieldset-data').remove();
        $('#txtQuantity').val('');
        $('#txtNotes').val('');
    })

    $('#btnSave').click(function(e) {
        e.preventDefault();
        var objectData = [];
        var today = new Date();
        var curMonth = today.getMonth() + 1 < 10 ? "0" + today.getMonth() + 1 : today.getMonth() + 1; 
        var curDay = today.getDate() < 10 ? "0" + today.getDate() : today.getDate(); 
        var date = today.getFullYear() + curMonth.toString() + curDay.toString();

        var curHour = today.getHours > 12 ? today.getHours() - 12 : (today.getHours() < 10 ? "0" + today.getHours() : today.getHours());
        var curMinute = today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes();
        var curSeconds = today.getSeconds() < 10 ? "0" + today.getSeconds() : today.getSeconds();
    
        var time = curHour + "" + curMinute + curSeconds;

        var okQty = document.getElementById("txtQuantity").value;
        if (okQty == "")
        {
            alert("BẠN CHƯA NHẬP SỐ LƯỢNG.");
            return false;
        }
        var number = document.getElementById("operation-number").innerText;
        var OperationNumber = parseInt(number) + 1;
        var showAlert = true;
        //kiem tra da nhap day du thong tin chua
        $('input[name^="input-qty"]').each(function(key, value) {
            if($('#'+ value.id).val() == null || $('#'+ value.id).val() == "")
            {
                alert("BẠN CHƯA NHẬP ĐẦY ĐỦ THÔNG TIN");
                showAlert = false;
                return false;
            }
            
            //var objEror = errorData.find( errorId => errorId.error_id.trim() === value.id);
            var objEror = errorDataNew.find( errorId => errorId.error_id.trim() === value.id);

            var item = {
                JobOrderNo: document.getElementById("txtJobOrderNo").value,
                OperationNumber: OperationNumber,
                FinishedGoodsCode : document.getElementById("txtItem").value,
                LotNo: document.getElementById("txtLot").value,
                CavityQty: cavity_qty,
                LineNo: line_no,
                RubberName: material_mark1,
                PlanCycle: rotation,
                PlanQty: curing_qty,
                UnitCost: 0,
                UnitPrice: 0,
                // JobStartDate: orderStartDate,
                // JobEndDate: orderEndDate,
                JobStartDate: "",
                JobEndDate: "",
                OperationStartDate: document.getElementById("txtStartDate").value == "" ? "" : document.getElementById("txtStartDate").value.replace(/-/g,''),
                OperationEndDate: document.getElementById("txtEndDate").value == "" ? "" : document.getElementById("txtEndDate").value.replace(/-/g,''),
                MachineNo: document.getElementById("txtMachineNo").value,
                OkQty: okQty == null ? 0 :  parseInt(document.getElementById("txtQuantity").value),
                ProgressOperationCode: $('#ddlProcess').children("option:selected").val(),
                ProgressOperationSeq: operation_sequence,
                ProgressOperationName: $('#ddlProcess').children("option:selected").text(),
                ErrorID: value.id,
                ErrorName: objEror.error_name,
                ErrorNameJP: objEror.error_name_jp,
                ErrorQty: $('#'+ value.id).val(),
                Notes: document.getElementById("txtNotes").value == "" ? "" : document.getElementById("txtNotes").value,
                EntryDate: date,
                EntryTime: time,
                EntryUser: document.getElementById("txtUserId").value,
                UpdateDate: "",
                UpdateTime: "",
                UpdateUser: "",
                Status: "0",
                ErrorNameEn: objEror.error_name_en,
                curingDate: curingDate,
                department: objEror.department,
                area: objEror.area,
                programID: objEror.program_id
            }
            objectData.push(item)
        });

        if(showAlert == true)
        {
            $.ajax({
                url: 'SaveData',
                type: "POST",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(objectData),
                success: function(result) {
                    var html = '';
                    if (result.success) {
                        $('#continueModal').modal('show');
                        $('#confirmModal').modal('hide');
                        return true; 
                    } else {
                        document.getElementById("div-notfi").innerText = ""
                        document.getElementById("div-notfi").innerText = "Lưu dữ liệu thất bại";
                        document.getElementById("div-notfi").style.color = "red"; 
                        return false;
                    }
                        
                },
                error: function(errormessage) {
                    document.getElementById("div-notfi").innerText = ""
                    document.getElementById("div-notfi").innerText = "Lưu dữ liệu thất bại";
                    document.getElementById("div-notfi").style.color = "red"; 
                    return false;
                }
            });
        }
    })
});

