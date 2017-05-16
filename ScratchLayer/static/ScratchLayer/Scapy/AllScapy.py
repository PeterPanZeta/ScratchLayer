
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
	print request.POST.get("DATA",None)
	if(request.POST.get("pk",None) != None):

		if(request.POST.get("Ethernet",None) != None):
			
			EtherDf=Ether()

			if(request.POST.get("dstEther","")!= ""):
				print request.POST.get("dstEther",None)
				if not parseMac(request.POST.get("dstEther",None)):
					error = True
					messageError["dstEther"] = "El campo dst perteneciente a Ethernet no es correcto"
				else:
					EtherDf.dst=request.POST.get("dstEther",None)

			if(request.POST.get("srcEther","")!= ""):
				print request.POST.get("srcEther",None)
				if not parseMac(request.POST.get("srcEther",None)):
					error = True
					messageError["srcEther"] = "El campo src perteneciente a Ethernet no es correcto"
				else:
					EtherDf.src=request.POST.get("srcEther",None)

			if(request.POST.get("typeEther","")!= ""):
				EtherDf.type=int(request.POST.get("typeEther",None))

			if not error:
				packetDf = EtherDf
		
		if (not error):		
			if(request.POST.get("ARP","") != ""):
				ARPDf= ARP()
				if(request.POST.get("hwlenARP","") != ""):
					ARPDf.hwlen=int(request.POST.get("hwlenARP",""))

				if(request.POST.get("plenARP","") != ""):
					ARPDf.plen=int(request.POST.get("plenARP",""))

				if(request.POST.get("opARP","") != ""):
					ARPDf.op=int(request.POST.get("opARP",""))

				if(request.POST.get("hwtyARP","") != ""):
					ARPDf.hwtype=int(request.POST.get("hwtyARP",""))

				if(request.POST.get("ptyARP","") != ""):
					ARPDf.ptype=int(request.POST.get("ptyARP",""))

				if(request.POST.get("hwsrcARP","") != ""):
					if not parseMac(request.POST.get("hwsrcARP","")):
						error = True
						messageError["hwsrcARP"] = "El campo HW src perteneciente a ARP no es correcto"
					else:
						ARPDf.hwsrc=request.POST.get("hwsrcARP","")

				if(request.POST.get("psrcARP","") != ""):

					if not parseIP(request.POST.get("psrcARP","")):
							error = True
							messageError["psrcARP"] = "El campo IP src perteneciente a ARP no es correcto"
					else:
							ARPDf.psrc=request.POST.get("psrcARP","")

				if(request.POST.get("hwdstARP","") != ""):
					if not parseMac(request.POST.get("hwdstARP","")):
						error = True
						messageError["hwdstARP"] = "El campo HW dst perteneciente a ARP no es correcto"
					else:
						ARPDf.hwdst=request.POST.get("hwdstARP","")

				if(request.POST.get("pdstARP","") != ""):
					
					if not parseIP(request.POST.get("pdstARP","")):
							error = True
							messageError["pdstARP"] = "El campo IP dst perteneciente a ARP no es correcto"
					else:
							ARPDf.psrc=request.POST.get("pdstARP","")

				if not error:
					if packetDf == None:
						packetDf = ARPDf
					else:
						packetDf=packetDf/ARPDf
			else:
				if(request.POST.get("IP",None) != None):

					IPDf=IP()

					if(request.POST.get("VERIP","") != ""):
						IPDf.version=int(request.POST.get("VERIP",""))

					if(request.POST.get("HLENIP","") != ""):
						IPDf.ihl=int(request.POST.get("HLENIP",""))

					if(request.POST.get("SERIP","") != ""):
						IPDf.tos=int(request.POST.get("SERIP",""))

					if(request.POST.get("LOGIP","") != ""):
						IPDf.len=int(request.POST.get("LOGIP",""))

					if(request.POST.get("IdenIP","") != ""):
						IPDf.id=int(request.POST.get("IdenIP",""))

					if(request.POST.get("OffFraIP","") != ""):
						IPDf.frag=int(request.POST.get("OffFraIP",""))

					if(request.POST.get("FlagsIP","") != ""):
						IPDf.flags=int(request.POST.get("FlagsIP",""))

					if(request.POST.get("TTLIP","") != ""):
						IPDf.ttl=int(request.POST.get("TTLIP",""))

					if(request.POST.get("ProIP","") != ""):
						IPDf.proto=int(request.POST.get("ProIP",""))

					if(request.POST.get("CheckIP","") != ""):
						IPDf.chksum=int(request.POST.get("CheckIP",""))
					
					if(request.POST.get("OpcionesIP","") != ""):
						None #IPDf.options=request.POST.get("OpcionesIP","")

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

							ICMPDf = ICMP()

							if(request.POST.get("typeICMP","") != ""):
								ICMPDf.type=int(request.POST.get("typeICMP",""))

							if(request.POST.get("codeICMP","") != ""):
								ICMPDf.code=int(request.POST.get("codeICMP",""))

							if(request.POST.get("checkICMP","") != ""):
								ICMPDf.chksum=int(request.POST.get("checkICMP",""))

							if(request.POST.get("tsoriICMP","") != ""):
								ICMPDf.ts_ori=int(request.POST.get("tsoriICMP",""))

							if(request.POST.get("tsrxICMP","") != ""):
								ICMPDf.ts_rx=int(request.POST.get("tsrxICMP",""))

							if(request.POST.get("tstxICMP","") != ""):
								ICMPDf.ts_tx=int(request.POST.get("tstxICMP",""))

							if(request.POST.get("idenICMP","") != ""):
								ICMPDf.id=int(request.POST.get("idenICMP",""))

							if(request.POST.get("nseqICMP","") != ""):
								ICMPDf.seq=int(request.POST.get("nseqICMP",""))

							if(request.POST.get("addrmaskICMP","") != ""):
								ICMPDf.addr_mask=request.POST.get("addrmaskICMP","")

							if not error:
								packetDf = packetDf/ICMPDf

						else:
							
							if(request.POST.get("TCP",None) != None):
								
								TCPDf=TCP()

								if(request.POST.get("srcportTCP","") != ""):
									TCPDf.sport=int(request.POST.get("srcportTCP",""))

								if(request.POST.get("dstportTCP","") != ""):
									TCPDf.dport=int(request.POST.get("dstportTCP",""))

								if(request.POST.get("sequennTCP","") != ""):
									TCPDf.seq=int(request.POST.get("sequennTCP",""))

								if(request.POST.get("ackTCP","") != ""):
									TCPDf.ack=int(request.POST.get("ackTCP",""))

								if(request.POST.get("offsetTCP","") != ""):
									TCPDf.dataofs=int(request.POST.get("offsetTCP",""))

								if(request.POST.get("reserdTCP","") != ""):
									TCPDf.reserved=int(request.POST.get("reserdTCP",""))

								if(request.POST.get("flagTCP","") != ""):
									TCPDf.flags=int(request.POST.get("flagTCP",""))

								if(request.POST.get("windTCP","") != ""):
									TCPDf.window=int(request.POST.get("windTCP",""))

								if(request.POST.get("checkTCP","") != ""):
									TCPDf.chksum=int(request.POST.get("checkTCP",""))

								if(request.POST.get("urgpoTCP","") != ""):
									TCPDf.urgptr=int(request.POST.get("urgpoTCP",""))

								if(request.POST.get("OpTCP","") != ""):
									None #TCPDf.options=request.POST.get("OpTCP","")

								if not error:
									packetDf = packetDf/TCPDf

							else:
								if(request.POST.get("UDP",None) != None):

									UDPDf=UDP()
									if(request.POST.get("sportUDP","") != ""):
										UDPDf.sport=request.POST.get("sportUDP","")
									
									if(request.POST.get("dportUDP","") != ""):
										UDPDf.dport=request.POST.get("dportUDP","")

									if(request.POST.get("lenUDP","") != ""):
										UDPDf.len=request.POST.get("lenUDP","")
									
									if(request.POST.get("checkUDP","") != ""):
										UDPDf.chksum=request.POST.get("checkUDP","")

									if not error:
										packetDf = packetDf/UDPDf

										if(request.POST.get("RIP",None) != None):
											RIPDf=RIP()

											if(request.POST.get("checkRIP","") != ""):
												RIPDf.cmd=request.POST.get("cmdRIP","")
											
											if(request.POST.get("checkRIP","") != ""):
												RIPDf.version=request.POST.get("verRIP","")
		
											if not error:
												packetDf = packetDf/RIPDf
		if(error):
			print messageError
			return {
					'error':True,
					'message': messageError
			}
		else:
			if (packetDf!= None and request.POST.get("interfaz","") != ""):
				if(request.POST.get("recur","") != "" and request.POST.get("recur","")):
					print "Interfaz: "+str(request.POST.get("interfaz",None))
					Data = serializeDataSniff(srp1(packetDf,iface=str(request.POST.get("interfaz",None)),verbose=0),str(request.POST.get("interfaz",None))) #,iface=request.POST.get("interfaz",None)
					print "El paquete ha sido enviado"
					return {
						'error':False,
						'message':{"Correcto":"El paquete ha sido enviado"},
						'data':Data
					}
				else:
					ls(packetDf)
					print "Interfaz: "+str(request.POST.get("interfaz",None))
					sendp(packetDf,iface=str(request.POST.get("interfaz",None))) #,iface=request.POST.get("interfaz",None)
					print "El paquete ha sido enviado"
					return {
						'error':False,
						'message':{"Correcto":"El paquete ha sido enviado"},
						'data':None
					}
			else:
				print "El paquete esta vacio"
				return {
					'error':True,
					'message':{"Vacio":"El paquete esta Vacio"}
				}

