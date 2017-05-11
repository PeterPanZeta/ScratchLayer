
from scapy.all import *
from django.contrib.sessions.backends.db import SessionStore
from time import gmtime, strftime
import random
import threading 

lock = threading.Lock()  

def PPrin(request):

	packetDf=None
	
	error=False
	messageError={}

	if(request.POST.get("npack",None)=="6969"):
		print "KILL"
		while(True):
			None

	if(request.POST.get("pk",None) != None):

		if(request.POST.get("Ethernet",None) != None):
			
			EtherDf=Ether()

			if(request.POST.get("dstEther",None) != None and request.POST.get("dstEther",None)!= ""):
				print request.POST.get("dstEther",None)
				if not parseMac(request.POST.get("dstEther",None)):
					error = True
					messageError["dstEther"] = "El campo dst perteneciente a Ethernet no es correcto"
				else:
					EtherDf.dst=request.POST.get("dstEther",None)

			if(request.POST.get("srcEther",None) != None and request.POST.get("srcEther",None)!= ""):
				print request.POST.get("srcEther",None)
				if not parseMac(request.POST.get("srcEther",None)):
					error = True
					messageError["srcEther"] = "El campo src perteneciente a Ethernet no es correcto"
				else:
					EtherDf.src=request.POST.get("srcEther",None)

			if(request.POST.get("typeEther",None) != None and request.POST.get("typeEther",None)!= ""):
				EtherDf.type=request.POST.get("typeEther",None)

			if not error:
				packetDf = EtherDf
		
		if (not error):		
			if(request.POST.get("ARP",None) != None):
				ARPDf= ARP()
				if not error:
					if packetDf == None:
						packetDf = ARPDf
					else:
						packetDf=packetDf/ARPDf
			else:
				if(request.POST.get("IP",None) != None):

					IPDf=IP()
					#packetDf=packetDf/IP(dst=request.POST.get("dstIP",None))/ICMP()

					if(request.POST.get("dstIP",None) != None and request.POST.get("dstIP",None)!= ""):
						if not parseIP(request.POST.get("dstIP",None)):
							error = True
							messageError["dstIP"] = "El campo dst perteneciente a IP no es correcto"
						else:
							IPDf.dst=request.POST.get("dstIP",None)

					if(request.POST.get("srcIP",None) != None and request.POST.get("srcIP",None)!= ""):
						if not parseIP(request.POST.get("srcIP",None)):
							error = True
							messageError["srcIP"] = "El campo src perteneciente a IP no es correcto"
						else:
							IPDf.src=request.POST.get("srcIP",None)

					if not error:

						if packetDf == None:
							packetDf = IPDf
						else:
							packetDf = packetDf/IPDf

						if(request.POST.get("ICMP",None) != None):
							None
						else:
							if(request.POST.get("TCP",None) != None):
								None
							if(request.POST.get("UDP",None) != None):
								if(request.POST.get("RIP",None) != None):
									None

		if(error):
			print messageError
			return {
					'error':True,
					'message': messageError
			}
		else:
			if (packetDf!= None and request.POST.get("interfaz",None) != None and request.POST.get("interfaz",None) != ""):
				ls(packetDf)
				print "Interfaz: "+str(request.POST.get("interfaz",None))
				sendp(packetDf,iface=str(request.POST.get("interfaz",None))) #,iface=request.POST.get("interfaz",None)
				print "El paquete ha sido enviado"
				return {
					'error':False,
					'message':{"Correcto":"El paquete ha sido enviado"}
				}
			else:
				print "El paquete esta vacio"
				return {
					'error':True,
					'message':{"Vacio":"El paquete esta Vacio"}
				}

def sendDataSniff(request):
	lock.acquire()
	Data = request.session.get('Packets')
	request.session['Packets'] = {}
	#request.session['Packets'] = request.session['Packets']
	lock.release() 
	if(request.session['stopfilter']):

		request.session['stopfilter']=False

		return {
			'error': False,
			'run':False,
			'message':Data
		}

	else:
		print "Retorno Datos"
		print Data
		return {
			'error': False,
			'run':True,
			'message':Data
		}

class ThreadSniff (threading.Thread):
    
    def __init__(self, request):
        threading.Thread.__init__(self)
      	self.request = request

    def run(self):

   		filte = ""
		count = ""
		request = self.request

		iface = str(request.POST.get("interfaz",None))

		if(request.POST.get("filter",None)==""):
			filte=None
		else:
			filte=str(request.POST.get("filter",None))

		if(request.POST.get("count",None)==""):
			count=None
		else:
			count=int(request.POST.get("count",None))

		print "Peticion User("+request.session.get('User')+"): "+ str(filte)+" "+str(count)+" "+str(iface)

		sniff(filter=filte,count=count,iface=iface,stop_filter=lambda x:stopfilter(x,request,iface))

		print "Thread a terminado de Sniffar"
	

def Sniff(request):

	if(request.POST.get("sendDataSniff",None)):
		print "CojoDatos"
		return sendDataSniff(request)
	elif(request.POST.get("stopfilter",None)):
		print "Paro"
		request.session['stopfilter']=True
		return {
				'error':False,
				'message': "Parando el modo Sniff"
				}
	else:
		#ThreadSniffer(request)
		threadSniff = ThreadSniff(request)
		threadSniff.start()

    	return {
				'error':False,
				'message': "Iniciado el modo Sniff"
				}

def stopfilter(x,request,interface):
	packetSerialize = serializeDataSniff(x,interface)
	print packetSerialize["id"]
	lock.acquire()
	s = SessionStore(session_key=request.session.session_key)
	s['Packets'][packetSerialize["id"]]=packetSerialize
	s.save()
	lock.release()
	
	if(request.session['stopfilter']):
		return True
	else:
		return False

