var contElement=1;

function PanelPrincipal(PanelPrincipalHTML) {

	this.id="panelPrincipal";
	this.idDrop="panelPrincipal";
	this.typeEther="panelPrincipal";
	this.Children={};
	this.drop=true;
	this.PV=PanelPrincipalHTML;

	PanelPrincipal.prototype.getId = function(){
		return this.id;
	};

	PanelPrincipal.prototype.getType = function(){
		return this.type;
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
			//this.PV.removeChild(Child.getPV());
			delete this.Children[Child.getId()];
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
	this.widthCollap="";
	this.heightCollap="";
	this.collap=false;

	Protocol.prototype.viewId = function(){
		console.log(this.id);
	};

	Protocol.prototype.viewType = function(){
		console.log(this.type);
	};

	Protocol.prototype.getId = function(){
		return this.id;
	};

	Protocol.prototype.getType = function(){
		return this.type;
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
		//Parent.addChild(this);
		this.Parent=Parent;
	};
	/*
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
	*/
	Protocol.prototype.setWH= function(width,height){
		this.width=width;
		this.height=height;
	};
	
	Protocol.prototype.setWHCollap= function(width,height){
		this.widthCollap=width;
		this.heightCollap=height;
	};
	
	Protocol.prototype.getwidth = function(){
		return this.width;
	};

	Protocol.prototype.getheight = function(){
		return this.height;
	};

	Protocol.prototype.remove=function(){
		//console.log("Sin drop");
		this.Parent.removeChild(this);
		delete this;
	};

	Protocol.prototype.getPV=function() {
		return this.PV;
	};

	Protocol.prototype.collapse=function(){
		if(this.collap){
			this.PV.style.height=this.height+"px";
			this.collap=false;
		}
		else{
			//console.log(this.heightCollap);
			this.PV.style.height=this.height-this.heightCollap+"px";
			this.collap=true;
		}
	};

}

function ProtocolDrop(type) {


	Protocol.call(this,type,true);

	this.drop=true;
	this.Children={};
	this.idDrop="";
	this.heightMod="";
	this.widthMod="";

	ProtocolDrop.prototype.addChild = function(Child){
		this.Children[Child.getId()] = Child;
		//console.log(this.PV.lastChild);
		if(this.type=="Packet"){
			this.PV.lastChild.lastChild.appendChild(Child.getPV());
		}else{
			this.PV.lastChild.appendChild(Child.getPV());
		}
	};

	ProtocolDrop.prototype.removeChild = function(Child){
			delete this.Children[Child.getId()];
	};

	ProtocolDrop.prototype.setModSize = function(height,width){
		this.heightMod=this.PV.offsetHeight;
		this.widthMod=this.PV.offsetWidth;

		this.PV.style.width=width+"px";
		this.PV.style.height=height+"px";
	};

	ProtocolDrop.prototype.setModSizePre = function(){
		this.PV.style.width=this.widthMod;
		this.PV.style.height=this.heightMod;
	};

	ProtocolDrop.prototype.setSizeOrig = function(){
		this.PV.style.width=this.getwidth();
		this.PV.style.height=this.getheight();
	};

	ProtocolDrop.prototype.collapse=function(){

		if(isEmpty(this.Children)){
			if(this.collap){
				this.PV.style.height=this.height+"px";
				this.collap=false;
			}
			else{
				//console.log(this.heightCollap);
				this.PV.style.height=this.height-this.heightCollap+"px";
				this.collap=true;
			}
		}
		else{
			for(child in this.Children){
				elemet=this.Children[child];
				if(this.collap){
					var height = (35+this.heightCollap)+elemet.getPV().offsetHeight+10;
					this.PV.style.height=height+"px";
					this.collap=false;
				}
				else{
					var height = 35+elemet.getPV().offsetHeight+10;
					//console.log(this.heightCollap);
					this.PV.style.height=height+"px";
					this.collap=true;
				}
			}
		}
		//console.log()
	};

	ProtocolDrop.prototype.remove=function(){
		this.Parent.removeChild(this);
		for(child in this.Children){
			elemet=this.Children[child];
			elemet.remove();
			delete this.Children[elemet.id]
			delete parentinations[elemet.getId()];
		}
		delete this;
	};
	
}

function Packet(){

	ProtocolDrop.call(this,"Packet",true);

	Packet.prototype.newPV=function() {
	var divDrop;
	var form = document.createElement("form");

	this.PV = document.createElement("div");
	this.PV.id = "Packetnew"+contElement;
	contElement=contElement+1;
	this.id=this.PV.id;
	//console.log("PUSS "+this.id);

	this.PV.classList.add("PacketNew");
	this.PV.setAttribute("draggable","true");
	this.PV.addEventListener('dragstart', drag, false);
	this.PV.innerHTML="<header id= 'header"+this.id+"' class='col-xs-12'> <div class='col-xs-3 col-xs-offset-4'>Packet</div> <button class='col-xs-2 col-xs-offset-3' id='remove"+this.id+"' class='remove' onclick='removeElement(this.parentNode.parentNode)'>X</button></header>"
	
	divDrop = createDrop(this.id)
	divDrop.setAttribute("class","drop");
	this.idDrop=divDrop.id;
	
	form.id="Form"+this.id
	form.setAttribute("class","form-horizontal col-xs-12");
	form.setAttribute("role","form");
	form.setAttribute("method","post");
	form.setAttribute("onsubmit","Submit(this,event)");
	form.style.height="100%";
	form.style.width="100%";

	form.innerHTML=" <input type='hidden' name='pk' value="+this.id+"><div class='form-group col-xs-12'></div> <div class='form-group col-xs-12'><input class='col-xs-5 col-xs-offset-1' type='text' placeholder='NºPaquetes'></input><input class='col-xs-3 col-xs-offset-3' type='submit' id='buttonSubmit"+this.id+"' value='Send'></input></div>";
	form.appendChild(divDrop);

	this.PV.appendChild(form);
	};
}

function Ethernet() {

	ProtocolDrop.call(this,"Ethernet",true);

	Ethernet.prototype.newPV=function() {

		var divDrop;

		this.PV = document.createElement("div");
		this.PV.id = "Ethernetnew"+contElement;
		contElement=contElement+1;
		this.id=this.PV.id;

		this.PV.classList.add("EthernetNew");
		this.PV.setAttribute("draggable","true");
		this.PV.addEventListener('dragstart', drag, false);
		this.PV.innerHTML="<header class='col-xs-12'><button type='button' class='col-xs-3 col-xs-offset-4' data-toggle='collapse' data-target='#"+this.id+"collap' onclick='collapseElement(this.parentNode.parentNode)'>Ethernet</button> <input type='hidden' name='Ether' value='True'><button class='col-xs-2 col-xs-offset-3' type='button' id='remove' class='remove' onclick='removeElement(this.parentNode.parentNode)' align='center'>X</button></header><div class='collapse in' id='"+this.id+"collap'><div class='col-xs-12' id='"+this.id+"collapElement'><div class='form-group col-xs-12'></div><div class='form-group col-xs-12'><input class='col-xs-5' type='text' name='srcEther' placeholder='src'></input><input class='col-xs-5' type='text' name='dstEther' placeholder='dst'></input><input class='col-xs-2' type='text' name='typeEther' placeholder='type'></input></div></div></div>"


		divDrop = createDrop(this.id)
		this.idDrop=divDrop.id;
		
		this.PV.appendChild(divDrop);
	};

}

function IP() {

	ProtocolDrop.call(this,"IP",true);

	IP.prototype.newPV=function() {

		var divDrop;

		this.PV = document.createElement("div");
		this.PV.id = "IPnew"+contElement;
		contElement=contElement+1;
		this.id=this.PV.id;

		this.PV.classList.add("IPNew");
		this.PV.setAttribute("draggable","true");
		this.PV.addEventListener('dragstart', drag, false);
		this.PV.innerHTML="<header class='col-xs-12'><button type='button' class='col-xs-3 col-xs-offset-4' data-toggle='collapse' data-target='#"+this.id+"collap' onclick='collapseElement(this.parentNode.parentNode)'>IP</button>  <input type='hidden' name='IP' value='True'><button class='col-xs-2 col-xs-offset-3' type='button' id='remove' class='remove' onclick='removeElement(this.parentNode.parentNode)' align='center'>X</button></header><div class='collapse in' id='"+this.id+"collap'><div class='col-xs-12' id='"+this.id+"collapElement'><div class='form-group col-xs-12'></div><div class='form-group col-xs-12'><input class='col-xs-2' type='text' name='VERIP' placeholder='VER'></input><input class='col-xs-3' type='text' name='HLENIP' placeholder='HLEN'></input><input class='col-xs-3' type='text' name='SERVIP' placeholder='T.Servicio'></input><input class='col-xs-4' type='text' name='LOGIP' placeholder='Longitud'></input></div><div class='form-group col-xs-12'><input class='col-xs-4' type='text' name='IdenIP' placeholder='Identificacion'></input><input class='col-xs-4' type='text' name='FlagsIP' placeholder='Flags'></input><input class='col-xs-4' type='text' name='OffFraIP' placeholder='Offset Frag'></input></div><div class='form-group col-xs-12'><input class='col-xs-3' type='text' name='TTLIP' placeholder='TTL'></input><input class='col-xs-4' type='text' name='ProIP' placeholder='Protocolo'></input><input class='col-xs-5' type='text' name='CheckIP' placeholder='Checksum'></input></div><div class='form-group col-xs-12'><input class='col-xs-4' type='text' name='srcIP' placeholder='src'></input><input class='col-xs-4' type='text' name='dstIP' placeholder='dst'></input><input class='col-xs-4' type='text' name='OpcionesIP' placeholder='Opciones'></input></div></div></div>"

		divDrop = createDrop(this.id)
		this.idDrop=divDrop.id;

		this.PV.appendChild(divDrop);
	};

}

function ICMP() {

	Protocol.call(this,"ICMP",true);

	ICMP.prototype.newPV=function() {

		this.PV = document.createElement("div");
		this.PV.id = "ICMPnew"+contElement;
		contElement=contElement+1;
		this.id=this.PV.id;

		this.PV.classList.add("ICMPNew");
		this.PV.setAttribute("draggable","true");
		this.PV.addEventListener('dragstart', drag, false);
		this.PV.innerHTML="<header>ICMP  <input type='hidden' name='ICMP' value='True'><button id='remove' class='remove' onclick='removeElement(this.parentNode.parentNode)'></button></header><div class='DataIP'><div class='form-group col-xs-12'><input class='col-xs-2' type='text' name='VERIP' placeholder='VER'></input><input class='col-xs-3' type='text' name='HLENIP' placeholder='HLEN'></input><input class='col-xs-3' type='text' name='SERVIP' placeholder='T.Servicio'></input><input class='col-xs-4' type='text' name='LOGIP' placeholder='Longitud'></input></div><div class='form-group col-xs-12'><input class='col-xs-4' type='text' name='IdenIP' placeholder='Identificacion'></input><input class='col-xs-4' type='text' name='FlagsIP' placeholder='Flags'></input><input class='col-xs-4' type='text' name='OffFraIP' placeholder='Offset Frag'></input></div><div class='form-group col-xs-12'><input class='col-xs-3' type='text' name='TTLIP' placeholder='TTL'></input><input class='col-xs-4' type='text' name='ProIP' placeholder='Protocolo'></input><input class='col-xs-5' type='text' name='CheckIP' placeholder='Checksum'></input></div><div class='form-group col-xs-12'><input class='col-xs-4' type='text' name='srcIP' placeholder='src'></input><input class='col-xs-4' type='text' name='dstIP' placeholder='dst'></input><input class='col-xs-4' type='text' name='OpcionesIP' placeholder='Opciones'></input></div></div>"
	
	};
}


function createElement(idSrt,parent) {
	var newElement;
	//console.log(parent);
	switch(idSrt) {
		case "Packet":
			newElement = new Packet();
			break;
    	case "Ethernet":
    		newElement = new Ethernet();
    		break;
    	case "IP":
    		newElement = new IP();
    		break;
    	case "ICMP":
    		newElement = new ICMP();
    		break;
	}
	newElement.newPV();
	/*newElement.setParent(parent);*/
	//parent.getPV().appendChild(newElement.getPV());
	parent.addChild(newElement);
	newElement.setParent(parent);
	parentinations[newElement.getId()]=newElement;
	newElement.setWH(newElement.getPV().offsetWidth,newElement.getPV().offsetHeight);
	if(newElement.getType()!="Packet")newElement.setWHCollap(document.getElementById(newElement.getId()+"collapElement").offsetWidth,document.getElementById(newElement.getId()+"collapElement").offsetHeight);
	return newElement;
}

function createDrop(Id){

	var divDrop = document.createElement("div");

	divDrop.id="Drop"+Id;
	divDrop.setAttribute("class","col-xs-12 drop");

	//divDrop.setAttribute("draggable","true");
	divDrop.addEventListener('dragover', allowDrop, false);
	divDrop.addEventListener('drop',function(e){drop(e,false)}, false);

	return divDrop;
}

function isEmpty(obj) {
  for(var i in obj) { return false; }
  return true;
}


ProtocolDrop.prototype = new Protocol();

Packet.prototype = new ProtocolDrop();

Ethernet.prototype = new ProtocolDrop();

IP.prototype = new ProtocolDrop();

ICMP.prototype = new Protocol();