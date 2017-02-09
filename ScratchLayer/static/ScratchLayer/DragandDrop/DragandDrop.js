var destinations = {panelPrincipal:new Array(1,"")}; //Respetar primera componente para llevar el contador de elementos

$(document).ready(function() {
	var elements = document.getElementById("elements1").childNodes;

	[].forEach.call(elements, function(elem) {
		elem.addEventListener('dragstart', drag, false);

	});

    /*var destination1 = document.getElementById("elements1");

	destination1.addEventListener('dragover', allowDrop, false);
	destination1.addEventListener('drop', drop, false);*/

	var destination2 = document.getElementById("panelPrincipal");

	destination2.addEventListener('dragover', allowDrop, false);
	destination2.addEventListener('drop', drop, false);

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
	e.dataTransfer.setDragImage(this, 0, 0);
}

function drop(e){

 	e.stopPropagation(); // Stops some browsers from redirecting.
  	e.preventDefault();

    var elementoArrastrado; // Elemento arrastrado
	var str = e.dataTransfer.getData("text");
    var patt = new RegExp("new");
    
    console.log(str);

    if (!patt.test(str)){

    	elementoArrastrado = createPacket(str);
    	elementoArrastrado.newPV();
		e.target.appendChild(elementoArrastrado.getPV());
		addElement(this.id, elementoArrastrado);
		elementoArrastrado.viewType();
		elementoArrastrado.viewId();

    } else{
    	elementoArrastrado = findObj(this.id, str);
    }

    tamContX = $('#'+e.target.id).width();
    tamContY = $('#'+e.target.id).height();

    tamElemX = $('#'+elementoArrastrado.id).width();
    tamElemY = $('#'+elementoArrastrado.id).height();

    posXCont = $('#'+e.target.id).position().left;
    posYCont = $('#'+e.target.id).position().top;

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

    elementoArrastrado.getPV().style.position = "absolute";
    elementoArrastrado.getPV().style.left = x + "px";
    elementoArrastrado.getPV().style.top = y + "px";

    return false;
}

function addElement(dest,obj) {
	var cont = destinations[dest][0];
	destinations[dest][cont]=obj;
	destinations[dest][0]=cont+1;
}

function removeElement(elem) {
	
	var elementoBorrar = elem.parentNode.parentNode;
	var dest = elementoBorrar.parentNode.id;
	elementoBorrar.parentNode.removeChild(elementoBorrar);
}

function findObj(dest,idObj) {
	return destinations[dest].find(function(Protocol) {
		return Protocol.id === idObj;
	});
}