
from scapy.all import *

def function():
	pass

def main(petition):

	packet=None
	error=False
	messageError=""

	if(petition.POST.get("pk",None) != None):

		if(petition.POST.get("Ether",None) != None):
			if(petition.POST.get("dstEther",None) != None and (parseMac(petition.POST.get("dstEther",None))==False)):
				error=True
				messageError="Se ha producido un error en dst"

		if(petition.POST.get("ARP",None) != None):
			None
		else:
			if(petition.POST.get("IP",None) != None):

				packet=packet/IP(dst=petition.POST.get("dstIP",None))/ICMP()

				if(petition.POST.get("ICMP",None) != None):
					None
				else:
					if(petition.POST.get("RIP",None) != None):
						None
					if(petition.POST.get("TCP",None) != None):
						None
					if(petition.POST.get("UDP",None) != None):
						None
		if (packet!= None):
			if(error):
				print messageError
			else:
				send(packet)
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
