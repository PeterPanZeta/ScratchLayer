var contElement=1;

function PanelPrincipal(PanelPrincipalHTML) {

	this.id="panelPrincipal";
	this.idDrop="panelPrincipal";
	this.Children={};
	this.drop=true;
	this.PV=PanelPrincipalHTML;

	PanelPrincipal.prototype.getId = function(){
		return this.id;
	};

	PanelPrincipal.prototype.getIdDrop = function() {
		return this.id;
	};

	PanelPrincipal.prototype.getDrop = function() {
		return this.drop;
	};

	PanelPrincipal.prototype.getPV = function() {
		return this.PV;
	};

	PanelPrincipal.prototype.addChild = function(Child){
		
		this.PV.appendChild(Child.getPV());
		this.Children[Child.getId()]=Child;
	
	};

	PanelPrincipal.prototype.removeChild = function(Child){

		if(Child.removeParent(this)){

			//this.PV.removeChild(Child.getPV());
			delete this.Children[Child.getId()];
    		delete parentinations[Child.getId()];
		}
		else{
			console.log("No eres hijo mio "+Child);
		}

	};

}


function Packet() {

	this.id="";
	this.drop=true;
	this.Parent;
	this.Children={};
	this.width="";
	this.height="";
	this.PV;

	Packet.prototype.viewId = function(){
		console.log("Packet");
	};

	Packet.prototype.viewType = function(){
		console.log("Packet");
	};

	Packet.prototype.getId = function(){
		return this.id;
	};

	Packet.prototype.setId = function(id){
		this.id = id;
	};
	
	Packet.prototype.getDrop =function() {
		return this.drop;
	};

	Packet.prototype.getIdDrop = function() {
		return "Drop"+this.id;
	};

	Packet.prototype.getParent = function(){
		return this.Parent;
	};

	Packet.prototype.setParent = function(Parent){
		//console.log(Parent);
		Parent.addChild(this);
		this.parent=Parent;
	};

	Packet.prototype.setwidth = function(width){
		this.width=width;
	};

	Packet.prototype.getwidth = function(){
		return this.width;
	};

	Packet.prototype.setheight = function(height){
		this.height=height;
	};

	Packet.prototype.getheight = function(){
		return this.height;
	};

	Packet.prototype.removeParent = function(Parent){

		if(this.parent.getId() == Parent.getId()){
			this.parent = undefined;
			return true;
		}
		else{
			return false;
		}
	};

	Packet.prototype.addChild = function(Child){
		this.PV.lastChild.lastChild.appendChild(Child.getPV());
		this.Children[Child.getId()]=Child;
	};

	Packet.prototype.removeChild = function(Child){

		if(Child.removeParent(this)){

			//this.PV.removeChild(Child.getPV());
			delete this.Children[Child.getId()];
    		delete parentinations[Child.getId()];
    		//console.log("Borro");
		}
		else{
			//console.log("No eres hijo mio "+Child);
		}

	};

	Packet.prototype.newPV=function() {
		var divDrop = document.createElement("div");
		var form = document.createElement("form");

		this.PV = document.createElement("div");
		this.PV.id = "Packetnew"+contElement;
		contElement=contElement+1;
		this.id=this.PV.id;
		//console.log("PUSS "+this.id);

		this.PV.classList.add("column");
		this.PV.setAttribute("draggable","true");
		this.PV.addEventListener('dragstart', drag, false);
		this.PV.innerHTML="<header id= 'header"+this.id+"'>Packet <button id='remove"+this.id+"' class='remove' onclick='removeElement(this,event)'></button></header>"
		
		divDrop.id="Drop"+this.id;
		divDrop.classList.add("drop");

		//divDrop.setAttribute("draggable","true");
		divDrop.addEventListener('dragover', allowDrop, false);
		divDrop.addEventListener('drop',function(e){drop(e,false)}, false);

		form.id="Form"+this.id
		form.setAttribute("method","post");
		form.setAttribute("onsubmit","Submit(this,event)");
		form.style.height="50%";
		form.style.width="auto";

		form.innerHTML="<input type='text' name='prueba' placeholder='Usuario'></input><input type='submit' id='buttonSubmit"+this.id+"' value='Ingresar'></input>";
		form.appendChild(divDrop);

		this.PV.appendChild(form);
	};

	Packet.prototype.getPV=function() {
		return this.PV;
	};

}