def sendDataSniff(request):

	lock.acquire()
	s = SessionStore(session_key=request.session.session_key)
	Data = s['Packets']
	s['Packets'] = {}
	stop = s['stopfilter']
	s.save()
	lock.release()

	if(stop):
		#print "Retorno Datos y paro"
		#request.session['stopfilter']=False

		return {
			'error': False,
			'stop':True,
			'message':"Sniff finalizado",
			'data':Data
		}

	else:
		#print "Retorno Datos"
		#print Data
		return {
			'error': False,
			'stop':False,
			'message':'',
			'data':Data
		}

class ThreadSniff (threading.Thread):
    
    def __init__(self, request):
        threading.Thread.__init__(self)
      	self.request = request

    def run(self):

   		filte = ""
		count = ""
		timeout = ""
		request = self.request

		iface = str(request.POST.get("interfaz",None))

		if(request.POST.get("filter","")==""):
			filte = None
		else:
			filte=str(request.POST.get("filter",None))

		if(request.POST.get("count","")==""):
			count = None
		else:
			count=int(request.POST.get("count",None))

		if(request.POST.get("timeout","")==""):
			timeout = None
		else:
			timeout=int(request.POST.get("timeout",""))


		print "Peticion User("+request.session.get('User')+"): "+ str(filte)+" "+str(count)+" "+str(iface)

		sniff(filter=filte,count=count,iface=iface,timeout=timeout,stop_filter=lambda x:stopfilter(x,request,iface))

		lock.acquire()
		s = SessionStore(session_key=request.session.session_key)
		s['stopfilter']=True
		s.save()
		lock.release()

		print "Thread a terminado de Sniffar"
	

