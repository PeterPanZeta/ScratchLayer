
from scapy.all import *
from django.contrib.sessions.backends.db import SessionStore
#from time import gmtime, strftime
import random
import threading
import os

lock = threading.Lock()  
lockFile = threading.Lock()  

def PPrin(request):

	packetDf=None
	
	error=False
	messageError={}
	try:
		#print request.POST.get("DATA",None)
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
							
							IPOptionsDf=IPOption()
							for options in request.POST.get("OpcionesIP","").split(","):
								if not (options == ""):
									option = options.split(":")[0]
									optionvalue = options.split(":")[1]		
									if(option == "copy_flag"):IPOptionsDf.copy_flag=int(optionvalue)
									elif(option == "optclass"):IPOptionsDf.optclass=int(optionvalue)
									elif(option == "option"):IPOptionsDf.option=int(optionvalue)
									elif(option == "length"):IPOptionsDf.length=int(optionvalue)
									elif(option == "value"):IPOptionsDf.value=int(optionvalue)
					
							IPDf.options=IPOptionsDf

						if(request.POST.get("dstIP","")!= ""):
							'''if not parseIP(request.POST.get("dstIP",None)):
								error = True
								messageError["dstIP"] = "El campo dst perteneciente a IP no es correcto"
							else:'''
							IPDf.dst=request.POST.get("dstIP",None)

						if(request.POST.get("srcIP","")!= ""):
							'''if not parseIP(request.POST.get("srcIP",None)):
								error = True
								messageError["srcIP"] = "El campo src perteneciente a IP no es correcto"
							else:'''
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
										TCPDf.flags=str(request.POST.get("flagTCP",""))

									if(request.POST.get("windTCP","") != ""):
										TCPDf.window=int(request.POST.get("windTCP",""))

									if(request.POST.get("checkTCP","") != ""):
										TCPDf.chksum=int(request.POST.get("checkTCP",""))

									if(request.POST.get("urgpoTCP","") != ""):
										TCPDf.urgptr=int(request.POST.get("urgpoTCP",""))

									if(request.POST.get("OpTCP","") != ""):
										
										TCPOptionsDf=[]

										for options in request.POST.get("OpTCP","").split(","):
											if not (options == ""):
												TCPOptionsDf=TCPOptionsDf+[{options.split(":")[0],int(options.split(":")[1])}]
										print TCPOptionsDf
										TCPDf.options=TCPOptionsDf

									if not error:
										packetDf = packetDf/TCPDf

								else:
									if(request.POST.get("UDP",None) != None):

										UDPDf=UDP()
										if(request.POST.get("sportUDP","") != ""):
											UDPDf.sport=int(request.POST.get("sportUDP",""))
										
										if(request.POST.get("dportUDP","") != ""):
											UDPDf.dport=int(request.POST.get("dportUDP",""))

										if(request.POST.get("lenUDP","") != ""):
											UDPDf.len=int(request.POST.get("lenUDP",""))
										
										if(request.POST.get("checkUDP","") != ""):
											UDPDf.chksum=int(request.POST.get("checkUDP",""))

										if not error:
											packetDf = packetDf/UDPDf

											if(request.POST.get("RIP",None) != None):
												RIPDf=RIP()
												print "PASO POR RIP"
												if(request.POST.get("checkRIP","") != ""):
													RIPDf.cmd=request.POST.get("cmdRIP","")
												
												if(request.POST.get("checkRIP","") != ""):
													RIPDf.version=request.POST.get("verRIP","")
			
												if not error:
													packetDf = packetDf/RIPDf
			
			if(request.POST.get("dat","") != ""):
				DATADf=Raw()
				DATADf.load=str(request.POST.get("dat",""))
				packetDf = packetDf/DATADf

			if(error):
				print messageError
				return {
						'error':True,
						'message': messageError
				}
			else:
				if(packetDf!= None and request.POST.get("pdfdump","") != ""):
					print os.getcwd()
					if not ("tmp" in os.listdir(os.getcwd()+"/ScratchLayer/static/ScratchLayer/")):
						os.mkdir(os.getcwd()+"/ScratchLayer/static/ScratchLayer/tmp")

					packetDf.pdfdump(os.getcwd()+"/ScratchLayer/static/ScratchLayer/tmp/"+request.POST.get("pk",""));

					return {
						'error':False,
						'message':{"Correcto":"El paquete ha sido enviado"},
						'id':request.POST.get("pk","")
					}
					
				elif (packetDf!= None and request.POST.get("interfaz","") != ""):
					
					count = 1

					if(request.POST.get("npack","") != ""):
						count = int(request.POST.get("npack",""))

					if(request.POST.get("recur","") != "" and request.POST.get("recur","")):
						
						ls(packetDf)
						
						print "Interfaz: "+str(request.POST.get("interfaz",None))
						
						Packets=[]

						if Ether in packetDf:
							print "Envio srp"
							Packets = srploop(packetDf,iface=str(request.POST.get("interfaz",None)),verbose=0,count=count)[0]
						else:
							print "Envio sr"
							Packets = srloop(packetDf,iface=str(request.POST.get("interfaz",None)),verbose=0,count=count)[0]
						
						Data=[]
						if len(Packets) == 0:
							return {
							'warn':True,
							'message':{"Correcto":"No habido ninguna respuesta"}
							}
						else:	
							for packet in Packets:
								print packet
								Data.append(serializeDataSniff(packet[1],str(request.POST.get("interfaz",None))))
							
							return {
							'error':False,
							'message':{"Correcto":"El paquete ha sido enviado, retornando respuesta"},
							'data':Data
							}					
					else:

						ls(packetDf)
						print "Interfaz: "+str(request.POST.get("interfaz",None))
						
						if Ether in packetDf:
							sendp(packetDf,iface=str(request.POST.get("interfaz",None)),verbose=False,count=count) #,iface=request.POST.get("interfaz",None)
						else:
							send(packetDf,iface=str(request.POST.get("interfaz",None)),verbose=False,count=count) #,iface=request.POST.get("interfaz",None)

						print "El paquete ha sido enviado"
						return {
							'error':False,
							'message':{"Correcto":"El paquete ha sido enviado"},
							'data':"undefined"
						}
				else:
					print "El paquete esta vacio"
					return {
						'error':True,
						'message':{"Vacio":"El paquete esta Vacio"}
					}
	except Exception as inst:
		#print(type(inst))
		#print(inst.args)
		print(inst[0])
		#lock.release()
		return {
			'error':True,
			'message':{"Error":inst[0]}
		}