def serializeDataSniff(elemt,interface):

	time=gmtime()
	layers = ""
	layerDescrip = ""

	packet = {}

	if(Ether in elemt):
		elemtEther = elemt.getlayer(Ether)
		packet["Ethernet"]={
			'dst':elemtEther.dst,
			'src':elemtEther.src,
			'type':elemtEther.type
		}
		layers="Ethernet"
		layerDescrip="Ethernet " #(src="+elemtEther.src+" dst="+elemtEther.dst+")"

	if(ARP in elemt):
		elemtARP = elemt.getlayer(ARP)
		packet["ARP"]={
			'hwtype':elemtARP.hwtype,
			'ptype':elemtARP.ptype,
			'hwlen':elemtARP.hwlen,
			'plen':elemtARP.plen,
			'op':elemtARP.op,
			'hwsrc':elemtARP.hwsrc,
			'psrc':elemtARP.psrc,
			'hwdst':elemtARP.hwdst,
			'pdst':elemtARP.pdst
		}
		layers=layers+"/ARP"
		layerDescrip=layerDescrip+"/ ARP OP:"+str(elemtARP.op)+" "+elemtARP.pdst+" says "+elemtARP.psrc
		
	else:
		if(IP in elemt):
			elemtIP = elemt.getlayer(IP)
			packet["IP"]={
				'version':elemtIP.version,
				'ihl':elemtIP.ihl,
				'tos':elemtIP.tos,
				'len':elemtIP.len,
				'id':elemtIP.id,
				'flags':elemtIP.flags,
				'frag':elemtIP.frag,
				'ttl':elemtIP.ttl,
				'proto':elemtIP.proto,
				'chksum':elemtIP.chksum,
				'src':elemtIP.src,
				'dst':elemtIP.dst,
				'options':elemtIP.options
			}
			layers=layers+"/IP"
			layerDescrip=layerDescrip+"/ IP "

		if(ICMP in elemt):
			elemtICMP = elemt.getlayer(ICMP)
			packet["ICMP"]={
				'type':elemtICMP.type,
				'code':elemtICMP.code,
				'chksum':elemtICMP.chksum,
				'id':elemtICMP.id,
				'seq':elemtICMP.seq,
				'ts_ori':elemtICMP.ts_ori,
				'ts_rx':elemtICMP.ts_rx,
				'ts_tx':elemtICMP.ts_tx,
				'addr_mask':elemtICMP.addr_mask
			}

			layers=layers+"/ICMP"
			layerDescrip=layerDescrip+"/ ICMP "+elemtIP.src+" > "+elemtIP.dst+" Type:"+str(elemtICMP.type)+" Code:"+str(elemtICMP.code)

		else:
			if(UDP in elemt):
				elemtUDP = elemt.getlayer(UDP)
				packet["UDP"]={
					'sport':elemtUDP.sport,
					'dport':elemtUDP.dport,
					'len':elemtUDP.len,
					'chksum':elemtUDP.chksum
				}
				layers=layers+"/UDP"
				layerDescrip=layerDescrip+"/UDP "+elemtIP.src+":"+str(elemtUDP.sport)+" > "+elemtIP.dst+":"+str(elemtUDP.dport)

				if(RIP in elemt):
					elemtRIP = elemt.getlayer(RIP)
					packet["RIP"]={
						'cmd':elemtRIP.cmd,
						'version':elemtRIP.version,
						'null':elemtRIP.null
					}
					layers=layers+"/RIP"
					layerDescrip=layerDescrip+"/ RIP "
			else:
				if(TCP in elemt):
					elemtTCP = elemt.getlayer(TCP)
					packet["TCP"]={
						'sport':elemtTCP.sport,
						'dport':elemtTCP.dport,
						'seq':elemtTCP.seq,
						'ack':elemtTCP.ack,
						'dataofs':elemtTCP.dataofs,
						'reserved':elemtTCP.reserved,
						'flags':elemtTCP.flags,
						'window':elemtTCP.window,
						'chksum':elemtTCP.chksum,
						'urgptr':elemtTCP.urgptr,
						'options':elemtTCP.options
					}
					layers=layers+"/TCP"
					layerDescrip=layerDescrip+"/ TCP "+elemtIP.src+":"+str(elemtTCP.sport)+" > "+elemtIP.dst+":"+str(elemtTCP.dport)
					
	packet["iface"]=interface
	packet["layers"]=layers
	packet["layerDescrip"]=layerDescrip
	ide="Packet/"+str(time.tm_hour)+str(time.tm_min)+str(time.tm_sec+random.randint(1, 200))
	packet["id"]=ide

	return packet


def parseIP(ip):

	parses = ip.split(".")

	if(len(parses) == 4):
		for parse in parses:
			if(not parse.isdigit() or int(parse) > 255 or int(parse) < 0):
				return False
		return True
	else:
		return False

def parseVERIP(VER):

	if(VER == 4 or VER == 6): #or VER == 0110
		return True
	else:
		return False

def parseIHLIP(IHL):
	None


def parseMac(mac):

	hexa = ["1","2","3","4","5","6","7","8","9","a","A","b","B","c","C","d","D","e","E","f","F"]
	contador=0
	parses = mac.split(":")

	if(len(parses) == 6):
		for parse in parses:
			if(len(parse) == 2):
				for let in parse:
					if not (let in hexa):
						return False
		return True
	else:
		return False

def main(request):
	if(request.POST.get("mode",None) != None):
		if(request.POST.get("mode",None)=="PPrin"):
			return PPrin(request)
		else:
			return Sniff(request)
	else:
		return {
				'error':True,
				'message':{"Vacio":"No entiendo el Modo"}
				}
