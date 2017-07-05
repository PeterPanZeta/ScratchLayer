var panelPrincipal;
var parentinations = {};
var onmouseover = undefined;
var sniffElements = {};
var rows_selected = [];
var sinterval;
var tableSniff;
//console.log(parentinations["panelPrincipal"]);

$(document).ready(function() {
	panelPrincipal = new PanelPrincipal(document.getElementById("panelPrincipal"));
	panelPrincipal.setWH();
	parentinations = {"panelPrincipal":panelPrincipal};
	var elements = document.getElementById("elements1").childNodes;

	[].forEach.call(elements, function(elem) {
		elem.addEventListener('dragstart', drag, false);

	});

	var parentination2 = document.getElementById("panelPrincipal");

	parentination2.addEventListener('dragover', allowDrop, false);
	parentination2.addEventListener('drop',function(e){drop(e)}, false);

	tableSniff = $('#dataTables-Sniffer').DataTable({
    	"order": [[ 1, "desc" ]],
    	bSort: true,
    	width: '1%',
    	"pagingType": "full_numbers",
        className: 'dt-body-center',
        'select': {
         'style': 'multi'
      	},
    	columnDefs: [
            {
         'targets': 0,
         'searchable': false,
         'orderable': false,
         'width': '1%',
         'className': 'dt-body-center',
         'render': function (data, type, full, meta){
             return '<input type="checkbox">';
         }},{'targets': 1, 'order':'asc'}],

         'rowCallback': function(row, data, dataIndex){
         // Get row ID
         var rowId = data[0];

         // If row ID is in the list of selected row IDs
         if($.inArray(rowId, rows_selected) !== -1){
            $(row).find('input[type="checkbox"]').prop('checked', true);
            $(row).addClass('selected');
         }
      	}
    });

    $('#dataTables-Sniffer tbody').on('click', 'input[type="checkbox"]', function(e){
      var $row = $(this).closest('tr');

      // Get row data
      var data = tableSniff.row($row).data();

      // Get row ID
      var rowId = data[0];

      
      // Determine whether row ID is in the list of selected row IDs 
      var index = $.inArray(rowId, rows_selected);

      // If checkbox is checked and row ID is not in list of selected row IDs
      if(this.checked && index === -1){
      	//console.log("Pongo: "+rowId);
        rows_selected.push(rowId);
        document.getElementById("createElementsSniffButton").disabled = false;
        console.log(rows_selected.length);

      // Otherwise, if checkbox is not checked and row ID is in list of selected row IDs
      } else if (!this.checked && index !== -1){
      	console.log("quito: "+index);
        rows_selected.splice(index, 1);
        if(rows_selected.length==0)document.getElementById("createElementsSniffButton").disabled = true;
        console.log(rows_selected.length);
      }

      if(this.checked){
         $row.addClass('selected');
      } else {
         $row.removeClass('selected');
      }
      // Update state of "Select all" control
      updateDataTableSelectAllCtrl(tableSniff);

      // Prevent click event from propagating to parent
      e.stopPropagation();
   });

	$('#dataTables-Sniffer').on('click', 'tbody td, thead th:first-child', function(e){
		$(this).parent().find('input[type="checkbox"]').trigger('click');
	});

	 tableSniff.on('draw', function(){
      // Update state of "Select all" control
      updateDataTableSelectAllCtrl(tableSniff);
   });

 // Handle click on "Select all" control
   $('thead input[name="select_all"]', tableSniff.table().container()).on('click', function(e){
      if(this.checked){
         $('#dataTables-Sniffer tbody input[type="checkbox"]:not(:checked)').trigger('click');
      } else {
         $('#dataTables-Sniffer tbody input[type="checkbox"]:checked').trigger('click');
      }

      // Prevent click event from propagating to parent
      e.stopPropagation();
   });

    document.getElementById("Snffer").style.display="none";
});

