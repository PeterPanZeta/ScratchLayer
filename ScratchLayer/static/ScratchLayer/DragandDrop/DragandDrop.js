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
            		console.log("Antes");
                	AddPacketSniff(data.response.message);
                	console.log("Destras");
            	}
            	//console.log(data.response.sniff);
        	}
        });
    	return false;
}

function AddPacketSniff(elements) {

	for (var packet in elements){
		var layerDescrip = "";
		sniffElements[packet]=elements[packet];

		if(Exists(elements[packet],"Ether")){
			layerDescrip="Ether(src="+elements[packet].Ether.src+" dst="+elements[packet].Ether.dst+")";
		}
		if(Exists(elements[packet],"ARP")){
			layerDescrip=layerDescrip+"/ARP";
		}else{
			if(Exists(elements[packet],"IP")){
				layerDescrip=layerDescrip+"/IP(src="+elements[packet].IP.src+" dst="+elements[packet].IP.dst+")";

				if(Exists(elements[packet],"ICMP")){
					layerDescrip=layerDescrip+"/ICMP";
				}else{
					if(Exists(elements[packet],"TCP")){
						layerDescrip=layerDescrip+"/TCP(sport="+elements[packet].TCP.sport+" dport"+elements[packet].TCP.dport+")";
					}else{
						if(Exists(elements[packet],"UDP")){
							layerDescrip=layerDescrip+"/UDP(sport="+elements[packet].UDP.sport+" dport"+elements[packet].UDP.dport+")";
						}
					}
					if(Exists(elements[packet],"RIP")){
						layerDescrip=layerDescrip+"/RIP";
					}
				}
			}
			
			//tBodySniff.innerHTML="<tr><th>"+layerDescrip+"</th></tr>"+tBodySniff.innerHTML
		}
		tableSniff.row.add( ["<button onclick='(createElementSniff(\""+packet+"\"))'>Send PP</button>  "+layerDescrip] ).draw();
		//console.log(elements[packet]);
		//console.log(layerDescrip);
	}
}

function createElementSniff(packet) {
	
	console.log(sniffElements[packet]+" "+sniffElements[packet].layers);
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

    var element; // Elemento arrastrado
	var src = document.getElementById(e.dataTransfer.getData("text"));//e.dataTransfer.getData("text");
    //var patt = new RegExp(src.split("new")[0]);
    //var patt2 = new RegExp("Drop"); 
    var dest = e.target;
    //console.log(dest.id)
    var	desti = findObj(dest.id);
    //console.log("SRC DROP: "+src);
    if(desti.dropInElemt(src.id)){ //1ºy 3º no permite meterse sobre si mismo, 2º solo se permite en los drop !patt.test(dest.id) && (patt2.test(dest.id) || dest.id == "panelPrincipal" ) && dest.id!=src && 
	    
	    var patt = new RegExp("new");

	    if (!patt.test(src.id)){
	    	//console.log("DestTunig "+dest.id.split("Drop")[1]);
	 		//console.log(findObj(dest.id));
	    	element = createElement(src.id,findObj(dest.id));
			//console.log(parentinations[destId]);
			if(dest.id!="panelPrincipal"){
				var child = element;
				desti.setModSize(child.getPV().offsetHeight,child.getPV().offsetWidth)
			}

	    } else{
	    	src=src.parentNode;
	    	//console.log("ElementHTML "+elementHTML.id);
	    	//console.log("Padre del elemento: "+elementHTML.parentNode.id);
	    	//console.log("DEST: "+dest.id);
	    	

	    	if(dest.id!=src.parentNode.id){
				//console.log("TransferElement");
	    		element = TransferElement(dest,src.parentNode,src);
	    		//console.log("Return "+ element);
	    	}
	    	else{

	    		//dest = elementHTML.parentNode; //Para evitar los casos en los que los elementos se menten dentro de si mismos.
	    		//console.log(dest);
	    		//console.log("Nuevo DEST: "+dest.id);
	    		//console.log("NO TransferElement");
	    		element = findObj(src.id);
	    		//console.log("Return "+ element);
	    	}

	    }

	    if(dest.id=="panelPrincipal"){

	    	//console.log("libre movimiento");

	    	tamContX = $('#'+dest.id).width();
		    tamContY = $('#'+dest.id).height();

		    tamElemX = $('#'+element.id).width();
		    tamElemY = $('#'+element.id).height();

		    posXCont = $('#'+dest.id).position().left;
		    posYCont = $('#'+dest.id).position().top;

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

	//console.log("ParentTransfer "+orig);
	//console.log("DestTransfer "+dest);
	var child = findObj(srcHTML.id);
	var	dest = findObj(destHTML.id);
	var orig = findObj(origHTML.id);

	if(orig.getId()!="panelPrincipal"){
		orig.setSizeOrig();
	}

	if(dest.id!="panelPrincipal"){
		/*if(dest.getType()!="Packet"){*/
		

			dest.setModSize(child.getPV().offsetHeight,child.getPV().offsetWidth);
		/*
		}
		else{
			dest.setModSize(child.getPV().offsetHeight+105,child.getPV().offsetWidth+37);
		}*/
	}
	//dest.getPV().appendChild(child.getPV());
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