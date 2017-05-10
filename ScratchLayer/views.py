# from django.shortcuts import render

import static.ScratchLayer.Scapy.AllScapy as sp

# Create your views here.
import random
from django.http import HttpResponse
from django.http import Http404
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from netifaces import interfaces

def index(request):

	if not request.session.get('Initial', False):
		print "reload"
		request.session['Initial'] = True
		user = random.choice('abcdefghijkmnopqrst')+random.choice('abcdefghijkmnopqrst')+str(random.randint(1, 200))+str(random.randint(200,300))
		request.session['User'] = user
		request.session['SniffStart'] =  False
		request.session['stopfilter'] =  False
		request.session['Packets'] =  {}
		print "UserNew: "+request.session.get('User')
		print request.session.get('Packets')
	else:
		print "No reload"
		print "User: "+request.session.get('User')
		print request.session['Packets']
	
	context = {
			'interfaces': interfaces(),
		}

	return render(request,'ScratchLayer/index.html', context)
    #return HttpResponse("Hello, world. You're at the polls index.")

def prueba(request):
	return render(request,'ScratchLayer/prueba.html')

@csrf_exempt
def ajax(request): 
	#print request.POST
	data= {
		'id': request.POST.get("pk",None),
		'response': sp.main(request)
	}
	
	return JsonResponse(data)