def sendDataSniff(request):
	lock.acquire()
	error = False
	message = ""
	idpcap = ""
	s = SessionStore(session_key=request.session.session_key)
	Data = s['Packets']
	s['Packets'] = {}
	stop = s['stopSendData']
	if s['error']:
		error  = True
		message = s['meserror']
	s.save()
	lock.release()

	if(stop):
		#print "Retorno Datos y paro"
		#request.session['stopfilter']=False
		if not error: message = "Sniff finalizado"
		if (request.session['User']+".pcap" in os.listdir(os.getcwd()+"/ScratchLayer/static/ScratchLayer/tmp/")):
			idpcap = request.session['User']+".pcap"
		else:
			idpcap = ""

		return {
			'error': error,
			'stop':True,
			'message':message,
			'idpcap': idpcap,
			'data':Data
		}

	else:
		#print "Retorno Datos"
		#print Data
		if not error: message = ""
		return {
			'error': error,
			'stop':False,
			'message':message,
			'idpcap': '',
			'data':Data
		}

class ThreadSniff (threading.Thread):
    
    def __init__(self, request):
        threading.Thread.__init__(self)
      	self.request = request

    def run(self):
		try:
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
			
			if not (request.session['User']+".pcap" in os.listdir(os.getcwd()+"/ScratchLayer/static/ScratchLayer/tmp/")):
				lock.acquire()
				s = SessionStore(session_key=request.session.session_key)
				s['timeSniff'] = 0
				s.save()
				lock.release()

			sniffInstan = sniff(filter=filte,count=count,iface=iface,timeout=timeout,stop_filter=lambda x:stopfilter(x,request,iface))

			#if len(sniffInstan)>0 and count == None : sniffInstan.pop(len(sniffInstan)-1)

			if not ("tmp" in os.listdir(os.getcwd()+"/ScratchLayer/static/ScratchLayer/")):
				os.mkdir(os.getcwd()+"/ScratchLayer/static/ScratchLayer/tmp")

			lockFile.acquire()
			if (request.session['User']+".pcap" in os.listdir(os.getcwd()+"/ScratchLayer/static/ScratchLayer/tmp/")):
				fileSniff = rdpcap(os.getcwd()+"/ScratchLayer/static/ScratchLayer/tmp/"+request.session['User']+".pcap")
				fileSniff+= sniffInstan
				wrpcap(os.getcwd()+"/ScratchLayer/static/ScratchLayer/tmp/"+request.session['User']+".pcap", fileSniff)
			else:
				wrpcap(os.getcwd()+"/ScratchLayer/static/ScratchLayer/tmp/"+request.session['User']+".pcap", sniffInstan)
			lockFile.release()

			lock.acquire()
			s = SessionStore(session_key=request.session.session_key)
			s['stopSendData']=True
			s.save()
			lock.release()

			print "Thread a terminado de Sniffar"

		except Exception as inst:
			#print(type(inst))
			#print(inst.args)
			print(inst[0])
			#lock.release()
			lock.acquire()
			s = SessionStore(session_key=request.session.session_key)
			s['stopSendData']=True
			s['error'] = True
			s['meserror'] = inst[0]
			s.save()
			lock.release()
			return True

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
	elif(request.POST.get("ClearData",None)):

		if (request.session['User']+".pcap" in os.listdir(os.getcwd()+"/ScratchLayer/static/ScratchLayer/tmp/")):
			os.remove(os.getcwd()+"/ScratchLayer/static/ScratchLayer/tmp/"+request.session['User']+".pcap")
			return {
				'error':False,
				'message': "Informacion borrada"
				}
		else:
			return {
					'error':True,
					'message': "No se ha encontrado la informacion a borrar"
					}

		
	else:

		lock.acquire()
		s = SessionStore(session_key=request.session.session_key)
		s['stopfilter']=False
		s['stopSendData']=False
		s['error'] = False
		s['meserror'] = ""
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
		s = SessionStore(session_key=request.session.session_key)
		stop = s['stopfilter']
		if s['timeSniff'] == 0 : 
			s['timeSniff'] = packetSerialize["time"]
			packetSerialize["time"] = 0
		else:
			packetSerialize["time"] = packetSerialize["time"]-s['timeSniff']
		'''if(stop):
			s['Packets']={}
		else:'''
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
		s['stopSendData']=True
		s.save()
		lock.release()
		return True


