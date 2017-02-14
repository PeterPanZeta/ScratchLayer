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
    var destId = e.target.id;
    
    console.log("SRC DROP: "+src);

    if (!patt.test(src)){
 	
    	element = createElement(src);
    	element.newPV();
		e.target.appendChild(element.getPV());
		addElement(destId, element);
		console.log(parentinations[destId]);

    } else{
    	var elementHTML = document.getElementById(src);
    	console.log("ElementHTML "+elementHTML.id);
    	console.log("Padre del elemento: "+elementHTML.parentNode.id);
    	console.log("DEST: "+destId);
    	if(destId!=elementHTML.parentNode.id && destId!=src){
			console.log("TransferElement");
    		element = TransferElement(destId,elementHTML);
    		console.log("Return "+ element);
    	}
    	else{
    		destId = elementHTML.parentNode.id; //Para evitar los casos en los que los elementos se menten dentro de si mismos.
    		console.log("NO TransferElement");
    		element = findObj(destId,src);
    		console.log("Return "+ element);
    	}

    }

    if(move){

    	tamContX = $('#'+destId).width();
	    tamContY = $('#'+destId).height();

	    tamElemX = $('#'+element.id).width();
	    tamElemY = $('#'+element.id).height();

	    posXCont = $('#'+destId).position().left;
	    posYCont = $('#'+destId).position().top;

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

		x = posXCont + tamContX - tamElemX;
	    y = posYCont + tamContY - tamElemY;

		element.getPV().style.position = "absolute";
	    element.getPV().style.left = x + "px";
	    element.getPV().style.top = y + "px";

	}

    return false;
}

function TransferElement(dest, src) {

	var parent = src.parentNode;
	console.log("ParentTransfer "+src.parentNode.id);
	console.log("DestTransfer "+dest);
	var child = findObj(parent.id,src.id);
	var index = parentinations[parent.id].indexOf(child);

	if (index > -1) {

		var cont = parentinations[parent.id][0];

    	parentinations[parent.id].splice(index, 1);
		parentinations[parent.id][0]=cont-1;

		addElement(dest,child);
		
		return child;
	}

	return false;

}

function addElement(parent,obj) {

	console.log(parent);
	var cont = parentinations[parent][0];
	parentinations[parent][cont]=obj;
	parentinations[parent][0]=cont+1;

}

function removeElement(elem) {

	var parent = elem.parentNode.parentNode.parentNode;
	console.log(parent.id);
	var child = findObj(parent.id,elem.parentNode.parentNode.id);
	var index = parentinations[parent.id].indexOf(child);

	if (index > -1) {
		var cont = parentinations[parent.id][0];
		parent.removeChild(child.getPV());
    	parentinations[parent.id].splice(index, 1);
		parentinations[parent.id][0]=cont-1;
	}

	console.log(parentinations[parent.id]);
}

function findObj(parent,idObj) {
	//console.log("parent "+parent);
	return parentinations[parent].find(function(Protocol) {
		return Protocol.id === idObj;
	}); 
}