function loadModal(elemHTMLid,elementid,e) {

	//console.log($('#Form'+elementid).serialize());
	e.preventDefault();
	$.ajax({
	 		type: 'POST',
            url: '/ScratchLayer/ajax/',
            data: "mode=PPrin&pdfdump=True&"+$('#Form'+elementid).serialize(),
        	dataType: 'json',
            success: function (data) {
	           	if(data.response.error){
            		for (var itemin in data.response.message){
                		$.notify( data.response.message[itemin], "error");
            		}
            	}
            	else{           			
            			var modalPDF = document.createElement("object");
            			modalPDF.setAttribute("type","application/pdf");
            			modalPDF.setAttribute("width","100%");
            			modalPDF.setAttribute("height","100%");
            			modalPDF.setAttribute("data","/static/ScratchLayer/tmp/"+elementid+".pdf");
            			modalPDF.innerHTML="<a href='/static/ScratchLayer/tmp/"+elementid+".pdf'>"+elementid+".pdf</a>"
            			var modalBody = document.getElementById("modalBody"+elementid);
            			var buttonDown = document.getElementById("buttonDown"+elementid);
            			buttonDown.setAttribute("href","/static/ScratchLayer/tmp/"+elementid+".pdf");
            			buttonDown.setAttribute("download",elementid+".pdf");
            			modalBody.innerHTML=modalPDF.outerHTML;
            			$('#'+elemHTMLid).modal('show')
                		//$.notify( data.response.message, "success");
            	}
        	}
        });
  	//clearInterval(sinterval);
    return false;
}

function clearTable () {
	 if (confirm('¿Estas seguro de que deseas limpiar la informacion?')){
       	$.ajax({
	 		type: 'POST',
            url: '/ScratchLayer/ajax/',
            data: "mode=Sniff&ClearData=True&",
        	dataType: 'json',
            success: function (data) {
	           if(data.response.error){
                	$.notify( data.response.message, "error");
            	}
            	else{
            		sniffElements = {};
					rows_selected = [];
					tableSniff.clear(); tableSniff.draw();
					document.getElementById("buttonDownSniff").href='javascript: void(0)';
					document.getElementById("clearTableButton").disabled = true;
					//document.getElementById("createElementsSniffButton").disabled = true;
					document.getElementById("buttonDownSniff").setAttribute("disabled" ,"true");
            	}
        	}
        });
    }

}

function updateDataTableSelectAllCtrl(tableSniff){
   
   var $tableSniff             = tableSniff.table().node();
   var $chkbox_all        = $('tbody input[type="checkbox"]', $tableSniff);
   var $chkbox_checked    = $('tbody input[type="checkbox"]:checked', $tableSniff);
   var chkbox_select_all  = $('thead input[name="select_all"]', $tableSniff).get(0);

   // If none of the checkboxes are checked
   if($chkbox_checked.length === 0){
      chkbox_select_all.checked = false;
      if('indeterminate' in chkbox_select_all){
         chkbox_select_all.indeterminate = false;
      }

   // If all of the checkboxes are checked
   } else if ($chkbox_checked.length === $chkbox_all.length){
      chkbox_select_all.checked = true;
      if('indeterminate' in chkbox_select_all){
         chkbox_select_all.indeterminate = false;
      }

   // If some of the checkboxes are checked
   } else {
      chkbox_select_all.checked = true;
      if('indeterminate' in chkbox_select_all){
         chkbox_select_all.indeterminate = true;
      }
   }
}

function enter(e) {

	var patt = new RegExp("Drop");
	if(patt.test(e.target.id)){
		var Dest = findObj(e.target.id); 
		topEleme(Dest.getPV());
	}
 	
}

function SubmitPrin(form,e){
	e.preventDefault();
	var idSR = form.id.split("Form")[1];
	//console.log($( form ).serialize());
	var load = document.getElementById("load"+idSR)
	load.style.visibility="initial";
	var Data = "mode=PPrin&"+$( form ).serialize()
	document.getElementById(idSR+"fieldset").setAttribute("disabled" ,"true");
	$.ajax({
	 		type: 'POST',
            url: '/ScratchLayer/ajax/',
            data: Data,
        	dataType: 'json',
            success: function (data) {
				load.style.visibility="hidden";
            	if(data.response.error){

            		for (var itemin in data.response.message){
                		$.notify( data.response.message[itemin], "error");
            		}

            	}else if (data.response.warn){
					for (var itemin in data.response.message){
                		$.notify( data.response.message[itemin], "warn");
            		}            	
            	}else{
            		for (var itemin in data.response.message){
                		$.notify( data.response.message[itemin], "success");
            		}
            		if(data.response.data != "undefined"){
            			console.log(data.response.data);
            			console.log("ID:"+form.id.split("Form")[1]);
            			Element = findObj(form.id.split("Form")[1]);
            			for(var i in data.response.data) {
            				Element.upResp();
            				data.response.data[i].id="Packet/R"+form.id.split("new")[1]+"."+Element.getResp();
            				traspast(data.response.data[i]);
            			}
            			
            		}
            	}
         	 	$("#"+idSR+"fieldset").removeAttr("disabled");
        	}
        });
    return false;
}