def serializeDataSniff(elemt,interface):

	#time=gmtime()
	layers = ""
	layerDescrip = ""

	packet = {}

	elemtEther=None
	elemtIP=None
	elemtIPOptions=None
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
		#print "Creo ARP"
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
			#print "Creo IP"
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
				'options':{}
			}
			#print elemtIP.options
			if(IPOption in elemtIP):
				elemtIPOptions = elemtIP.getlayer(IPOption)
				packet["IP"]['options']={
				'copy_flag':elemtIPOptions.copy_flag,
				'optclass':elemtIPOptions.optclass,
				'option':elemtIPOptions.option,
				'length':elemtIPOptions.length,
				'value':elemtIPOptions.value
			}

			if(layers==""):
				layers="IP"
				layerDescrip=" IP "
			else:
				layers=layers+"/IP"
				layerDescrip=layerDescrip+"/ IP "

			if(ICMP in elemt):
				#print "Creo ICMP"
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
					#print "Creo UDP"
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
						#print "Creo TCP"
						elemtTCP = elemt.getlayer(TCP)
						packet["TCP"]={
							'sport':elemtTCP.sport,
							'dport':elemtTCP.dport,
							'seq':elemtTCP.seq,
							'ack':elemtTCP.ack,
							'dataofs':elemtTCP.dataofs,
							'reserved':elemtTCP.reserved,
							'flags':elemtTCP.sprintf('%TCP.flags%'),
							'window':elemtTCP.window,
							'chksum':elemtTCP.chksum,
							'urgptr':elemtTCP.urgptr,
							'options':{}
						}

						for option in elemtTCP.options:
							packet["TCP"]['options'][option[0]] = option[1]

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
	ide="Packet/" +str(random.randint(1, 9))+str(random.randint(1, 9))+str(random.randint(1, 9))+str(random.randint(1, 9))+str(random.randint(1, 9))   #str(time.tm_hour)+str(time.tm_min)+str(time.tm_sec+random.randint(1, 200))
	packet["id"]=ide
	packet["time"]= elemt.time
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

def loadpcap(filename, request):
	try:
		datapcap = rdpcap(os.getcwd()+"/ScratchLayer/static/ScratchLayer/tmp/"+filename)
		dataSeria = {}
		timestart = datapcap[0].time
		for x in datapcap:
			packetpcap = serializeDataSniff(x,"File: "+filename)
			packetpcap["time"] = packetpcap["time"]-timestart
			dataSeria[packetpcap["id"]]=packetpcap

		lockFile.acquire()
		if (request.session['User']+".pcap" in os.listdir(os.getcwd()+"/ScratchLayer/static/ScratchLayer/tmp/")):
			fileSniff = rdpcap(os.getcwd()+"/ScratchLayer/static/ScratchLayer/tmp/"+request.session['User']+".pcap")
			fileSniff+=datapcap
			wrpcap(os.getcwd()+"/ScratchLayer/static/ScratchLayer/tmp/"+request.session['User']+".pcap", fileSniff)
		else:
			wrpcap(os.getcwd()+"/ScratchLayer/static/ScratchLayer/tmp/"+request.session['User']+".pcap", datapcap)
		lockFile.release()

		os.remove(os.getcwd()+"/ScratchLayer/static/ScratchLayer/tmp/"+filename)

		return {
			'error': False,
			'message':"Sniff finalizado",
			'idpcap': filename.split("_")[0],
			'data':dataSeria
		}

	except Exception as inst:

		print(type(inst))
		print(inst.args)
		print(inst)

		return {
			'error': True,
			'message':"Error al transformar el archivo pcap",
			'idpcap': filename,
			'data':dataSeria
		}

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
