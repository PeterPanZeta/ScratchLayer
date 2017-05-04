var contElement=1;
var nPack=1;

function PanelPrincipal(PanelPrincipalHTML) {

	this.id="panelPrincipal";
	this.idDrop="panelPrincipal";
	this.typeEther="panelPrincipal";
	this.Children={};
	this.dropable=true;
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

	PanelPrincipal.prototype.isDropable = function() {
		return this.dropable;
	};

	PanelPrincipal.prototype.getPV = function() {
		return this.PV;
	};

	PanelPrincipal.prototype.dropInElemt=function(elemet) {
		return true;
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
	this.dropable=false;
	this.Parent;
	this.width="";
	this.height="";
	this.widthCollap="";
	this.heightCollap="";
	this.collap=false;
	this.chincheta=false;

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

	Protocol.prototype.isChincheta = function(){
		return this.chincheta;
	};

	Protocol.prototype.getIdDrop = function() {
		if(this.dropable){		
			return "Drop"+this.id;
		}
		else{
			return false;
		}
	};

	Protocol.prototype.isCollap=function() {
		return this.collap;
	};

	Protocol.prototype.setId = function(id){
		this.id = id;
	};

	Protocol.prototype.isDropable =function() {
		return this.dropable;
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
		if(this.Parent.getId()!="panelPrincipal")this.Parent.setSizeOrig();
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
		if(this.Parent.getId()!="panelPrincipal"){
			this.Parent.setModSize(this.PV.offsetHeight,this.PV.offsetWidth);
		}
	};

	Protocol.prototype.stop=function(){
		if(this.chincheta){
			//this.PV.setAttribute("draggable","true");
			this.chincheta=false;
		}else{
			//this.PV.setAttribute("draggable","false");
			this.chincheta=true;
		}
	};

}

function ProtocolDrop(type) {


	Protocol.call(this,type,true);

	this.dropable=true;
	this.Children={};
	this.idDrop="";
	this.drop;
	this.heightMod="";
	this.widthMod="";
	this.dropin={};

	ProtocolDrop.prototype.dropInElemt=function(elemet) {
		var patt;
		for(var i in this.dropin) {
			patt = new RegExp(this.dropin[i]);
			if(patt.test(elemet)){
				return true;
			}
		}
  			return false;
	};

	ProtocolDrop.prototype.iniDropWH=function() {
		
		if(this.collap){
			this.drop.style.height = this.PV.offsetHeight-40+"px";
		}else{
			this.drop.style.height = this.PV.offsetHeight-40-this.heightCollap+"px";
		}

		this.drop.style.width = this.PV.offsetWidth-30+"px";
	};

	ProtocolDrop.prototype.addChild = function(Child){
		this.Children[Child.getId()] = Child;
		this.PV.lastChild.lastChild.appendChild(Child.getPV());
	};

	ProtocolDrop.prototype.removeChild = function(Child){
			delete this.Children[Child.getId()];
	};

	ProtocolDrop.prototype.setModSize = function(height,width){
		this.heightMod=this.PV.offsetHeight;
		this.widthMod=this.PV.offsetWidth;

		var widthN = width+37;

		var heightN;
		if(!this.collap){
			heightN= 35+this.heightCollap+height+10;
		}else{
			heightN= 35+height+10;
		}

		this.PV.style.width=widthN+"px";
		this.PV.style.height=heightN+"px";

		this.drop.style.width=width+4+"px";
		this.drop.style.height=height+4+"px";

		if(this.Parent.getId()!="panelPrincipal"){
			this.Parent.setModSize(this.PV.offsetHeight,this.PV.offsetWidth);
		}
	};

	ProtocolDrop.prototype.setModSizePre = function(){
		this.PV.style.width=this.widthMod+"px";
		this.PV.style.height=this.heightMod+"px";
	};

	ProtocolDrop.prototype.setSizeOrig = function(){
		var heightN;

		if(!this.collap){
			heightN=this.height;
		}else{
			heightN=this.height-this.heightCollap;
			
		}
		this.PV.style.width=this.width+"px";
		this.PV.style.height=heightN+"px";
		this.iniDropWH();

		if(this.Parent.getId()!="panelPrincipal"){
			this.Parent.setModSize(this.PV.offsetHeight,this.PV.offsetWidth);
		}

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
		if(this.Parent.getId()!="panelPrincipal"){
			this.Parent.setModSize(this.PV.offsetHeight,this.PV.offsetWidth);
		}
	};

	ProtocolDrop.prototype.remove=function(){
		this.Parent.removeChild(this);
		if(this.Parent.getId()!="panelPrincipal")this.Parent.setSizeOrig();
		for(child in this.Children){
			elemet=this.Children[child];
			elemet.remove();
			delete this.Children[elemet.id]
			delete parentinations[elemet.getId()];
		}
		delete this;
	};
	
}

function Packet(idPack){

	ProtocolDrop.call(this,"Packet",true);
	this.idPack=idPack;

	Packet.prototype.newPV=function() {
		var form = document.createElement("form");

		this.dropin={"Ethernet":"Ethernet","IP":"IP","ARP":"ARP"};

		this.PV = document.createElement("div");
		this.PV.id = "Packetnew"+contElement;
		contElement=contElement+1;
		this.id=this.PV.id;
		//console.log("PUSS "+this.id);

		this.PV.classList.add("PacketNew");

		var header = document.createElement("header");
		header.id="header"+this.id;
		header.classList.add("col-xs-12");
		header.setAttribute("ondragstart", "drag(event)");
		header.setAttribute("onmouseover", "topEleme(this.parentNode)");
		header.setAttribute("draggable","true");
			
		header.innerHTML="<div class='col-xs-3'>Packet:"+idPack+"</div><img id='load"+this.id+"' class='col-xs-1 col-xs-offset-4 load'><a type='button' id='collap' onclick='minimax(this)' class='col-xs-1 mini'><a type='button' id='chincheta' onclick='chincheta(this)' class='col-xs-1 chincheta'><a class='col-xs-1 remove' type='button' id='remove' class='remove' onclick='removeElement(this.parentNode.parentNode)' align-text='center'></a>"

		this.PV.appendChild(header);
		this.PV.innerHTML=this.PV.innerHTML+"</div class='col-xs-12' id='formula'><div>"

		form.id="Form"+this.id
		form.setAttribute("class","form-horizontal col-xs-12");
		form.setAttribute("role","form");
		form.setAttribute("method","post");
		form.setAttribute("onsubmit","SubmitPrin(this,event)");
		form.style.height="100%";
		form.style.width="100%";

		form.innerHTML=" <input type='hidden' name='pk' value="+this.id+"><div class='col-xs-12' id='"+this.id+"collapElement'><div class='form-group col-xs-12'></div> <div class='form-group col-xs-12'><input class='col-xs-5 col-xs-offset-1' type='text' placeholder='NºPaquetes' name='npack'></input><input class='col-xs-3 col-xs-offset-3' type='submit' id='buttonSubmit"+this.id+"' value='Send'></input></div></div>";
		
		this.drop = document.createElement("div");
		this.drop.id="Drop"+this.id;
		this.drop.setAttribute("class","drop");
		this.drop.addEventListener('dragover', allowDrop, false);
		this.drop.addEventListener('dragenter',enter, false);
		this.drop.addEventListener('drop',function(e){drop(e,false)}, false);
		this.idDrop=this.drop.id;
		form.appendChild(this.drop);

		this.PV.lastChild.appendChild(form);
	};

	Packet.prototype.collapse=function(){

		if(isEmpty(this.Children)){
			if(this.collap){
				this.PV.style.height=this.height+"px";
				this.PV.style.width=this.width+"px";
				this.collap=false;
			}
			else{
				//console.log(this.heightCollap);
				this.PV.style.height=35+"px";
				this.PV.style.width=260+"px";
				this.collap=true;
			}
		}else{
			for(child in this.Children){
				elemet=this.Children[child];
				if(this.collap){
					this.PV.style.height=(35+this.heightCollap)+elemet.getPV().offsetHeight+10+"px";
					this.PV.style.width=elemet.getPV().offsetWidth+37+"px";
					this.collap=false;
				}
				else{
					this.PV.style.height=35+"px";
					this.PV.style.width=260+"px";
					this.collap=true;
				}
			}
		}
	};
	Packet.prototype.addChild = function(Child){
		this.Children[Child.getId()] = Child;
		this.PV.lastChild.lastChild.lastChild.appendChild(Child.getPV());
	};
}

function Ethernet() {

	ProtocolDrop.call(this,"Ethernet",true);

	Ethernet.prototype.newPV=function() {

		this.dropin={"IP":"IP","ARP":"ARP"};
		this.PV = document.createElement("div");
		this.PV.id = "Ethernetnew"+contElement;
		contElement=contElement+1;
		this.id=this.PV.id;

		this.PV.classList.add("EthernetNew");
		//this.PV.setAttribute("draggable","false");
		//this.PV.addEventListener('dragstart', drag, false);
		//this.PV.addEventListener('dragenter', enter, false);

		var header = document.createElement("header");
		header.id="header"+this.id;
		header.classList.add("col-xs-12");
		header.setAttribute("ondragstart", "drag(event)");
		header.setAttribute("onmouseover", "topEleme(this.parentNode)");
		header.setAttribute("draggable","true");
			
		header.innerHTML="<div class='col-xs-3'>Ethernet</div> <input type='hidden' name='Ether' value='True'><a type='button' id='collap' data-toggle='collapse' data-target='#"+this.id+"collap' onclick='collapseElement(this)' class='col-xs-1 col-xs-offset-5 collap'><a type='button' id='chincheta' onclick='chincheta(this)' class='col-xs-1 chincheta'><input type='hidden' name='Ether' value='True'><a class='col-xs-1 remove' type='button' id='remove' onclick='removeElement(this.parentNode.parentNode)' align-text='center'></a>";

		this.PV.appendChild(header);
		this.PV.innerHTML=this.PV.innerHTML+"<div class='collapse in' id='"+this.id+"collap'><div class='col-xs-12' id='"+this.id+"collapElement'><div class='form-group col-xs-12'></div><div class='form-group col-xs-12'><input class='col-xs-5' type='text' name='srcEther' placeholder='src'></input><input class='col-xs-5' type='text' name='dstEther' placeholder='dst'></input><input class='col-xs-2' type='text' name='typeEther' placeholder='type'></input></div></div></div>";

		var drop = createDrop(this.id)
		
		this.PV.appendChild(drop);
		this.drop=drop.firstChild;
		this.idDrop=this.drop.id;
	};

}

function ARP() {

	Protocol.call(this,"ARP",true);

	ARP.prototype.newPV=function() {

		this.PV = document.createElement("div");
		this.PV.id = "ARPnew"+contElement;
		contElement=contElement+1;
		this.id=this.PV.id;

		var header = document.createElement("header");
		header.id="header"+this.id;
		header.classList.add("col-xs-12");
		header.setAttribute("ondragstart", "drag(event)");
		header.setAttribute("onmouseover", "topEleme(this.parentNode)");
		header.setAttribute("draggable","true");
		header.innerHTML="<div class='col-xs-3'>ARP</div><a type='button' id='collap' data-toggle='collapse' data-target='#"+this.id+"collap' onclick='collapseElement(this)' class='col-xs-1 col-xs-offset-5 collap'> <a type='button' id='chincheta' onclick='chincheta(this)' class='col-xs-1 chincheta'> <input type='hidden' name='ARP' value='True'><a class='col-xs-1 remove' type='button' id='remove' class='remove' onclick='removeElement(this.parentNode.parentNode)' align-text='center'></a>"

		this.PV.classList.add("ARPNew");
		this.PV.appendChild(header);
		this.PV.innerHTML=this.PV.innerHTML+"<div class='collapse in' id='"+this.id+"collap'><div class='col-xs-12' id='"+this.id+"collapElement'><div class='form-group col-xs-12'></div><div class='form-group col-xs-12'><input class='col-xs-6' type='text' name='hwtyARP' placeholder='T HARDWARE'></input><input class='col-xs-6' type='text' name='ptyARP' placeholder='T PROTOCOL'></input></div><div class='form-group col-xs-12'><input class='col-xs-3' type='text' name='hwlenARP' placeholder='HLEN'></input><input class='col-xs-3' type='text' name='plenARP' placeholder='PLEN'></input><input class='col-xs-6' type='text' name='opARP' placeholder='OPERACION'></input></div><div class='form-group col-xs-12'><input class='col-xs-6' type='text' name='hwsrcARP' placeholder='HW src'></input><input class='col-xs-6' type='text' name='psrcARP' placeholder='IP src'></input></div><div class='form-group col-xs-12'><input class='col-xs-6' type='text' name='hwdstARP' placeholder='HW dst'></input><input class='col-xs-6' type='text' name='pdstARP' placeholder='IP dst'></input></div></div></div>"
	};
}

function IP() {

	ProtocolDrop.call(this,"IP",true);

	IP.prototype.newPV=function() {

		this.dropin={"ICMP":"ICMP","TCP":"TCP","UDP":"UDP"};

		this.PV = document.createElement("div");
		this.PV.id = "IPnew"+contElement;
		contElement=contElement+1;
		this.id=this.PV.id;

		var header = document.createElement("header");
		header.id="header"+this.id;
		header.classList.add("col-xs-12");
		header.setAttribute("ondragstart", "drag(event)");
		header.setAttribute("onmouseover", "topEleme(this.parentNode)");
		header.setAttribute("draggable","true");
		header.innerHTML="<div class='col-xs-3'>IP</div><a type='button' id='collap' data-toggle='collapse' data-target='#"+this.id+"collap' onclick='collapseElement(this)' class='col-xs-1 col-xs-offset-5 collap'><a type='button' id='chincheta' onclick='chincheta(this)' class='col-xs-1 chincheta'>  <input type='hidden' name='IP' value='True'><a class='col-xs-1 remove' type='button' id='remove' class='remove' onclick='removeElement(this.parentNode.parentNode)' align-text='center'></a>"
		
		this.PV.classList.add("IPNew");
		this.PV.appendChild(header);
		this.PV.innerHTML=this.PV.innerHTML+"<div class='collapse in' id='"+this.id+"collap'><div class='col-xs-12' id='"+this.id+"collapElement'><div class='form-group col-xs-12'></div><div class='form-group col-xs-12'><input class='col-xs-2' type='text' name='VERIP' placeholder='VER'></input><input class='col-xs-3' type='text' name='HLENIP' placeholder='HLEN'></input><input class='col-xs-3' type='text' name='SERVIP' placeholder='T.Servicio'></input><input class='col-xs-4' type='text' name='LOGIP' placeholder='Longitud'></input></div><div class='form-group col-xs-12'><input class='col-xs-4' type='text' name='IdenIP' placeholder='Identificacion'></input><input class='col-xs-4' type='text' name='FlagsIP' placeholder='Flags'></input><input class='col-xs-4' type='text' name='OffFraIP' placeholder='Offset Frag'></input></div><div class='form-group col-xs-12'><input class='col-xs-3' type='text' name='TTLIP' placeholder='TTL'></input><input class='col-xs-4' type='text' name='ProIP' placeholder='Protocolo'></input><input class='col-xs-5' type='text' name='CheckIP' placeholder='Checksum'></input></div><div class='form-group col-xs-12'><input class='col-xs-4' type='text' name='srcIP' placeholder='src'></input><input class='col-xs-4' type='text' name='dstIP' placeholder='dst'></input><input class='col-xs-4' type='text' name='OpcionesIP' placeholder='Opciones'></input></div></div></div>"

		var drop = createDrop(this.id)
		
		this.PV.appendChild(drop);
		this.drop=drop.firstChild;
		this.idDrop=this.drop.id;
	};

}

function ICMP() {

	Protocol.call(this,"ICMP",true);

	ICMP.prototype.newPV=function() {

		this.PV = document.createElement("div");
		this.PV.id = "ICMPnew"+contElement;
		contElement=contElement+1;
		this.id=this.PV.id;

		var header = document.createElement("header");
		header.id="header"+this.id;
		header.classList.add("col-xs-12");
		header.setAttribute("ondragstart", "drag(event)");
		header.setAttribute("onmouseover", "topEleme(this.parentNode)");
		header.setAttribute("draggable","true");
		header.innerHTML="<div class='col-xs-3'>ICMP</div><a type='button' id='collap' data-toggle='collapse' data-target='#"+this.id+"collap' onclick='collapseElement(this)' class='col-xs-1 col-xs-offset-5 collap'> <a type='button' id='chincheta' onclick='chincheta(this)' class='col-xs-1 chincheta'> <input type='hidden' name='ICMP' value='True'><a class='col-xs-1 remove' type='button' id='remove' class='remove' onclick='removeElement(this.parentNode.parentNode)' align-text='center'></a>"

		this.PV.classList.add("ICMPNew");
		this.PV.appendChild(header);
		this.PV.innerHTML=this.PV.innerHTML+"<div class='collapse in' id='"+this.id+"collap'><div class='col-xs-12' id='"+this.id+"collapElement'><div class='form-group col-xs-12'></div><div class='form-group col-xs-12'><input class='col-xs-3' type='text' name='typeICMP' placeholder='Type'></input><input class='col-xs-3' type='text' name='codeICMP' placeholder='CODE'></input><input class='col-xs-6' type='text' name='checkICMP' placeholder='Checksum'></input></div><div class='form-group col-xs-12'><input class='col-xs-6' type='text' name='idenICMP' placeholder='Iden'></input><input class='col-xs-6' type='text' name='nseqICMP' placeholder='N seq'></input></div><div class='form-group col-xs-12'><input class='col-xs-4' type='text' name='tsoriICMP' placeholder='TStamp Ori'></input><input class='col-xs-4' type='text' name='tsrxICMP' placeholder='TStamp Rv'></input><input class='col-xs-4' type='text' name='tstxICMP' placeholder='TStamp Trans'></input></div><div class='form-group col-xs-12'><input class='col-xs-12' type='text' name='addrmaskICMP' placeholder='Dic Mascara'></input></div></div></div>"
	};
}

function TCP() {

	ProtocolDrop.call(this,"TCP",true);

	TCP.prototype.newPV=function() {

		this.dropin={"DATA":"DATA"};

		this.PV = document.createElement("div");
		this.PV.id = "TCPnew"+contElement;
		contElement=contElement+1;
		this.id=this.PV.id;

		var header = document.createElement("header");
		header.id="header"+this.id;
		header.classList.add("col-xs-12");
		header.setAttribute("ondragstart", "drag(event)");
		header.setAttribute("onmouseover", "topEleme(this.parentNode)");
		header.setAttribute("draggable","true");
		header.innerHTML="<div class='col-xs-3'>TCP</div><a type='button' id='collap' data-toggle='collapse' data-target='#"+this.id+"collap' onclick='collapseElement(this)' class='col-xs-1 col-xs-offset-5 collap'><a type='button' id='chincheta' onclick='chincheta(this)' class='col-xs-1 chincheta'>  <input type='hidden' name='TCP' value='True'><a class='col-xs-1 remove' type='button' id='remove' class='remove' onclick='removeElement(this.parentNode.parentNode)' align-text='center'></a>"
		
		this.PV.classList.add("TCPNew");
		this.PV.appendChild(header);
		this.PV.innerHTML=this.PV.innerHTML+"<div class='collapse in' id='"+this.id+"collap'><div class='col-xs-12' id='"+this.id+"collapElement'><div class='form-group col-xs-12'></div><div class='form-group col-xs-12'><input class='col-xs-6' type='text' name='srcportTCP' placeholder='Port src'></input><input class='col-xs-6' type='text' name='dstportTCP' placeholder='Port dst'></input></input></div><div class='form-group col-xs-12'><input class='col-xs-12' type='text' name='sequennTCP' placeholder='N Sequence'></div><div class='form-group col-xs-12'><input class='col-xs-12' type='text' name='ackTCP' placeholder='N ACK'></input></div><div class='form-group col-xs-12'><input class='col-xs-3' type='text' name='offsetTCP' placeholder='Offset'></input><input class='col-xs-2' type='text' name='reserdTCP' placeholder='Rvd'></input><input class='col-xs-3' type='text' name='flagTCP' placeholder='Flag'></input><input class='col-xs-4' type='text' name='windTCP' placeholder='Windows'></input></div><div class='form-group col-xs-12'><input class='col-xs-4' type='text' name='checkTCP' placeholder='Checksum'></input><input class='col-xs-4' type='text' name='urgpoTCP' placeholder='UrgentPoin'></input><input class='col-xs-4' type='text' name='OpTCP' placeholder='Options'></input></div></div></div>"

		var drop = createDrop(this.id)
		
		this.PV.appendChild(drop);
		this.drop=drop.firstChild;
		this.idDrop=this.drop.id;
	};

}

function UDP() {

	ProtocolDrop.call(this,"UDP",true);

	UDP.prototype.newPV=function() {

		this.dropin={"DATA":"DATA","RIP":"RIP"};

		this.PV = document.createElement("div");
		this.PV.id = "UDPnew"+contElement;
		contElement=contElement+1;
		this.id=this.PV.id;

		var header = document.createElement("header");
		header.id="header"+this.id;
		header.classList.add("col-xs-12");
		header.setAttribute("ondragstart", "drag(event)");
		header.setAttribute("onmouseover", "topEleme(this.parentNode)");
		header.setAttribute("draggable","true");
		header.innerHTML="<div class='col-xs-3'>UDP</div><a type='button' id='collap' data-toggle='collapse' data-target='#"+this.id+"collap' onclick='collapseElement(this)' class='col-xs-1 col-xs-offset-5 collap'><a type='button' id='chincheta' onclick='chincheta(this)' class='col-xs-1 chincheta'>  <input type='hidden' name='UDP' value='True'><a class='col-xs-1 remove' type='button' id='remove' class='remove' onclick='removeElement(this.parentNode.parentNode)' align-text='center'></a>"
		
		this.PV.classList.add("UDPNew");
		this.PV.appendChild(header);
		this.PV.innerHTML=this.PV.innerHTML+"<div class='collapse in' id='"+this.id+"collap'><div class='col-xs-12' id='"+this.id+"collapElement'><div class='form-group col-xs-12'></div><div class='form-group col-xs-12'><input class='col-xs-6' type='text' name='sportUDP' placeholder='Port src'></input><input class='col-xs-6' type='text' name='dport' placeholder='Port dst'></input></div><div class='form-group col-xs-12'><input class='col-xs-6' type='text' name='lenUDP' placeholder='LENG'></input><input class='col-xs-6' type='text' name='checkUDP' placeholder='Checksum'></input></div></div></div>"

		var drop = createDrop(this.id)
		
		this.PV.appendChild(drop);
		this.drop=drop.firstChild;
		this.idDrop=this.drop.id;
	};

}

function RIP() {

	ProtocolDrop.call(this,"RIP",true);

	RIP.prototype.newPV=function() {

		this.dropin={"DATARIP":"DATARIP"};

		this.PV = document.createElement("div");
		this.PV.id = "RIPnew"+contElement;
		contElement=contElement+1;
		this.id=this.PV.id;

		var header = document.createElement("header");
		header.id="header"+this.id;
		header.classList.add("col-xs-12");
		header.setAttribute("ondragstart", "drag(event)");
		header.setAttribute("onmouseover", "topEleme(this.parentNode)");
		header.setAttribute("draggable","true");
		header.innerHTML="<div class='col-xs-3'>RIP</div><a type='button' id='collap' data-toggle='collapse' data-target='#"+this.id+"collap' onclick='collapseElement(this)' class='col-xs-1 col-xs-offset-5 collap'><a type='button' id='chincheta' onclick='chincheta(this)' class='col-xs-1 chincheta'>  <input type='hidden' name='RIP' value='True'><a class='col-xs-1 remove' type='button' id='remove' class='remove' onclick='removeElement(this.parentNode.parentNode)' align-text='center'></a>"
		
		this.PV.classList.add("RIPNew");
		this.PV.appendChild(header);
		this.PV.innerHTML=this.PV.innerHTML+"<div class='collapse in' id='"+this.id+"collap'><div class='col-xs-12' id='"+this.id+"collapElement'><div class='form-group col-xs-12'></div><div class='form-group col-xs-12'><input class='col-xs-6' type='text' name='cmdRIP' placeholder='Command'></input><input class='col-xs-6' type='text' name='verRIP' placeholder='Version'></input></div></div></div>"

		var drop = createDrop(this.id)
		
		this.PV.appendChild(drop);
		this.drop=drop.firstChild;
		this.idDrop=this.drop.id;
	};

}


function createElement(idSrt,parent) {
	var newElement;
	
	//console.log(idSrt);
	//console.log(parent);
	switch(idSrt.split("/")[0]) {
		case "Packet":
			
			if(idSrt.split("/")[1]!=undefined){
				console.log(idSrt);
				console.log(idSrt.split("/")[1]);
				newElement = new Packet(idSrt.split("/")[1]);
			}
			else{
				newElement = new Packet(nPack);
				nPack=nPack+1;
			}
			break;
    	case "Ethernet":
    		newElement = new Ethernet();
    		break;
    	case "ARP":
    		newElement = new ARP();
    		break;
    	case "IP":
    		newElement = new IP();
    		break;
    	case "ICMP":
    		newElement = new ICMP();
    		break;
    	case "TCP":
    		newElement = new TCP();
    		break;
    	case "UDP":
    		newElement = new UDP();
    		break;
    	case "RIP":
    		newElement = new RIP();
    		break;
	}
	newElement.newPV();
	/*newElement.setParent(parent);*/
	//parent.getPV().appendChild(newElement.getPV());
	parent.addChild(newElement);
	//console.log(findObj(parent.id));
	newElement.setParent(parent);
	parentinations[newElement.getId()]=newElement;
	newElement.setWH(newElement.getPV().offsetWidth,newElement.getPV().offsetHeight);
	newElement.setWHCollap(document.getElementById(newElement.getId()+"collapElement").offsetWidth,document.getElementById(newElement.getId()+"collapElement").offsetHeight);
	if(newElement.isDropable())newElement.iniDropWH();
	if(parent.getId()!="panelPrincipal")parent.setModSize(newElement.getPV().offsetHeight,newElement.getPV().offsetWidth);
	return newElement;
}

function createDrop(Id){

	var divDrop = document.createElement("div");
	var divDropVis = document.createElement("div");
	divDropVis.id="Drop"+Id;
	divDrop.setAttribute("class","col-xs-12");
	divDropVis.setAttribute("class","drop");
	//divDrop.setAttribute("draggable","true");
	divDropVis.addEventListener('dragover', allowDrop, false);
	divDropVis.addEventListener('dragenter',enter, false);
	divDropVis.addEventListener('drop',function(e){drop(e,false)}, false);
	divDrop.appendChild(divDropVis);

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

TCP.prototype = new ProtocolDrop();

UDP.prototype = new ProtocolDrop();

ICMP.prototype = new Protocol();

RIP.prototype = new ProtocolDrop();

ARP.prototype = new Protocol();