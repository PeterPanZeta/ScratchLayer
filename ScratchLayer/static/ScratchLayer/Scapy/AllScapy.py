
from scapy.all import *

def main(petition):

	packetSc=None
	
	EthernetSc=None

	error=False
	messageError=""

	if(petition.POST.get("pk",None) != None):

		if(petition.POST.get("Ether",None) != None):
			
			dstEther=None
			srcEther=None
			typeEther=None

			if((petition.POST.get("dstEther",None) != None) and (not parseMac(petition.POST.get("dstEther",None)))):
				
				error=True
				messageError="Se ha producido un error en dst"

			else:
				dstEther=petition.POST.get("dstEther",None)


			if((petition.POST.get("srcEther",None) != None) and (not parseMac(petition.POST.get("srcEther",None)))):

				error=True
				messageError="Se ha producido un error en src"

			else:
				srcEther=petition.POST.get("srcEther",None)

			if(petition.POST.get("typeEther",None) != None):
				typeEther=petition.POST.get("typeEther",None)

			if( not error):
				EthernetSc = Ether(src=srcEther,dst=dstEther,type=typeEther)
				
		if(petition.POST.get("ARP",None) != None):
			None
		else:
			if(petition.POST.get("IP",None) != None):

				packetSc=packetSc/IP(dst=petition.POST.get("dstIP",None))/ICMP()

				if(petition.POST.get("ICMP",None) != None):
					None
				else:
					if(petition.POST.get("RIP",None) != None):
						None
					if(petition.POST.get("TCP",None) != None):
						None
					if(petition.POST.get("UDP",None) != None):
						None

		if (packetSc!= None):
			if(error):
				print messageError
			else:
				send(packetSc)

	else:
		print "Nada"


def parseIP(ip):

	parses = ip.split(".")

	if(len(parses) == 4):
		for parse in parses:
			if(parse.isdigit() == False):
				return False

	return True

def parseMac(mac):

	value=False

	parses = mac.split(":")

	if(len(parses) == 6):
		value=True

	return value
