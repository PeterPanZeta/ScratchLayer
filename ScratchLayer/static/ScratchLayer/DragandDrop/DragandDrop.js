var parentinations = {panelPrincipal:new Array(1,"")}; //Respetar primera componente para llevar el contador de elementos

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

});

function allowDrop(e) {
	if (e.preventDefault) {
	e.preventDefault(); // Necessary. Allows us to drop.
	}
	e.dataTransfer.dropEffect = 'move';
	// See the section on
	return false;
}

function drag(e) {
	e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData("text", e.target.id);
	e.dataTransfer.setDragImage(e.target, 0, 0);
}

function drop(e,move=true){

 	e.stopPropagation(); // Stops some browsers from redirecting.
  	e.preventDefault();

    var element; // Elemento arrastrado
	var src = e.dataTransfer.getData("text");
    var patt = new RegExp("new");
    var dest = e.target;
    
    //console.log("SRC DROP: "+src);

    if (!patt.test(src)){
 	
    	element = createElement(src);
    	element.newPV();
		addElement(dest, element);
		//console.log(parentinations[destId]);

    } else{
    	var elementHTML = document.getElementById(src);
    	//console.log("ElementHTML "+elementHTML.id);
    	//console.log("Padre del elemento: "+elementHTML.parentNode.id);
    	//console.log("DEST: "+destId);
    	if(dest.id!=elementHTML.parentNode.id && dest.id!=src){
			//console.log("TransferElement");
    		element = TransferElement(dest,elementHTML.parentNode.id,elementHTML);
    		//console.log("Return "+ element);
    	}
    	else{

    		dest = elementHTML.parentNode; //Para evitar los casos en los que los elementos se menten dentro de si mismos.
    		//console.log(dest);
    		//console.log("Nuevo DEST: "+destId);
    		//console.log("NO TransferElement");
    		element = findObj(dest.id,src);
    		//console.log("Return "+ element);
    	}

    }

    if(move){

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
	}

    return false;
}

function TransferElement(dest,orig,src) {

	//console.log("ParentTransfer "+orig);
	//console.log("DestTransfer "+dest);
	var child;

	if(dest.id!="panelPrincipal"){

		child = findObj("Drop"+orig,src.id);

		var dimChildX = child.getPV().offsetWidth + 20;
		var dimChildy = child.getPV().offsetHeight + 20;

		console.log("y "+dimChildy+" x "+dimChildX);

		dest.style.width=dimChildX+"px";

		console.log(child.getPV().offsetWidth);

	}else{
		child = findObj(orig,src.id);
	}

	var index = parentinations[orig].indexOf(child);

	if (index > -1) {

		addElement(dest,child);

		var cont = parentinations[orig][0];
		
    	parentinations[orig].splice(index, 1);
		parentinations[orig][0]=cont-1;

	
		return child;
	}

	return false;

}

function addElement(parent,obj) {

	//console.log(parent);
	var cont = parentinations[parent.id][0];
	parentinations[parent.id][cont]=obj;

	if(parent.id!="panelPrincipal"){
		var element = findDrop(parent);
		console.log("Return " + element);
		element.appendChild(obj.getPV());
	}else{
		parent.appendChild(obj.getPV());
	}
	parentinations[parent.id][0]=cont+1;
	//console.log(parentinations[parent]);

}

function removeElement(elem) {

	var parent = elem.parentNode.parentNode.parentNode;
	//console.log(parent.id);
	var child = findObj(parent.id,elem.parentNode.parentNode.id);
	var index = parentinations[parent.id].indexOf(child);

	if (index > -1) {
		var cont = parentinations[parent.id][0];
		parent.removeChild(child.getPV());
    	parentinations[parent.id].splice(index, 1);
		parentinations[parent.id][0]=cont-1;
	}

	//console.log(parentinations[parent.id]);
}

function findObj(parent,idObj) {
	console.log("parent "+parent);
	return parentinations[parent].find(function(Protocol) {
		return Protocol.id === idObj;
	}); 
}

function findDrop(parent) {
	var result;
	console.log(parent.childNodes);
	parent.childNodes.forEach(function(element){

		console.log(element.id);

		if(element.id == "Drop"+parent.id){
			result=element;
		}

		if(element.id == "FormPacket"){
			element.childNodes.forEach(function(element){
				if(element.id == "Drop"+parent.id){
					result=element;
				}
			});
		}
	});
	return result;
}