function SubmitSniffpcap(form,e) {
	e.preventDefault();
	var formData = new FormData(document.getElementById(form.id));
	$.ajax({
	 		type: 'POST',
            url: '/ScratchLayer/uppcap/',
            dataType: "json",
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            success: function (data) {

	           if(data.response.error){
            		for (var itemin in data.response.message){
                		$.notify( data.response.message[itemin], "error");
            		}
            	}
            	else{
            		AddPacketSniff(data.response.data);
	            	tableSniff.page('last').draw('page');
	            	document.getElementById("clearTableButton").disabled = false;
					//document.getElementById("createElementsSniffButton").disabled = false;
					$("#buttonDownSniff").removeAttr("disabled");
            	}
        	}
        });
	return false;
}

function SubmitSniff(form,e){
	e.preventDefault();

	console.log( $( form ).serialize());

	document.getElementById("buttonSubmitSniff").disabled = true;
	document.getElementById("clearTableButton").disabled = true;
	document.getElementById("createElementsSniffButton").disabled = true;
	document.getElementById("buttonDownSniff").setAttribute("disabled" ,"true");
	document.getElementById("buttonStopSniff").disabled = false;

	//var load = document.getElementById("load"+form.id.split("Form")[1])
	//load.style.visibility="initial";
	$.ajax({
	 		type: 'POST',
            url: '/ScratchLayer/ajax/',
            data: "mode=Sniff&"+$( form ).serialize(),
        	dataType: 'json',
            success: function (data) {
	           	if(data.response.error){
            		for (var itemin in data.response.message){
                		$.notify( data.response.message[itemin], "error");
            		}
            	}
            	else{
                	$.notify( data.response.message, "success");
                	ReciveDataSniff();
            	}
        	}
        });
	    

    return false;
}


function ReciveDataSniff(){
	sinterval = setInterval(function(){
		//console.log("Voy a por datos");
		$.ajax({
	 		type: 'POST',
            url: '/ScratchLayer/ajax/',
            data: "mode=Sniff&sendDataSniff=True",
        	dataType: 'json',
            success: function (data) {
	           	if(data.response.error){
                	$.notify( data.response.message, "error");
                	if(data.response.stop){
                		document.getElementById("buttonSubmitSniff").disabled = false;
            			document.getElementById("buttonStopSniff").disabled = true;
            			if(! tableSniff.data().count() ){
            				document.getElementById("buttonDownSniff").setAttribute("disabled","true");
            				document.getElementById("clearTableButton").disabled = true;
            			}else {
            				document.getElementById("clearTableButton").disabled = false;
            				if(data.response.idpcap!=""){
	            				var buttonDown = document.getElementById("buttonDownSniff");
		            			buttonDown.setAttribute("href","/static/ScratchLayer/tmp/"+data.response.idpcap);
		            			buttonDown.setAttribute("download",data.response.idpcap);
		            			$("#buttonDownSniff").removeAttr("disabled");
	            			}
            			}

            			
                		clearInterval(sinterval);	
                	}
            	}
            	else{
            		if(data.response.stop){
            			$.notify( data.response.message, "success");
            			document.getElementById("buttonSubmitSniff").disabled = false;
            			document.getElementById("clearTableButton").disabled = false;
						//document.getElementById("createElementsSniffButton").disabled = false;
            			document.getElementById("buttonStopSniff").disabled = true;
            			var buttonDown = document.getElementById("buttonDownSniff");
            			buttonDown.setAttribute("href","/static/ScratchLayer/tmp/"+data.response.idpcap);
            			buttonDown.setAttribute("download",data.response.idpcap);
            			$("#buttonDownSniff").removeAttr("disabled");
            			clearInterval(sinterval);	
            		}
	                AddPacketSniff(data.response.data);
	                tableSniff.page('last').draw('page');
            	}
        	}
        });	
	},1000);
    //return false;
}

function stopSniff(ele,e){
	e.preventDefault();
	$.ajax({
	 		type: 'POST',
            url: '/ScratchLayer/ajax/',
            data: "mode=Sniff&stopfilter=True",
        	dataType: 'json',
            success: function (data) {
	           	if(data.response.error){
            		for (var itemin in data.response.message){
                		$.notify( data.response.message[itemin], "error");
            		}
            	}
            	else{
                		$.notify( data.response.message, "success");
            	}
        	}
        });
  	//clearInterval(sinterval);
    return false;
}

