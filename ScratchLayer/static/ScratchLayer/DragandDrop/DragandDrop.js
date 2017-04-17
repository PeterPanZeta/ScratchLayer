var panelPrincipal = new PanelPrincipal(document.getElementById("panelPrincipal"));
var parentinations = {"panelPrincipal":panelPrincipal};
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

});

function Submit(form,e){
	e.preventDefault();

	 $.ajax({
	 		type: 'POST',
            url: '/ScratchLayer/ajax/',
            data: $( form ).serialize(),
        	dataType: 'json',
            success: function (data) {

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
		e.dataTransfer.setDragImage(e.target, 0, 0);
	}
}

function drop(e,move=true){

 	e.stopPropagation(); // Stops some browsers from redirecting.
  	e.preventDefault();

    var element; // Elemento arrastrado
	var src = e.dataTransfer.getData("text");
    var patt = new RegExp(src);
    var patt2 = new RegExp("Drop"); 
    var dest = e.target;
    
    //console.log("SRC DROP: "+src);
    if(!patt.test(dest.id) && (patt2.test(dest.id) || dest.id == "panelPrincipal" ) && dest.id!=src){ //1ºy 3º no permite meterse sobre si mismo, 2º solo se permite en los drop
	    
	    patt = new RegExp("new");

	    if (!patt.test(src)){
	    	//console.log("DestTunig "+dest.id.split("Drop")[1]);
	 		//console.log(findObj(dest.id));
	    	element = createElement(src,findObj(dest.id));
			//console.log(parentinations[destId]);

	    } else{
	    	var elementHTML = document.getElementById(src);
	    	//console.log("ElementHTML "+elementHTML.id);
	    	//console.log("Padre del elemento: "+elementHTML.parentNode.id);
	    	//console.log("DEST: "+dest.id);
	    	

	    	if(dest.id!=elementHTML.parentNode.id){
				//console.log("TransferElement");
	    		element = TransferElement(dest,elementHTML.parentNode,elementHTML);
	    		//console.log("Return "+ element);
	    	}
	    	else{

	    		//dest = elementHTML.parentNode; //Para evitar los casos en los que los elementos se menten dentro de si mismos.
	    		//console.log(dest);
	    		//console.log("Nuevo DEST: "+dest.id);
	    		//console.log("NO TransferElement");
	    		element = findObj(src);
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
		orig.getPV().style.width=orig.getwidth();
		orig.getPV().style.height=orig.getheight();
	}

	if(dest.getId()!="panelPrincipal"){

		var dimChildX = child.getPV().offsetWidth + 20;
		var dimChildy = child.getPV().offsetHeight + 20;

		//console.log("y "+dimChildy+" x "+dimChildX);
		dest.setheight(dest.getPV().style.height);
		dest.setwidth(dest.getPV().style.width);
		dest.getPV().style.width=dimChildX+"px";
		dest.getPV().style.height=dimChildy+"px";
		//console.log(child.getPV().offsetWidth);

	}

	parentinations[child.getId()].setParent(findObj(destHTML.id));
	//dest.getPV().appendChild(child.getPV());
	//origHTML.removeChild(child.getPV());

	return child;

}


function removeElement(elemHTML) {

	var parent = findObj(elemHTML.parentNode.parentNode.parentNode.id);
	var child = findObj(elemHTML.parentNode.parentNode.id);
	//console.log(parent);
	parent.removeChild(child);
	elemHTML.parentNode.parentNode.parentNode.removeChild(elemHTML.parentNode.parentNode);
	//elemHTML.parentNode.parentNode.parentNode.removeChild(child.getPV());
	return false;

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
