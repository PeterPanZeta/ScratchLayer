var panelPrincipal = new PanelPrincipal(document.getElementById("panelPrincipal"));
var parentinations = {"panelPrincipal":panelPrincipal};
var onmouseover=undefined;
var sniffElements= {};
//console.log(parentinations["panelPrincipal"]);

$(document).ready(function() {
	var elements = document.getElementById("elements1").childNodes;

	[].forEach.call(elements, function(elem) {
		elem.addEventListener('dragstart', drag, false);

	});
	
    /*var parentination1 = document.getElementById("elements1");

	parentination1.addEventListener('dragover', allowDrop, false);
	parentination1.addEventListener('drop', drop, false);*/

	var parentination2 = document.getElementById("panelPrincipal");

	parentination2.addEventListener('dragover', allowDrop, false);
	parentination2.addEventListener('drop',function(e){drop(e)}, false);
	tableSniff = $('#dataTables-Sniffer').DataTable({
    	responsive: true
    });
});

function enter(e) {

	var patt = new RegExp("Drop");
	if(patt.test(e.target.id)){
		var Dest = findObj(e.target.id); 
		topEleme(Dest.getPV());
	}
 	
}

function SubmitPrin(form,e){
	e.preventDefault();
	var load = document.getElementById("load"+form.id.split("Form")[1])
	load.style.visibility="initial";
	$.ajax({
	 		type: 'POST',
            url: '/ScratchLayer/ajax/',
            data: "mode=PPrin&"+$( form ).serialize()+"&interfaz="+document.getElementById("interfaces1").value,
        	dataType: 'json',
            success: function (data) {
				load.style.visibility="hidden";
            	if(data.response.error){

            		for (var itemin in data.response.message){
                		$.notify( data.response.message[itemin], "error");
            		}

            	}
            	else{
            		for (var itemin in data.response.message){
                		$.notify( data.response.message[itemin], "success");
            		}
            	}
         	 	
        	}
        });

    	return false;
}

function SubmitSniff(form,e){
	e.preventDefault();

	console.log( $( form ).serialize());
	//var load = document.getElementById("load"+form.id.split("Form")[1])
	//load.style.visibility="initial";
	$.ajax({
	 		type: 'POST',
            url: '/ScratchLayer/ajax/',
            data: "mode=Sniff&"+$( form ).serialize(),
        	dataType: 'json',
            success: function (data) {

            	AddPacketSniff();
				//load.style.visibility="hidden";
            	if(data.response.error){
            		for (var itemin in data.response.message){
                		$.notify( data.response.message[itemin], "error");
            		}
            	}
            	else{
            		//console.log("Antes");
                	AddPacketSniff(data.response.message);
                	//console.log("Destras");
            	}
            	//console.log(data.response.sniff);
        	}
        });
    	return false;
}

function AddPacketSniff(elements) {

	for (var packet in elements){
		sniffElements[packet]=elements[packet];
		//console.log(sniffElements[packet]);
		tableSniff.row.add( ["<button onclick='(createElementSniff(\""+packet+"\"))'>Send PP</button> ("+elements[packet].iface+") "+elements[packet].layerDescrip] ).draw();
	}
}

function createElementSniff(packetName) {
	viewPanel(document.getElementById("pprin"));
	var packet =  sniffElements[packetName];
	var child;
	var parent = createElement(packetName,findObj("panelPrincipal"));
	//sleep(1000);
	//var form = document.getElementById("FormPacketnew"+packetName.split("/")[1]);
	layers=packet.layers.split("/");
	for (var i=0; i<layers.length; i++) {
		
		child= createElement(layers[i],parent);

		//sleep(1000);
		parent.setModSize(child.getPV().offsetHeight,child.getPV().offsetWidth);
		//child.getPV().style.position = "relative";
		//child.getPV().style.left = 0 + "px";
		//child.getPV().style.top = 0 + "px";

		//sleep(1000);
		
		parent=child;
		//console.log(packet[layers[i]]);
	}

	/*var child = element;
	desti.setModSize(child.getPV().offsetHeight,child.getPV().offsetWidth);
	console.log(sniffElements[packet]+" "+sniffElements[packet].layers);*/
}

function sleep(millis)
{
    var date = new Date();
    var curDate = null;
    do { curDate = new Date(); }
    while(curDate-date < millis);
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

    if(desti.dropInElemt(src.id)){
	    
	    var patt = new RegExp("new");

	    if (!patt.test(src.id)){
	    	element = createElement(src.id,desti);
	    	if(destHTML.id!="panelPrincipal")desti.setModSize(element.getPV().offsetHeight,element.getPV().offsetWidth);
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

		    if (posYCont + tamContY <= y + tamElemY){
		        y = posYCont + tamContY - tamElemY;
		    }

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
			$.notify(src.id+" no puede introducirse dentro de "+dest.id.split("new")[0].split("Drop")[1], "error");
	    }else{
			$.notify(src.id.split("header")[1].split("new")[0]+" no puede introducirse dentro de "+dest.id.split("new")[0].split("Drop")[1], "error");
		}
	}
    return false;
}

function TransferElement(destHTML,origHTML,srcHTML) {

	var child = findObj(srcHTML.id);
	var	dest = findObj(destHTML.id);
	var orig = findObj(origHTML.id);

	if(orig.getId()!="panelPrincipal")orig.setSizeOrig();

	if(dest.id!="panelPrincipal")dest.setModSize(child.getPV().offsetHeight,child.getPV().offsetWidth);

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
	//console.log(parent);
	elemHTML.parentNode.removeChild(child.getPV());

	child.remove();

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