function AddPacketSniff(elements) {

	for (var packet in elements){
		sniffElements[packet]=elements[packet];
		tableSniff.row.add( [packet,elements[packet].time,"("+elements[packet].iface+") "+"Packet:"+packet.split("/")[1]+" [ "+elements[packet].layerDescrip+" ]",""] ).draw();
	}
}

function createElementsSniff(argument) {
	viewPanel(document.getElementById("pprin"));
  	$.each(rows_selected, function(index, rowId){
  		//console.log(rowId);
    	traspast(sniffElements[rowId]); 
  	});
}

function traspast
(dataPacket) {
	var child;

	var packet = createElement(dataPacket["id"],findObj("panelPrincipal"));
	var parent = packet;

	layers=dataPacket.layers.split("/");
	for (var i=0; i<layers.length; i++) {
		child = createElement(layers[i],parent);
		parent=child;
	}
	//packet.getPV().style.position = "absolute";
	var form = document.getElementById("Form"+packet.getId());
	for (var i=0; i<layers.length; i++) loadData(form,dataPacket[layers[i]],layers[i]);
	minimax(document.getElementById(packet.getId()+"buttonMinimax"));
}

function clonar(elementid) {
	var element = findObj(elementid);
	var clonElemt = createElement(element.getType(), panelPrincipal);
	clonValues(element.getId(),clonElemt.getId(),element.getType());
}