function Protocol(type) {

	this.type=type;
	this.id="";
	this.PV;
	this.drop=false;
	this.Parent;
	this.width="";
	this.height="";

	Protocol.prototype.viewId = function(){
		console.log(this.id);
	};

	Protocol.prototype.viewType = function(){
		console.log(this.type);
	};

	Protocol.prototype.getId = function(){
		return this.id;
	};

	Protocol.prototype.getIdDrop = function() {
		if(this.drop){		
			return "Drop"+this.id;
		}
		else{
			return false;
		}
	};

	Protocol.prototype.setId = function(id){
		this.id = id;
	};

	Protocol.prototype.getDrop =function() {
		return this.drop;
	};

	Protocol.prototype.getParent = function(){
		return this.Parent;
	};

	Protocol.prototype.setParent = function(Parent){
		Parent.addChild(this);
		this.parent=Parent;
	};

	Protocol.prototype.removeParent = function(Parent){

		if(this.parent.getId() == Parent.getId()){
			this.parent = undefined;
			//console.log("Quito padre");
			return true;
		}
		else{
			//console.log("NO Quito padre");
			return false;
		}
	};
	Protocol.prototype.setwidth = function(width){
		this.width=width;
	};

	Protocol.prototype.getwidth = function(){
		return this.width;
	};

	Protocol.prototype.setheight = function(height){
		this.height=height;
	};

	Protocol.prototype.getheight = function(){
		return this.height;
	};

}

function ProtocolDrop(type) {

	Protocol.call(this,type,true);

	this.drop=true;
	this.Children={};
	this.idDrop="";

	ProtocolDrop.prototype.addChild = function(Child){
		this.Children[Child.getId()] = Child;
		//console.log(this.PV.lastChild);
		this.PV.lastChild.appendChild(Child.getPV());
	};

	ProtocolDrop.prototype.removeChild = function(Child){

		if(Child.removeParent(this)){
			var Childh = Child.getPV();
			//this.PV.removeChild(Childh);
			delete this.Children[Child.getId()];
    		delete parentinations[Child.getId()];
		}
		//else{
			//console.log("No eres hijo mio "+Child);
		//}
	};
}

function Ethernet() {

	ProtocolDrop.call(this,"Ethernet",true);

	Ethernet.prototype.newPV=function() {

		var divDrop = document.createElement("div");

		this.PV = document.createElement("div");
		this.PV.id = "Ethernetnew"+contElement;
		contElement=contElement+1;
		this.id=this.PV.id;

		this.PV.classList.add("column");
		this.PV.setAttribute("draggable","true");
		this.PV.addEventListener('dragstart', drag, false);
		this.PV.innerHTML="<header>Ethernet <button id='remove' class='remove' onclick='removeElement(this)'></button></header><input type='text' name='prueba2' placeholder='Usuario'>"

		divDrop.id="Drop"+this.id;
		this.idDrop=divDrop.id;

		divDrop.classList.add("drop");

		//divDrop.setAttribute("draggable","true");
		divDrop.addEventListener('dragover', allowDrop, false);
		divDrop.addEventListener('drop',function(e){drop(e,false)}, false);

		this.PV.appendChild(divDrop);
	};

	Ethernet.prototype.getPV=function() {
		return this.PV;
	};

}

function createElement(idSrt,parent) {
	var newElement;
	switch(idSrt) {

		case "Packet":
			newElement = new Packet();
			newElement.newPV();
			newElement.setParent(parent);
			//parent.getPV().appendChild(newElement.getPV());
			parentinations[newElement.getId()]=newElement;
			return newElement;

    	case "Ethernet":
    		newElement = new Ethernet();
    		newElement.newPV();
    		newElement.setParent(parent);
    		//parent.getPV().appendChild(newElement.getPV());
    		parentinations[newElement.getId()]=newElement;
    		return newElement;
    }
}

ProtocolDrop.prototype = new Protocol();

Ethernet.prototype = new ProtocolDrop();