def Sniff(request):
	if(request.POST.get("sendDataSniff",None)):
		return sendDataSniff(request)
	elif(request.POST.get("stopfilter",None)):
		print "Paro"
		lock.acquire()
		s = SessionStore(session_key=request.session.session_key)
		s['stopfilter']=True
		s.save()
		lock.release()
		return {
				'error':False,
				'message': "Parando el modo Sniff"
				}
	else:

		lock.acquire()
		s = SessionStore(session_key=request.session.session_key)
		s['stopfilter']=False
		s.save()
		lock.release()

		threadSniff = ThreadSniff(request)
		threadSniff.start()

    	return {
				'error':False,
				'message': "Iniciado el modo Sniff"
				}

def stopfilter(x,request,interface):
	try:
		lock.acquire()
		packetSerialize = serializeDataSniff(x,interface)
		#print packetSerialize["id"]
		#if("DATA" in packetSerialize):print packetSerialize["DATA"]
		s = SessionStore(session_key=request.session.session_key)
		stop = s['stopfilter']
		if(stop):
			s['Packets']={}
		else:
			s['Packets'][packetSerialize["id"]]=packetSerialize
		s.save()
		lock.release()

		if(stop):
			return True
		else:
			return False
	except Exception as inst:

		print(type(inst))
		print(inst.args)
		print(inst)
		lock.release()
		lock.acquire()
		s = SessionStore(session_key=request.session.session_key)
		s['stopfilter']=True
		s.save()
		lock.release()


def serializeDataSniff(elemt,interface):

	time=gmtime()
	layers = ""
	layerDescrip = ""

	packet = {}

	elemtEther=None
	elemtIP=None
	elemtARP=None
	elemtICMP=None
	elemtTCP=None
	elemtUDP=None
	elemtRIP=None
	elemtRaw=None

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
				'options':""
			}
			#print elemtIP.options
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
				
				if(Raw in elemt):
					elemtRaw = elemt.getlayer(Raw)
					packet["DATA"]={
						'load':hexstr(elemtRaw.load)
					}
					layers=layers+"/DATA"
					layerDescrip=layerDescrip+" / Raw"

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

	hexa = ["0","1","2","3","4","5","6","7","8","9","a","A","b","B","c","C","d","D","e","E","f","F"]
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
	if(request.POST.get("mode","") != ""):
		if(request.POST.get("mode","")=="PPrin"):
			return PPrin(request)
		elif(request.POST.get("mode","")=="Sniff"):
			return Sniff(request)
		else:
			return {
				'error':True,
				'message':{"Vacio":"No entiendo el Modo"}
				}
	else:
		return {
				'error':True,
				'message':{"Vacio":"No entiendo el Modo"}
				}