function clonValues(Elemtid, clonElemtid, Type) {

		switch(Type) {

    	case "Ethernet":
    		$("input[name*='srcEther']","#"+clonElemtid+"collapElement")[0].value = $("input[name*='srcEther']","#"+Elemtid+"collapElement")[0].value;
    		$("input[name*='dstEther']","#"+clonElemtid+"collapElement")[0].value = $("input[name*='dstEther']","#"+Elemtid+"collapElement")[0].value;
    		$("input[name*='typeEther']","#"+clonElemtid+"collapElement")[0].value = $("input[name*='typeEther']","#"+Elemtid+"collapElement")[0].value;
    		break;

    	case "ARP":
    		$("input[name*='hwtyARP']","#"+clonElemtid+"collapElement")[0].value = $("input[name*='hwtyARP']","#"+Elemtid+"collapElement")[0].value;
    		$("input[name*='ptyARP']","#"+clonElemtid+"collapElement")[0].value = $("input[name*='ptyARP']","#"+Elemtid+"collapElement")[0].value;
    		$("input[name*='hwlenARP']","#"+clonElemtid+"collapElement")[0].value = $("input[name*='hwlenARP']","#"+Elemtid+"collapElement")[0].value;
    		$("input[name*='plenARP']","#"+clonElemtid+"collapElement")[0].value = $("input[name*='plenARP']","#"+Elemtid+"collapElement")[0].value;
    		$("input[name*='opARP']","#"+clonElemtid+"collapElement")[0].value = $("input[name*='opARP']","#"+Elemtid+"collapElement")[0].value;
    		$("input[name*='hwsrcARP']","#"+clonElemtid+"collapElement")[0].value = $("input[name*='hwsrcARP']","#"+Elemtid+"collapElement")[0].value;
    		$("input[name*='psrcARP']","#"+clonElemtid+"collapElement")[0].value = $("input[name*='psrcARP']","#"+Elemtid+"collapElement")[0].value;
    		$("input[name*='hwdstARP']","#"+clonElemtid+"collapElement")[0].value = $("input[name*='hwdstARP']","#"+Elemtid+"collapElement")[0].value;
    		$("input[name*='pdstARP']","#"+clonElemtid+"collapElement")[0].value = $("input[name*='pdstARP']","#"+Elemtid+"collapElement")[0].value;
    		break;

    	case "IP":
    		$("input[name*='VERIP']","#"+clonElemtid+"collapElement")[0].value = $("input[name*='VERIP']","#"+Elemtid+"collapElement")[0].value;
    		$("input[name*='HLENIP']","#"+clonElemtid+"collapElement")[0].value = $("input[name*='HLENIP']","#"+Elemtid+"collapElement")[0].value;
    		$("input[name*='SERVIP']","#"+clonElemtid+"collapElement")[0].value = $("input[name*='SERVIP']","#"+Elemtid+"collapElement")[0].value;
    		$("input[name*='LOGIP']","#"+clonElemtid+"collapElement")[0].value = $("input[name*='LOGIP']","#"+Elemtid+"collapElement")[0].value;
    		$("input[name*='IdenIP']","#"+clonElemtid+"collapElement")[0].value = $("input[name*='IdenIP']","#"+Elemtid+"collapElement")[0].value;
    		$("input[name*='FlagsIP']","#"+clonElemtid+"collapElement")[0].value = $("input[name*='FlagsIP']","#"+Elemtid+"collapElement")[0].value;
    		$("input[name*='OffFraIP']","#"+clonElemtid+"collapElement")[0].value = $("input[name*='OffFraIP']","#"+Elemtid+"collapElement")[0].value;
    		$("input[name*='TTLIP']","#"+clonElemtid+"collapElement")[0].value = $("input[name*='TTLIP']","#"+Elemtid+"collapElement")[0].value;
    		$("input[name*='ProIP']","#"+clonElemtid+"collapElement")[0].value = $("input[name*='ProIP']","#"+Elemtid+"collapElement")[0].value;
    		$("input[name*='CheckIP']","#"+clonElemtid+"collapElement")[0].value = $("input[name*='CheckIP']","#"+Elemtid+"collapElement")[0].value;
    		$("input[name*='srcIP']","#"+clonElemtid+"collapElement")[0].value = $("input[name*='srcIP']","#"+Elemtid+"collapElement")[0].value;
    		$("input[name*='dstIP']","#"+clonElemtid+"collapElement")[0].value = $("input[name*='dstIP']","#"+Elemtid+"collapElement")[0].value;
    		$("input[name*='OpcionesIP']","#"+clonElemtid+"collapElement")[0].value = $("input[name*='OpcionesIP']","#"+Elemtid+"collapElement")[0].value;
    		break;

    	case "ICMP":
    	    $("input[name*='typeICMP']","#"+clonElemtid+"collapElement")[0].value = $("input[name*='typeICMP']","#"+Elemtid+"collapElement")[0].value;
    		$("input[name*='codeICMP']","#"+clonElemtid+"collapElement")[0].value = $("input[name*='codeICMP']","#"+Elemtid+"collapElement")[0].value;
    		$("input[name*='checkICMP']","#"+clonElemtid+"collapElement")[0].value = $("input[name*='checkICMP']","#"+Elemtid+"collapElement")[0].value;
    		$("input[name*='idenICMP']","#"+clonElemtid+"collapElement")[0].value = $("input[name*='idenICMP']","#"+Elemtid+"collapElement")[0].value;
    		$("input[name*='nseqICMP']","#"+clonElemtid+"collapElement")[0].value = $("input[name*='nseqICMP']","#"+Elemtid+"collapElement")[0].value;
    		$("input[name*='tsoriICMP']","#"+clonElemtid+"collapElement")[0].value = $("input[name*='tsoriICMP']","#"+Elemtid+"collapElement")[0].value;
    		$("input[name*='tsrxICMP']","#"+clonElemtid+"collapElement")[0].value = $("input[name*='tsrxICMP']","#"+Elemtid+"collapElement")[0].value;
    		$("input[name*='tstxICMP']","#"+clonElemtid+"collapElement")[0].value = $("input[name*='tstxICMP']","#"+Elemtid+"collapElement")[0].value;
    		$("input[name*='addrmaskICMP']","#"+clonElemtid+"collapElement")[0].value = $("input[name*='addrmaskICMP']","#"+Elemtid+"collapElement")[0].value;
     		break;

    	case "TCP":
    	    $("input[name*='srcportTCP']","#"+clonElemtid+"collapElement")[0].value = $("input[name*='srcportTCP']","#"+Elemtid+"collapElement")[0].value;
    	    $("input[name*='dstportTCP']","#"+clonElemtid+"collapElement")[0].value = $("input[name*='dstportTCP']","#"+Elemtid+"collapElement")[0].value;
    	    $("input[name*='sequennTCP']","#"+clonElemtid+"collapElement")[0].value = $("input[name*='sequennTCP']","#"+Elemtid+"collapElement")[0].value;
    	    $("input[name*='ackTCP']","#"+clonElemtid+"collapElement")[0].value = $("input[name*='ackTCP']","#"+Elemtid+"collapElement")[0].value;
    	    $("input[name*='offsetTCP']","#"+clonElemtid+"collapElement")[0].value = $("input[name*='offsetTCP']","#"+Elemtid+"collapElement")[0].value;
    	    $("input[name*='reserdTCP']","#"+clonElemtid+"collapElement")[0].value = $("input[name*='reserdTCP']","#"+Elemtid+"collapElement")[0].value;
    	    $("input[name*='flagTCP']","#"+clonElemtid+"collapElement")[0].value = $("input[name*='flagTCP']","#"+Elemtid+"collapElement")[0].value;
    	    $("input[name*='windTCP']","#"+clonElemtid+"collapElement")[0].value = $("input[name*='windTCP']","#"+Elemtid+"collapElement")[0].value;
    	    $("input[name*='checkTCP']","#"+clonElemtid+"collapElement")[0].value = $("input[name*='checkTCP']","#"+Elemtid+"collapElement")[0].value;
    	    $("input[name*='urgpoTCP']","#"+clonElemtid+"collapElement")[0].value = $("input[name*='urgpoTCP']","#"+Elemtid+"collapElement")[0].value;
    	    $("input[name*='OpTCP']","#"+clonElemtid+"collapElement")[0].value = $("input[name*='OpTCP']","#"+Elemtid+"collapElement")[0].value;
    		break;

    	case "UDP":
    	    $("input[name*='sportUDP']","#"+clonElemtid+"collapElement")[0].value = $("input[name*='sportUDP']","#"+Elemtid+"collapElement")[0].value;
    	    $("input[name*='dportUDP']","#"+clonElemtid+"collapElement")[0].value = $("input[name*='dportUDP']","#"+Elemtid+"collapElement")[0].value;
    	    $("input[name*='lenUDP']","#"+clonElemtid+"collapElement")[0].value = $("input[name*='lenUDP']","#"+Elemtid+"collapElement")[0].value;
    	    $("input[name*='checkUDP']","#"+clonElemtid+"collapElement")[0].value = $("input[name*='checkUDP']","#"+Elemtid+"collapElement")[0].value;
    		break;

    	case "RIP":
    	    $("input[name*='cmdRIP']","#"+clonElemtid+"collapElement")[0].value = $("input[name*='cmdRIP']","#"+Elemtid+"collapElement")[0].value;
    	    $("input[name*='verUDP']","#"+clonElemtid+"collapElement")[0].value = $("input[name*='verUDP']","#"+Elemtid+"collapElement")[0].value;
    		break;

    	case "DATA":
    	    $("textarea[name*='dat']","#"+clonElemtid+"collapElement")[0].value = $("textarea[name*='dat']","#"+Elemtid+"collapElement")[0].value;
			break;
	}
}

function loadData(form, dataLoad, layer) {

		switch(layer) {

    	case "Ethernet":
    		form.srcEther.value = dataLoad.src;
    		form.dstEther.value = dataLoad.dst;
    		form.typeEther.value = dataLoad.type;
    		break; 
    	case "ARP":
    		form.hwtyARP.value = dataLoad.hwtype;
    		form.ptyARP.value = dataLoad.ptype;
    		form.hwlenARP.value = dataLoad.hwlen;
    		form.plenARP.value = dataLoad.plen;
    		form.opARP.value = dataLoad.op;
    		form.hwsrcARP.value = dataLoad.hwsrc;
    		form.psrcARP.value = dataLoad.psrc;
    		form.hwdstARP.value = dataLoad.hwdst;
    		form.pdstARP.value = dataLoad.pdst;
    		break;
    	case "IP":
    		form.VERIP.value = dataLoad.version;
    		form.HLENIP.value = dataLoad.ihl;
    		form.SERVIP.value = dataLoad.tos;
    		form.LOGIP.value = dataLoad.len;
    		form.IdenIP.value = dataLoad.id;
    		form.FlagsIP.value = dataLoad.flags;
    		form.OffFraIP.value = dataLoad.frag;
    		form.TTLIP.value = dataLoad.ttl;
    		form.ProIP.value = dataLoad.proto;
    		form.CheckIP.value = dataLoad.chksum;
    		form.srcIP.value = dataLoad.src;
    		form.dstIP.value = dataLoad.dst;

    		var options = ""
    		for(option in dataLoad.options){
				optionvalue = dataLoad.options[option];
				options = options + option + ":" + optionvalue + ","
    		}

    		form.OpcionesIP.value = options;

    		break;
    	case "ICMP":
    		form.typeICMP.value = dataLoad.type;
    		form.codeICMP.value = dataLoad.code;
    		form.checkICMP.value = dataLoad.chksum;
    		form.idenICMP.value = dataLoad.id;
    		form.nseqICMP.value = dataLoad.seq;
    		form.tsoriICMP.value = dataLoad.ts_ori;
    		form.tsrxICMP.value = dataLoad.ts_rx;
    		form.tstxICMP.value = dataLoad.ts_tx;
    		form.addrmaskICMP.value = dataLoad.addr_mask;
     		break;
    	case "TCP":
    		form.srcportTCP.value = dataLoad.sport;
    		form.dstportTCP.value = dataLoad.dport;
    		form.sequennTCP.value = dataLoad.seq;
    		form.ackTCP.value = dataLoad.ack;
    		form.offsetTCP.value = dataLoad.dataofs;
    		form.reserdTCP.value = dataLoad.reserved;
    		form.flagTCP.value = dataLoad.flags;
    		form.windTCP.value = dataLoad.window;
    		form.checkTCP.value = dataLoad.chksum;
    		form.urgpoTCP.value = dataLoad.urgptr;
    		form.OpTCP.value = dataLoad.options;
    		
    		var options = ""
    		for(option in dataLoad.options){
				optionvalue = dataLoad.options[option];
				options = options + option + ":" + optionvalue + ","
    		}

    		form.OpcionesIP.value = options;			
    		break;
    	case "UDP":
    		form.sportUDP.value = dataLoad.sport;			
    		form.dportUDP.value = dataLoad.dport;
    		form.lenUDP.value = dataLoad.len;
    		form.checkUDP.value = dataLoad.chksum;
    		break;
    	case "RIP":
    		form.cmdRIP.value = dataLoad.cmd;
			form.verUDP.value = dataLoad.version;
    		break;
    	case "DATA":
    		//console.log("DATA: "+dataLoad.load)
    		form.dat.value = dataLoad.load;
	}
}

function Exists (element, item) {
	for(var i in element){
		if(item==i){
			return true;
		}
	}
	return false;
}

function allowDrop(e) {
	if (e.preventDefault) {
	e.preventDefault(); // Necessary. Allows us to drop.
	}
	e.dataTransfer.dropEffect = 'move';
	// See the section on
	return false;
}

function drag(e) {

    var patt = new RegExp("new");


	e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData("text", e.target.id);

	if (!patt.test(e.target.id)){
		e.dataTransfer.setDragImage(e.target, 50, 50);
	}
	else{
		e.dataTransfer.setDragImage(e.target.parentNode, 0, 0);
	}
}

function drop(e,move=true){

 	e.stopPropagation(); // Stops some browsers from redirecting.
  	e.preventDefault();

    var element;
	var src = document.getElementById(e.dataTransfer.getData("text"));
    var destHTML = e.target;
    var	desti = findObj(destHTML.id);

    if(desti!=undefined){
  	    if(desti.dropInElemt(src.id)){
		    
		    var patt = new RegExp("new");

		    if (!patt.test(src.id)){
		    	element = createElement(src.id,desti);
		    } else{
		    	src=src.parentNode;

		     	if(destHTML.id!=src.parentNode.id){
		    		element = TransferElement(destHTML,src.parentNode,src);
		    	}
		    	else{
		    		element = findObj(src.id);
		    	}

		    }

		    if(destHTML.id=="panelPrincipal"){

		    	//console.log("libre movimiento");

		    	tamContX = $('#'+destHTML.id).width();
			    tamContY = $('#'+destHTML.id).height();

			    tamElemX = $('#'+element.id).width();
			    tamElemY = $('#'+element.id).height();

			    posXCont = $('#'+destHTML.id).position().left;
			    posYCont = $('#'+destHTML.id).position().top;

			    // Posicion absoluta del raton
			    x = e.layerX;
			    y = e.layerY;

			    // Si parte del elemento que se quiere mover se queda fuera se cambia las coordenadas para que no sea asi
			    if (posXCont + tamContX <= x + tamElemX){
			        x = posXCont + tamContX - tamElemX;
			    }
			    /*
			    if (posYCont + tamContY <= y + tamElemY){
			        y = posYCont + tamContY - tamElemY;
			    }*/
			    /*console.log("Parent: "+destHTML.id);
			    console.log("x: "+x+" tamElemX: "+tamElemX);
			    console.log("y: "+y+" tamElemY: "+tamElemY);
				*/
			    panelPrincipal.setModSize(undefined, tamElemY, tamElemX,y,x);
			    element.getPV().style.position = "absolute";
			    element.getPV().style.left = x + "px";
			    element.getPV().style.top = y + "px";
			}
			else{
				element.getPV().style.position = "relative";
				element.getPV().style.left = 0 + "px";
			    element.getPV().style.top = 0 + "px";

			}
		}else{
			var patt = new RegExp("new");
		    if (!patt.test(src.id)){
				$.notify(src.id+" no puede introducirse dentro de "+destHTML.id.split("new")[0].split("Drop")[1], "error");
		    }else{
				$.notify(src.id.split("header")[1].split("new")[0]+" no puede introducirse dentro de "+destHTML.id.split("new")[0].split("Drop")[1], "error");
			}
		}
	}
    return false;
}

function TransferElement(destHTML,origHTML,srcHTML) {

	var child = findObj(srcHTML.id);
	var	dest = findObj(destHTML.id);
	var orig = findObj(origHTML.id);

	if(orig.getId()!="panelPrincipal")orig.setSizeOrig();

	if(dest.id!="panelPrincipal")dest.setModSize(child.getPV());

	dest.addChild(child);
	child.setParent(dest);
	orig.removeChild(child);

	return child;

}

function collapseElement(ElementHTML){
	var element = findObj(ElementHTML.parentNode.parentNode.id);
	if(element.isCollap()){
		ElementHTML.style.backgroundImage = "url('/static/ScratchLayer/images/arriba.png')";
	}else{
		ElementHTML.style.backgroundImage = "url('/static/ScratchLayer/images/abajo.png')";
	}
	//console.log(element);
	element.collapse();
}

function minimax(ElementHTML) {
	var element = findObj(ElementHTML.parentNode.parentNode.id);
	if(element.isCollap()){
		ElementHTML.previousSibling.setAttribute("class","col-xs-1 col-xs-offset-4 load");
		ElementHTML.style.backgroundImage = "url('/static/ScratchLayer/images/mini.png')";
	}else{
		ElementHTML.previousSibling.setAttribute("class","col-xs-1 col-xs-offset-2 load");
		ElementHTML.style.backgroundImage = "url('/static/ScratchLayer/images/max.png')";
	}
	//console.log(element);
	element.collapse();
}

function chincheta(ElementHTML){
	var element = findObj(ElementHTML.parentNode.parentNode.id);
	if(element.isChincheta()){
		ElementHTML.parentNode.setAttribute("draggable","true");
		ElementHTML.style.backgroundImage = "url('/static/ScratchLayer/images/chin.png')";
	}else{
		ElementHTML.parentNode.setAttribute("draggable","false");
		ElementHTML.style.backgroundImage = "url('/static/ScratchLayer/images/cheta.png')";
	}
	//console.log(element);
	element.stop();
}

function removeElement(elemHTML) {

	//var parent = findObj(elemHTML.parentNode.parentNode.parentNode.id);
	var child = findObj(elemHTML.id);
	var parent = child.getParent();
	//console.log(parent);
	child.remove();
	elemHTML.parentNode.removeChild(elemHTML);
	parent.setSizeOrig();
	return false;

}

function topEleme(element){
	if(onmouseover==undefined){
		onmouseover=element;
		element.style.zIndex="1";
	}
	else if(onmouseover.id!=element.id){
		onmouseover.style.zIndex="0";
		element.style.zIndex="1";
		onmouseover=element;	
	}
	
	//console.log("top "+element.id);
}

function findObj(ObjHTMLId) {

    var patt = new RegExp("Drop");

	if(patt.test(ObjHTMLId)){

		return parentinations[ObjHTMLId.split("Drop")[1]];

	}
	else{

		return parentinations[ObjHTMLId];

	}
	//console.log(parentinations[ObjHTMLId]);	
}

function viewPanel(ElementHTML) {
	ElementHTML.innerHTML="Panel Principal <span class='sr-only'>(current)</span>";
	ElementHTML.parentNode.setAttribute("class","active");
	document.getElementById("sni").parentNode.setAttribute("class"," ");
	document.getElementById("Pprin").style.display="initial";
	document.getElementById("Snffer").style.display="none";
}
function viewSniffer(ElementHTML) {
	ElementHTML.innerHTML="Sniffer <span class='sr-only'>(current)</span>";
	ElementHTML.parentNode.setAttribute("class","active");
	document.getElementById("pprin").parentNode.setAttribute("class"," ");
	document.getElementById("Snffer").style.display="initial";
	document.getElementById("Pprin").style.display="none";
}